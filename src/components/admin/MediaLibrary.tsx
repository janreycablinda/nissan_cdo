'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MediaItem } from '@/lib/media';

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? items.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()))
    : items;

  // Close the preview on Escape.
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
        if (!res.ok) throw new Error((await res.json()).error || `Failed to upload ${file.name}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  async function remove(name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/media/${encodeURIComponent(name)}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
    else window.alert('Delete failed.');
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="mt-1 text-sm text-nissan-gray">
            {items.length} image(s) · upload, copy a link to paste into Image URL fields, or delete.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="bg-nissan-red px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Uploading…' : '+ Upload Image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/avif"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-nissan-red">{error}</p>}

      {/* Dropzone / empty hint */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="mt-6 border-2 border-dashed border-gray-300 p-6 text-center text-sm text-nissan-gray"
      >
        Drag &amp; drop images here, or use the Upload button. Max 5&nbsp;MB · PNG, JPG, GIF, WEBP, SVG, AVIF.
      </div>

      {/* Search */}
      {items.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full max-w-xs border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
          />
          <span className="text-xs text-nissan-gray">
            {filtered.length} of {items.length} shown
          </span>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <p className="mt-8 text-center text-nissan-gray">No images uploaded yet.</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-center text-nissan-gray">No images match your filter.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.name} className="flex flex-col border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setPreview(m)}
                title="Click to preview"
                className="group flex h-32 items-center justify-center overflow-hidden bg-gray-50 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.name}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-110"
                />
              </button>
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate text-xs font-semibold" title={m.name}>{m.name}</p>
                <p className="mt-0.5 text-[11px] text-nissan-gray">{fmtSize(m.size)}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
                  <button onClick={() => copy(m.url)} className="text-nissan-dark hover:text-nissan-red">
                    {copied === m.url ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={() => remove(m.name)} className="text-nissan-red hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            aria-label="Close preview"
            className="absolute right-5 top-4 text-3xl leading-none text-white/80 transition hover:text-white"
          >
            ×
          </button>

          <div className="flex max-h-[80vh] max-w-[90vw] items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.url}
              alt={preview.name}
              className="max-h-[80vh] max-w-[90vw] object-contain shadow-2xl"
            />
          </div>

          <div
            className="mt-4 flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="max-w-[60vw] truncate normal-case text-white/80">{preview.name}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60">{fmtSize(preview.size)}</span>
            <span className="text-white/40">·</span>
            <button onClick={() => copy(preview.url)} className="hover:text-nissan-red">
              {copied === preview.url ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => {
                const name = preview.name;
                setPreview(null);
                remove(name);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
