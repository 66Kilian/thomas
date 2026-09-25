import { NextResponse, type NextRequest } from 'next/server';

/**
 * Sprachwahl wie auf der Plattform: `?lang=de|en` gilt sofort (Kopf an die Seite) und bleibt (Cookie).
 * Ohne JavaScript — die Sprachwahl ist ein gewöhnlicher Link.
 */
export function proxy(request: NextRequest): NextResponse {
  const lang = request.nextUrl.searchParams.get('lang');
  const gueltig = lang === 'de' || lang === 'en' ? lang : null;
  const headers = new Headers(request.headers);
  if (gueltig) headers.set('x-kit-lang', gueltig);
  else headers.delete('x-kit-lang');
  const antwort = NextResponse.next({ request: { headers } });
  if (gueltig) antwort.cookies.set('lang', gueltig, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  return antwort;
}

// Kein Matcher mit Ausschluss-Muster: Das Muster griff bei den Vorschau-Pfaden (/v/…) nicht. Die Prüfung
// oben ist billig (ein Suchparameter), statische Dateien laufen ohnehin nicht über Seiten.
export const config = {
  matcher: ['/', '/v/:path*']
};
