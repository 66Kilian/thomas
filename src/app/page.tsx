import type { Metadata } from 'next';

import { DesignWahl } from './design-wahl';
import { Feedback } from './feedback';

/**
 * Präsentation der Designs (Startseite des Kits). Nur zum Zeigen — nicht Teil der Abgabe.
 * Die technische Kit-Übersicht liegt unter /uebersicht.
 */
export const metadata: Metadata = { title: 'Designs · Fan-Seite', robots: { index: false } };

const v = (page: string, w = 'gothic', q = '') => `/v/aurora/${page}?s=voll&w=${w}${q}`;

const MORE: { title: string; links: [string, string][] }[] = [
  {
    title: 'Startseite in allen Zuständen',
    links: [
      ['Vollausbau', '/v/aurora/Home?s=voll&w=gothic'],
      ['Minimal (nichts gebucht)', '/v/aurora/Home?s=minimal&w=gothic'],
      ['Besucher (abgemeldet)', '/v/aurora/Home?s=gast&w=gothic'],
      ['Alle Hinweisleisten', '/v/aurora/Home?s=hinweise&w=gothic'],
      ['Leer', '/v/aurora/Home?s=leer&w=gothic'],
      ['English', '/v/aurora/Home?s=voll&w=gothic&lang=en'],
      ['Deutsch', '/v/aurora/Home?s=voll&w=gothic&lang=de']
    ]
  },
  {
    title: 'Bausteine',
    links: [
      ['ContentCard (Kacheln)', v('Home')],
      ['PurchasePanel (Kaufbereich)', v('ContentDetail', 'gothic', '&inhalt=sommer-garten')],
      ['ConfirmDialog (Bestätigung)', v('ContentDetail', 'gothic', '&inhalt=sommer-garten&dialog=inhalt-sommer-garten')]
    ]
  },
  {
    title: 'Kaufbereich — jeder Zustand',
    links: ['ready', 'guest', 'test', 'not_configured', 'email_unverified', 'pending_transfer', 'done', 'lastschrift_wartet', 'fehler'].map((k) => [
      k,
      v('ContentDetail', 'gothic', `&inhalt=sommer-garten&kauf=${k}`)
    ])
  },
  {
    title: 'Weitere Seiten',
    links: [
      ['Inhalt freigeschaltet', v('ContentDetail', 'gothic', '&inhalt=nachtfahrt')],
      ['Event-Detail', v('EventDetail')],
      ['Auktion-Detail', v('AuctionDetail')],
      ['Anmelden', v('Login')],
      ['Registrieren', v('Register')],
      ['Passwort vergessen', v('ForgotPassword')],
      ['Neues Passwort', v('ResetPassword')],
      ['Passwort ändern', v('ChangePassword')],
      ['E-Mail bestätigen', v('VerifyEmail')],
      ['AGB-Zustimmung', v('TermsConsent')],
      ['Profil', v('Profile')],
      ['Zahlungen', v('Payments')],
      ['Benachrichtigungen', v('Notifications')],
      ['Impressum', v('TextPage', 'gothic', '&seite=impressum')],
      ['Seite nicht gefunden', v('Message', 'gothic', '&zustand=not_found')]
    ]
  }
];

export default function Praesentation() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c0b10] text-[#f3eff8]">
      <div aria-hidden="true" className="pointer-events-none fixed -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#e0558c]/15 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Wähle dein Design.</h1>
          <p className="mt-3 text-lg text-white/60">Design antippen — die Vorschau zeigt sofort, wie es aussieht. Dann mit einem Klick öffnen.</p>
          <a href="/rotlicht" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-[#f43f5a]/60 bg-[#f43f5a]/10 px-5 text-sm font-bold text-white transition hover:bg-[#f43f5a]/25">
            <span className="h-2 w-2 rounded-full bg-[#f43f5a]" />
            Beispiel mit Fotos ansehen: Rotlicht →
          </a>
          <a href="#rueckmeldung" className="ml-2 mt-5 inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
            Rückmeldung geben ↓
          </a>
        </header>

        <DesignWahl />

        <details className="group mt-24 rounded-3xl border border-white/10 bg-white/[0.03]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg font-bold [&::-webkit-details-marker]:hidden">
            Alle Seiten und Zustände
            <span className="text-white/40 transition group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-6 px-6 pb-6 md:grid-cols-2">
            {MORE.map((g) => (
              <div key={g.title} className={g.links.length > 8 ? 'md:col-span-2' : ''}>
                <h3 className="text-sm font-bold text-white/60">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.links.map(([l, h]) => (
                    <a key={l} href={h} className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm text-white/80 transition hover:border-white/50 hover:text-white">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        <Feedback />

        <p className="mt-10 text-center text-sm text-white/35">
          <a href="/uebersicht" className="hover:text-white">Technische Übersicht</a>
        </p>
      </div>
    </main>
  );
}
