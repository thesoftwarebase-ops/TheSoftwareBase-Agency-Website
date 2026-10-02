'use client';

import { useEffect, useState } from 'react';
import { dashboard } from '@/lib/site';
import { Check, Image as ImageIcon, Trash2, Upload, X } from 'lucide-react';

export function MediaPicker({ value, onChange, accept = 'image/*', label }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ed = dashboard.editor;

  async function load() {
    try {
      setError('');
      const res = await fetch('/api/admin/media');
      const json = await res.json().catch(() => ({}));
      // Fail loud, never silent-empty: a failed load must read as an error,
      // not as "no uploads". Otherwise live files look deleted.
      if (!res.ok || json.ok === false) throw new Error(json.error || ed.errorSave);
      if (json.configured === false) {
        setConfigured(false);
        setFiles([]);
        return;
      }
      setConfigured(true);
      setFiles(Array.isArray(json.files) ? json.files : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : ed.errorSave);
      setFiles([]);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open ]);

  // Lock body scroll while the picker is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', f);
      form.append('folder', '/console');
      const res = await fetch('/api/admin/media', { method: 'POST', body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || ed.errorSave);
      setFiles((prev) => [json.file, ...prev]);
      onChange(json.file.url);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : ed.errorSave);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  async function onDelete(fileId) {
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(fileId)}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || ed.errorSave);
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  const isVideo = (f) => (f.contentType || '').startsWith('video/') || /\.(mp4|webm|mov)$/i.test(f.url || '');

  return (
    <div>
      <div className="flex min-w-0 items-center gap-2">
        {value ? (
          <span className="min-w-0 flex-1 truncate border-[3px] border-[#020F40]/15 bg-[var(--bg-base)] px-3 py-2.5 font-mono text-[11px] text-[var(--text-secondary)] dark:border-white/15">
            {value}
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate border-[3px] border-dashed border-[#020F40]/20 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]/60 dark:border-white/15">
            {label}
          </span>
        )}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 border-[3px] border-[#020F40] bg-[#11DFF5] px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#020F40] shadow-[2px_2px_0_0_#020F40] transition-all hover:-translate-y-0.5 dark:border-[#11DFF5] dark:shadow-[2px_2px_0_0_#11DFF5]"
        >
          <ImageIcon aria-hidden className="h-3.5 w-3.5" />
          {label}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={label}>
          <div aria-hidden className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 max-h-[86vh] w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5]">
            <div className="flex items-center gap-2 border-b-[4px] border-[#020F40] bg-[#020F40] px-4 py-3 dark:border-[#11DFF5] dark:bg-[#0B1220]">
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#11DFF5]">{ed.libraryLabel}</span>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-auto flex h-8 w-8 items-center justify-center border-[2px] border-[#11DFF5] text-[#11DFF5] hover:bg-[#11DFF5] hover:text-[#020F40]"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 p-4 sm:p-5">
              {!configured ? (
                <p className="border-[3px] border-dashed border-[#020F40]/25 px-4 py-6 text-center text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] dark:border-white/20">
                  {ed.mediaMissing}
                </p>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 border-[3px] border-dashed border-[#020F40]/30 px-4 py-5 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:border-[#020F40] hover:text-[#020F40] dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:text-white">
                  <Upload aria-hidden className="h-4 w-4" />
                  {busy ? ed.uploadingLabel : ed.uploadLabel}
                  <input suppressHydrationWarning type="file" accept={accept} disabled={busy} onChange={onFile} className="sr-only" />
                </label>
              )}
              {error && (
                <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
                  {error}
                </p>
              )}
              {configured && files.length === 0 && !busy && !error && (
                <p className="px-2 py-4 text-center text-[12px] font-medium text-[var(--text-secondary)]">
                  {ed.mediaEmpty}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {files.map((f) => (
                  <div key={f.fileId} className="group relative border-[3px] border-[#020F40]/15 bg-[var(--bg-base)] dark:border-white/15">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        onChange(f.url);
                        setOpen(false);
                      }}
                      title={`${ed.useLabel}: ${f.name}`}
                      className="block aspect-square w-full overflow-hidden"
                    >
                      {isVideo(f) ? (
                        <span className="flex h-full w-full items-center justify-center bg-[#020F40] text-[10px] font-black uppercase tracking-[0.1em] text-[#11DFF5]">
                          ▶ {f.name}
                        </span>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.thumbnailUrl || f.url} alt={f.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      )}
                    </button>
                    <div className="flex items-center gap-1 border-t-[2px] border-[#020F40]/10 p-1.5 dark:border-white/10">
                      <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-[var(--text-secondary)]">{f.name}</span>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => onDelete(f.fileId)}
                        aria-label={`${ed.deleteLabel} ${f.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center border-[2px] border-transparent text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                      >
                        <Trash2 aria-hidden className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          onChange(f.url);
                          setOpen(false);
                        }}
                        aria-label={`${ed.useLabel} ${f.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center border-[2px] border-[#0D65EF] bg-[#0D65EF]/10 text-[#0D65EF] hover:bg-[#0D65EF] hover:text-white dark:border-[#11DFF5] dark:text-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                      >
                        <Check aria-hidden className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
