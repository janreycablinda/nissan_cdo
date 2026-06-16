import { promises as fs } from 'fs';
import path from 'path';

export const UPLOAD_SUBPATH = 'images/uploads';
export const UPLOAD_DIR = path.join(process.cwd(), 'public', UPLOAD_SUBPATH);
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);

export type MediaItem = { name: string; url: string; size: number; mtime: number };

export function publicUrl(name: string): string {
  return `/${UPLOAD_SUBPATH}/${name}`;
}

export async function ensureDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

// Strip any directory parts so a filename can never escape UPLOAD_DIR.
export function resolveInDir(name: string): string {
  const clean = path.basename(name);
  const full = path.join(UPLOAD_DIR, clean);
  if (path.dirname(full) !== UPLOAD_DIR) throw new Error('Invalid filename');
  return full;
}

export async function listMedia(): Promise<MediaItem[]> {
  await ensureDir();
  const files = await fs.readdir(UPLOAD_DIR);
  const items = await Promise.all(
    files
      .filter((f) => ALLOWED_EXT.has(path.extname(f).toLowerCase()))
      .map(async (f) => {
        const s = await fs.stat(path.join(UPLOAD_DIR, f));
        return { name: f, url: publicUrl(f), size: s.size, mtime: s.mtimeMs };
      }),
  );
  return items.sort((a, b) => b.mtime - a.mtime);
}

export async function saveUpload(file: File): Promise<MediaItem> {
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error('Unsupported file type. Allowed: ' + Array.from(ALLOWED_EXT).join(', '));
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) throw new Error('Empty file.');
  if (buf.length > MAX_BYTES) throw new Error('File too large (max 5 MB).');

  const base =
    path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'image';
  const name = `${base}-${Date.now()}${ext}`;

  await ensureDir();
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return { name, url: publicUrl(name), size: buf.length, mtime: Date.now() };
}

export async function deleteMedia(name: string): Promise<void> {
  const full = resolveInDir(name);
  await fs.unlink(full);
}
