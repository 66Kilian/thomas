import { palette, type PaletteColors, type ThemeKey } from '@/kit/theme';

/**
 * Sechs Farbwelten des Basis-Templates. Grundflächen (1.–5. Wert) sind die plattformweiten Werte je
 * Stimmung; ein neues Template ändert vor allem Markenfarbe, Text darauf und Akzent (6.–8. Wert).
 * Reihenfolge: background, surface, text, mutedText, border, primary, onPrimary, accent, dark.
 */
export const palettes: Record<ThemeKey, PaletteColors> = {
  gothic: palette('#0b0a0e', '#16141c', '#e6e2ee', '#918c9e', '#292532', '#9f1239', '#ffffff', '#7c3aed', true),
  playful: palette('#fff5fa', '#ffffff', '#3b2a37', '#9d7e92', '#f5d5e5', '#db2777', '#ffffff', '#8b5cf6', false),
  redlight: palette('#120409', '#1e0a12', '#fde7ef', '#c07f92', '#3a1220', '#e11d48', '#ffffff', '#fb7185', true),
  tech: palette('#0a0e14', '#121a24', '#d9e4f0', '#7e93a8', '#223140', '#0891b2', '#ffffff', '#34d399', true),
  royal: palette('#171020', '#221833', '#f2ead8', '#a89a7e', '#3a2c50', '#c9a227', '#1d1502', '#9333ea', true),
  light: palette('#ffffff', '#fafafa', '#1c1c21', '#71717a', '#e4e4e7', '#18181b', '#ffffff', '#db2777', false)
};
