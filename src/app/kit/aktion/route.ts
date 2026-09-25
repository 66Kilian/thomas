import { NextResponse, type NextRequest } from 'next/server';

/**
 * Nur im Kit: Jedes Formular landet hier und kehrt mit `?meldung=<aktion>` zur Seite zurück —
 * so lassen sich Erfolgsmeldungen und Folgezustände ansehen. Auf der Plattform steht hinter
 * denselben Formularen die echte Verarbeitung.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const aktion = String(form.get('_aktion') ?? 'aktion');
  const zurueck = String(form.get('_zurueck') ?? '/');
  const ziel = new URL(zurueck.startsWith('/') ? zurueck : '/', request.url);
  if (!aktion.startsWith('kauf:') && aktion !== 'alter-bestaetigt') ziel.searchParams.set('meldung', aktion);
  return NextResponse.redirect(ziel, 303);
}
