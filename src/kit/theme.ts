import type { CSSProperties } from 'react';

import type { ColorTheme } from './types';

/**
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *  FARBWELTEN
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * Jedes Template liefert sechs Paletten (`FanTemplate.palettes`), je eine pro Stimmung. Die Plattform
 * legt die gewählte Palette als CSS-Variablen auf die Seite; Komponenten verwenden ausschließlich die
 * Tailwind-Klassen dieser Tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`,
 * `border-border`, `bg-primary`, `text-primary-foreground`, `bg-accent`, `rounded-lg` …).
 *
 * Grundflächen (background/surface/text/mutedText/border) sind je Stimmung für alle Templates gleich
 * gedacht — ein neues Template variiert vor allem `primary`, `onPrimary` und `accent`. Weicht es davon
 * ab, bitte begründen.
 */

export type ThemeKey = Exclude<ColorTheme, 'custom'>;

export const THEME_KEYS: ThemeKey[] = ['gothic', 'playful', 'redlight', 'tech', 'royal', 'light'];

export const THEME_LABELS: Record<ThemeKey | 'custom', { de: string; en: string }> = {
  custom: { de: 'Eigene Farben', en: 'Custom colours' },
  gothic: { de: 'Dunkel & Gruftig', en: 'Dark & Gothic' },
  playful: { de: 'Verspielt', en: 'Playful' },
  redlight: { de: 'Rotlicht', en: 'Red light' },
  tech: { de: 'Technisch', en: 'Tech' },
  royal: { de: 'Pompös', en: 'Royal' },
  light: { de: 'Hell & Klar', en: 'Light & Clear' }
};

/** Farben einer Welt (Hex). `dark` steuert Scrollleisten und Formularfelder des Browsers. */
export interface PaletteColors {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  onPrimary: string;
  accent: string;
  dark: boolean;
}

/** Kurzform zum Anlegen von Paletten (Reihenfolge = Felder von PaletteColors). */
export function palette(
  background: string,
  surface: string,
  text: string,
  mutedText: string,
  border: string,
  primary: string,
  onPrimary: string,
  accent: string,
  dark: boolean
): PaletteColors {
  return { background, surface, text, mutedText, border, primary, onPrimary, accent, dark };
}

/**
 * Formsprache je Stimmung — gilt plattformweit, Templates ändern sie nicht: Eckenradius, 3 px
 * Akzentlinie am oberen Rand, dezenter Lichtschein hinter dem Inhalt.
 */
export const DECOR: Record<ThemeKey, (c: PaletteColors) => { radius: string; accentBar: string; pageGlow: string | null }> = {
  gothic: (c) => ({
    radius: '0.25rem',
    accentBar: `linear-gradient(90deg, transparent, ${c.primary} 35%, ${c.primary} 65%, transparent)`,
    pageGlow: `radial-gradient(80rem 30rem at 50% -10rem, color-mix(in oklab, ${c.accent} 16%, transparent), transparent)`
  }),
  playful: (c) => ({
    radius: '1rem',
    accentBar: `linear-gradient(90deg, ${c.primary}, ${c.accent})`,
    pageGlow: `radial-gradient(70rem 26rem at 85% -8rem, color-mix(in oklab, ${c.accent} 14%, transparent), transparent)`
  }),
  redlight: (c) => ({
    radius: '0.75rem',
    accentBar: `linear-gradient(90deg, ${c.primary}, ${c.accent}, ${c.primary})`,
    pageGlow: `radial-gradient(75rem 28rem at 50% -8rem, color-mix(in oklab, ${c.primary} 24%, transparent), transparent)`
  }),
  tech: (c) => ({
    radius: '0.125rem',
    accentBar: `linear-gradient(90deg, ${c.primary} 0%, ${c.primary} 60%, ${c.accent} 60%, ${c.accent})`,
    pageGlow: `radial-gradient(60rem 24rem at 12% -8rem, color-mix(in oklab, ${c.accent} 10%, transparent), transparent)`
  }),
  royal: (c) => ({
    radius: '0.4rem',
    accentBar: `linear-gradient(90deg, transparent, ${c.primary} 30%, ${c.primary} 70%, transparent)`,
    pageGlow: `radial-gradient(80rem 30rem at 50% -10rem, color-mix(in oklab, ${c.accent} 14%, transparent), transparent)`
  }),
  light: (c) => ({ radius: '0.625rem', accentBar: c.primary, pageGlow: null })
};

// ─── Kontrast (WCAG) — wie auf der Plattform ────────────────────────────────────────────────────

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function relLuminance(hex: string): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = toRgb(hex);
  if ([r, g, b].some((n) => Number.isNaN(n))) return 1;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
/** Kontrastverhältnis zweier Hex-Farben (1–21). Text braucht ≥ 4,5. */
export function contrastRatio(a: string, b: string): number {
  const l1 = relLuminance(a);
  const l2 = relLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function readableText(bg: string): string {
  return contrastRatio('#ffffff', bg) >= contrastRatio('#0a0a0a', bg) ? '#ffffff' : '#0a0a0a';
}
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${h(ar + (br - ar) * t)}${h(ag + (bg - ag) * t)}${h(ab + (bb - ab) * t)}`;
}
/** Markenfarbe so weit auf-/abdunkeln, bis sie als Link auf dem Hintergrund lesbar ist (AA). */
function readableLink(color: string, bg: string): string {
  if (contrastRatio(color, bg) >= 4.5) return color;
  const target = readableText(bg);
  for (let t = 0.15; t < 1; t += 0.15) {
    const c = mix(color, target, t);
    if (contrastRatio(c, bg) >= 4.5) return c;
  }
  return target;
}

/**
 * CSS-Variablen für eine Farbwelt (bzw. für eigene Farben bei `custom`). So setzt sie auch die
 * Plattform — Komponenten müssen davon nichts wissen, sie verwenden nur die Token-Klassen.
 */
export function themeStyle(p: PaletteColors | null, theme: ColorTheme, custom: { primary: string; background: string }): CSSProperties {
  if (!p || theme === 'custom') {
    const dark = relLuminance(custom.background) < 0.2;
    const fg = dark ? '#f5f5f5' : '#111111';
    const onPrimary = readableText(custom.primary);
    return {
      '--background': custom.background,
      '--foreground': fg,
      '--card': dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
      '--card-foreground': fg,
      '--muted': dark ? 'rgba(255,255,255,0.06)' : '#f4f4f5',
      '--muted-foreground': dark ? 'rgba(245,245,245,0.66)' : 'rgba(17,17,17,0.6)',
      '--accent': dark ? 'rgba(255,255,255,0.06)' : '#f4f4f5',
      '--accent-foreground': fg,
      '--border': dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
      '--primary': custom.primary,
      '--primary-foreground': onPrimary,
      '--ring': custom.primary,
      '--destructive': dark ? '#f87171' : '#dc2626',
      '--brand-link': readableLink(custom.primary, custom.background),
      colorScheme: dark ? 'dark' : 'light'
    } as CSSProperties;
  }
  const d = DECOR[theme as ThemeKey](p);
  return {
    '--background': p.background,
    '--foreground': p.text,
    '--card': p.surface,
    '--card-foreground': p.text,
    '--muted': p.surface,
    '--muted-foreground': p.mutedText,
    '--accent': p.accent,
    '--accent-foreground': readableText(p.accent),
    '--border': p.border,
    '--primary': p.primary,
    '--primary-foreground': p.onPrimary,
    '--ring': p.primary,
    '--destructive': p.dark ? '#f87171' : '#dc2626',
    '--radius': d.radius,
    '--theme-accent-bar': d.accentBar,
    ...(d.pageGlow ? { '--theme-page-glow': d.pageGlow } : {}),
    '--brand-link': readableLink(p.primary, p.background),
    colorScheme: p.dark ? 'dark' : 'light'
  } as CSSProperties;
}

/** Prüfliste für die Abgabe: Kontraste aller sechs Welten (in der Vorschau unter „Farbwelten"). */
export function paletteChecks(p: PaletteColors): { label: string; ratio: number; ok: boolean }[] {
  const checks: [string, string, string, number][] = [
    ['Text auf Hintergrund', p.text, p.background, 4.5],
    ['Nebentext auf Hintergrund', p.mutedText, p.background, 4.5],
    ['Text auf Fläche', p.text, p.surface, 4.5],
    ['Knopftext auf Markenfarbe', p.onPrimary, p.primary, 4.5]
  ];
  return checks.map(([label, a, b, min]) => {
    const ratio = contrastRatio(a, b);
    return { label, ratio: Math.round(ratio * 10) / 10, ok: ratio >= min };
  });
}
