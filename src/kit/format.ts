/**
 * Anzeige-Helfer. Preise und Daten IMMER hierüber bzw. über next-intl formatieren — nie von Hand
 * („9,99 €" ist im Englischen „€9.99").
 */

/** Minimaler Ausschnitt von next-intls `useFormatter()` / `getFormatter()`. */
interface NumberFormatter {
  number(value: number, format: 'eur'): string;
}

/** Cent → „9,99 €" / „€9.99". `format` = Rückgabe von `useFormatter()`. */
export function formatPrice(format: NumberFormatter, cents: number): string {
  return format.number(cents / 100, 'eur');
}

/** Laufzeit „12:34" bzw. „1:02:03". */
export function formatDuration(totalSeconds: number | null | undefined): string | null {
  if (totalSeconds == null || !Number.isFinite(totalSeconds) || totalSeconds < 0) return null;
  const gesamt = Math.round(totalSeconds);
  const h = Math.floor(gesamt / 3600);
  const m = Math.floor((gesamt % 3600) / 60);
  const s = gesamt % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
