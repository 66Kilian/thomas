import type { Metadata } from 'next';

import { THEME_KEYS, THEME_LABELS, type ThemeKey } from '@/kit/theme';
import { aurora } from '@/templates/aurora';

/**
 * Präsentation des Template-Pakets „Aurora" (Startseite des Kits). Nur zum Zeigen — nicht Teil der
 * Abgabe. Die technische Kit-Übersicht liegt unter /uebersicht.
 */
export const metadata: Metadata = { title: 'Aurora · Template-Paket', robots: { index: false } };

const v = (page: string, w: ThemeKey = 'gothic', q = '') => `/v/aurora/${page}?s=voll&w=${w}${q}`;

const STYLE_TEXT: Record<ThemeKey, string> = {
  gothic: 'Tiefes Schwarz, Rosé und Gold — geheimnisvoll und edel.',
  playful: 'Hell, zart und verspielt — Rosa mit Violett.',
  redlight: 'Glühendes Rot auf Nachtschwarz — die klassische Rotlicht-Stimmung.',
  tech: 'Kühles Blau, Cyan und Neon-Grün — modern und technisch.',
  royal: 'Violett mit Gold — pompös und luxuriös.',
  light: 'Weiß und klar mit Magenta — seriös und ruhig.'
};

type Step = { n: string; page: string; q?: string; title: string; text: string; points: string[] };
const STEPS: Step[] = [
  {
    n: '01',
    page: 'Home',
    title: 'Startseite',
    text: 'Titelbild randlos hinter der schwebenden Glas-Kopfzeile, großer Name, Kennzahlen, Momente-Ring.',
    points: ['Reihe „Empfohlen" mit den Highlights', 'Raster „Neueste" mit Filter und Suche', 'Kacheln mit Preis-Marke, Schloss und Hover-Aufforderung']
  },
  {
    n: '02',
    page: 'ContentDetail',
    q: '&inhalt=sommer-garten',
    title: 'Inhalt & Kaufen',
    text: 'Scharfe Vorschau mit Schloss, daneben die mitlaufende Kaufkarte — Guthaben, Zahlungsart, Abo.',
    points: ['Bestätigungsdialog als Blatt von unten (mobil)', 'Alle Kaufzustände: Gast, Test, Überweisung …', 'Freigeschaltet: Player, Download, weitere Inhalte']
  },
  {
    n: '03',
    page: 'Subscriptions',
    title: 'Abos',
    text: 'Jede Stufe mit Laufzeit-Karten zum Auswählen — der Kaufbereich der gewählten Laufzeit erscheint darunter.',
    points: ['Auswahl ohne JavaScript', 'Aktives Abo und offene Überweisung sichtbar', 'Beliebteste Stufe hervorgehoben']
  },
  {
    n: '04',
    page: 'Events',
    title: 'Events',
    text: '„Triff … live." — nächster Termin groß, Stadt-Pillen, Monats-Zeitleiste mit Kalenderblättern.',
    points: ['Tickets, Kalender, Karte direkt am Termin', 'Abgesagt/verschoben klar markiert', 'Städte abonnieren für Angemeldete']
  },
  {
    n: '05',
    page: 'Wishlist',
    title: 'Wunschliste',
    text: 'Große Beträge, Fortschritt im Markenverlauf, Belohnung und Unterstützer auf einen Blick.',
    points: ['Unterstützen direkt in der Karte', 'Erfüllt/abgelaufen als eigene Zustände', 'Bild oder Farbfläche']
  },
  {
    n: '06',
    page: 'Bundles',
    title: 'Bundles',
    text: 'Pakete mit Collage der enthaltenen Inhalte, Anzahl und Paketpreis.',
    points: ['Vorschau aus den Inhalten', 'Kaufbereich wie überall', 'Leerer Zustand ohne Lücke']
  },
  {
    n: '07',
    page: 'Auctions',
    title: 'Auktionen',
    text: 'Karten mit Bild, Endzeit und großem aktuellen Gebot — Detailseite mit Gebotskarte.',
    points: ['Bieten, gewonnen, bezahlt, beendet', 'Mindestgebot und Hinweis', 'Kaufbereich nach Gewinn']
  },
  {
    n: '08',
    page: 'Requests',
    title: 'Wunsch-Anfragen',
    text: 'Anfrage-Formular links, Verlauf wie ein Chat rechts — mit Status und Bezahlen nach Lieferung.',
    points: ['Eigene Nachrichten in Markenfarbe', 'Status als farbige Pillen', 'Stornieren, Lieferung ansehen']
  },
  {
    n: '09',
    page: 'TextPage',
    q: '&seite=ueber-mich',
    title: 'Über mich',
    text: 'Eigene Seiten des Models mit Profilkopf, großer Überschrift und ruhiger Lesespalte.',
    points: ['Abo-Karte daneben', 'Rechtstexte bleiben schlicht', 'Bilder im Text abgerundet']
  },
  {
    n: '10',
    page: 'Wallet',
    title: 'Konto',
    text: 'Guthaben als große Karte, Aufladen mit Betrags-Pillen, Profil, Zahlungen, Benachrichtigungen.',
    points: ['Anmelde-Seiten als Glas-Karte', 'Bankdaten gut kopierbar', 'Zustände grün/gelb/rot']
  },
  {
    n: '11',
    page: 'AgeGate',
    title: '18+-Abfrage',
    text: 'Schwarzer Einstieg mit Lichtschein — Sprache und Rechtslinks sofort erreichbar.',
    points: ['Funktioniert ohne JavaScript', 'DE / EN direkt oben', 'Klar: Eintreten oder Verlassen']
  }
];

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

/**
 * Live-Vorschau einer Seite in einem Geräte-Rahmen. Das iframe rendert in echter Größe (1280×800 bzw.
 * 390×844) und wird per `scale` verkleinert — so bleibt das Layout exakt wie im Browser.
 */
const DESKTOP = {
  // Rahmenbreite = 1280 × Faktor, Höhe = 800 × Faktor
  tour: { box: 'w-[345px] h-[216px] sm:w-[576px] sm:h-[360px] lg:w-[640px] lg:h-[400px]', scale: 'scale-[0.27] sm:scale-[0.45] lg:scale-50' },
  hero: { box: 'w-[345px] h-[216px] sm:w-[576px] sm:h-[360px] lg:w-[538px] lg:h-[336px]', scale: 'scale-[0.27] sm:scale-[0.45] lg:scale-[0.42]' }
};

function Desktop({ src, label, size = 'tour' }: { src: string; label: string; size?: keyof typeof DESKTOP }) {
  const d = DESKTOP[size];
  return (
    <div className="w-fit max-w-full overflow-hidden rounded-2xl border border-white/15 bg-[#111] shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/40">{label}</span>
      </div>
      <div className={`relative overflow-hidden ${d.box}`}>
        <iframe
          src={src}
          title={label}
          loading="lazy"
          tabIndex={-1}
          className={`pointer-events-none absolute left-0 top-0 h-[800px] w-[1280px] origin-top-left border-0 ${d.scale}`}
        />
      </div>
    </div>
  );
}

/** Handy-Rahmen: 390×844 auf 0,44 bzw. 0,5 verkleinert. */
function Phone({ src, label }: { src: string; label: string }) {
  return (
    <div className="w-fit shrink-0 rounded-[2rem] border border-white/15 bg-[#111] p-2 shadow-2xl shadow-black/60">
      <div className="relative h-[371px] w-[172px] overflow-hidden rounded-[1.5rem] sm:h-[422px] sm:w-[195px]">
        <iframe
          src={src}
          title={label}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 h-[844px] w-[390px] origin-top-left scale-[0.44] border-0 sm:scale-50"
        />
      </div>
    </div>
  );
}

export default function Praesentation() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08070b] text-[#f3eff8] [font-feature-settings:'ss01']">
      <div aria-hidden="true" className="pointer-events-none fixed -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[#e0558c]/20 blur-[160px]" />
      <div aria-hidden="true" className="pointer-events-none fixed -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[#d2b173]/12 blur-[160px]" />

      {/* Kopfleiste */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08070b]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="text-lg font-black tracking-tight">
            Aurora<span className="text-[#e0558c]">.</span>
          </a>
          <div className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <a href="#stile" className="hover:text-white">Stile</a>
            <a href="#tour" className="hover:text-white">Seiten</a>
            <a href="#alles" className="hover:text-white">Alles im Detail</a>
          </div>
          <a href={v('Home')} className="inline-flex h-10 items-center rounded-full bg-[#e0558c] px-5 text-sm font-bold text-[#1a0610]">
            Design ansehen
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_538px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e0558c]" />
              Template-Paket für Fan-Seiten
            </p>
            <h1 className="mt-6 text-7xl font-black leading-[0.9] tracking-tighter sm:text-8xl">
              Aurora<span className="text-[#e0558c]">.</span>
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-8 text-white/70">
              Ein Design, <b className="text-white">sechs Stile</b>. Jede Seite der Fan-Seite — von der Startseite bis zum Kauf — in Premium-Qualität, auf Handy und
              Desktop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={v('Home')} className="inline-flex h-14 items-center gap-2 rounded-full bg-[#e0558c] px-8 text-base font-bold text-[#1a0610] shadow-2xl shadow-[#e0558c]/40 transition hover:opacity-90">
                Design ansehen →
              </a>
              <a href="#stile" className="inline-flex h-14 items-center rounded-full border border-white/20 px-7 text-base font-semibold transition hover:bg-white/10">
                6 Stile entdecken
              </a>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4">
              {[
                ['6', 'Stile'],
                ['24', 'Seiten'],
                ['DE / EN', 'Sprachen']
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-black">{n}</dt>
                  <dd className="text-xs uppercase tracking-wider text-white/50">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative flex justify-center pb-10 lg:justify-end lg:pb-0">
            <div className="hidden sm:block">
              <Desktop src={v('Home')} label="Startseite · Dunkel & Gruftig" size="hero" />
            </div>
            <div className="sm:absolute sm:-bottom-6 sm:right-0 lg:-bottom-12 lg:-right-6">
              <Phone src={v('Home', 'redlight')} label="Startseite mobil · Rotlicht" />
            </div>
          </div>
        </div>
      </header>

      {/* Stile */}
      <section id="stile" className="relative scroll-mt-20 border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e0558c]">Schritt 1</p>
          <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Wähle deinen Stil.</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            Das Model wählt einen der sechs Stile — alle Seiten folgen automatisch. Klick auf einen Stil, um das ganze Design darin zu sehen.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_KEYS.map((w) => {
              const p = aurora.palettes[w];
              return (
                <a key={w} href={v('Home', w)} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/30">
                  <div className="relative h-[216px] overflow-hidden sm:h-[182px] lg:h-[212px]" style={{ background: p.background }}>
                    <iframe
                      src={v('Home', w)}
                      title={THEME_LABELS[w].de}
                      loading="lazy"
                      tabIndex={-1}
                      className="pointer-events-none absolute left-0 top-0 h-[800px] w-[1280px] origin-top-left scale-[0.27] border-0 sm:scale-[0.228] lg:scale-[0.265]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p className="text-lg font-black">{THEME_LABELS[w].de}</p>
                      <p className="mt-1 text-sm text-white/55">{STYLE_TEXT[w]}</p>
                    </div>
                    <span className="flex shrink-0 -space-x-2">
                      {[p.primary, p.accent, p.surface].map((c, i) => (
                        <span key={i} className="h-7 w-7 rounded-full ring-2 ring-[#08070b]" style={{ background: c }} />
                      ))}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rundgang */}
      <section id="tour" className="relative scroll-mt-20 border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e0558c]">Schritt 2</p>
          <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Seite für Seite.</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">Jede Seite live — auf Desktop und Handy. Unter jeder Seite schaltest du den Stil um.</p>

          <div className="mt-16 space-y-28">
            {STEPS.map((s, i) => (
              <article key={s.n} className={`grid items-center gap-10 ${i % 2 ? 'lg:grid-cols-[640px_minmax(0,1fr)] lg:[&>*:first-child]:order-2' : 'lg:grid-cols-[minmax(0,1fr)_640px]'}`}>
                <div>
                  <p className="font-mono text-sm text-white/40">{s.n} / {STEPS.length}</p>
                  <h3 className="mt-2 text-4xl font-black tracking-tight">{s.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-white/65">{s.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-white/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0558c]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-2">
                    <a href={v(s.page, 'gothic', s.q)} className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-bold text-black">
                      Seite öffnen →
                    </a>
                    {THEME_KEYS.map((w) => (
                      <a
                        key={w}
                        href={v(s.page, w, s.q)}
                        title={THEME_LABELS[w].de}
                        className="h-9 w-9 rounded-full ring-2 ring-white/10 transition hover:scale-110 hover:ring-white/60"
                        style={{ background: `linear-gradient(135deg, ${aurora.palettes[w].primary} 50%, ${aurora.palettes[w].background} 50%)` }}
                      >
                        <span className="sr-only">{THEME_LABELS[w].de}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="relative w-fit max-w-full justify-self-center lg:justify-self-end">
                  <Desktop src={v(s.page, 'gothic', s.q)} label={s.title} />
                  <div className="absolute -bottom-10 -right-4 hidden md:block lg:-right-8">
                    <Phone src={v(s.page, i % 2 ? 'royal' : 'redlight', s.q)} label={`${s.title} mobil`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Alles im Detail */}
      <section id="alles" className="relative scroll-mt-20 border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e0558c]">Schritt 3</p>
          <h2 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Alles im Detail.</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">Jeder Zustand und jeder Baustein einzeln — für die Umsetzung.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {MORE.map((g) => (
              <div key={g.title} className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${g.links.length > 8 ? 'md:col-span-2' : ''}`}>
                <h3 className="text-lg font-black">{g.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.links.map(([l, h]) => (
                    <a key={l} href={h} className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-sm font-medium text-white/80 transition hover:border-[#e0558c] hover:text-white">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-white/45">
          <span>
            Aurora<span className="text-[#e0558c]">.</span> — Template-Paket
          </span>
          <a href="/uebersicht" className="hover:text-white">Technische Kit-Übersicht</a>
        </div>
      </footer>
    </main>
  );
}
