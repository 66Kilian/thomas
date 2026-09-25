'use client';

import { useEffect, useRef, useState } from 'react';

import { THEME_KEYS, type ThemeKey } from '@/kit/theme';
import { palettes } from '@/templates/aurora/palettes';

import { PAGE_LABELS, previewLang, STYLE_TEXT, THEME_NAMES, UI, type Lang } from './praesentation-i18n';

/** Präsentation: Design links wählen, rechts live sehen, dann öffnen. Nur zum Zeigen. */

const PAGES: { key: string; q?: string }[] = [
  { key: 'Home' },
  { key: 'ContentDetail', q: '&inhalt=sommer-garten' },
  { key: 'Subscriptions' },
  { key: 'Events' },
  { key: 'Wishlist' },
  { key: 'Bundles' },
  { key: 'Auctions' },
  { key: 'Requests' },
  { key: 'TextPage', q: '&seite=ueber-mich' },
  { key: 'Wallet' },
  { key: 'AgeGate' }
];

const url = (page: (typeof PAGES)[number], w: ThemeKey, lang: Lang) => `/v/aurora/${page.key}?s=voll&w=${w}${page.q ?? ''}&lang=${previewLang(lang)}`;

/** iframe in echter Größe, per scale auf die Breite des Rahmens verkleinert. */
function Live({ src, width, height, title }: { src: string; width: number; height: number; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  useEffect(() => setLoading(true), [src]);
  return (
    <div ref={box} className="relative w-full overflow-hidden bg-black/40" style={{ aspectRatio: `${width} / ${height}` }}>
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          onLoad={() => setLoading(false)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      )}
      <div className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0c0b10]/70 transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0'}`}>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    </div>
  );
}

export function DesignWahl({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const names = THEME_NAMES[lang];
  const [w, setW] = useState<ThemeKey>('gothic');
  const [p, setP] = useState(0);
  const page = PAGES[p];
  const label = PAGE_LABELS[lang][page.key];
  const src = url(page, w, lang);
  const pal = palettes[w];

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-10">
      {/* Designs */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">{t.step1}</p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {THEME_KEYS.map((k) => {
            const c = palettes[k];
            const on = k === w;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setW(k)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${on ? 'border-white/60 bg-white/10' : 'border-white/10 bg-white/[0.03] hover:border-white/30'}`}
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15" style={{ background: c.background }}>
                  <span className="absolute bottom-1.5 left-1.5 h-4 w-4 rounded-full" style={{ background: c.primary }} />
                  <span className="absolute right-1.5 top-1.5 h-3 w-3 rounded-full" style={{ background: c.accent }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{names[k]}</span>
                  <span className="hidden text-xs text-white/50 sm:block">{STYLE_TEXT[lang][k]}</span>
                </span>
                {on && <span className="ml-auto hidden h-2 w-2 shrink-0 rounded-full bg-white lg:block" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vorschau */}
      <div className="min-w-0">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">{t.step2}</p>
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {PAGES.map((pg, i) => (
            <button
              key={pg.key}
              type="button"
              onClick={() => setP(i)}
              className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition ${i === p ? 'bg-white text-black' : 'border border-white/15 text-white/70 hover:text-white'}`}
            >
              {PAGE_LABELS[lang][pg.key]}
            </button>
          ))}
        </div>

        {/* Handy: Handy-Ansicht */}
        <div className="mx-auto w-[260px] rounded-[2rem] border border-white/15 bg-[#111] p-2 shadow-2xl shadow-black/60 md:hidden">
          <div className="overflow-hidden rounded-[1.5rem]">
            <Live src={src} width={390} height={844} title={`${label} ${t.mobile}`} />
          </div>
        </div>

        {/* ab Tablet: Desktop-Rahmen mit Handy daneben */}
        <div className="relative hidden md:block">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#111] shadow-2xl shadow-black/60">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 truncate text-[11px] text-white/40">
                {names[w]} · {label}
              </span>
            </div>
            <Live src={src} width={1280} height={800} title={`${names[w]} · ${label}`} />
          </div>
          <div className="absolute -bottom-8 -right-3 hidden w-[180px] rounded-[1.75rem] border border-white/15 bg-[#111] p-1.5 shadow-2xl shadow-black/70 md:block xl:-right-8 xl:w-[200px]">
            <div className="overflow-hidden rounded-[1.4rem]">
              <Live src={src} width={390} height={844} title={`${label} ${t.mobile}`} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-14 md:justify-start">
          <a
            href={src}
            className="inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-bold shadow-2xl transition hover:opacity-90"
            style={{ background: pal.primary, color: pal.onPrimary }}
          >
            {t.open}
          </a>
          <span className="text-sm text-white/50">
            {names[w]} · {label}
          </span>
        </div>
        {t.previewNote && <p className="mt-4 max-w-xl text-xs leading-5 text-white/40">{t.previewNote}</p>}
      </div>
    </div>
  );
}
