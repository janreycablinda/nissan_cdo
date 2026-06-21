'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Field } from '@/lib/admin-schema';
import MediaPicker from './MediaPicker';

type Row = Record<string, unknown>;

const PAGE_SIZE = 10;

function emptyForm(fields: Field[]): Record<string, string> {
  // New records default toggles to on ('1') so vehicles are visible unless hidden.
  return Object.fromEntries(fields.map((f) => [f.name, f.type === 'toggle' ? '1' : '']));
}

export default function AdminEntity({
  entityKey,
  label,
  fields,
  rows,
}: {
  entityKey: string;
  label: string;
  fields: Field[];
  rows: Row[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cloneFromId, setCloneFromId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm(fields));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pickerField, setPickerField] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [String(row.id), ...fields.map((f) => String(row[f.name] ?? ''))]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [rows, fields, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to the first page whenever the search query changes.
  useEffect(() => {
    setPage(1);
  }, [search]);

  function openAdd() {
    setEditingId(null);
    setCloneFromId(null);
    setForm(emptyForm(fields));
    setError('');
    setOpen(true);
  }

  function openEdit(row: Row) {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      next[f.name] = row[f.name] == null ? '' : String(row[f.name]);
    });
    setForm(next);
    setEditingId(Number(row.id));
    setCloneFromId(null);
    setError('');
    setOpen(true);
  }

  // Open the form pre-filled with an existing row's values, but with no id —
  // saving creates a brand-new record (a clone).
  function openClone(row: Row) {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      next[f.name] = row[f.name] == null ? '' : String(row[f.name]);
    });
    setForm(next);
    setEditingId(null);
    setCloneFromId(Number(row.id));
    setError('');
    setOpen(true);
  }

  function close() {
    if (busy) return;
    setOpen(false);
  }

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, busy]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const url = editingId ? `/api/admin/${entityKey}/${editingId}` : `/api/admin/${entityKey}`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed.');
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/${entityKey}/${row.id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
    else window.alert('Delete failed.');
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{label}</h1>
          <p className="mt-1 text-sm text-nissan-gray">{rows.length} record(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-nissan-red px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
        >
          + Add New
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full max-w-sm border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-nissan-gray">
              <th className="px-3 py-2">ID</th>
              {fields.map((f) => (
                <th key={f.name} className="px-3 py-2">{f.label}</th>
              ))}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={fields.length + 2} className="px-3 py-6 text-center text-nissan-gray">
                  {search ? 'No records match your search.' : 'No records yet.'}
                </td>
              </tr>
            )}
            {pageRows.map((row) => (
              <tr key={String(row.id)} className="border-b border-gray-100 align-top hover:bg-gray-50">
                <td className="px-3 py-2 text-nissan-gray">{String(row.id)}</td>
                {fields.map((f) => (
                  <td key={f.name} className="max-w-[220px] truncate px-3 py-2">
                    {f.type === 'password' ? (
                      '••••••••'
                    ) : f.type === 'toggle' ? (
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          Number(row[f.name]) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-nissan-gray'
                        }`}
                      >
                        {Number(row[f.name]) ? 'Yes' : 'No'}
                      </span>
                    ) : f.name === 'image_url' && row[f.name] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(row[f.name])} alt="" className="h-10 w-16 object-contain" />
                    ) : (
                      String(row[f.name] ?? '')
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <button onClick={() => openEdit(row)} className="text-xs font-semibold uppercase tracking-wide text-nissan-dark hover:text-nissan-red">
                    Edit
                  </button>
                  <span className="px-2 text-gray-300">|</span>
                  <button onClick={() => openClone(row)} className="text-xs font-semibold uppercase tracking-wide text-nissan-dark hover:text-nissan-red">
                    Clone
                  </button>
                  <span className="px-2 text-gray-300">|</span>
                  <button onClick={() => remove(row)} className="text-xs font-semibold uppercase tracking-wide text-nissan-red hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-nissan-gray">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="border border-gray-300 px-3 py-1.5 font-semibold uppercase tracking-wide transition hover:border-nissan-red hover:text-nissan-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-nissan-gray"
            >
              ‹ Prev
            </button>
            <span className="px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="border border-gray-300 px-3 py-1.5 font-semibold uppercase tracking-wide transition hover:border-nissan-red hover:text-nissan-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-nissan-gray"
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
          onMouseDown={close}
        >
          <div
            className="w-full max-w-2xl bg-white shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-nissan-red">
                {editingId
                  ? `Edit ${label} #${editingId}`
                  : cloneFromId
                    ? `Clone ${label} (from #${cloneFromId})`
                    : `Add New ${label}`}
              </h2>
              <button
                onClick={close}
                aria-label="Close"
                className="text-xl leading-none text-nissan-gray transition hover:text-nissan-dark"
              >
                ×
              </button>
            </div>

            <form onSubmit={save} className="grid gap-4 p-6 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">
                    {f.label} {f.required && <span className="text-nissan-red">*</span>}
                  </label>
                  {f.type === 'image' ? (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form[f.name]}
                          required={f.required}
                          placeholder={f.placeholder || '/images/… or https://…'}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setPickerField(f.name)}
                          className="shrink-0 border border-gray-300 px-3 text-xs font-semibold uppercase tracking-wide text-nissan-dark transition hover:border-nissan-red hover:text-nissan-red"
                        >
                          Browse
                        </button>
                      </div>
                      {form[f.name] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form[f.name]}
                          alt=""
                          className="mt-2 h-14 w-24 border border-gray-100 object-contain"
                        />
                      )}
                    </div>
                  ) : f.type === 'toggle' ? (
                    <label className="inline-flex cursor-pointer items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        checked={form[f.name] === '1'}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked ? '1' : '0' })}
                        className="h-4 w-4 accent-nissan-red"
                      />
                      <span className="text-sm text-nissan-gray">
                        {form[f.name] === '1' ? 'Yes — visible' : 'No — hidden'}
                      </span>
                    </label>
                  ) : f.type === 'select' ? (
                    <select
                      value={form[f.name]}
                      required={f.required}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={form[f.name]}
                      required={f.required}
                      rows={3}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
                    />
                  ) : f.type === 'password' ? (
                    <input
                      type="password"
                      value={form[f.name]}
                      // On edit, leave blank to keep the existing password.
                      required={f.required && editingId == null}
                      autoComplete="new-password"
                      placeholder={editingId ? 'Leave blank to keep current' : f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={form[f.name]}
                      required={f.required}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-nissan-red focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {error && (
                <p className="sm:col-span-2 text-sm font-semibold text-nissan-red">{error}</p>
              )}

              <div className="sm:col-span-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={close}
                  disabled={busy}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-nissan-gray transition hover:text-nissan-dark disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-nissan-red px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {busy ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media picker (for image fields) */}
      {pickerField && (
        <MediaPicker
          onSelect={(url) => {
            setForm((prev) => ({ ...prev, [pickerField]: url }));
            setPickerField(null);
          }}
          onClose={() => setPickerField(null)}
        />
      )}
    </div>
  );
}
