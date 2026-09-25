import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getLocale, getTranslations } from 'next-intl/server';

import { PAGE_KEYS, type PageKey } from '@/kit/template';
import { themeStyle } from '@/kit/theme';
import type { Locale, PageContext } from '@/kit/types';
import { buildProps } from '@/mock/build';
import { CONTENT } from '@/mock/content';
import { aurora } from '@/templates/aurora';

/**
 * Nur zur Präsentation: die Seiten im Stil „Rotlicht" wie eine fertige Website — Beispieldaten,
 * aber mit echten Fotos (CC0, public/demo/rotlicht) statt Platzhaltern und ohne Kit-Leiste.
 * /rotlicht = Startseite, /rotlicht/<Seite>?… wie in der Vorschau.
 */
export const metadata: Metadata = { title: 'Nova Beispiel', robots: { index: false } };

const IMG = (n: number) => `/demo/rotlicht/${n}.jpg`;
const COVER = IMG(193);
const LOGO = IMG(88);
const POOL = [99, 116, 55, 143, 0, 174, 13, 122, 102, 51, 26, 123, 215, 112, 50, 15, 120, 200, 18, 109, 35, 53, 12, 213, 19].map(IMG);

/** Farbton eines Platzhalters — wie in src/mock/images.ts. */
const hueOf = (seed: string) => [...seed].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 0);
/** Jeder Beispielinhalt bekommt ein eigenes Foto (Kachel und Detailseite gleich). */
const BY_HUE = new Map<number, string>();
CONTENT.forEach((c, i) => {
  const h = hueOf(c.slug);
  if (!BY_HUE.has(h)) BY_HUE.set(h, POOL[i % POOL.length]);
});

/**
 * Ersetzt in den Beispieldaten jedes Platzhalterbild durch ein Foto (gleicher Platzhalter-Farbton ⇒
 * gleiches Foto, damit Kachel und Detailseite zusammenpassen), streicht das Daumenkino (Platzhalter-Streifen)
 * und biegt alle Vorschau-Links auf /rotlicht um.
 */
function demo(value: unknown): unknown {
  if (typeof value === 'string') {
    if (value.startsWith('data:image/svg+xml')) {
      const svg = decodeURIComponent(value);
      const hue = Number(/hsl\((\d+),55%/.exec(svg)?.[1] ?? 0);
      const tag = /<text[^>]*>([^<]*)</.exec(svg)?.[1] ?? '';
      const salt = [...tag.replace(/[^A-Za-z]/g, '')].reduce((a, c) => a + c.charCodeAt(0), 0);
      if (!tag.startsWith('Bild') && BY_HUE.has(hue)) return BY_HUE.get(hue);
      // Galeriebilder („Bild 3 · …") sollen innerhalb einer Galerie verschieden sein.
      return POOL[(hue + (tag.startsWith('Bild') ? salt + Number(/\d+/.exec(tag)?.[0] ?? 0) * 7 : 0)) % POOL.length];
    }
    if (value.includes('data:image/svg+xml')) {
      // Markdown mit eingebettetem Bild (z. B. „Über mich").
      return value.replace(/data:image\/svg\+xml[^)\s]*/g, IMG(153));
    }
    if (value.startsWith('/v/aurora/')) return value.replace('/v/aurora/', '/rotlicht/').replace(/([?&])w=[^&]*&?/, '$1').replace(/[?&]$/, '');
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => demo(v));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === 'sprite') out[k] = null;
      else if (k === 'coverUrl' && v) out[k] = COVER;
      else if (k === 'logoUrl' && v) out[k] = LOGO;
      else out[k] = demo(v);
    }
    return out;
  }
  return value;
}

export default async function Rotlicht({
  params,
  searchParams
}: {
  params: Promise<{ seite?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ seite }, sp] = await Promise.all([params, searchParams]);
  const name = seite?.[0] ?? 'Home';
  if (seite && seite.length > 1) notFound();
  if (!(PAGE_KEYS as readonly string[]).includes(name) || !aurora[name as PageKey]) notFound();
  const page = name as PageKey;
  const query = { s: 'voll', ...Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])), w: 'redlight' };

  const [locale, t, format] = await Promise.all([getLocale(), getTranslations('platform'), getFormatter()]);
  const sprache: Locale = locale.startsWith('en') ? 'en' : 'de';
  const props = demo(
    buildProps({
      template: 'aurora',
      page,
      query,
      locale: sprache,
      t: (key, values) => t(key as never, values as never),
      price: (cents) => format.number(cents / 100, 'eur'),
      date: (iso) => format.dateTime(new Date(iso), 'dateNumeric')
    })
  ) as { ctx: PageContext };

  const Seite = aurora[page] as unknown as ComponentType<Record<string, unknown>>;
  return (
    <div className="kit-theme min-h-screen bg-background text-foreground" data-color-theme="redlight" style={themeStyle(aurora.palettes.redlight, 'redlight', props.ctx.site.customColors)}>
      <Seite {...(props as Record<string, unknown>)} />
    </div>
  );
}
