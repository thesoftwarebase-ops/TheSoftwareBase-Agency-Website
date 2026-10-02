'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { ConflictBar } from './conflict-bar';
import { diffLeaves } from './diff';
import { MediaPicker } from './media-picker';
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';

const BLANK = { kicker: '', title: '', desc: '', bullets: [], image: '/home-hero.png', imagePos: 'object-center', selected: false };
const IMAGE_POS = ['object-top', 'object-center', 'object-bottom'];

export function ServicesEditor({ initial, source, updatedAt }) {
  const [items, setItems] = useState(Array.isArray(initial) ? initial : []);
  const [src, setSrc] = useState(source);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(updatedAt);
  const [base, setBase] = useState(updatedAt || null);
  const dirty = JSON.stringify(items) !== JSON.stringify(initial);
  const [undoing, setUndoing] = useState(false);
  const [conflict, setConflict] = useState(null);
  const summary = `${items.length} cards · ${items.filter((s) => s.selected).length} featured`;
  const ed = dashboard.editor;

  function setItem(i, patch) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  function setBullet(i, bi, value) {
    setItems((prev) =>
      prev.map((it, j) => (j === i ? { ...it, bullets: (it.bullets || []).map((b, k) => (k === bi ? value : b)) } : it))
    );
  }

  function addBullet(i) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, bullets: [...(it.bullets || []), ''] } : it)));
  }

  function removeBullet(i, bi) {
    setItems((prev) =>
      prev.map((it, j) => (j === i ? { ...it, bullets: (it.bullets || []).filter((_, k) => k !== bi) } : it))
    );
  }

  async function onSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: items, baseUpdatedAt: base }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (res.status === 409 && json.conflict) setConflict(json.conflict);
        throw new Error(json.error || ed.errorSave);
      }
      setConflict(null);
      setStatus('saved');
      setSrc('db');
      setSavedAt(json.updatedAt || new Date().toISOString());
      setBase(json.updatedAt || new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  async function onUndo() {
    if (status === 'saving' || undoing) return;
    setUndoing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content/services/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latest: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || ed.errorSave);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : ed.errorSave);
      setUndoing(false);
    }
  }

  // Merge review: force yours through (theirs is snapshotted first —
  // undoable), or adopt theirs into the form and keep editing.
  async function onKeepMine() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: items, baseUpdatedAt: null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || ed.errorSave);
      setConflict(null);
      setStatus('saved');
      setSrc('db');
      setSavedAt(json.updatedAt || new Date().toISOString());
      setBase(json.updatedAt || new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  function onUseTheirs() {
    if (!conflict || conflict.data === undefined) return;
    setItems(Array.isArray(conflict.data) ? conflict.data : []);
    setBase(conflict.updatedAt || null);
    setSrc('db');
    setConflict(null);
    setError('');
  }

  const inputCls =
    'min-w-0 border-[3px] border-[#020F40] bg-white px-3 py-2.5 text-[13px] font-medium text-[#020F40] outline-none focus:border-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white';
  const labelCls = 'text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]';

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
        <span className={`inline-flex items-center gap-1.5 border-[3px] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${src === 'db' ? 'border-[#020F40] bg-[#11DFF5] text-[#020F40] dark:border-[#11DFF5]' : 'border-[#020F40]/30 text-[var(--text-secondary)] dark:border-white/20'}`}>
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${src === 'db' ? 'bg-[#020F40]' : 'bg-current'}`} />
          {src === 'db' ? ed.sourceDb : ed.sourceLib}
        </span>
        {dirty && status !== 'saving' && (
          <span className="inline-flex items-center gap-1.5 border-[3px] border-[#0D65EF] bg-[#0D65EF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5]/10 dark:text-[#11DFF5]">
            {ed.dirtyLabel}
          </span>
        )}
        <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {items.length}
        </span>
      </div>

      {status === 'error' && (
        <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || ed.errorSave}
        </p>
      )}

      <ConflictBar
        conflict={conflict}
        lines={conflict ? diffLeaves(items, conflict.data) : []}
        busy={status === 'saving'}
        onKeepMine={onKeepMine}
        onUseTheirs={onUseTheirs}
      />

      <div className="grid gap-5">
        {items.map((s, i) => (
          <div key={i} className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-4 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-5">
            <div className="flex items-center gap-2">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[11px] font-black text-[#11DFF5] dark:border-[#11DFF5]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <label className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  suppressHydrationWarning
                  checked={!!s.selected}
                  onChange={(e) => setItem(i, { selected: e.target.checked })}
                  className="h-4 w-4 accent-[#0D65EF]"
                />
                Featured · shows on home
              </label>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`${ed.removeLabel} ${i + 1}`}
                className="ml-auto flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
              >
                <Trash2 aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Kicker</span>
                <input suppressHydrationWarning value={s.kicker || ''} onChange={(e) => setItem(i, { kicker: e.target.value })} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Title</span>
                <input suppressHydrationWarning value={s.title || ''} onChange={(e) => setItem(i, { title: e.target.value })} className={`${inputCls} font-bold`} />
              </label>
            </div>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className={labelCls}>Description</span>
              <textarea suppressHydrationWarning value={s.desc || ''} onChange={(e) => setItem(i, { desc: e.target.value })} rows={2} className={`${inputCls} resize-y leading-relaxed`} />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className={labelCls}>{dashboard.editor.imageLabel}</span>
                <MediaPicker
                  value={s.image || ''}
                  onChange={(url) => setItem(i, { image: url })}
                  accept="image/*"
                  label={dashboard.editor.imageLabel}
                />
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt="" aria-hidden className="aspect-[16/9] w-full border-[3px] border-[#020F40] object-cover dark:border-[#11DFF5]" />
                ) : null}
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Image position</span>
                <select suppressHydrationWarning value={s.imagePos || 'object-center'} onChange={(e) => setItem(i, { imagePos: e.target.value })} className={`${inputCls} cursor-pointer font-bold`}>
                  {IMAGE_POS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-3 border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
              <span className={labelCls}>Bullets ({(s.bullets || []).length})</span>
              <div className="mt-2 grid gap-2">
                {(s.bullets || []).map((b, bi) => (
                  <div key={bi} className="flex items-center gap-2">
                    <input
                      suppressHydrationWarning
                      value={b}
                      onChange={(e) => setBullet(i, bi, e.target.value)}
                      aria-label={`Service ${i + 1} bullet ${bi + 1}`}
                      className={`${inputCls} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => removeBullet(i, bi)}
                      aria-label={`Remove bullet ${bi + 1}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                    >
                      <Trash2 aria-hidden className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => addBullet(i)}
                  className="inline-flex w-fit items-center gap-1.5 border-[2px] border-dashed border-[#020F40]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:border-[#020F40] hover:text-[#020F40] dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:text-white"
                >
                  <Plus aria-hidden className="h-3 w-3" />
                  {ed.addLabel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-auto font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {summary}{dirty ? ' · unsaved' : ''}
        </span>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setItems((prev) => [...prev, { ...BLANK }])}
          className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition-all hover:-translate-y-0.5 dark:border-[#11DFF5] dark:bg-transparent dark:text-white"
        >
          <Plus aria-hidden className="h-3.5 w-3.5" />
          {ed.addLabel}
        </button>
        {src !== 'db' && (
          <p role="alert" className="w-full border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
            {ed.sourceWarn}
          </p>
        )}
        <button
          type="button"
          suppressHydrationWarning
          onClick={onSave}
          disabled={status === 'saving' || !dirty || src !== 'db'}
          title={src !== 'db' ? ed.sourceWarn : undefined}
          className="inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#0D65EF] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_0_#020F40] transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_white]"
        >
          {status === 'saved' && <Check aria-hidden className="h-3.5 w-3.5" />}
          {status === 'saving' ? ed.savingLabel : status === 'saved' && !dirty ? ed.savedLabel : ed.saveLabel}
        </button>
        {savedAt && (
          <span className="ml-auto font-mono text-[10px] text-[var(--text-secondary)]">
            {new Date(savedAt).toLocaleString()}
          </span>
        )}
        <button
          type="button"
          suppressHydrationWarning
          onClick={onUndo}
          disabled={status === 'saving' || undoing}
          title={ed.undoLabel}
          className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40]/30 bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] transition-all hover:border-[#020F40] hover:text-[#020F40] disabled:cursor-wait disabled:opacity-60 dark:border-white/25 dark:hover:border-[#11DFF5] dark:hover:text-white"
        >
          <RotateCcw aria-hidden className="h-3.5 w-3.5" />
          {undoing ? ed.undoingLabel : ed.undoLabel}
        </button>
      </div>
    </div>
  );
}
