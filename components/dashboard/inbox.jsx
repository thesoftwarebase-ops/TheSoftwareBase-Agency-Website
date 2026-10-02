'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { ArrowLeft, Check, MailOpen, Trash2 } from 'lucide-react';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function Inbox({ initial }) {
  const [items, setItems] = useState(Array.isArray(initial) ? initial : []);
  const [filter, setFilter] = useState('all');
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const shown = items.filter((q) => (filter === 'unread' ? !q.read : true));
  const unread = items.filter((q) => !q.read).length;

  async function setRead(id, read) {
    if (busy) return;
    setBusy(id);
    setError('');
    const prev = items;
    setItems((list) => list.map((q) => (q._id === id ? { ...q, read } : q)));
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Update failed.');
    } catch (err) {
      setItems(prev);
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setBusy(null);
    }
  }

  async function remove(id) {
    if (busy) return;
    if (!window.confirm('Delete this inquiry permanently?')) return;
    setBusy(id);
    setError('');
    const prev = items;
    setItems((list) => list.filter((q) => q._id !== id));
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Delete failed.');
    } catch (err) {
      setItems(prev);
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid content-start gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-[#11DFF5] dark:bg-transparent dark:text-white"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
          {dashboard.backLabel}
        </Link>
        <div className="inline-flex items-center gap-1 border-[3px] border-[#020F40] p-0.5 dark:border-[#11DFF5]">
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              type="button"
              suppressHydrationWarning
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${filter === f ? 'bg-[#020F40] text-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]' : 'text-[var(--text-secondary)]'}`}
            >
              {f}{f === 'unread' && unread > 0 ? ` (${unread})` : ''}
            </button>
          ))}
        </div>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {shown.length} of {items.length}
        </span>
      </div>

      {error && (
        <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="border-[3px] border-dashed border-[#020F40]/20 px-4 py-10 text-center text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] dark:border-white/15">
          {filter === 'unread' ? 'Inbox zero — nothing unread' : 'No inquiries yet — new contact submissions land here live'}
        </p>
      ) : (
        <div className="grid gap-4">
          {shown.map((q) => (
            <article
              key={q._id}
              className={`border-[4px] bg-[var(--bg-surface)] p-4 shadow-[4px_4px_0_0_#020F40] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-5 ${q.read ? 'border-[#020F40]/25 dark:border-white/20' : 'border-[#020F40] dark:border-[#11DFF5]'}`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {!q.read && <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-[#0D65EF] dark:bg-[#11DFF5]" />}
                <p className="font-black text-[#020F40] dark:text-white">{q.name}</p>
                <a href={`mailto:${q.email}`} className="font-mono text-[11px] text-[#0D65EF] hover:underline dark:text-[#11DFF5]">{q.email}</a>
                {q.phone && <span className="font-mono text-[11px] text-[var(--text-secondary)]">{q.phone}</span>}
                <span className="ml-auto font-mono text-[10px] text-[var(--text-secondary)]">{fmtDate(q.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[var(--text-secondary)]">{q.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t-[3px] border-[#020F40]/10 pt-3 dark:border-white/10">
                {q.budget && (
                  <span className="inline-flex items-center border-[2px] border-[#020F40]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] dark:border-white/20">
                    {q.budget}
                  </span>
                )}
                {q.place && (
                  <span className="inline-flex items-center gap-1 border-[2px] border-[#020F40]/20 px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)] dark:border-white/20">
                    {q.place}
                    {q.location && Number.isFinite(q.location.lat) && (
                      <a
                        href={`https://www.google.com/maps?q=${q.location.lat},${q.location.lon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0D65EF] hover:underline dark:text-[#11DFF5]"
                      >
                        map ↗
                      </a>
                    )}
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setRead(q._id, !q.read)}
                    disabled={busy === q._id}
                    title={q.read ? 'Mark unread' : 'Mark read'}
                    className="flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white disabled:opacity-50 dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                  >
                    {q.read ? <MailOpen aria-hidden className="h-3.5 w-3.5" /> : <Check aria-hidden className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => remove(q._id)}
                    disabled={busy === q._id}
                    title="Delete permanently"
                    className="flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white disabled:opacity-50 dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                  >
                    <Trash2 aria-hidden className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
