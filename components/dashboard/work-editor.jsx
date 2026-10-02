'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { ConflictBar } from './conflict-bar';
import { diffLeaves } from './diff';
import { MediaPicker } from './media-picker';
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';

const BLANK = {
  slug: '',
  title: '',
  tag: '',
  desc: '',
  longDesc: '',
  href: '',
  external: '',
  kind: 'client',
  image: '/home-hero.png',
  stack: [],
  highlights: [],
  selected: false,
};
const KINDS = ['own', 'client'];

export function WorkEditor({ initial, source, updatedAt, kindFilter = null }) {
  const [items, setItems] = useState(Array.isArray(initial) ? initial : []);
  // Split console: each page shows one kind, but state + save always carry
  // the FULL list — a filtered save must never wipe the other kind.
  const visible = items
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => !kindFilter || (c.kind || 'client') === kindFilter);
  const [src, setSrc] = useState(source);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(updatedAt);
  const [base, setBase] = useState(updatedAt || null);
  const [undoing, setUndoing] = useState(false);
  const [conflict, setConflict] = useState(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(initial);
  const ed = dashboard.editor;
  const slugs = items.map((c) => (c.slug || '').trim()).filter(Boolean);
  const dupSlug = slugs.some((s, i) => slugs.indexOf(s) !== i);
  const shown = visible.length;
  const summary = kindFilter
    ? `${shown} ${kindFilter === 'own' ? 'own products' : 'clients'} · ${items.length} total`
    : `${items.length} cases · ${items.filter((c) => c.kind === 'own').length} own · ${items.filter((c) => c.kind !== 'own').length} clients`;

  function setItem(i, patch) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  // Type freely — slugify only on blur. Transforming mid-keystroke yanks
  // the cursor; raw text while typing, clean slug when you leave the field.
  function setSlugRaw(i, value) {
    setItem(i, { slug: value });
  }

  function slugifySlug(i) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== i) return it;
        const v = (it.slug || '')
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const autoHref = `/work/${v}`;
        const href = !it.href || it.href.startsWith('/work/') ? autoHref : it.href;
        return { ...it, slug: v, href };
      })
    );
  }

  function setList(i, field, idx, value) {
    setItems((prev) =>
      prev.map((it, j) => (j === i ? { ...it, [field]: (it[field] || []).map((x, k) => (k === idx ? value : x)) } : it))
    );
  }

  function addList(i, field) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, [field]: [...(it[field] || []), ''] } : it)));
  }

  function removeList(i, field, idx) {
    setItems((prev) =>
      prev.map((it, j) => (j === i ? { ...it, [field]: (it[field] || []).filter((_, k) => k !== idx) } : it))
    );
  }

  async function onSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/workCases', {
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
      const res = await fetch('/api/admin/content/workCases/restore', {
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

  async function onKeepMine() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/workCases', {
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

  function listEditor(i, field, label) {
    return (
      <div className="mt-3 border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
        <span className={labelCls}>{label} ({((items[i] || {})[field] || []).length})</span>
        <div className="mt-2 grid gap-2">
          {((items[i] || {})[field] || []).map((x, xi) => (
            <div key={xi} className="flex items-center gap-2">
              <input
                suppressHydrationWarning
                value={x}
                onChange={(e) => setList(i, field, xi, e.target.value)}
                aria-label={`Case ${i + 1} ${field} ${xi + 1}`}
                className={`${inputCls} min-w-0 flex-1`}
              />
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => removeList(i, field, xi)}
                aria-label={`Remove ${field} ${xi + 1}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
              >
                <Trash2 aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => addList(i, field)}
            className="inline-flex w-fit items-center gap-1.5 border-[2px] border-dashed border-[#020F40]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:border-[#020F40] hover:text-[#020F40] dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:text-white"
          >
            <Plus aria-hidden className="h-3 w-3" />
            {ed.addLabel}
          </button>
        </div>
      </div>
    );
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
        {visible.map(({ c, i }, vi) => (
          <div key={i} className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-4 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-5">
            <div className="flex items-center gap-2">
              <span aria-hidden className="flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[11px] font-black text-[#11DFF5] dark:border-[#11DFF5]">
                {String(vi + 1).padStart(2, '0')}
              </span>
              <label className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  suppressHydrationWarning
                  checked={!!c.selected}
                  onChange={(e) => setItem(i, { selected: e.target.checked })}
                  className="h-4 w-4 accent-[#0D65EF]"
                />
                Featured · shows on home
              </label>
              {kindFilter ? (
                <span className="inline-flex items-center border-[2px] border-[#020F40] bg-[#020F40] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#11DFF5] dark:border-[#11DFF5]">
                  {c.kind || kindFilter}
                </span>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                  <select
                    suppressHydrationWarning
                    value={c.kind || 'client'}
                    onChange={(e) => setItem(i, { kind: e.target.value })}
                    aria-label={`Case ${i + 1} kind`}
                    className="cursor-pointer border-[2px] border-[#020F40]/30 bg-transparent px-1 py-0.5 font-black uppercase dark:border-white/25"
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </label>
              )}
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
                <span className={labelCls}>Slug (unique — drives the page URL)</span>
                <input suppressHydrationWarning value={c.slug || ''} onChange={(e) => setSlugRaw(i, e.target.value)} onBlur={() => slugifySlug(i)} placeholder="atlas-platform" className={`${inputCls} font-mono`} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Title</span>
                <input suppressHydrationWarning value={c.title || ''} onChange={(e) => setItem(i, { title: e.target.value })} className={`${inputCls} font-bold`} />
              </label>
            </div>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className={labelCls}>Tag line</span>
              <input suppressHydrationWarning value={c.tag || ''} onChange={(e) => setItem(i, { tag: e.target.value })} placeholder="Client • Fintech • Next.js" className={inputCls} />
            </label>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className={labelCls}>Short description (cards)</span>
              <textarea suppressHydrationWarning value={c.desc || ''} onChange={(e) => setItem(i, { desc: e.target.value })} rows={2} className={`${inputCls} resize-y leading-relaxed`} />
            </label>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className={labelCls}>Long description (detail page)</span>
              <textarea suppressHydrationWarning value={c.longDesc || ''} onChange={(e) => setItem(i, { longDesc: e.target.value })} rows={3} className={`${inputCls} resize-y leading-relaxed`} />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Page href (auto from slug)</span>
                <input suppressHydrationWarning value={c.href || ''} onChange={(e) => setItem(i, { href: e.target.value })} className={`${inputCls} font-mono`} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>External URL</span>
                <input suppressHydrationWarning value={c.external || ''} onChange={(e) => setItem(i, { external: e.target.value })} placeholder="https://…" className={`${inputCls} font-mono`} />
              </label>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <span className={labelCls}>{dashboard.editor.imageLabel}</span>
              <MediaPicker
                value={c.image || ''}
                onChange={(url) => setItem(i, { image: url })}
                accept="image/*"
                label={dashboard.editor.imageLabel}
              />
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" aria-hidden className="aspect-[16/10] w-full border-[3px] border-[#020F40] object-cover dark:border-[#11DFF5]" />
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>{listEditor(i, 'stack', 'Stack')}</div>
              <div>{listEditor(i, 'highlights', 'Highlights')}</div>
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
          onClick={() => setItems((prev) => [...prev, { ...BLANK, kind: kindFilter || 'client' }])}
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
          disabled={status === 'saving' || !dirty || src !== 'db' || dupSlug}
          title={src !== 'db' ? ed.sourceWarn : dupSlug ? 'Duplicate slugs — make each slug unique.' : undefined}
          className="inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#0D65EF] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_0_#020F40] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_white]"
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
