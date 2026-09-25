import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { formats } from './formats';

/**
 * Sprache der Anfrage: `?lang` (über den Proxy) → Cookie → Deutsch.
 * Formatiert wird britisch (`en-GB`) bzw. `de-DE`, Zeitzone Wien — wie auf der Plattform.
 */
export default getRequestConfig(async () => {
  const [h, c] = await Promise.all([headers(), cookies()]);
  const wahl = h.get('x-kit-lang') ?? c.get('lang')?.value;
  const sprache = wahl === 'en' ? 'en' : 'de';
  return {
    locale: sprache === 'en' ? 'en-GB' : 'de-DE',
    messages: (await import(`../../messages/${sprache}.json`)).default,
    timeZone: 'Europe/Vienna',
    formats
  };
});
