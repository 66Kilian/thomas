import type { Metadata } from 'next';

import { THEME_KEYS, THEME_LABELS } from '@/kit/theme';
import { aurora } from '@/templates/aurora';

/**
 * Präsentationsseite für das Template „Aurora" (nur zum Zeigen, nicht Teil der Abgabe).
 * Ein Klick zum Design, darunter jede Seite, jeder Baustein und jede Farbwelt direkt verlinkt.
 */
export const metadata: Metadata = { title: 'Aurora · Template-Präsentation', robots: { index: false } };

const V = (page: string, q = '') => `/v/aurora/${page}?s=voll&w=gothic${q}`;

type Item = { label: string; desc: string; href: string; extra?: { label: string; href: string }[] };
const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Startseite',
    items: [
      { label: 'Vollausbau', desc: 'Alles gebucht: Titelbild, Momente, Empfohlen, Neueste, Abo.', href: V('Home') },
      { label: 'Minimalausbau', desc: 'Nichts gebucht, kein Titelbild, kein Logo, kein Abo.', href: '/v/aurora/Home?s=minimal&w=gothic' },
      { label: 'Besucher (abgemeldet)', desc: 'Ansicht für Gäste mit Anmelden/Registrieren.', href: '/v/aurora/Home?s=gast&w=gothic' },
      { label: 'Hinweisleisten', desc: 'Alle vier Hinweise über der Kopfzeile.', href: '/v/aurora/Home?s=hinweise&w=gothic' },
      { label: 'Leer', desc: 'Keine Inhalte — leere Zustände.', href: '/v/aurora/Home?s=leer&w=gothic' }
    ]
  },
  {
    title: 'Bausteine',
    items: [
      { label: 'ContentCard (Kachel)', desc: 'Alle Zugangszustände: frei, Einzelkauf, Abo, beides, gekauft, im Abo.', href: V('Home', '#inhalt') },
      {
        label: 'PurchasePanel (Kaufbereich)',
        desc: 'Kaufbereich auf einem gesperrten Inhalt — jeder Zustand einzeln:',
        href: V('ContentDetail', '&inhalt=sommer-garten'),
        extra: ['ready', 'guest', 'test', 'not_configured', 'email_unverified', 'pending_transfer', 'done', 'lastschrift_wartet', 'fehler'].map((k) => ({
          label: k,
          href: V('ContentDetail', `&inhalt=sommer-garten&kauf=${k}`)
        }))
      },
      { label: 'ConfirmDialog (Bestätigung)', desc: 'Pflicht-Dialog vor jedem Kauf.', href: V('ContentDetail', '&inhalt=sommer-garten&dialog=inhalt-sommer-garten') }
    ]
  },
  {
    title: 'Inhalte',
    items: [
      { label: 'Inhalt freigeschaltet', desc: 'Video mit Player, Download, Beschreibung, weitere Inhalte.', href: V('ContentDetail') },
      { label: 'Inhalt gesperrt', desc: 'Vorschau mit Schloss, Kaufkarte rechts.', href: V('ContentDetail', '&inhalt=sommer-garten') },
      { label: 'Über mich', desc: 'Eigene Seite des Models mit Profilkopf.', href: V('TextPage', '&seite=ueber-mich') }
    ]
  },
  {
    title: 'Shop',
    items: [
      { label: 'Abos', desc: 'Stufen kompakt nebeneinander, Laufzeiten aufklappbar.', href: V('Subscriptions') },
      { label: 'Bundles', desc: 'Pakete mit Vorschau-Collage.', href: V('Bundles') },
      { label: 'Wunschliste', desc: 'Fortschritt, Belohnung, Unterstützen.', href: V('Wishlist') }
    ]
  },
  {
    title: 'Community',
    items: [
      { label: 'Events', desc: 'Nächster Termin groß, Liste nach Monaten.', href: V('Events') },
      { label: 'Event-Detail', desc: 'Bild, Infokarte, Tickets, Kalender.', href: V('EventDetail') },
      { label: 'Auktionen', desc: 'Karten mit Bild und aktuellem Gebot.', href: V('Auctions') },
      { label: 'Auktion-Detail', desc: 'Gebotskarte, gewonnen/bezahlt.', href: V('AuctionDetail') },
      { label: 'Wunsch-Anfragen', desc: 'Formular und Verlauf wie ein Chat.', href: V('Requests') }
    ]
  },
  {
    title: 'Konto',
    items: [
      { label: 'Anmelden', desc: 'Schlichte Karte ohne Kopfzeile.', href: V('Login') },
      { label: 'Registrieren', desc: 'Mit AGB-Häkchen.', href: V('Register') },
      { label: 'Passwort vergessen', desc: '', href: V('ForgotPassword') },
      { label: 'Neues Passwort', desc: '', href: V('ResetPassword') },
      { label: 'Passwort ändern', desc: '', href: V('ChangePassword') },
      { label: 'E-Mail bestätigen', desc: '', href: V('VerifyEmail') },
      { label: 'AGB-Zustimmung', desc: '', href: V('TermsConsent') },
      { label: 'Profil', desc: 'Abos, Käufe, Anfragen.', href: V('Profile') },
      { label: 'Zahlungen', desc: 'Offene und bisherige Zahlungen.', href: V('Payments') },
      { label: 'Guthaben', desc: 'Saldo, Aufladen, Verlauf.', href: V('Wallet') },
      { label: 'Benachrichtigungen', desc: '', href: V('Notifications') }
    ]
  },
  {
    title: 'Sonstiges',
    items: [
      { label: '18+-Abfrage', desc: 'Erster Kontakt jedes Besuchers.', href: V('AgeGate') },
      { label: 'Impressum / Rechtstexte', desc: 'Ruhige Lesespalte.', href: V('TextPage', '&seite=impressum') },
      { label: 'Seite nicht gefunden', desc: '404 und weitere Meldungen.', href: V('Message', '&zustand=not_found') }
    ]
  }
];

export default function AuroraPraesentation() {
  return (
    <main className="min-h-screen bg-[#0b0a0e] text-[#f3eff8]">
      <div className="pointer-events-none fixed -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#e0558c]/25 blur-[140px]" />
      <div className="pointer-events-none fixed -right-40 top-40 h-[30rem] w-[30rem] rounded-full bg-[#d2b173]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20">
        {/* Hero */}
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e0558c]">Template für die Fan-Seite</p>
          <h1 className="mt-3 text-6xl font-black tracking-tighter sm:text-8xl">Aurora</h1>
          <p className="mt-4 text-lg leading-8 text-white/70">{aurora.meta.description.de}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={V('Home')} className="inline-flex h-14 items-center gap-2 rounded-full bg-[#e0558c] px-8 text-base font-bold text-[#1a0610] shadow-2xl shadow-[#e0558c]/40 hover:opacity-90">
              Design ansehen →
            </a>
            <a href={`${V('Home')}&lang=en`} className="inline-flex h-14 items-center rounded-full border border-white/20 px-6 text-base font-semibold hover:bg-white/10">
              English version
            </a>
            <a href="/" className="inline-flex h-14 items-center rounded-full px-4 text-sm font-semibold text-white/60 hover:text-white">
              Kit-Übersicht
            </a>
          </div>
          <p className="mt-4 text-sm text-white/45">Tipp: Unten auf jeder Seite lassen sich Szenario, Farbwelt, Sprache und Zustand umschalten.</p>
        </header>

        {/* Farbwelten */}
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-black tracking-tight">Farbwelten</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {THEME_KEYS.map((w) => {
              const p = aurora.palettes[w];
              return (
                <a key={w} href={`/v/aurora/Home?s=voll&w=${w}`} className="group overflow-hidden rounded-3xl border border-white/10 transition hover:-translate-y-1 hover:border-white/30">
                  <div className="relative h-24" style={{ background: p.background }}>
                    <span className="absolute left-3 top-3 h-8 w-8 rounded-full" style={{ background: p.primary }} />
                    <span className="absolute left-9 top-3 h-8 w-8 rounded-full ring-2" style={{ background: p.accent, ['--tw-ring-color' as string]: p.background }} />
                    <span className="absolute bottom-3 left-3 right-3 h-3 rounded-full" style={{ background: p.surface }} />
                  </div>
                  <div className="bg-white/5 px-3 py-2.5 text-sm font-bold">{THEME_LABELS[w].de}</div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Alle Seiten */}
        {GROUPS.map((g) => (
          <section key={g.title} className="mt-14">
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-black tracking-tight">
              {g.title}
              <span className="h-px flex-1 bg-white/10" />
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <div key={it.label} className={`rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-[#e0558c]/60 ${it.extra ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                  <a href={it.href} className="flex items-start justify-between gap-3 p-5">
                    <span>
                      <span className="block text-base font-bold">{it.label}</span>
                      {it.desc && <span className="mt-1 block text-sm text-white/55">{it.desc}</span>}
                    </span>
                    <span className="mt-0.5 text-white/40">→</span>
                  </a>
                  {it.extra && (
                    <div className="flex flex-wrap gap-2 px-5 pb-5">
                      {it.extra.map((x) => (
                        <a key={x.label} href={x.href} className="inline-flex h-9 items-center rounded-full border border-white/15 px-3.5 font-mono text-xs hover:border-[#e0558c] hover:text-white">
                          {x.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
