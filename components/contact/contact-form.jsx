'use client';

import { useEffect, useRef, useState } from 'react';
import { contact as libContact } from '@/lib/site';
import { placeNameFor } from './location';
import { ArrowRight, Check, MapPin, Shield, Zap } from 'lucide-react';

const GEO_OPTS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 };

export function ContactForm({ t }) {
  const contact = t && typeof t === 'object' && !Array.isArray(t) ? t : libContact;
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [loc, setLoc] = useState({ state: 'idle', lat: '', lon: '', acc: '' });
  const [place, setPlace] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);

  function showToast(kind, title, desc) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ kind, title, desc });
    toastTimer.current = setTimeout(() => setToast(null), kind === 'success' ? 7000 : 5500);
  }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Coordinates → words once the position locks.
  useEffect(() => {
    if (loc.state !== 'locked' || !loc.lat || !loc.lon) return;
    let alive = true;
    placeNameFor(loc.lat, loc.lon).then((name) => {
      if (alive) setPlace(name);
    });
    return () => {
      alive = false;
    };
  }, [loc.state, loc.lat, loc.lon]);

  // Permission-aware location capture: only prompts when the user opts in
  // or the browser already granted access. Initial 'idle' matches SSR output.
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLoc((s) => ({ ...s, state: 'unavailable' }));
      return;
    }
    let alive = true;
    const apply = (p) => {
      if (!alive) return;
      setLoc({
        state: 'locked',
        lat: String(p.coords.latitude),
        lon: String(p.coords.longitude),
        acc: String(Math.round(p.coords.accuracy || 0)),
      });
    };
    const deny = () => {
      if (alive) setLoc((s) => ({ ...s, state: 'denied' }));
    };
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((res) => {
          if (!alive) return;
          if (res.state === 'granted') {
            setLoc((s) => ({ ...s, state: 'locating' }));
            navigator.geolocation.getCurrentPosition(apply, deny, GEO_OPTS);
          } else if (res.state === 'prompt') {
            setLoc((s) => ({ ...s, state: 'prompt' }));
          } else {
            deny();
          }
        })
        .catch(() => {
          if (alive) setLoc((s) => ({ ...s, state: 'prompt' }));
        });
    } else {
      setLoc((s) => ({ ...s, state: 'prompt' }));
    }
    return () => {
      alive = false;
    };
  }, []);

  function lockFromPosition(p) {
    setLoc({
      state: 'locked',
      lat: String(p.coords.latitude),
      lon: String(p.coords.longitude),
      acc: String(Math.round(p.coords.accuracy || 0)),
    });
  }

  // Error code 1 = permission denied/blocked (browser will NOT show a
  // prompt again — the user must unblock manually). Codes 2/3 are transient.
  function handlePositionError(err) {
    if (err && err.code === 1) {
      setLoc((s) => ({ ...s, state: 'blocked' }));
    } else {
      setLoc((s) => ({ ...s, state: 'prompt' }));
      showToast(
        'warn',
        contact.locationRetryHint ?? 'Could not lock your position.',
        contact.locationEnable ?? 'Attach my location'
      );
    }
  }

  function enableLocation() {
    if (!('geolocation' in navigator)) return;
    setLoc((s) => ({ ...s, state: 'locating' }));
    navigator.geolocation.getCurrentPosition(lockFromPosition, handlePositionError, GEO_OPTS);
  }

  // Re-checks the permission state first: if still blocked we keep the
  // unblock instructions instead of failing silently again.
  function retryLocation() {
    if (!('geolocation' in navigator)) return;
    setLoc((s) => ({ ...s, state: 'locating' }));
    const attempt = () =>
      navigator.geolocation.getCurrentPosition(lockFromPosition, handlePositionError, GEO_OPTS);
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((res) => {
          if (res.state === 'denied') {
            setLoc((s) => ({ ...s, state: 'blocked' }));
          } else {
            attempt();
          }
        })
        .catch(attempt);
    } else {
      attempt();
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    // Hard gate: no locked location, no transmission.
    if (loc.state !== 'locked') {
      showToast('warn', contact.locationRequired, contact.locationMissing);
      return;
    }
    setStatus('sending');
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch(contact.formAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || contact.errorDesc);
      setStatus('sent');
      showToast('success', contact.success.title.join(' '), contact.success.desc);
    } catch (err) {
      const msg = err instanceof Error ? err.message : contact.errorDesc;
      setError(msg);
      setStatus('error');
      showToast('error', msg, contact.errorDesc);
    }
  }

  const toastUi = toast && (
    <div
      role="status"
      aria-live="polite"
      className="toast-in fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] border-[4px] border-[#020F40] bg-white shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[6px_6px_0_0_#11DFF5]"
    >
      <div aria-hidden className={`h-[4px] w-full ${toast.kind === 'success' ? 'bg-[#0D65EF]' : toast.kind === 'warn' ? 'bg-[#11DFF5]' : 'bg-[#020F40] dark:bg-white'}`} />
      <div className="flex items-start gap-3 p-4">
        <span
          aria-hidden
          className={`flex h-9 w-9 shrink-0 items-center justify-center border-[3px] ${toast.kind === 'success' ? 'border-[#020F40] bg-[#11DFF5] text-[#020F40] dark:border-[#11DFF5]' : 'border-[#020F40] bg-[#020F40] text-[#11DFF5] dark:border-[#11DFF5]'}`}
        >
          {toast.kind === 'success'
            ? <Check className="h-4 w-4" />
            : toast.kind === 'warn'
              ? <MapPin className="h-4 w-4" />
              : <Zap className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-[12px] font-black uppercase tracking-[0.1em] text-[#020F40] dark:text-white">
            {toast.title}
          </span>
          {toast.desc && (
            <span className="mt-1 block break-words text-[12px] font-medium leading-relaxed text-[#020F40]/70 dark:text-white/70">
              {toast.desc}
            </span>
          )}
        </span>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setToast(null)}
          aria-label="Dismiss"
          className="flex h-7 w-7 shrink-0 items-center justify-center border-[2px] border-[#020F40]/20 text-[14px] font-black leading-none text-[#020F40]/60 transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:text-white/60 dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
        >
          ×
        </button>
      </div>
    </div>
  );

  if (status === 'sent') {
    return (
      <>
      <div className="contact-rise flex min-h-[320px] flex-col items-start justify-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center border-[4px] border-[#020F40] bg-[#11DFF5] text-[#020F40] shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]">
          <Check aria-hidden className="h-7 w-7" />
        </span>
        <p className="text-[clamp(1.75rem,4vw,2.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          <span className="block">{contact.success.title[0]}</span>
          <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{contact.success.title[1]}</span>
        </p>
        <p className="max-w-[480px] text-[14px] font-medium leading-relaxed text-[#020F40]/75 dark:text-white/75">
          {contact.success.desc}
        </p>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setStatus('idle')}
          className="mt-2 inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#020F40] hover:text-white hover:shadow-[4px_4px_0_0_#0D65EF] dark:border-[#11DFF5] dark:bg-transparent dark:text-white dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
        >
          {contact.newLabel}
        </button>
      </div>
      {toastUi}
      </>
    );
  }

  return (
    <>
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {contact.fields.filter((f) => f.half).map((f, i) => (
          <label
            key={f.id}
            htmlFor={f.id === 'phone' ? 'contact-phone-number' : `contact-${f.id}`}
            className={`group flex min-w-0 flex-col gap-1.5 ${f.id === 'phone' ? 'sm:col-span-2' : ''}`}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:text-white">
              <span aria-hidden className="text-[#0D65EF] dark:text-[#11DFF5]">{String(i + 1).padStart(2, '0')}</span>
              {f.label}
              {f.required && <span aria-hidden className="text-[#0D65EF] dark:text-[#11DFF5]">*</span>}
            </span>
            {f.id === 'phone' ? (
              <span className="flex min-w-0 gap-3">
                <span className="flex w-36 shrink-0 flex-col gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                    {contact.countryCodeLabel}
                  </span>
                  <select
                    suppressHydrationWarning
                    id="contact-phone-code"
                    name="countryCode"
                    defaultValue={contact.countryCodes[0].d}
                    disabled={status === 'sending'}
                    aria-label={contact.countryCodeLabel}
                    className="min-w-0 cursor-pointer border-[3px] border-[#020F40] bg-white px-2 py-3 text-[14px] font-bold text-[#020F40] outline-none transition-all duration-200 focus:border-[#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white"
                  >
                    {contact.countryCodes.map((c) => (
                      <option key={`${c.c}-${c.d}`} value={c.d}>{`${c.c} (${c.d})`}</option>
                    ))}
                  </select>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span aria-hidden className="hidden text-[9px] font-black uppercase tracking-[0.14em] text-transparent sm:block">
                    .
                  </span>
                  <input
                    suppressHydrationWarning
                    id="contact-phone-number"
                    name={f.id}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    required={f.required}
                    placeholder={f.placeholder}
                    disabled={status === 'sending'}
                    className="contact-field min-w-0 border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-medium text-[#020F40] outline-none transition-all duration-200 placeholder:text-[#020F40]/35 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:placeholder:text-white/30 dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
                  />
                </span>
              </span>
            ) : (
            <input
              suppressHydrationWarning
              id={`contact-${f.id}`}
              name={f.id}
                type={f.type}
                autoComplete={f.autoComplete}
                required={f.required}
                placeholder={f.placeholder}
                disabled={status === 'sending'}
                className="contact-field min-w-0 border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-medium text-[#020F40] outline-none transition-all duration-200 placeholder:text-[#020F40]/35 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:placeholder:text-white/30 dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
              />
            )}
          </label>
        ))}
      </div>
      {contact.fields.filter((f) => !f.half).map((f) => (
        <label key={f.id} htmlFor={`contact-${f.id}`} className="flex min-w-0 flex-col gap-1.5">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:text-white">
            <Zap aria-hidden className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
            {f.label}
            {f.required && <span aria-hidden className="text-[#0D65EF] dark:text-[#11DFF5]">*</span>}
          </span>
          <textarea
            suppressHydrationWarning
            id={`contact-${f.id}`}
            name={f.id}
            autoComplete={f.autoComplete}
            required={f.required}
            rows={f.rows || 5}
            placeholder={f.placeholder}
            disabled={status === 'sending'}
            className="contact-field min-w-0 resize-y border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-medium leading-relaxed text-[#020F40] outline-none transition-all duration-200 placeholder:text-[#020F40]/35 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:placeholder:text-white/30 dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
          />
        </label>
      ))}
      <label htmlFor="contact-budget" className="flex min-w-0 flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:text-white">
          <Shield aria-hidden className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
          {contact.budgetLabel}
        </span>
        <select
          suppressHydrationWarning
          id="contact-budget"
          name="budget"
          defaultValue={contact.budgets[0]}
          disabled={status === 'sending'}
          className="min-w-0 cursor-pointer border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-bold text-[#020F40] outline-none transition-all duration-200 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
        >
          {contact.budgets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </label>

      {/* LOCATION — permission-gated capture, coordinates ride along silently */}
      <div className="flex min-w-0 flex-wrap items-center gap-3 border-[3px] border-dashed border-[#020F40]/30 bg-[var(--bg-base)] px-4 py-3 dark:border-white/20">
        <span
          aria-hidden
          className={`flex h-8 w-8 shrink-0 items-center justify-center border-[2px] ${
            loc.state === 'locked'
              ? 'border-[#020F40] bg-[#11DFF5] text-[#020F40] dark:border-[#11DFF5]'
              : 'border-[#020F40]/25 text-[#020F40]/40 dark:border-white/25 dark:text-white/40'
          }`}
        >
          <MapPin className={`h-4 w-4 ${loc.state === 'locating' ? 'animate-bounce' : ''}`} />
        </span>
        <span className="min-w-0 flex-1 break-words text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          {loc.state === 'locked'
            ? place
              ? `${contact.locationAttached} — ${place}`
              : contact.locationAttached
            : loc.state === 'locating' || loc.state === 'idle'
              ? contact.locationLocating
              : loc.state === 'blocked'
                ? (contact.locationBlockedTitle ?? 'Location is blocked')
                : contact.locationMissing}
        </span>
        {(loc.state === 'prompt' || loc.state === 'denied') && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={enableLocation}
            className="shrink-0 border-[3px] border-[#020F40] bg-[#11DFF5] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[3px_3px_0_0_#11DFF5]"
          >
            {contact.locationEnable}
          </button>
        )}
        {loc.state === 'blocked' && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={retryLocation}
            className="shrink-0 border-[3px] border-[#020F40] bg-[#11DFF5] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[3px_3px_0_0_#11DFF5]"
          >
            {contact.locationRetry ?? 'Retry location'}
          </button>
        )}
        <input type="hidden" name="placeName" value={place} readOnly />
        <input type="hidden" name="latitude" value={loc.lat} readOnly />
        <input type="hidden" name="longitude" value={loc.lon} readOnly />
        <input type="hidden" name="locationAccuracy" value={loc.acc} readOnly />
      </div>

      {/* BLOCKED — the browser won't show a prompt again, so spell out the manual unblock. */}
      {loc.state === 'blocked' && (
        <div
          role="alert"
          className="border-[3px] border-[#020F40] bg-[#C6EAF4] px-4 py-3 dark:border-[#11DFF5] dark:bg-[#0B1220]"
        >
          <p className="break-words text-[12px] font-black uppercase tracking-[0.1em] text-[#020F40] dark:text-white">
            {contact.locationBlockedTitle ?? 'Location is blocked'}
          </p>
          <p className="mt-1 break-words text-[12px] font-medium leading-relaxed text-[#020F40]/75 dark:text-white/75">
            {contact.locationBlockedDesc ??
              'Your browser is blocking location for this site, so no permission popup can appear. Allow it in 3 taps:'}
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-[12px] font-bold leading-relaxed text-[#020F40] dark:text-white">
            <li>{contact.locationBlockedStep1 ?? 'Tap the tune / lock icon in the address bar'}</li>
            <li>{contact.locationBlockedStep2 ?? 'Set Location to Allow'}</li>
            <li>{contact.locationBlockedStep3 ?? 'Come back here and tap Retry location below'}</li>
          </ol>
        </div>
      )}

      {status === 'error' && (
        <p role="alert" className="contact-rise border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || contact.errorDesc}
        </p>
      )}
      <button
        type="submit"
        suppressHydrationWarning
        disabled={status === 'sending'}
        className="group mt-2 inline-flex min-h-14 items-center justify-center gap-3 border-[4px] border-[#020F40] bg-[#0D65EF] px-8 py-4 text-[13px] font-black uppercase tracking-[0.16em] text-white shadow-[5px_5px_0_0_#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#020F40] active:translate-x-px active:translate-y-px active:shadow-[3px_3px_0_0_#020F40] disabled:cursor-wait disabled:opacity-70 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[5px_5px_0_0_white] dark:hover:shadow-[7px_7px_0_0_white]"
      >
        {status === 'sending' ? contact.sendingLabel : status === 'error' ? contact.retryLabel : contact.submitLabel}
        <span className="flex h-6 w-6 items-center justify-center bg-white text-[#0D65EF] transition-transform duration-200 group-hover:translate-x-1 dark:bg-[#020F40] dark:text-[#11DFF5]">
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </span>
      </button>
      <p className="text-center text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40]/60 dark:text-white/60">
        {contact.promise}
      </p>
    </form>
    {toastUi}
  </>
  );
}
