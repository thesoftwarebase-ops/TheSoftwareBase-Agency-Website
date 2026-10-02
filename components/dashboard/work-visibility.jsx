'use client';

import { useState } from 'react';
import { dashboard } from '@/lib/site';
import { ConflictBar } from './conflict-bar';
import { diffLeaves } from './diff';
import { Check, RotateCcw } from 'lucide-react';

export function WorkVisibility({ initial, source, updatedAt }) {
  const [on, setOn] = useState(!!(initial && initial.clientsEnabled));
  const [src, setSrc] = useState(source);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [base, setBase] = useState(updatedAt || null);
  const [undoing, setUndoing] = useState(false);
  const [conflict, setConflict] = useState(null);
  const ed = dashboard.editor;
  const dirty = on !== !!(initial && initial.clientsEnabled);

  async function onSave() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/workVisibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { clientsEnabled: on }, baseUpdatedAt: base }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (res.status === 409 && json.conflict) setConflict(json.conflict);
        throw new Error(json.error || ed.errorSave);
      }
      setConflict(null);
      setStatus('saved');
      setSrc('db');
      setBase(json.updatedAt || new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  async function onKeepMine() {
    if (status === 'saving') return;
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/admin/content/workVisibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { clientsEnabled: on }, baseUpdatedAt: null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || ed.errorSave);
      setConflict(null);
      setStatus('saved');
      setSrc('db');
      setBase(json.updatedAt || new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : ed.errorSave);
    }
  }

  function onUseTheirs() {
    if (!conflict || !conflict.data || typeof conflict.data !== 'object') return;
    setOn(!!conflict.data.clientsEnabled);
    setBase(conflict.updatedAt || null);
    setSrc('db');
    setConflict(null);
    setError('');
  }

  async function onUndo() {
    if (status === 'saving' || undoing) return;
    setUndoing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content/workVisibility/restore', {
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

  return (
    <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-4 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-5">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          suppressHydrationWarning
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          className="h-5 w-5 accent-[#0D65EF]"
        />
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:text-white">
          {ed.visibilityLabel}
        </span>
        <span className={`ml-auto inline-flex items-center border-[2px] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${on ? 'border-[#0D65EF] bg-[#0D65EF]/10 text-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5]/10 dark:text-[#11DFF5]' : 'border-[#020F40]/30 text-[var(--text-secondary)] dark:border-white/25'}`}>
          {on ? 'On' : 'Off'}
        </span>
      </label>
      <p className="mt-2 text-[12px] font-medium leading-relaxed text-[var(--text-secondary)]">{ed.visibilityHint}</p>
      {status === 'error' && (
        <p role="alert" className="mt-3 border-[3px] border-[#020F40] bg-[#020F40] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || ed.errorSave}
        </p>
      )}
      {src !== 'db' && (
        <p role="alert" className="mt-3 border-[3px] border-[#020F40] bg-[#020F40] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {ed.sourceWarn}
        </p>
      )}
      <ConflictBar
        conflict={conflict}
        lines={conflict ? diffLeaves({ clientsEnabled: on }, conflict.data) : []}
        busy={status === 'saving'}
        onKeepMine={onKeepMine}
        onUseTheirs={onUseTheirs}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          suppressHydrationWarning
          onClick={onSave}
          disabled={status === 'saving' || !dirty || src !== 'db'}
          title={src !== 'db' ? ed.sourceWarn : undefined}
          className="inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#0D65EF] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_0_#020F40] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_white]"
        >
          {status === 'saved' && !dirty && <Check aria-hidden className="h-3.5 w-3.5" />}
          {status === 'saving' ? ed.savingLabel : status === 'saved' && !dirty ? ed.savedLabel : ed.saveLabel}
        </button>
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
