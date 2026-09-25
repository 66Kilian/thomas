import type { ComponentType, ReactNode } from 'react';

import type {
  Auction,
  AuthForm,
  Bundle,
  ConfirmDialog,
  ContentCard,
  CustomRequest,
  EventItem,
  Flash,
  FormTarget,
  MediaFile,
  MethodOption,
  MomentCard,
  MySubscription,
  NavLink,
  NotificationItem,
  PageContext,
  Pagination,
  PaymentEntry,
  PurchasePanel,
  SubscriptionTier,
  WalletTransaction,
  Wish
} from './types';
import type { PaletteColors, ThemeKey } from './theme';

/**
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *  TEMPLATE-VERTRAG — welche Bausteine ein Template liefert
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * Ein Template ist ein Objekt vom Typ `FanTemplate` (siehe `src/templates/basis/index.ts`).
 * Jede Seite ist eine React-Komponente, die ihre Props bekommt und sonst nichts.
 *
 * Fehlt eine Seite im Template, verwendet die Vorschau die des Basis-Templates. Ein vollständiges
 * Template liefert ALLE Seiten (Übersicht unter http://localhost:3400/ → „Vollständigkeit").
 *
 * Jede Seite rendert selbst ihren Rahmen: `<t.Shell ctx={ctx}>…</t.Shell>` (Kopfzeile, Hinweisleisten,
 * Fußzeile). Ausnahmen ohne Kopfzeile: Anmelde-Seiten, 18+-Abfrage.
 */

// ─── Props je Seite ─────────────────────────────────────────────────────────────────────────────

export interface ShellProps {
  ctx: PageContext;
  children: ReactNode;
  /** Unterseiten ohne Kopfzeile (Anmelden, Registrieren …): nur schlichter Rahmen + „← Name". */
  bare?: boolean;
}

export interface AgeGateProps {
  ctx: PageContext;
  confirm: FormTarget;
  leaveHref: string;
}

export interface HomeProps {
  ctx: PageContext;
  /** Hervorgehobene Inhalte (Aufmacher, „Empfohlen"). Leer ⇒ Template nimmt den neuesten oder lässt es weg. */
  featured: ContentCard[];
  items: ContentCard[];
  /** Filter Alle / Videos / Galerien. */
  filters: NavLink[];
  /** Suchformular (GET): `action` + versteckte Felder + Feld `q`. */
  search: { action: string; hidden: Record<string, string>; value: string };
  /** Gesetzt, wenn gerade gesucht wird (Suchergebnis statt Startansicht). */
  searching: boolean;
  pagination: Pagination;
  moments: MomentCard[];
  /** Kurzübersicht der Abo-Stufen für Seitenleiste/Knöpfe. Leer ⇒ kein Abo angeboten. */
  tiers: { name: string; fromCents: number; href: string }[];
}

export interface ContentDetailProps {
  ctx: PageContext;
  content: ContentCard & { description: string };
  /** Freigeschaltet ⇒ Medien. Gesperrt ⇒ leer, stattdessen `paywall`. */
  media: MediaFile[];
  /** Nur bei gesperrten Inhalten. */
  paywall: {
    /** Einzelkauf, falls angeboten. */
    purchase: PurchasePanel | null;
    /** Abo-Stufen, die den Inhalt enthalten, samt Link zur Abo-Seite. */
    subscription: { packages: string[]; href: string } | null;
  } | null;
  confirm: ConfirmDialog | null;
  /** Vorschlag fürs Design: weitere Inhalte des Models (heute nicht angezeigt). */
  related: ContentCard[];
  backHref: string;
}

export interface SubscriptionsProps {
  ctx: PageContext;
  tiers: SubscriptionTier[];
  confirm: ConfirmDialog | null;
}

export interface BundlesProps {
  ctx: PageContext;
  bundles: Bundle[];
  confirm: ConfirmDialog | null;
}

export interface WishlistProps {
  ctx: PageContext;
  wishes: Wish[];
  flash: Flash | null;
}

export interface EventsProps {
  ctx: PageContext;
  events: EventItem[];
  /** Stadtfilter (GET): `action` + versteckte Felder + Feld `stadt`. */
  cityFilter: { action: string; hidden: Record<string, string>; value: string; resetHref: string | null };
  /** Nur für Angemeldete: Termine in abonnierten Städten + Formular. */
  near: { cities: string[]; events: EventItem[]; subscribe: FormTarget } | null;
  flash: Flash | null;
}

export interface EventDetailProps {
  ctx: PageContext;
  event: EventItem;
  backHref: string;
}

export interface AuctionsProps {
  ctx: PageContext;
  auctions: Auction[];
}

export interface AuctionDetailProps {
  ctx: PageContext;
  auction: Auction;
  backHref: string;
  confirm: ConfirmDialog | null;
  flash: Flash | null;
}

export interface RequestsProps {
  ctx: PageContext;
  intro: string;
  create: FormTarget;
  requests: CustomRequest[];
  confirm: ConfirmDialog | null;
  flash: Flash | null;
}

export interface AuthPageProps {
  ctx: PageContext;
  form: AuthForm;
}

export interface VerifyEmailProps {
  ctx: PageContext;
  state: 'ready' | 'incomplete' | 'already' | 'guest' | 'done';
  confirm: FormTarget | null;
  resend: FormTarget | null;
}

export interface TermsConsentProps {
  ctx: PageContext;
  changed: boolean;
  alreadyAccepted: boolean;
  /** AGB-Text als Markdown. */
  termsMarkdown: string;
  form: AuthForm;
  laterHref: string;
}

export interface ProfileProps {
  ctx: PageContext;
  subscriptions: MySubscription[];
  pastSubscriptions: { tierName: string; endedAt: string }[];
  purchases: { title: string; href: string; imageUrl: string | null; at: string }[];
  requests: { description: string; status: CustomRequest['status']; offeredCents: number }[] | null;
  links: { wallet: string | null; notifications: string; payments: string; password: string };
}

export interface PaymentsProps {
  ctx: PageContext;
  /** Ergebnis nach Rückkehr vom Zahlungsdienst. */
  result: { kind: 'success' | 'created' | 'failed' | 'cancelled'; targetHref: string | null; targetLabel: string | null } | null;
  open: PaymentEntry[];
  history: PaymentEntry[];
}

export interface WalletProps {
  ctx: PageContext;
  state: 'ok' | 'disabled' | 'test' | 'guest';
  balanceCents: number;
  blocked: boolean;
  pendingTopups: PaymentEntry[];
  topup: {
    amounts: { cents: number; href: string; selected: boolean }[];
    stepCents: number;
    maxCents: number;
    selectedCents: number;
    minusHref: string | null;
    plusHref: string | null;
    methods: MethodOption[];
    purchase: PurchasePanel;
  } | null;
  transactions: WalletTransaction[];
  confirm: ConfirmDialog | null;
}

export interface NotificationsProps {
  ctx: PageContext;
  items: NotificationItem[];
  markAll: FormTarget | null;
}

export interface TextPageProps {
  ctx: PageContext;
  title: string;
  /** Formatierter Text (Markdown). Mit `<RichText>` aus src/kit/platform darstellen. */
  markdown: string;
  backHref: string;
  /** Hinweis, wenn der Text nicht in der gewählten Sprache vorliegt. */
  languageNote: string | null;
}

export interface MessagePageProps {
  ctx: PageContext;
  /** z. B. Nicht gefunden · Seite nicht verfügbar · Modul nicht gebucht · Technischer Fehler */
  kind: 'not_found' | 'site_unavailable' | 'feature_unavailable' | 'error' | 'loading';
  title: string | null;
}

// ─── Bausteine, die mehrere Seiten teilen ───────────────────────────────────────────────────────

export interface ContentCardProps {
  ctx: PageContext;
  card: ContentCard;
  /** Größe der Kachel im Layout — steuert kleine oder große Bildfassung. */
  size?: 'small' | 'large';
}

export interface PurchasePanelProps {
  ctx: PageContext;
  panel: PurchasePanel;
}

export interface ConfirmDialogProps {
  ctx: PageContext;
  dialog: ConfirmDialog;
}

// ─── Das Template ──────────────────────────────────────────────────────────────────────────────

export interface FanTemplate {
  /** Technischer Schlüssel, nur Kleinbuchstaben (wird gespeichert, später nie umbenennen). */
  key: string;
  /** Name und Leitidee — erscheinen in der Auswahl für das Model. */
  meta: { name: Record<'de' | 'en', string>; description: Record<'de' | 'en', string> };
  /** Sechs Farbwelten. Form: siehe src/kit/theme.ts. */
  palettes: Record<ThemeKey, PaletteColors>;

  // Rahmen + Bausteine
  Shell: ComponentType<ShellProps>;
  ContentCard?: ComponentType<ContentCardProps>;
  PurchasePanel?: ComponentType<PurchasePanelProps>;
  ConfirmDialog?: ComponentType<ConfirmDialogProps>;

  // Seiten
  AgeGate?: ComponentType<AgeGateProps>;
  Home: ComponentType<HomeProps>;
  ContentDetail?: ComponentType<ContentDetailProps>;
  Subscriptions?: ComponentType<SubscriptionsProps>;
  Bundles?: ComponentType<BundlesProps>;
  Wishlist?: ComponentType<WishlistProps>;
  Events?: ComponentType<EventsProps>;
  EventDetail?: ComponentType<EventDetailProps>;
  Auctions?: ComponentType<AuctionsProps>;
  AuctionDetail?: ComponentType<AuctionDetailProps>;
  Requests?: ComponentType<RequestsProps>;
  Login?: ComponentType<AuthPageProps>;
  Register?: ComponentType<AuthPageProps>;
  ForgotPassword?: ComponentType<AuthPageProps>;
  ResetPassword?: ComponentType<AuthPageProps>;
  ChangePassword?: ComponentType<AuthPageProps>;
  VerifyEmail?: ComponentType<VerifyEmailProps>;
  TermsConsent?: ComponentType<TermsConsentProps>;
  Profile?: ComponentType<ProfileProps>;
  Payments?: ComponentType<PaymentsProps>;
  Wallet?: ComponentType<WalletProps>;
  Notifications?: ComponentType<NotificationsProps>;
  TextPage?: ComponentType<TextPageProps>;
  Message?: ComponentType<MessagePageProps>;
}

/** Alle Seiten-Schlüssel in fester Reihenfolge (Vorschau + Vollständigkeits-Prüfung). */
export const PAGE_KEYS = [
  'AgeGate',
  'Home',
  'ContentDetail',
  'Subscriptions',
  'Bundles',
  'Wishlist',
  'Events',
  'EventDetail',
  'Auctions',
  'AuctionDetail',
  'Requests',
  'Login',
  'Register',
  'ForgotPassword',
  'ResetPassword',
  'ChangePassword',
  'VerifyEmail',
  'TermsConsent',
  'Profile',
  'Payments',
  'Wallet',
  'Notifications',
  'TextPage',
  'Message'
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/** Bausteine, die ein vollständiges Template ebenfalls selbst gestaltet. */
export const PART_KEYS = ['ContentCard', 'PurchasePanel', 'ConfirmDialog'] as const;
