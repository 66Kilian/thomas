import type { Formats } from 'next-intl';

/**
 * Benannte Formate — dieselben wie auf der Plattform. Verwenden mit
 * `format.dateTime(new Date(iso), 'dateLong')` bzw. `formatPrice(format, cents)`.
 * Deutsch: „5. September 2026", „9,99 €" · Englisch (britisch): „5 September 2026", „€9.99".
 */
export const formats = {
  dateTime: {
    /** 05.09.2026 */
    dateNumeric: { day: '2-digit', month: '2-digit', year: 'numeric' },
    /** 05. Sept. 2026 */
    dateShortMonth: { day: '2-digit', month: 'short', year: 'numeric' },
    /** 5. September 2026 */
    dateLong: { day: 'numeric', month: 'long', year: 'numeric' },
    /** 05.09., 18:30 */
    dateTimeNumeric: { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' },
    /** 05. Sept., 18:30 */
    dateTimeShort: { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
    /** Sa., 05. Sept., 18:30 */
    dateTimeWeekdayShort: { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
    /** Samstag, 05. September 2026 um 18:30 */
    dateTimeFull: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  },
  number: {
    eur: { style: 'currency', currency: 'EUR' }
  }
} satisfies Formats;
