/** Checkliste für die Abstimmung mit dem Entwickler (nur Präsentation). */

export type FeedbackItem = {
  id: string;
  title: string;
  text: string;
  /** Vorschau-Link zum Ansehen. */
  href?: string;
  /** Nötige Änderung an Plattform/Vertrag — leer = reines Frontend mit dem vorhandenen Vertrag. */
  backend?: string;
};

export type FeedbackGroup = { title: string; items: FeedbackItem[] };

const v = (page: string, q = '', w = 'gothic') => `/v/aurora/${page}?s=voll&w=${w}${q}`;

export const FEEDBACK: FeedbackGroup[] = [
  {
    title: 'Grundlagen',
    items: [
      { id: 'paket', title: 'Ein Design-Paket „Aurora" mit 6 Farbwelten', text: 'Dunkel & Gruftig, Verspielt, Rotlicht, Technisch, Pompös, Hell & Klar. Grundflächen wie Plattform, eigene Markenfarbe und Akzent. Kontrast überall ≥ 4,5.', href: '/' },
      { id: 'playful-muted', title: 'Abweichung: Verspielt — grauer Text dunkler', text: 'mutedText #9d7e92 → #7f6275, weil der Plattformwert nur 3,4 : 1 Kontrast erreicht (Soll 4,5).', href: v('Home', '', 'playful') },
      { id: 'kopfzeile', title: 'Schwebende Glas-Kopfzeile mit Pillen-Menü', text: 'Menü, Sprache, Guthaben, Glocke, Konto in einer Glasleiste. Mobil als aufklappbares Menü ohne JavaScript (<details>).', href: v('Home') },
      { id: 'ecken', title: 'Ecken folgen dem Radius der Farbwelt', text: 'Karten, Knöpfe und Felder nutzen rounded-lg/xl (Technisch fast eckig, Verspielt rund). Chips, Badges, Avatare bleiben rund wie im Basis-Template.', href: v('Subscriptions', '', 'tech') },
      { id: 'schrift', title: 'Systemschrift (keine Webschrift)', text: 'Fette Gewichte der Systemschrift. Eine eigene, selbst gehostete Schrift wäre möglich (Mehraufwand).' },
      { id: 'ohne-js', title: 'Alles funktioniert ohne JavaScript', text: 'Menü, Filter, Suche, Blättern, Abo-Auswahl, Zahlungsart, Dialog: Links und Formulare. JavaScript nur als Verbesserung (Story).' }
    ]
  },
  {
    title: 'Startseite',
    items: [
      { id: 'hero', title: 'Hero: Titelbild randlos hinter der Kopfzeile', text: 'Großer Name, Kennzahlen als große Zahlen, „Abonnieren – ab …" als Hauptknopf, Abo-Stufen als Pillen.', href: v('Home') },
      { id: 'story', title: 'Story am Profilbild (wie Instagram)', text: 'Drehender Farbring + „Story"-Label. Öffnet Vollbild-Story: alle Momente → neuester Inhalt → Abo-Folie. Tippen links/rechts, Halten = Pause, nach unten wischen = schließen, 5 s pro Folie. Danach Ring grau + „Gesehen".', href: '/rotlicht', backend: 'Empfohlen: MomentCard.mediaUrl (Bild/Video im Hochformat, derzeit nur 160-px-Kreisbild) und createdAt. Optional MomentCard.seen, damit „Gesehen" dauerhaft bleibt (derzeit nur solange die Seite offen ist).' },
      { id: 'highlights', title: 'Highlights (Momente-Kreise) öffnen die Story', text: 'Gleicher Ring wie die Story, öffnen die Story an ihrer Stelle. Gesperrte Momente: scharfes Bild, Schloss, „Mit Abo ansehen".', href: '/rotlicht', backend: 'Wie Story (mediaUrl).' },
      { id: 'intro', title: 'Vorstellungstext mit „Mehr lesen"', text: 'Lange Texte aufklappbar (ohne JavaScript).', href: v('Home') },
      { id: 'empfohlen', title: 'Reihe „Empfohlen" (Highlights des Models)', text: 'Hervorgehobene Inhalte groß in einer waagrechten Reihe mit sichtbarer Scrollleiste.', href: v('Home') },
      { id: 'neueste', title: 'Raster „Neueste" mit Filter-Pillen und Suche', text: 'Alle / Videos / Galerien, Suche rechts, Blättern mit festen Knöpfen.', href: v('Home') }
    ]
  },
  {
    title: 'Inhalte & Kauf',
    items: [
      { id: 'kachel', title: 'Inhaltskachel (ContentCard)', text: 'Art oben links, Besitz/Preis oben rechts, Laufzeit unten rechts, Vorschau-Knopf unten links, Schloss mittig. Hover: „Freischalten/Ansehen"-Leiste. Darunter „oder im Paket …".', href: v('Home') },
      { id: 'inhaltsseite', title: 'Inhaltsseite zweispaltig mit mitlaufender Kaufkarte', text: 'Gesperrte Vorschau scharf mit Schloss, rechts Kauf/Abo. Freigeschaltet: Player, Download, „Mehr von …".', href: v('ContentDetail', '&inhalt=sommer-garten') },
      { id: 'kaufbereich', title: 'Kaufbereich (PurchasePanel) im Aurora-Stil', text: 'Guthaben-Kauf, Zahlungsarten als Pillen, Bankdaten-Box. Knopftexte wörtlich aus den Props, brechen um statt abgeschnitten zu werden.', href: v('ContentDetail', '&inhalt=sommer-garten&kauf=pending_transfer') },
      { id: 'dialog', title: 'Bestätigungsdialog als Blatt von unten (mobil)', text: 'Desktop mittig, Handy von unten.', href: v('ContentDetail', '&inhalt=sommer-garten&dialog=inhalt-sommer-garten') }
    ]
  },
  {
    title: 'Abos, Bundles, Wünsche',
    items: [
      { id: 'abos', title: 'Abos: Laufzeiten als wählbare Karten', text: 'Kaufbereich der gewählten Laufzeit erscheint darunter. Auswahl ohne JavaScript über Anker (#plan-…); der Anker wird an die Zahlungsart-Links angehängt, damit die Auswahl beim Wechsel bleibt.', href: v('Subscriptions') },
      { id: 'beliebt', title: 'Hervorhebung „Beliebt" auf der teuersten Stufe', text: 'Nur bei mehreren Stufen.', href: v('Subscriptions') },
      { id: 'bundles', title: 'Bundles mit Collage der enthaltenen Inhalte', text: 'Nutzt bundle.items; ohne Items Farbverlauf.', href: v('Bundles') },
      { id: 'wuensche', title: 'Wunschliste mit Fortschritt und Unterstützern', text: 'Große Beträge, Fortschrittsbalken im Markenverlauf, Belohnung, Top-Unterstützer.', href: v('Wishlist') }
    ]
  },
  {
    title: 'Events, Auktionen, Anfragen',
    items: [
      { id: 'events', title: 'Events: „Triff … live." mit nächstem Termin', text: 'Nächster Termin groß, Stadt-Pillen (Formulare), Suche, Monats-Zeitleiste mit Kalenderblättern, Tickets/Kalender/Karte direkt am Termin.', href: v('Events'), backend: 'Empfohlen: benannte Datumsformate day, weekdayShort, monthShort, monthYear, time in formats.ts (derzeit Inline-Optionen von next-intl).' },
      { id: 'auktionen', title: 'Auktionen mit Bild und großem Gebot', text: 'Karten mit Bild, Endzeit, aktuellem Gebot; Detailseite mit Gebotskarte.', href: v('Auctions') },
      { id: 'anfragen', title: 'Wunsch-Anfragen als Chat', text: 'Formular links, Verlauf wie ein Chat rechts, Status als farbige Pillen.', href: v('Requests') }
    ]
  },
  {
    title: 'Seiten & Konto',
    items: [
      { id: 'ueber', title: 'Eigene Seiten („Über mich") mit Profilkopf', text: 'Titelband, Profil, große Überschrift, ruhige Lesespalte, Abo-Karte daneben. Rechtstexte bleiben schlicht.', href: v('TextPage', '&seite=ueber-mich'), backend: 'Kit: RichText filtert die data:-Bild-URL der Beispieldaten heraus (leeres Bild in der Vorschau, auch im Basis-Template).' },
      { id: 'konto', title: 'Konto: Guthaben-Karte, Aufladen, Profil, Zahlungen', text: 'Aufbau wie Basis, Bausteine im Aurora-Stil.', href: v('Wallet') },
      { id: 'anmelden', title: 'Anmelden/Registrieren als Glas-Karte', text: 'Alle Anmelde-Seiten im gleichen Stil.', href: v('Login') },
      { id: 'agegate', title: '18+-Abfrage schwarz mit Lichtschein', text: 'Sprache oben, Eintreten/Verlassen, Rechtslinks. Ohne JavaScript.', href: v('AgeGate') },
      { id: '404', title: 'Fehlerseite „404" als große Zahl', text: '', href: v('Message', '&zustand=not_found') }
    ]
  },
  {
    title: 'Nur zur Präsentation (nicht für die Plattform)',
    items: [
      { id: 'praes', title: 'Präsentationsseite unter / (Design wählen + Vorschau)', text: 'src/app/page.tsx, design-wahl.tsx, feedback.tsx. Kit-Übersicht nach /uebersicht verschoben.' },
      { id: 'rotlicht', title: 'Beispiel-Website /rotlicht mit echten Fotos', text: 'CC0-Fotos (public/demo/rotlicht, Quellen in QUELLEN.md) statt Platzhaltern, ohne Kit-Leiste. src/proxy.ts kennt /rotlicht.', href: '/rotlicht' },
      { id: 'registry', title: 'Basis-Template aus der Auswahl genommen', text: 'registry.ts listet nur aurora; Basis bleibt als Ersatz im Code.' }
    ]
  }
];
