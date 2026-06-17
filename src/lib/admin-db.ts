import { query } from './db';
import { ENTITIES, type Field } from './admin-schema';
import { hashPassword } from './auth';

function cfg(entity: string) {
  const c = ENTITIES[entity];
  if (!c) throw new Error('Unknown entity');
  return c;
}

// Run an entity's optional idempotent DDL so its table exists on any database.
async function ensureTable(c: ReturnType<typeof cfg>) {
  if (c.ensure) await query(c.ensure);
}

function isBlank(raw: unknown) {
  return raw == null || String(raw).trim() === '';
}

function coerce(field: Field, raw: unknown) {
  if (field.type === 'password') {
    // Caller must guarantee a non-blank value reaches here.
    return hashPassword(String(raw));
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
  const select = ['`id`', ...cols].join(', ');
  const hasSort = c.fields.some((f) => f.name === 'sort_order');
  const order = hasSort ? '`sort_order` ASC, `id` ASC' : '`id` ASC';
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
