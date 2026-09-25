'use client';

import { ArrowRight, ChevronLeft, ChevronRight, Lock, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';

/**
 * Story-Ansicht (Verbesserung mit JavaScript): Klick auf ein Element mit `data-story-open="<n>"`
 * (Avatar-Ring, Highlight-Kreise) öffnet die Story ab Folie n. Ohne JavaScript bleiben das normale
 * Links (href des Moments). Tippen links/rechts, Halten = Pause, nach unten wischen = schließen,
 * Pfeiltasten/Esc. Gesehene Ringe werden grau (`data-seen`, nur für diese Sitzung).
 */

export interface StorySlide {
  id: string;
  image: string | null;
  eyebrow: string;
  title: string;
  text?: string;
  locked?: boolean;
  cta?: { label: string; href: string };
}

const DUR = 5000;
const SEEN_KEY = 'aurora_story_seen';

function readSeen(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function markRings(seen: string[]) {
  document.querySelectorAll<HTMLElement>('[data-story-ring]').forEach((el) => {
    const ids = (el.dataset.storyRing ?? '').split(' ').filter(Boolean);
    const done = ids.length > 0 && ids.every((id) => seen.includes(id));
    if (done) el.dataset.seen = '';
    else delete el.dataset.seen;
    const hint = el.querySelector<HTMLElement>('[data-story-hint]');
    if (hint) hint.textContent = done ? (hint.dataset.seenLabel ?? '') : (hint.dataset.label ?? '');
  });
}

export function StoryViewer({
  slides,
  name,
  avatarUrl,
  labels
}: {
  slides: StorySlide[];
  name: string;
  avatarUrl: string | null;
  labels: { title: string; close: string; prev: string; next: string };
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [drag, setDrag] = useState(0);
  const pointer = useRef<{ y: number; at: number; moved: boolean } | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const see = useCallback((i: number) => {
    const s = slides[i];
    if (!s) return;
    const seen = readSeen();
    if (!seen.includes(s.id)) {
      seen.push(s.id);
      try {
        sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
      } catch {}
    }
    markRings(seen);
  }, [slides]);

  const show = useCallback(
    (i: number) => {
      setIdx(i);
      setRun((r) => r + 1);
      see(i);
    },
    [see]
  );
  const close = useCallback(() => {
    setOpen(false);
    document.documentElement.style.overflow = '';
    lastFocus.current?.focus();
  }, []);
  const next = useCallback(() => (idx < slides.length - 1 ? show(idx + 1) : close()), [idx, slides.length, show, close]);
  const prev = useCallback(() => show(Math.max(0, idx - 1)), [idx, show]);

  // Öffnen per Klick auf [data-story-open] — der Link dahinter ist der Weg ohne JavaScript.
  useEffect(() => {
    markRings(readSeen());
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-story-open]');
      if (!el) return;
      e.preventDefault();
      lastFocus.current = el;
      setPaused(false);
      setOpen(true);
      document.documentElement.style.overflow = 'hidden';
      show(Math.min(slides.length - 1, Number(el.dataset.storyOpen) || 0));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [show, slides.length]);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close, next, prev]);

  if (!open || slides.length === 0) return null;
  const slide = slides[idx];

  const down = (e: RPointerEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    pointer.current = { y: e.clientY, at: Date.now(), moved: false };
    setPaused(true);
  };
  const move = (e: RPointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    const dy = e.clientY - p.y;
    if (dy > 12) {
      p.moved = true;
      setDrag(dy);
    }
  };
  const up = (e: RPointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    pointer.current = null;
    const dy = e.clientY - p.y;
    setDrag(0);
    setPaused(false);
    if (p.moved && dy > 110) return close();
    if (!p.moved && Date.now() - p.at < 250) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      if (e.clientX - r.left < r.width * 0.35) prev();
      else next();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl [animation:aurora-fade_.25s_ease]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <style>{`@keyframes aurora-bar{from{width:0}to{width:100%}}@keyframes aurora-fade{from{opacity:0}}@keyframes aurora-pop{from{opacity:0;transform:scale(.94)}}`}</style>

      <button type="button" onClick={prev} aria-label={labels.prev} className="absolute left-[calc(50%-17rem)] top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex">
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>

      <div
        className="relative h-[100dvh] w-screen touch-none select-none overflow-hidden bg-card text-white shadow-[0_40px_120px_-30px_var(--primary)] [animation:aurora-pop_.35s_cubic-bezier(.34,1.4,.64,1)] sm:h-[min(92dvh,calc(26.25rem*16/9))] sm:w-[26.25rem] sm:rounded-[1.5rem]"
        style={{ transform: drag ? `translateY(${drag}px)` : undefined, opacity: drag ? Math.max(0.4, 1 - drag / 400) : undefined }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          pointer.current = null;
          setDrag(0);
          setPaused(false);
        }}
      >
        {/* Bild */}
        {slide.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={slide.id} src={slide.image} alt="" className={`absolute inset-0 h-full w-full object-cover [animation:aurora-fade_.35s_ease] ${slide.locked ? 'scale-110 blur-2xl brightness-50' : ''}`} />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,var(--primary),transparent_70%),radial-gradient(70%_60%_at_80%_90%,var(--accent),transparent_70%)] opacity-70" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent via-40% to-black/85" />

        {/* Fortschritt */}
        <div className="absolute inset-x-3 top-[calc(0.75rem+env(safe-area-inset-top,0px))] z-10 flex gap-1">
          {slides.map((s, i) => (
            <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <i
                key={i === idx ? `${s.id}-${run}` : s.id}
                className="block h-full bg-white"
                style={
                  i < idx
                    ? { width: '100%' }
                    : i === idx
                      ? { animation: `aurora-bar ${DUR}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }
                      : { width: 0 }
                }
                onAnimationEnd={i === idx ? next : undefined}
              />
            </span>
          ))}
        </div>

        {/* Kopf */}
        <div className="absolute inset-x-3 top-[calc(1.5rem+env(safe-area-inset-top,0px))] z-10 flex items-center gap-2.5">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-black text-primary-foreground">{name.charAt(0)}</span>
          )}
          <b className="truncate text-sm">{name}</b>
          <button ref={closeBtn} type="button" onClick={close} aria-label={labels.close} className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/35 transition hover:bg-black/55">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {/* Gesperrt */}
        {slide.locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/45 backdrop-blur-md">
              <Lock aria-hidden="true" className="h-7 w-7" />
            </span>
          </div>
        )}

        {/* Text */}
        <div key={slide.id} className="absolute inset-x-5 bottom-[calc(1.75rem+env(safe-area-inset-bottom,0px))] z-10 [animation:aurora-fade_.4s_ease]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-link,var(--primary))] [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">{slide.eyebrow}</p>
          <h3 className="mt-1.5 text-[2rem] font-black leading-[1.02] tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,.5)]">{slide.title}</h3>
          {slide.text && <p className="mt-2 text-[15px] text-white/80">{slide.text}</p>}
          {slide.cta && (
            <a href={slide.cta.href} className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-2xl shadow-black/50 transition hover:opacity-90">
              {slide.cta.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <button type="button" onClick={next} aria-label={labels.next} className="absolute right-[calc(50%-17rem)] top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:flex">
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
