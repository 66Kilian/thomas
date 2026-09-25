import { palette, type PaletteColors, type ThemeKey } from '@/kit/theme';

/**
 * Sechs Farbwelten von „Aurora". Grundflächen (1.–5. Wert) = plattformweite Werte je Stimmung;
 * Aurora setzt Markenfarbe, Text darauf und Akzent (6.–8. Wert): Rosé-Magenta mit Nordlicht-Akzent.
 * Einzige Abweichung: „Playful" mutedText #9d7e92 → #7f6275 (Kontrast 3,4 → 5,0, siehe HINWEISE.md).
 * Reihenfolge: background, surface, text, mutedText, border, primary, onPrimary, accent, dark.
 */
export const palettes: Record<ThemeKey, PaletteColors> = {
  gothic: palette('#0b0a0e', '#16141c', '#e6e2ee', '#918c9e', '#292532', '#e0558c', '#1a0610', '#d2b173', true),
  playful: palette('#fff5fa', '#ffffff', '#3b2a37', '#7f6275', '#f5d5e5', '#c2185b', '#ffffff', '#7c3aed', false),
  redlight: palette('#120409', '#1e0a12', '#fde7ef', '#c07f92', '#3a1220', '#f43f5a', '#1a0206', '#ff8a5c', true),
  tech: palette('#0a0e14', '#121a24', '#d9e4f0', '#7e93a8', '#223140', '#22d3ee', '#03151c', '#a3e635', true),
  royal: palette('#171020', '#221833', '#f2ead8', '#a89a7e', '#3a2c50', '#d4ae52', '#1c1400', '#b48cff', true),
  light: palette('#ffffff', '#fafafa', '#1c1c21', '#71717a', '#e4e4e7', '#c2185b', '#ffffff', '#96620f', false)
};
