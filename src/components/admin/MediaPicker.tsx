'use client';

import { useEffect, useRef, useState } from 'react';
import type { MediaItem } from '@/lib/media';

export default function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? items.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()))
    : items;

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/media');
      if (!res.ok) throw new Error('Failed to load media.');
      setItems(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
        if (!res.ok) throw new Error((await res.json()).error || 'Upload failed.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      onMouseDown={onClose}
    >
      <div className="w-full max-w-3xl bg-white shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-nissan-red">
            Choose an Image
          </h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="text-xs font-semibold uppercase tracking-wide text-nissan-dark transition hover:text-nissan-red disabled:opacity-60"
            >
              {busy ? 'Uploading…' : '+ Upload New'}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/avif"
              multiple
              hidden
              onChange={(e) => upload(e.target.files)}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-xl leading-none text-nissan-gray transition hover:text-nissan-dark"
            >
              ×
            </button>
          </div>
        </div>

        <div className="border-b border-gray-100 px-5 py-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images by name…"
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {error && <p className="mb-3 text-sm font-semibold text-nissan-red">{error}</p>}
          {loading ? (
            <p className="py-8 text-center text-sm text-nissan-gray">Loading…</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-nissan-gray">
              No images yet. Use “+ Upload New”.
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-nissan-gray">
              No images match “{search}”.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => onSelect(m.url)}
                  title={m.name}
                  className="flex flex-col border border-gray-200 transition hover:border-nissan-red"
                >
                  <span className="flex h-24 items-center justify-center overflow-hidden bg-gray-50 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.name} className="max-h-full max-w-full object-contain" />
                  </span>
                  <span className="truncate px-2 py-1 text-[10px] text-nissan-gray">{m.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
