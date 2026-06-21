import { query } from './db';
import { ENTITIES, type Field } from './admin-schema';
import { hashPassword } from './auth';

function cfg(entity: string) {
  const c = ENTITIES[entity];
  if (!c) throw new Error('Unknown entity');
  return c;
}

// MySQL error codes for "the thing you're creating already exists" — safe to
// ignore so the idempotent DDL can run on every request.
const BENIGN_DDL_ERRORS = new Set([
  'ER_TABLE_EXISTS_ERROR', // CREATE TABLE (without IF NOT EXISTS) on existing table
  'ER_DUP_FIELDNAME',      // ADD COLUMN that already exists
  'ER_DUP_KEYNAME',        // ADD INDEX/KEY that already exists
]);

// Entities whose DDL has already run this process — the migrations are
// idempotent, so running them once per process is enough and avoids hammering
// the DB with redundant ALTERs (and connections) on every request.
const globalForEnsure = globalThis as unknown as { __ensuredEntities?: Set<string> };
const ensured = (globalForEnsure.__ensuredEntities ??= new Set<string>());

// Run an entity's optional idempotent DDL so its table (and any later-added
// columns) exist on any database, swallowing "already exists" errors.
async function ensureTable(c: ReturnType<typeof cfg>) {
  if (!c.ensure || ensured.has(c.key)) return;
  const statements = Array.isArray(c.ensure) ? c.ensure : [c.ensure];
  for (const sql of statements) {
    try {
      await query(sql);
    } catch (err) {
      if (!BENIGN_DDL_ERRORS.has((err as { code?: string }).code ?? '')) throw err;
    }
  }
  ensured.add(c.key);
}

// Public hook so non-admin code paths (e.g. the homepage data layer) can run an
// entity's idempotent DDL before reading.
export async function ensureEntity(entity: string) {
  await ensureTable(cfg(entity));
}

function isBlank(raw: unknown) {
  return raw == null || String(raw).trim() === '';
}

function coerce(field: Field, raw: unknown) {
  if (field.type === 'password') {
    // Caller must guarantee a non-blank value reaches here.
    return hashPassword(String(raw));
  }
  if (field.type === 'toggle') {
    // Form sends '1'/'0'; normalise anything truthy-looking to 1.
    return String(raw) === '1' || raw === true || String(raw).toLowerCase() === 'true' ? 1 : 0;
  }
  if (field.type === 'variants') {
    // Form sends a JSON string of [{name, price}]. Normalise: drop blank rows,
    // coerce price to a number, and re-stringify for storage.
    let parsed: unknown = [];
    try {
      parsed = JSON.parse(typeof raw === 'string' && raw ? raw : '[]');
    } catch {
      parsed = [];
    }
    const clean = (Array.isArray(parsed) ? parsed : [])
      .map((v) => ({
        name: String((v as any)?.name ?? '').trim(),
        price: Number((v as any)?.price) || 0,
      }))
      .filter((v) => v.name !== '');
    return JSON.stringify(clean);
  }
  if (field.type === 'number') {
    if (raw === '' || raw == null) return null;
    return Number(raw);
  }
  // Store empty optional text as '' (not NULL) so it works for NOT NULL columns.
  return raw == null ? '' : String(raw);
}

function validate(fields: Field[], body: Record<string, unknown>) {
  for (const f of fields) {
    if (f.required && isBlank(body[f.name])) {
      throw new Error(`${f.label} is required.`);
    }
  }
}

// Translate MySQL's unique-constraint error into a readable message.
async function run(sql: string, params: unknown[]) {
  try {
    await query(sql, params as any[]);
  } catch (err) {
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
      throw new Error('That value is already taken — it must be unique.');
    }
    throw err;
  }
}

export async function listRows(entity: string) {
  const c = cfg(entity);
  await ensureTable(c);
  // Never read password hashes out to the client.
  const cols = c.fields.filter((f) => f.type !== 'password').map((f) => `\`${f.name}\``);
  // Read-tracking column isn't a form field but the list view needs it.
  if (c.readColumn) cols.push(`\`${c.readColumn}\``);
  const select = ['`id`', ...cols].join(', ');
  const hasSort = c.fields.some((f) => f.name === 'sort_order');
  const order = c.defaultOrder ?? (hasSort ? '`sort_order` ASC, `id` ASC' : '`id` ASC');
  return query(`SELECT ${select} FROM \`${c.table}\` ORDER BY ${order}`);
}

export async function createRow(entity: string, body: Record<string, unknown>) {
  const c = cfg(entity);
  await ensureTable(c);
  validate(c.fields, body);
  const cols = c.fields.map((f) => `\`${f.name}\``).join(', ');
  const placeholders = c.fields.map(() => '?').join(', ');
  const vals = c.fields.map((f) => coerce(f, body[f.name]));
  await run(`INSERT INTO \`${c.table}\` (${cols}) VALUES (${placeholders})`, vals);
}

export async function updateRow(entity: string, id: string | number, body: Record<string, unknown>) {
  const c = cfg(entity);
  await ensureTable(c);
  // A blank password on edit means "keep the current one" — drop it from the update.
  const fields = c.fields.filter((f) => !(f.type === 'password' && isBlank(body[f.name])));
  validate(fields, body);
  const sets = fields.map((f) => `\`${f.name}\`=?`).join(', ');
  const vals = fields.map((f) => coerce(f, body[f.name]));
  vals.push(Number(id));
  await run(`UPDATE \`${c.table}\` SET ${sets} WHERE \`id\`=?`, vals);
}

export async function deleteRow(entity: string, id: string | number) {
  const c = cfg(entity);
  await ensureTable(c);
  await query(`DELETE FROM \`${c.table}\` WHERE \`id\`=?`, [Number(id)]);
}

// Flip the read/unread flag for a single row. Only valid for entities that
// declare a readColumn; updates that one column without touching other fields.
export async function setReadState(entity: string, id: string | number, isRead: boolean) {
  const c = cfg(entity);
  if (!c.readColumn) throw new Error('This record type does not support read tracking.');
  await ensureTable(c);
  await query(
    `UPDATE \`${c.table}\` SET \`${c.readColumn}\`=? WHERE \`id\`=?`,
    [isRead ? 1 : 0, Number(id)],
  );
}

// Count of unread rows for an entity, or 0 if it has no readColumn.
export async function unreadCount(entity: string): Promise<number> {
  const c = cfg(entity);
  if (!c.readColumn) return 0;
  try {
    await ensureTable(c);
    const rows = await query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM \`${c.table}\` WHERE \`${c.readColumn}\`=0`,
    );
    return Number(rows[0]?.n ?? 0);
  } catch {
    return 0;
  }
}
