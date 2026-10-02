'use client';

function fmtDate(v) {
  if (!v) return '—';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Merge review: their version arrived while you edited. Nothing is lost
// either way — keeping yours snapshots theirs first (undoable), taking
// theirs just swaps your form state (your save stays unsent).
export function ConflictBar({ conflict, lines, busy, onKeepMine, onUseTheirs }) {
  if (!conflict) return null;
  const shown = Array.isArray(lines) ? lines.slice(0, 12) : [];
  return (
    <div role="alert" className="border-[4px] border-[#0D65EF] bg-[#0D65EF]/10 p-4 dark:border-[#11DFF5] dark:bg-[#11DFF5]/10 sm:p-5">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0D65EF] dark:text-[#11DFF5]">
        Changed elsewhere — by {conflict.updatedBy || 'someone'} at {fmtDate(conflict.updatedAt)}
      </div>
      {shown.length > 0 ? (
        <ul className="mt-3 grid gap-1.5">
          {shown.map((l, i) => (
            <li key={i} className="border-[2px] border-[#020F40]/15 bg-[var(--bg-surface)] px-3 py-2 font-mono text-[11px] leading-relaxed dark:border-white/15">
              <span className="font-black text-[#0D65EF] dark:text-[#11DFF5]">{l.path}</span>
              <span className="block truncate text-[var(--text-secondary)]">theirs: {l.from}</span>
              <span className="block truncate text-[var(--text-primary)]">yours: {l.to}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[12px] font-medium text-[var(--text-secondary)]">
          Same content, newer timestamp — safe to keep yours.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          suppressHydrationWarning
          onClick={onKeepMine}
          disabled={!!busy}
          className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40] bg-[#020F40] px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[2px_2px_0_0_#11DFF5] disabled:cursor-wait disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
        >
          Keep mine
        </button>
        <button
          type="button"
          suppressHydrationWarning
          onClick={onUseTheirs}
          disabled={!!busy}
          className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40]/30 bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:border-[#020F40] hover:text-[#020F40] disabled:cursor-wait disabled:opacity-60 dark:border-white/25 dark:hover:border-[#11DFF5] dark:hover:text-white"
        >
          Use theirs
        </button>
      </div>
    </div>
  );
}
