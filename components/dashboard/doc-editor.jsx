'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { ConflictBar } from './conflict-bar';
import { diffLeaves } from './diff';
import { ArrowLeft, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';

// Spec-driven document editor for flat/nested copy objects (pages, whyUs,
// contact, footer, site, workDetail). Field types:
//   section — { type:'section', label }
//   text    — { type:'text', path:[...], label, textarea? }
//   pair    — { type:'pair', path:[...], label, labels:[a,b] } (title[2])
//   cta     — { type:'cta', path:[...], label } ({label,href})
//   list    — { type:'list', path:[...], label } (string[])
//   objlist — { type:'objlist', path:[...], label, fields:[{key,label,textarea?}] }

function getPath(obj, path) {
  return (path || []).reduce((o, k) => (o == null ? o : o[k]), obj);
}

function setPath(obj, path, value) {
  const root = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cur = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    const k = path[i];
    const v = cur[k];
    cur[k] = Array.isArray(v) ? [...v] : v && typeof v === 'object' ? { ...v } : {};
    cur = cur[k];
  }
  cur[path[path.length - 1]] = value;
  return root;
}

export function DocEditor({ storageKey, initial, source, updatedAt, spec, note, hideNav }) {
  const [doc, setDoc] = useState(initial && typeof initial === 'object' ? initial : {});
  const [src, setSrc] = useState(source);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(updatedAt);
  const [base, setBase] = useState(updatedAt || null);
  const [undoing, setUndoing] = useState(false);
  const [conflict, setConflict] = useState(null);
  const dirty = JSON.stringify(doc) !== JSON.stringify(initial);
  const ed = dashboard.editor;

  function setVal(path, value) {
    setDoc((prev) => setPath(prev, path, value));
  }

  async function put(data, baseUpdatedAt) {
    const res = await fetch(`/api/admin/content/${storageKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, baseUpdatedAt }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      const err = new Error(json.error || ed.errorSave);
      err.status = res.status;
      err.conflict = json.conflict || null;
      throw err;
    }
    return json;
  }

  async function onSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const json = await put(doc, base);
      setConflict(null);
      setStatus('saved');
      setSrc('db');
      setSavedAt(json.updatedAt || new Date().toISOString());
      setBase(json.updatedAt || new Date().toISOString());
    } catch (err) {
      if (err.status === 409 && err.conflict) setConflict(err.conflict);
      setStatus('error');
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  async function onUndo() {
    if (status === 'saving' || undoing) return;
    setUndoing(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/content/${storageKey}/restore`, {
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
      const json = await put(doc, null);
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
    setDoc(conflict.data && typeof conflict.data === 'object' ? conflict.data : {});
    setBase(conflict.updatedAt || null);
    setSrc('db');
    setConflict(null);
    setError('');
  }

  const inputCls =
    'min-w-0 w-full border-[3px] border-[#020F40] bg-white px-3 py-2.5 text-[13px] font-medium text-[#020F40] outline-none focus:border-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white';
  const labelCls = 'text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]';

  function fieldText(f, key) {
    const v = getPath(doc, f.path);
    if (f.textarea) {
      return (
        <label key={key} className="flex flex-col gap-1.5">
          <span className={labelCls}>{f.label}</span>
          <textarea suppressHydrationWarning value={typeof v === 'string' ? v : ''} onChange={(e) => setVal(f.path, e.target.value)} rows={3} className={`${inputCls} resize-y leading-relaxed`} />
        </label>
      );
    }
    return (
      <label key={key} className="flex flex-col gap-1.5">
        <span className={labelCls}>{f.label}</span>
        <input suppressHydrationWarning value={typeof v === 'string' ? v : ''} onChange={(e) => setVal(f.path, e.target.value)} className={inputCls} />
      </label>
    );
  }

  function fieldPair(f, key) {
    const v = getPath(doc, f.path);
    const arr = Array.isArray(v) ? v : ['', ''];
    return (
      <div key={key} className="grid gap-3 sm:grid-cols-2">
        {(f.labels || ['Line 1', 'Line 2']).map((lab, li) => (
          <label key={li} className="flex flex-col gap-1.5">
            <span className={labelCls}>{f.label} — {lab}</span>
            <input suppressHydrationWarning value={arr[li] || ''} onChange={(e) => { const next = [...arr]; next[li] = e.target.value; setVal(f.path, next); }} className={`${inputCls} font-bold`} />
          </label>
        ))}
      </div>
    );
  }

  function fieldCta(f, key) {
    const v = getPath(doc, f.path) || {};
    return (
      <div key={key} className="grid gap-3 sm:grid-cols-[1fr_1fr]">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{f.label} — label</span>
          <input suppressHydrationWarning value={v.label || ''} onChange={(e) => setVal(f.path, { ...v, label: e.target.value })} className={`${inputCls} font-bold`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{f.label} — href</span>
          <input suppressHydrationWarning value={v.href || ''} onChange={(e) => setVal(f.path, { ...v, href: e.target.value })} className={`${inputCls} font-mono`} />
        </label>
      </div>
    );
  }

  function fieldList(f, key) {
    const arr = getPath(doc, f.path);
    const list = Array.isArray(arr) ? arr : [];
    return (
      <div key={key} className="border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
        <span className={labelCls}>{f.label} ({list.length})</span>
        <div className="mt-2 grid gap-2">
          {list.map((x, xi) => (
            <div key={xi} className="flex items-center gap-2">
              <input suppressHydrationWarning value={x} onChange={(e) => { const next = [...list]; next[xi] = e.target.value; setVal(f.path, next); }} aria-label={`${f.label} ${xi + 1}`} className={`${inputCls} min-w-0 flex-1`} />
              <button type="button" suppressHydrationWarning onClick={() => setVal(f.path, list.filter((_, k) => k !== xi))} aria-label={`Remove ${f.label} ${xi + 1}`} className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]">
                <Trash2 aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button type="button" suppressHydrationWarning onClick={() => setVal(f.path, [...list, ''])} className="inline-flex w-fit items-center gap-1.5 border-[2px] border-dashed border-[#020F40]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:border-[#020F40] hover:text-[#020F40] dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:text-white">
            <Plus aria-hidden className="h-3 w-3" />
            {ed.addLabel}
          </button>
        </div>
      </div>
    );
  }

  function fieldObjList(f, key) {
    const arr = getPath(doc, f.path);
    const list = Array.isArray(arr) ? arr : [];
    return (
      <div key={key} className="border-[3px] border-[#020F40]/10 p-3 dark:border-white/10">
        <span className={labelCls}>{f.label} ({list.length})</span>
        <div className="mt-2 grid gap-3">
          {list.map((row, ri) => (
            <div key={ri} className="border-[3px] border-[#020F40]/10 bg-[var(--bg-base)] p-3 dark:border-white/10">
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden className="flex h-7 w-7 items-center justify-center border-[2px] border-[#020F40] bg-[#020F40] text-[10px] font-black text-[#11DFF5] dark:border-[#11DFF5]">
                  {String(ri + 1).padStart(2, '0')}
                </span>
                <button type="button" suppressHydrationWarning onClick={() => setVal(f.path, list.filter((_, k) => k !== ri))} aria-label={`Remove ${f.label} ${ri + 1}`} className="ml-auto flex h-8 w-8 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]">
                  <Trash2 aria-hidden className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-2.5">
                {(f.fields || []).map((sub) => (
                  sub.textarea ? (
                    <label key={sub.key} className="flex flex-col gap-1">
                      <span className={labelCls}>{sub.label}</span>
                      <textarea suppressHydrationWarning value={row?.[sub.key] || ''} onChange={(e) => { const next = list.map((r, k) => (k === ri ? { ...r, [sub.key]: e.target.value } : r)); setVal(f.path, next); }} rows={2} className={`${inputCls} resize-y leading-relaxed`} />
                    </label>
                  ) : (
                    <label key={sub.key} className="flex flex-col gap-1">
                      <span className={labelCls}>{sub.label}</span>
                      <input suppressHydrationWarning value={row?.[sub.key] || ''} onChange={(e) => { const next = list.map((r, k) => (k === ri ? { ...r, [sub.key]: e.target.value } : r)); setVal(f.path, next); }} className={inputCls} />
                    </label>
                  )
                ))}
              </div>
            </div>
          ))}
          <button type="button" suppressHydrationWarning onClick={() => { const blank = {}; for (const sub of (f.fields || [])) blank[sub.key] = ''; setVal(f.path, [...list, blank]); }} className="inline-flex w-fit items-center gap-1.5 border-[2px] border-dashed border-[#020F40]/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:border-[#020F40] hover:text-[#020F40] dark:border-white/20 dark:hover:border-[#11DFF5] dark:hover:text-white">
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
        {!hideNav && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-[#11DFF5] dark:bg-transparent dark:text-white"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
            {dashboard.backLabel}
          </Link>
        )}
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

      {note && (
        <p className="border-[3px] border-dashed border-[#020F40]/25 px-4 py-3 text-[12px] font-medium leading-relaxed text-[var(--text-secondary)] dark:border-white/20">
          {note}
        </p>
      )}

      {status === 'error' && (
        <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || ed.errorSave}
        </p>
      )}

      <ConflictBar
        conflict={conflict}
        lines={conflict ? diffLeaves(doc, conflict.data) : []}
        busy={status === 'saving'}
        onKeepMine={onKeepMine}
        onUseTheirs={onUseTheirs}
      />

      <div className="grid content-start gap-5">
        {(spec || []).map((f, fi) => {
          if (f.type === 'section') {
            return (
              <h2 key={fi} className="mt-2 inline-flex w-fit items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5] dark:border-[#11DFF5]">
                {f.label}
              </h2>
            );
          }
          if (f.type === 'pair') return fieldPair(f, fi);
          if (f.type === 'cta') return fieldCta(f, fi);
          if (f.type === 'list') return fieldList(f, fi);
          if (f.type === 'objlist') return fieldObjList(f, fi);
          return fieldText(f, fi);
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-auto font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {storageKey}{dirty ? ' · unsaved' : ''}
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
