/**
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *  DATENVERTRAG — alles, was ein Template zu sehen bekommt
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * Ein Template ist reine Darstellung. Es bekommt diese Daten fertig aufbereitet als Props und lädt
 * nichts selbst nach. Die Plattform liefert in Produktion exakt diese Formen; im Kit kommen sie aus
 * `src/mock/`.
 *
 * Regeln:
 * - Beträge immer in **Cent** (`priceCents: 999` = 9,99 €), Anzeige über `formatPrice()`.
 * - Zeitpunkte als ISO-String, Anzeige über next-intl (`useFormatter().dateTime(...)`, siehe format.ts).
 * - Bild-/Video-Adressen sind fertige URLs. Nie selbst zusammenbauen.
 * - `href` = Ziel eines Links (GET). `FormTarget` = Ziel eines Formulars (POST). Beides nie selbst erfinden.
 * - Inhalte des Models (Titel, Beschreibungen, Namen) stehen in der Sprache des Models (`site.mainLanguage`),
 *   unabhängig von der gewählten Oberflächensprache. Dafür `lang={site.mainLanguage}` am Element setzen.
 */

// ─── Grundbegriffe ──────────────────────────────────────────────────────────────────────────────

/** Sprache der Oberfläche. Weitere kommen später dazu — nie auf genau zwei Sprachen verlassen. */
export type Locale = 'de' | 'en';

/** Farbwelt, vom Model gewählt. `custom` = zwei freie Farben des Models statt einer Palette. */
export type ColorTheme = 'custom' | 'gothic' | 'playful' | 'redlight' | 'tech' | 'royal' | 'light';

/**
 * Zubuchbare Module. Fehlt ein Modul in `site.modules`, verschwindet alles, was dazugehört — ohne
 * Lücke, ohne Platzhalter, ohne „bald verfügbar".
 */
export type ModuleKey =
  | 'vip_subscription' // mehrere Abo-Stufen statt genau einem Abo
  | 'video_download' // Download-Knöpfe auf der Inhaltsseite
  | 'custom_requests' // Wunsch-Anfragen
  | 'auctions' // Auktionen
  | 'events'; // Veranstaltungen

/** Zahlungsarten, die ein Model einrichten kann. Sichtbar ist nur, was in `site.paymentMethods` steht. */
export type PaymentMethod = 'creditcard' | 'sepa' | 'online-uberweisen' | 'direct_transfer';

/** Ziel eines Formulars. Immer als `<form method="post" action={target.action}>` + versteckte Felder rendern. */
export interface FormTarget {
  action: string;
  hidden: Record<string, string>;
}

/** Link mit Zustand (Reiter, Filter, Sprachwahl, Menü). */
export interface NavLink {
  label: string;
  href: string;
  active: boolean;
}

/** Blätter-Angaben einer Liste. `null` = in diese Richtung geht es nicht weiter. */
export interface Pagination {
  page: number;
  pages: number;
  prevHref: string | null;
  nextHref: string | null;
}

/** Rückmeldung nach einem Formular (Erfolg/Fehler/Hinweis), erscheint unterhalb des Formulars. */
export interface Flash {
  kind: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

// ─── Seite und Fan ──────────────────────────────────────────────────────────────────────────────

/** Die Model-Seite (Mandant). */
export interface Site {
  slug: string;
  displayName: string;
  /** Quadratisch, 512 × 512. `null` = kein Logo, Template zeigt z. B. die Initiale. */
  logoUrl: string | null;
  /** Bis 1920 px breit, beliebiges Seitenverhältnis. `null` = kein Titelbild. */
  coverUrl: string | null;
  /** Vorstellungstext, 0–1000 Zeichen, reiner Text mit Zeilenumbrüchen. */
  profileIntro: string;
  /** Sprache der Inhalte des Models. */
  mainLanguage: Locale;
  /** Angebotene Oberflächensprachen. Nur eine ⇒ keine Sprachwahl anzeigen. */
  languages: Locale[];
  colorTheme: ColorTheme;
  /** Nur bei `colorTheme === 'custom'` maßgeblich. */
  customColors: { primary: string; background: string };
  modules: ModuleKey[];
  /** Euro-Guthaben für diese Seite eingeschaltet. */
  walletEnabled: boolean;
  paymentMethods: PaymentMethod[];
  /** Zählwerte für Kennzahlen im Kopfbereich. */
  stats: { posts: number; videos: number; galleries: number };
  /** Günstigster Abo-Preis für „Abonnieren – ab X €". `null` = kein Abo angeboten. */
  subscriptionFromCents: number | null;
  /** Hilfe-Handbuch vorhanden (Link in der Fußzeile). */
  hasHelp: boolean;
}

/** Angemeldeter Fan. `null` in allen Props = abgemeldet. */
export interface Fan {
  displayName: string;
  email: string;
  /** Testzugang eines Administrators: Käufe kosten nichts. Blauer Hinweis in der Kopfzeile. */
  isTest: boolean;
  /** Ein Administrator sieht die Seite als dieser Fan. Gelber Hinweis mit Name des Fans. */
  impersonated: boolean;
  emailVerified: boolean;
  /** `current` = AGB zugestimmt · `first` = noch nie · `changed` = neue Fassung. */
  terms: 'current' | 'first' | 'changed';
  /** Guthaben in Cent — `null`, wenn die Seite kein Guthaben anbietet. */
  walletCents: number | null;
  unreadNotifications: number;
}

/** Ein Punkt im Hauptmenü. „Start" ist immer der erste und nicht konfigurierbar. */
export interface MenuItem extends NavLink {
  key: string;
}

/** Hinweisleiste über der Kopfzeile. Mehrere gleichzeitig möglich, feste Reihenfolge. */
export interface Notice {
  kind: 'test' | 'impersonation' | 'email' | 'terms';
  text: string;
  /** Knopf/Link in der Leiste („Schließen", „E-Mail erneut senden", „Ansehen und zustimmen"). */
  action: { label: string; href: string } | null;
}

/** Gemeinsamer Rahmen, den jede Seite bekommt. */
export interface PageContext {
  site: Site;
  fan: Fan | null;
  locale: Locale;
  menu: MenuItem[];
  notices: Notice[];
  /** Sprachwahl — leer, wenn die Seite nur eine Sprache anbietet. */
  languageLinks: NavLink[];
  /** Feste Wege der Plattform. */
  links: {
    home: string;
    login: string;
    register: string;
    forgotPassword: string;
    profile: string;
    notifications: string;
    wallet: string;
    subscriptions: string;
    imprint: string;
    privacy: string;
    terms: string;
    help: string;
    logout: FormTarget;
  };
}

// ─── Inhalte ────────────────────────────────────────────────────────────────────────────────────

export type ContentType = 'video' | 'photo_gallery';

/**
 * Zugang des aktuellen Besuchers zu einem Inhalt.
 * - `free`: kostenlos für alle
 * - `locked`: gesperrt — einzeln kaufbar (`priceCents`) und/oder in Abo-Stufen enthalten (`packages`)
 * - `owned`: gekauft (auch Bundle/Geschenk), `since` = Kaufdatum
 * - `subscription`: über das Abo des Fans freigeschaltet
 */
export type Access =
  | { state: 'free' }
  | { state: 'locked'; priceCents: number | null; packages: string[] }
  | { state: 'owned'; since: string | null }
  | { state: 'subscription' };

/** Bewegte Vorschau eines Videos. `null`-Felder = (noch) nicht vorhanden, dann bleibt es beim Standbild. */
export interface MotionPreview {
  /** Bildstreifen (1 × `tiles` nebeneinander) für das „Daumenkino". */
  sprite: { url: string; tiles: number; tileWidth: number; tileHeight: number; loopMs: number } | null;
  /** Kurzer stummer Clip (MP4). */
  clipUrl: string | null;
}

/** Kachel eines Inhalts in Rastern, Reihen, Feeds. */
export interface ContentCard {
  slug: string;
  href: string;
  type: ContentType;
  /** 1–160 Zeichen, in der Sprache des Models. */
  title: string;
  tags: string[];
  /** Kleine Fassung (Kante bis 400 px) für kleine Kacheln. */
  imageUrl: string | null;
  /** Große Fassung (bis 1200 px) für Aufmacher und große Kacheln. */
  imageLargeUrl: string | null;
  /** Seitenverhältnis des Vorschaubilds (Breite / Höhe) — Hoch- und Querformat kommen gemischt vor. */
  imageAspect: number;
  preview: MotionPreview;
  /** Laufzeit in Sekunden (nur Videos). Anzeige über `formatDuration()`. */
  durationSeconds: number | null;
  /** Qualitätsstufe („1080p", „4K") — `null` bei Galerien oder unbekannt. */
  quality: string | null;
  /** Anzahl Bilder (nur Galerien). */
  imageCount: number | null;
  featured: boolean;
  createdAt: string;
  access: Access;
}

/** Ein Moment („Story"). */
export interface MomentCard {
  id: string;
  kind: 'image' | 'video';
  caption: string;
  /** Kreisbild in der Reihe. */
  thumbUrl: string;
  /** Gesperrt ⇒ nur mit Abo sichtbar (Momente gibt es nie einzeln zu kaufen). */
  locked: boolean;
  packages: string[];
  href: string;
}

/** Medien eines freigeschalteten Inhalts. */
export interface MediaFile {
  kind: 'video' | 'image';
  url: string;
  /** Standbild (Video) bzw. kleine Fassung (Bild). */
  posterUrl: string;
  width: number;
  height: number;
  /** Download-Ziel, wenn für diesen Fan erlaubt (Modul + Zugangsweg). Sonst `null`. */
  downloadHref: string | null;
}

// ─── Kaufen ─────────────────────────────────────────────────────────────────────────────────────

/** Zahlungsart zur Auswahl. `disabledReason` gesetzt ⇒ Chip gesperrt (gestrichelt) mit Begründung. */
export interface MethodOption {
  method: PaymentMethod;
  label: string;
  selected: boolean;
  /** Link, der diese Zahlungsart auswählt (ohne JavaScript). */
  href: string;
  instant: boolean;
  disabledReason: string | null;
}

/** Bankdaten für eine Direktüberweisung. Alle Felder gut kopierbar darstellen. */
export interface BankDetails {
  amountCents: number;
  accountHolder: string;
  iban: string;
  bic: string;
  reference: string;
}

/**
 * Kaufbereich — steht auf jeder Seite, auf der man etwas kaufen kann (Inhalt, Abo-Plan, Bundle,
 * Auktion, Anfrage, Guthaben). Der Zustand bestimmt, was angezeigt wird.
 */
export interface PurchasePanel {
  /** Was gekauft wird, z. B. „Kaufen" / „Buchen" / „Zahlen" — neutraler Knopftext auf der Seite. */
  buttonLabel: string;
  priceCents: number;
  state:
    | { kind: 'guest'; loginHref: string }
    | { kind: 'not_configured' }
    | { kind: 'email_unverified' }
    | { kind: 'test'; confirmHref: string }
    | {
        kind: 'ready';
        methods: MethodOption[];
        /** Guthaben-Weg, falls die Seite Guthaben anbietet und der Fan angemeldet ist. */
        wallet: { balanceCents: number; enough: boolean; blocked: boolean; confirmHref: string; topupHref: string } | null;
        /** Öffnet den Bestätigungsdialog (Link, kein JavaScript). */
        confirmHref: string;
      }
    | { kind: 'pending_transfer'; bank: BankDetails; paymentsHref: string }
    | { kind: 'done'; text: string };
  /** Fehlermeldung des letzten Versuchs. */
  error: string | null;
}

/**
 * Bestätigungsdialog vor jedem Kauf (rechtlich vorgeschrieben). Erscheint über der Seite, wenn
 * `open` gesetzt ist. Der Knopf trägt IMMER den eindeutigen Text aus `submitLabel`.
 */
export interface ConfirmDialog {
  title: string;
  /** Detailzeilen: Preis, Laufzeit, Zahlungsart … */
  rows: { label: string; value: string }[];
  /** Pflicht-Häkchen „Ich stimme den AGB zu", wenn der Fan (der neuen Fassung) noch nicht zugestimmt hat. */
  termsCheckbox: { label: string; changed: boolean } | null;
  /** „Kostenpflichtig bestellen" / „Zahlungspflichtig aufladen: 20,00 €" — nie verändern. */
  submitLabel: string;
  /** „Mit Klick bestellst du zahlungspflichtig." */
  legalNote: string;
  submit: FormTarget;
  cancelHref: string;
}

// ─── Abo, Bundles, Wünsche ──────────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  /** „30 Tage", „3 Monate". */
  label: string;
  priceCents: number;
  recurring: boolean;
  /** Offene Überweisung genau für diesen Plan. */
  pendingTransfer: BankDetails | null;
  purchase: PurchasePanel;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  /** Fan hat diese Stufe aktiv — bis `activeUntil`. */
  active: boolean;
  activeUntil: string | null;
  plans: SubscriptionPlan[];
}

export interface Bundle {
  id: string;
  title: string;
  itemCount: number;
  priceCents: number;
  /** Vorschau enthaltener Inhalte — heute noch leer, darf vom Design vorgesehen werden. */
  items: ContentCard[];
  purchase: PurchasePanel;
}

export interface Wish {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  quantity: number;
  targetCents: number;
  raisedCents: number;
  /** 0–1 */
  progress: number;
  externalUrl: string | null;
  rewardText: string | null;
  subscribersOnly: boolean;
  deadline: string | null;
  supporterCount: number;
  topSupporters: { name: string | null; amountCents: number }[];
  state: 'open' | 'fulfilled' | 'expired';
  /** Formular zum Unterstützen — `null`, wenn abgemeldet oder nicht (mehr) möglich. */
  support: {
    /** Nur der ganze Restbetrag auf einmal („Kostenpflichtig schenken (60,00 €)"). */
    fullGiftCents: number | null;
    minCents: number;
    methods: MethodOption[];
    walletBalanceCents: number | null;
    termsCheckbox: { label: string; changed: boolean } | null;
    submit: FormTarget;
    submitLabel: string;
    legalNote: string;
  } | null;
  pendingTransfer: BankDetails | null;
}

// ─── Events, Auktionen, Anfragen ───────────────────────────────────────────────────────────────

export interface EventItem {
  id: string;
  href: string;
  title: string;
  type: string | null;
  description: string;
  imageUrl: string | null;
  startAt: string;
  endAt: string | null;
  status: 'published' | 'postponed' | 'cancelled';
  statusNote: string | null;
  online: boolean;
  onlineUrl: string | null;
  location: { name: string | null; address: string | null; city: string | null; mapHref: string | null; website: string | null };
  admission: string | null;
  ticketUrl: string | null;
  calendarHref: string | null;
}

export interface Auction {
  id: string;
  href: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startPriceCents: number;
  currentBidCents: number;
  endsAt: string;
  state:
    | { kind: 'open'; minBidCents: number; bid: FormTarget | null; myBidCents: number | null }
    | { kind: 'won'; purchase: PurchasePanel }
    | { kind: 'won_paid' }
    | { kind: 'closed' };
}

export interface CustomRequest {
  id: string;
  description: string;
  offeredCents: number;
  status: 'open' | 'negotiating' | 'accepted' | 'delivered' | 'rejected' | 'cancelled';
  messages: { from: 'fan' | 'model'; body: string; at: string }[];
  reply: FormTarget | null;
  cancel: FormTarget | null;
  deliveryHref: string | null;
  /** Geliefert, noch nicht bezahlt ⇒ Kaufbereich. */
  purchase: PurchasePanel | null;
}

// ─── Konto ─────────────────────────────────────────────────────────────────────────────────────

export interface MySubscription {
  id: string;
  tierName: string;
  recurring: boolean;
  /** Verlängert sich am … bzw. aktiv bis … */
  until: string;
  renewalPending: boolean;
  cancelRecurring: FormTarget | null;
  /** Wechsel zum Ablauf: auswählbare Ziele (als Optionen, keine Aufklappliste!). */
  changeOptions: { label: string; target: FormTarget }[];
  scheduledChange: { label: string; undo: FormTarget } | null;
}

export interface PaymentEntry {
  id: string;
  title: string;
  href: string | null;
  amountCents: number;
  createdAt: string;
  method: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  failReason: string | null;
  /** Offene Direktüberweisung. */
  bank: BankDetails | null;
  /** Läuft beim Zahlungsdienst (Karte/Lastschrift). */
  processing: boolean;
  cancel: FormTarget | null;
}

export interface WalletTransaction {
  id: string;
  kind: 'topup' | 'spend' | 'forfeit' | 'chargeback' | 'adjust';
  note: string;
  amountCents: number;
  balanceAfterCents: number | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  at: string;
  markRead: FormTarget | null;
}

/** Freies Formular (Anmelden, Registrieren …). Feldnamen sind fest, Beschriftungen kommen aus den Texten. */
export interface AuthForm {
  submit: FormTarget;
  /** Vorbelegte Werte nach einem Fehler. */
  values: Record<string, string>;
  error: string | null;
  success: string | null;
}
