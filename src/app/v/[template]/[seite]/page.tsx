import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';

import { PAGE_KEYS, type FanTemplate, type PageKey } from '@/kit/template';
import { THEME_KEYS, THEME_LABELS, themeStyle, type ThemeKey } from '@/kit/theme';
import type { ColorTheme, Locale, PageContext } from '@/kit/types';
import { buildProps, PAGE_VARIANTS } from '@/mock/build';
import { SCENARIO_KEYS, SCENARIOS } from '@/mock/scenarios';
import { basis } from '@/templates/basis';
import { TEMPLATES } from '@/templates/registry';

/**
 * Vorschau einer Seite: /v/<template>/<Seite>?s=<szenario>&w=<farbwelt>&lang=de|en&…
 * Rendert die Seite des gewählten Templates mit Beispieldaten; fehlt sie dort, springt das
 * Basis-Template ein (die Kit-Leiste unten sagt das dann).
 */
export default async function Vorschau({
  params,
  searchParams
}: {
  params: Promise<{ template: string; seite: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ template, seite }, sp] = await Promise.all([params, searchParams]);
  const tpl = TEMPLATES[template];
  if (!tpl || !(PAGE_KEYS as readonly string[]).includes(seite)) notFound();
  const page = seite as PageKey;
  const query = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));

  const [locale, t, format] = await Promise.all([getLocale(), getTranslations('platform'), getFormatter()]);
  const sprache: Locale = locale.startsWith('en') ? 'en' : 'de';
  const props = buildProps({
    template,
    page,
    query,
    locale: sprache,
    t: (key, values) => t(key as never, values as never),
    price: (cents) => format.number(cents / 100, 'eur'),
    date: (iso) => format.dateTime(new Date(iso), 'dateNumeric')
  }) as { ctx: PageContext };

  // Die Props passen per Konstruktion zur Seite (buildProps baut sie für genau diesen Schlüssel).
  type AnySeite = ComponentType<Record<string, unknown>>;
  const eigene = tpl[page] as unknown as AnySeite | undefined;
  const Seite = eigene ?? (basis[page] as unknown as AnySeite);
  const theme = props.ctx.site.colorTheme as ColorTheme;
  const palette = theme === 'custom' ? null : tpl.palettes[theme as ThemeKey];

  return (
    <>
      <div
        className="kit-theme min-h-screen bg-background text-foreground"
        data-color-theme={theme !== 'custom' ? theme : undefined}
        style={themeStyle(palette, theme, props.ctx.site.customColors)}
      >
        <Seite {...(props as Record<string, unknown>)} />
      </div>
      <KitBar tpl={tpl} page={page} query={query} ersatz={!eigene} />
    </>
  );
}

/** Steuerleiste des Kits — steht unter der Seite (nicht darüber), damit sie nichts verdeckt. */
function KitBar({ tpl, page, query, ersatz }: { tpl: FanTemplate; page: PageKey; query: Record<string, string | undefined>; ersatz: boolean }) {
  const link = (changes: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...query, ...changes })) if (v != null && k !== 'meldung') q.set(k, v);
    return `/v/${tpl.key}/${page}?${q.toString()}`;
  };
  const chip = (href: string, label: string, active: boolean) => (
    <a key={href + label} href={href} className={`rounded px-1.5 py-0.5 ${active ? 'bg-white text-black' : 'hover:bg-white/15'}`}>
      {label}
    </a>
  );
  const w = query.w ?? 'gothic';
  const s = query.s ?? 'voll';
  return (
    <div className="space-y-1.5 border-t-4 border-fuchsia-500 bg-zinc-900 px-4 py-3 font-mono text-[11px] text-zinc-200">
      <div className="flex flex-wrap items-center gap-2">
        <a href="/" className="font-bold text-fuchsia-300">◀ Übersicht</a>
        <span>Template: <strong>{tpl.meta.name.de}</strong></span>
        <span>· Seite: <strong>{page}</strong></span>
        {ersatz && <span className="rounded bg-amber-500 px-1.5 text-black">vom Basis-Template (in „{tpl.key}" noch nicht umgesetzt)</span>}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-zinc-400">Szenario:</span>
        {SCENARIO_KEYS.map((k) => chip(link({ s: k }), SCENARIOS[k].label, k === s))}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-zinc-400">Farbwelt:</span>
        {[...THEME_KEYS, 'custom' as const].map((k) => chip(link({ w: k }), THEME_LABELS[k].de, k === w))}
        <span className="ml-3 text-zinc-400">Sprache:</span>
        {chip(link({ lang: 'de' }), 'DE', false)}
        {chip(link({ lang: 'en' }), 'EN', false)}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-zinc-400">Seite:</span>
        {PAGE_KEYS.map((p) => chip(`/v/${tpl.key}/${p}?s=${s}&w=${w}`, p, p === page))}
      </div>
      {(PAGE_VARIANTS[page] ?? []).map((v) => (
        <div key={v.param} className="flex flex-wrap items-center gap-1">
          <span className="text-zinc-400">{v.param}:</span>
          {chip(link({ [v.param]: undefined }), '–', !query[v.param])}
          {v.values.map((val) => chip(link({ [v.param]: val }), val, query[v.param] === val))}
        </div>
      ))}
    </div>
  );
}
