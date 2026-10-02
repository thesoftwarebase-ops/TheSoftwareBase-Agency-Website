'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { ConflictBar } from './conflict-bar';
import { diffLeaves } from './diff';
import { MediaPicker } from './media-picker';
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';

const BLANK_STAT = { v: '', k: '' };

export function HeroEditor({ initial, source, updatedAt }) {
  const [form, setForm] = useState(() => ({
    kicker: initial.kicker || '',
    title0: (initial.title || [])[0] || '',
    title1: (initial.title || [])[1] || '',
    desc: initial.desc || '',
    primaryLabel: initial.primaryCta?.label || '',
    primaryHref: initial.primaryCta?.href || '',
    secondaryLabel: initial.secondaryCta?.label || '',
    secondaryHref: initial.secondaryCta?.href || '',
    stats: Array.isArray(initial.stats) ? initial.stats : [],
    video: initial.video || '',
    poster: initial.poster || '',
  }));
  const [src, setSrc] = useState(source);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(updatedAt);
  const [base, setBase] = useState(updatedAt || null);
  const ed = dashboard.editor;

  const dirty =
    JSON.stringify({
      kicker: form.kicker,
      title: [form.title0, form.title1],
      desc: form.desc,
      primaryCta: { label: form.primaryLabel, href: form.primaryHref },
      secondaryCta: { label: form.secondaryLabel, href: form.secondaryHref },
      stats: form.stats,
      video: form.video,
      poster: form.poster,
    }) !== JSON.stringify({ ...initial, video: initial.video || '', poster: initial.poster || '' });

  const [undoing, setUndoing] = useState(false);
  const [conflict, setConflict] = useState(null);
  const summary = `${form.stats.length} stats · ${form.video ? 'video on' : 'no video'} · ${form.poster ? 'poster on' : 'no poster'}`;
  const heroData = () => ({
    kicker: form.kicker,
    title: [form.title0, form.title1],
    desc: form.desc,
    primaryCta: { label: form.primaryLabel, href: form.primaryHref },
    secondaryCta: { label: form.secondaryLabel, href: form.secondaryHref },
    stats: form.stats,
    video: form.video,
    poster: form.poster,
  });

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setStat(i, patch) {
    setForm((prev) => ({ ...prev, stats: prev.stats.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }

  async function onSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            kicker: form.kicker,
            title: [form.title0, form.title1],
            desc: form.desc,
            primaryCta: { label: form.primaryLabel, href: form.primaryHref },
            secondaryCta: { label: form.secondaryLabel, href: form.secondaryHref },
            stats: form.stats,
            video: form.video,
            poster: form.poster,
          },
          baseUpdatedAt: base,
        }),
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
      const res = await fetch('/api/admin/content/hero/restore', {
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
      const res = await fetch('/api/admin/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: heroData(), baseUpdatedAt: null }),
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
    if (!conflict || conflict.data === undefined || conflict.data === null) return;
    const t = conflict.data;
    setForm((prev) => ({
      ...prev,
      kicker: t.kicker || '',
      title0: (t.title || [])[0] || '',
      title1: (t.title || [])[1] || '',
      desc: t.desc || '',
      primaryLabel: t.primaryCta?.label || '',
      primaryHref: t.primaryCta?.href || '',
      secondaryLabel: t.secondaryCta?.label || '',
      secondaryHref: t.secondaryCta?.href || '',
      stats: Array.isArray(t.stats) ? t.stats : [],
      video: t.video || '',
      poster: t.poster || '',
    }));
    setBase(conflict.updatedAt || null);
    setSrc('db');
    setConflict(null);
    setError('');
  }

  const inputCls =
    'min-w-0 border-[3px] border-[#020F40] bg-white px-3 py-2.5 text-[13px] font-medium text-[#020F40] outline-none focus:border-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white';
  const labelCls =
    'text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]';

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
      </div>

      {status === 'error' && (
        <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || ed.errorSave}
        </p>
      )}

      <div className="grid gap-4 border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-4 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-5">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Kicker</span>
          <input suppressHydrationWarning value={form.kicker} onChange={(e) => set('kicker', e.target.value)} className={inputCls} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Title — line 1</span>
            <input suppressHydrationWarning value={form.title0} onChange={(e) => set('title0', e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Title — line 2</span>
            <input suppressHydrationWarning value={form.title1} onChange={(e) => set('title1', e.target.value)} className={inputCls} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Description</span>
          <textarea suppressHydrationWarning value={form.desc} onChange={(e) => set('desc', e.target.value)} rows={3} className={`${inputCls} resize-y leading-relaxed`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-3 border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
            <span className={labelCls}>Primary CTA</span>
            <input suppressHydrationWarning value={form.primaryLabel} onChange={(e) => set('primaryLabel', e.target.value)} placeholder="Label" className={inputCls} />
            <input suppressHydrationWarning value={form.primaryHref} onChange={(e) => set('primaryHref', e.target.value)} placeholder="/contact" className={inputCls} />
          </div>
          <div className="grid content-start gap-3 border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
            <span className={labelCls}>Secondary CTA</span>
            <input suppressHydrationWarning value={form.secondaryLabel} onChange={(e) => set('secondaryLabel', e.target.value)} placeholder="Label" className={inputCls} />
            <input suppressHydrationWarning value={form.secondaryHref} onChange={(e) => set('secondaryHref', e.target.value)} placeholder="/work/products" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-[4px] border-[#020F40]/10 p-4 dark:border-white/10 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>{ed.videoLabel}</span>
          <MediaPicker
            value={form.video}
            onChange={(url) => set('video', url)}
            accept="video/*"
            label={ed.videoLabel}
          />
          {form.video ? (
            <video src={form.video} muted playsInline preload="metadata" className="mt-1 aspect-video w-full border-[3px] border-[#020F40] bg-black object-cover dark:border-[#11DFF5]" />
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>{ed.posterLabel}</span>
          <MediaPicker
            value={form.poster}
            onChange={(url) => set('poster', url)}
            accept="image/*"
            label={ed.posterLabel}
          />
          {form.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.poster} alt="" aria-hidden className="mt-1 aspect-video w-full border-[3px] border-[#020F40] object-cover dark:border-[#11DFF5]" />
          ) : null}
        </div>
      </div>

      <div className="grid gap-3">
        <span className={labelCls}>Stats ({form.stats.length})</span>
        {form.stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2 border-[3px] border-[#020F40]/10 bg-[var(--bg-surface)] p-3 dark:border-white/10">
            <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[11px] font-black text-[#11DFF5] dark:border-[#11DFF5]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <input
              suppressHydrationWarning
              value={s.v}
              onChange={(e) => setStat(i, { v: e.target.value })}
              placeholder="6w"
              aria-label={`Stat ${i + 1} value`}
              className={`${inputCls} w-24 shrink-0`}
            />
            <input
              suppressHydrationWarning
              value={s.k}
              onChange={(e) => setStat(i, { k: e.target.value })}
              placeholder="avg to prod"
              aria-label={`Stat ${i + 1} label`}
              className={`${inputCls} min-w-0 flex-1`}
            />
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, j) => j !== i) }))}
              aria-label={`${dashboard.editor.removeLabel} ${i + 1}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
            >
              <Trash2 aria-hidden className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setForm((prev) => ({ ...prev, stats: [...prev.stats, { ...BLANK_STAT }] }))}
          className="inline-flex w-fit items-center gap-2 border-[3px] border-[#020F40] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition-all hover:-translate-y-0.5 dark:border-[#11DFF5] dark:bg-transparent dark:text-white"
        >
          <Plus aria-hidden className="h-3.5 w-3.5" />
          {ed.addLabel}
        </button>
      </div>

      <ConflictBar
        conflict={conflict}
        lines={conflict ? diffLeaves(heroData(), conflict.data) : []}
        busy={status === 'saving'}
        onKeepMine={onKeepMine}
        onUseTheirs={onUseTheirs}
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-auto font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {summary}{dirty ? ' · unsaved' : ''}
        </span>
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
