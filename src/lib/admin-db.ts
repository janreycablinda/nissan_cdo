import { query } from './db';
import { ENTITIES, type Field } from './admin-schema';

function cfg(entity: string) {
  const c = ENTITIES[entity];
  if (!c) throw new Error('Unknown entity');
  return c;
}

function coerce(field: Field, raw: unknown) {
  if (field.type === 'number') {
    if (raw === '' || raw == null) return null;
    return Number(raw);
  }
  // Store empty optional text as '' (not NULL) so it works for NOT NULL columns.
  return raw == null ? '' : String(raw);
}

function validate(fields: Field[], body: Record<string, unknown>) {
  for (const f of fields) {
    if (f.required && (body[f.name] == null || String(body[f.name]).trim() === '')) {
      throw new Error(`${f.label} is required.`);
    }
  }
}

export async function listRows(entity: string) {
  const c = cfg(entity);
  const hasSort = c.fields.some((f) => f.name === 'sort_order');
  const order = hasSort ? '`sort_order` ASC, `id` ASC' : '`id` ASC';
  return query(`SELECT * FROM \`${c.table}\` ORDER BY ${order}`);
}

export async function createRow(entity: string, body: Record<string, unknown>) {
  const c = cfg(entity);
  validate(c.fields, body);
  const cols = c.fields.map((f) => `\`${f.name}\``).join(', ');
  const placeholders = c.fields.map(() => '?').join(', ');
  const vals = c.fields.map((f) => coerce(f, body[f.name]));
  await query(`INSERT INTO \`${c.table}\` (${cols}) VALUES (${placeholders})`, vals);
}

export async function updateRow(entity: string, id: string | number, body: Record<string, unknown>) {
  const c = cfg(entity);
  validate(c.fields, body);
  const sets = c.fields.map((f) => `\`${f.name}\`=?`).join(', ');
  const vals = c.fields.map((f) => coerce(f, body[f.name]));
  vals.push(Number(id));
  await query(`UPDATE \`${c.table}\` SET ${sets} WHERE \`id\`=?`, vals);
}

export async function deleteRow(entity: string, id: string | number) {
  const c = cfg(entity);
  await query(`DELETE FROM \`${c.table}\` WHERE \`id\`=?`, [Number(id)]);
}
