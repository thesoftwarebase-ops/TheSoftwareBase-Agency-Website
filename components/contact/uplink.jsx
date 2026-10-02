'use client';

import { useEffect, useState } from 'react';
import { site, contact, hero } from '@/lib/site';
import { MapPin } from 'lucide-react';
import { requestPosition, placeNameFor } from './location';

const BAR_COUNT = 14;

function stamp() {
  try {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

export function UplinkMonitor({ kicker, liveLabel, waitingLabel, ringText }) {
  const [place, setPlace] = useState('');
  const [acc, setAcc] = useState('');
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState('');
  const [lines, setLines] = useState([]);

  // Passive position lock: never prompts, attaches when already granted.
  useEffect(() => {
    let alive = true;
    let timer = 0;
    async function sync() {
      try {
        if (!('geolocation' in navigator)) return true;
        if (navigator.permissions && navigator.permissions.query) {
          const res = await navigator.permissions.query({ name: 'geolocation' });
          if (res.state !== 'granted') return false;
        }
        const p = await requestPosition(8000);
        if (!alive) return true;
        const name = await placeNameFor(p.coords.latitude, p.coords.longitude);
        if (!alive) return true;
        setPlace(name);
        setAcc(`±${Math.round(p.coords.accuracy || 0)}m`);
        setLocked(true);
        return true;
      } catch {
        return false;
      }
    }
    sync().then((ok) => {
      if (!ok && alive) {
        timer = setInterval(async () => {
          if (await sync()) clearInterval(timer);
        }, 4000);
      }
    });
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // Live clock — client-only state, SSR renders empty (no hydration risk).
  useEffect(() => {
    setNow(stamp());
    const id = setInterval(() => setNow(stamp()), 1000);
    return () => clearInterval(id);
  }, []);

  // Streaming activity log — every line composed from lib copy + runtime stamp.
  useEffect(() => {
    const pool = [
      () => contact.promise,
      () => contact.steps[0].text,
      () => contact.steps[1].text,
      () => contact.steps[2].text,
      () => contact.budgets.join('  /  '),
      () => hero.stats.map((s) => `${s.v} ${s.k}`).join('  •  '),
      () => `${site.name} — ${hero.kicker}`,
    ];
    let i = 0;
    const id = setInterval(() => {
      const text = pool[i % pool.length]();
      i += 1;
      setLines((prev) => [...prev.slice(-4), { t: stamp(), text, id: i }]);
    }, 2100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] shadow-[6px_6px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5]">
      <style>{`
        .uplink-row { animation: uplink-row-in 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes uplink-row-in { from { opacity: 0; transform: translateY(8px); } }
        .uplink-tick { display: flex; width: max-content; animation: uplink-tick 26s linear infinite; }
        @keyframes uplink-tick { to { transform: translateX(-50%); } }
        .uplink-eq { transform-origin: bottom; animation: uplink-eq 1.1s ease-in-out infinite alternate; }
        @keyframes uplink-eq { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }
        .uplink-blink { animation: uplink-blink 1.1s steps(2, start) infinite; }
        @keyframes uplink-blink { to { visibility: hidden; } }
        @media (prefers-reduced-motion: reduce) {
          .uplink-row, .uplink-tick, .uplink-eq, .uplink-blink { animation: none; }
        }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.08)_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div aria-hidden className="absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />

      {/* header: kicker + live clock */}
      <div className="relative flex items-center gap-2 px-4 pt-4">
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${lines.length || locked ? 'animate-pulse bg-[#11DFF5] shadow-[0_0_8px_#11DFF5]' : 'animate-ping bg-white/60'}`}
        />
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
          {kicker}
        </span>
        <span className="ml-auto font-mono text-[12px] font-bold tabular-nums tracking-[0.08em] text-[#11DFF5]">
          {now || '--:--:--'}
        </span>
      </div>

      {/* scrolling lib ticker */}
      <div aria-hidden className="relative mt-3 overflow-hidden border-y border-[#11DFF5]/20 py-1.5">
        <div className="uplink-tick">
          {[0, 1].map((half) => (
            <span key={half} className="whitespace-nowrap pr-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#11DFF5]/70">
              {ringText}
              {ringText}
            </span>
          ))}
        </div>
      </div>

      {/* console */}
      <div className="relative flex h-44 flex-col justify-end gap-1.5 overflow-hidden px-4 py-3">
        {lines.length === 0 && (
          <p className="font-mono text-[11px] text-white/40">
            {waitingLabel}
            <span aria-hidden className="uplink-blink ml-1 inline-block h-3 w-[7px] bg-[#11DFF5]/70 align-baseline" />
          </p>
        )}
        {lines.map((l, idx) => (
          <p key={l.id} className={`uplink-row font-mono text-[11px] leading-snug ${idx === lines.length - 1 ? 'text-[#11DFF5]' : 'text-white/45'}`}>
            <span className="mr-2 text-white/30">{l.t}</span>
            {l.text}
          </p>
        ))}
      </div>

      {/* equalizer + lock status */}
      <div className="relative flex items-end gap-4 px-4 pb-1">
        <div aria-hidden className="flex h-10 flex-1 items-end gap-[3px]">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <span
              key={i}
              className="uplink-eq w-full bg-[#11DFF5]/80"
              style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.12}s`, animationDuration: `${0.8 + ((i * 13) % 5) * 0.14}s` }}
            />
          ))}
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center border-[3px] transition-colors duration-500 ${
            locked ? 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40] shadow-[0_0_20px_#11DFF5]' : 'border-white/25 bg-white/5 text-[#11DFF5]/70'
          }`}
        >
          <MapPin aria-hidden className="h-4 w-4" />
        </span>
      </div>

      <div className="relative flex items-center gap-2 border-t-[4px] border-[#11DFF5]/40 bg-black/30 px-4 py-3 backdrop-blur">
        <span className="min-w-0 flex-1 truncate text-[11px] font-black uppercase tracking-[0.14em] text-white">
          {locked ? liveLabel : waitingLabel} — {place || site.shortName}
        </span>
        {acc && (
          <span className="shrink-0 font-mono text-[11px] font-bold tracking-[0.04em] text-[#11DFF5]">
            {acc}
          </span>
        )}
      </div>
    </div>
  );
}
