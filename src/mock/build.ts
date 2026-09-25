import type * as P from '@/kit/template';
import type { PageKey } from '@/kit/template';
import type {
  Access,
  Auction,
  BankDetails,
  ConfirmDialog,
  ContentCard,
  CustomRequest,
  EventItem,
  Fan,
  Flash,
  FormTarget,
  Locale,
  MediaFile,
  MenuItem,
  MethodOption,
  MomentCard,
  Notice,
  PageContext,
  PaymentEntry,
  PaymentMethod,
  PurchasePanel,
  Site,
  SubscriptionTier,
  ColorTheme
} from '@/kit/types';

import { CONTENT, type RawContent } from './content';
import { placeholder, spriteStrip } from './images';
import { PURCHASE_STATES, scenario, type Scenario, type ScenarioKey } from './scenarios';

/**
 * Baut die Props jeder Seite aus Beispieldaten + Szenario + URL-Parametern.
 * Nur fürs Kit — auf der Plattform liefert dieselben Formen die echte Datenschicht.
 */

type T = (key: string, values?: Record<string, string | number>) => string;

export interface BuildInput {
  template: string;
  page: PageKey;
  query: Record<string, string | undefined>;
  locale: Locale;
  /** Übersetzer für den Namensraum `platform` (Texte, die in Produktion die Plattform liefert). */
  t: T;
  /** Cent → „9,99 €" in der aktuellen Sprache. */
  price: (cents: number) => string;
  /** ISO → Datum in der aktuellen Sprache. */
  date: (iso: string) => string;
}

class Ctx {
  readonly sk: ScenarioKey;
  readonly s: Scenario;
  constructor(readonly i: BuildInput) {
    const { key, s } = scenario(i.query.s);
    this.sk = key;
    this.s = s;
  }

  /** Link auf eine Vorschauseite, Szenario und Farbwelt bleiben erhalten. */
  href(page: PageKey, extra: Record<string, string | undefined> = {}): string {
    const q = new URLSearchParams();
    q.set('s', this.sk);
    if (this.i.query.w) q.set('w', this.i.query.w);
    for (const [k, v] of Object.entries(extra)) if (v != null) q.set(k, v);
    return `/v/${this.i.template}/${page}?${q.toString()}`;
  }

  /** Aktuelle Seite mit geänderten Parametern (`undefined` entfernt einen Parameter). */
  here(changes: Record<string, string | undefined>): string {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(this.i.query)) if (v != null && k !== 'lang' && k !== 'meldung') q.set(k, v);
    for (const [k, v] of Object.entries(changes)) {
      if (v == null) q.delete(k);
      else q.set(k, v);
    }
    return `/v/${this.i.template}/${this.i.page}?${q.toString()}`;
  }

  /** Formularziel: im Kit landet jede Aktion bei /kit/aktion und kehrt mit Meldung zurück. */
  form(name: string, back?: string): FormTarget {
    return { action: '/kit/aktion', hidden: { _aktion: name, _zurueck: back ?? this.here({ dialog: undefined }) } };
  }

  /** Versteckte Felder für GET-Formulare (Suche, Filter) — Szenario und Farbwelt bleiben erhalten. */
  get keep(): Record<string, string> {
    return { s: this.sk, ...(this.i.query.w ? { w: this.i.query.w } : {}) };
  }

  get loggedIn(): boolean {
    return this.s.loggedIn;
  }

  /** Gleicher Kontext, aber Listen gefüllt — Detailseiten zeigen auch im Szenario „Leer" ein Beispiel. */
  full(): Ctx {
    const n = new Ctx(this.i);
    (n as { s: Scenario }).s = { ...this.s, lists: 'full' };
    return n;
  }
}

// ─── Seite, Fan, Rahmen ─────────────────────────────────────────────────────────────────────────

function site(c: Ctx): Site {
  const theme = (c.i.query.w ?? 'gothic') as ColorTheme;
  return {
    slug: 'nova',
    displayName: 'Nova Beispiel',
    logoUrl: c.s.logo ? placeholder('logo-nova', 512, 512, 'Logo 512²') : null,
    coverUrl: c.s.cover ? placeholder('cover-nova', 1920, 640, 'Titelbild 1920×640') : null,
    profileIntro: c.s.cover
      ? 'Hi, ich bin Nova! 📸 Fotografin, Model und Kaffeeliebhaberin aus Wien.\nHier findest du meine exklusiven Shootings, Videos und alles, was nicht auf Instagram darf.'
      : '',
    mainLanguage: 'de',
    languages: c.s.languages,
    colorTheme: theme,
    customColors: { primary: '#e11d48', background: '#101014' },
    modules: c.s.modules,
    walletEnabled: c.s.wallet,
    paymentMethods: c.s.methods,
    stats: { posts: c.s.contentCount, videos: rawList(c).filter((r) => r.type === 'video').length, galleries: rawList(c).filter((r) => r.type === 'photo_gallery').length },
    subscriptionFromCents: c.s.tiers === 'none' ? null : 999,
    hasHelp: c.s.hasHelp
  };
}

function fan(c: Ctx): Fan | null {
  if (!c.loggedIn) return null;
  return {
    displayName: 'Max Mustermann',
    email: 'max@example.com',
    isTest: c.s.notices.test,
    impersonated: c.s.notices.impersonated,
    emailVerified: !c.s.notices.emailUnverified,
    terms: c.s.notices.terms,
    walletCents: c.s.wallet ? 2500 : null,
    unreadNotifications: c.s.unread
  };
}

function menu(c: Ctx): MenuItem[] {
  const t = c.i.t;
  const items: MenuItem[] = [{ key: 'start', label: t('menu.start'), href: c.href('Home'), active: c.i.page === 'Home' }];
  const add = (key: string, page: PageKey, label: string, active: PageKey[] = [page]) =>
    items.push({ key, label, href: c.href(page), active: active.includes(c.i.page) });
  if (c.s.tiers !== 'none') add('subscriptions', 'Subscriptions', t('menu.subscriptions'));
  add('bundles', 'Bundles', t('menu.bundles'));
  add('wishlist', 'Wishlist', t('menu.wishlist'));
  if (c.s.modules.includes('events')) add('events', 'Events', t('menu.events'), ['Events', 'EventDetail']);
  if (c.s.modules.includes('auctions')) add('auctions', 'Auctions', t('menu.auctions'), ['Auctions', 'AuctionDetail']);
  if (c.s.modules.includes('custom_requests')) add('requests', 'Requests', t('menu.requests'));
  if (c.s.wallet && c.loggedIn) add('wallet', 'Wallet', t('menu.wallet'));
  // Eigene Seite des Models — Menüname ist Inhalt des Models (bleibt deutsch).
  items.push({ key: 'page:ueber-mich', label: 'Über mich', href: c.href('TextPage', { seite: 'ueber-mich' }), active: c.i.page === 'TextPage' && c.i.query.seite === 'ueber-mich' });
  return items;
}

function notices(c: Ctx, f: Fan | null): Notice[] {
  if (!f) return [];
  const t = c.i.t;
  const out: Notice[] = [];
  if (f.isTest) out.push({ kind: 'test', text: t('notice.test'), action: null });
  if (f.impersonated) out.push({ kind: 'impersonation', text: t('notice.impersonation', { name: f.displayName }), action: { label: t('notice.close'), href: c.here({}) } });
  if (!f.emailVerified) out.push({ kind: 'email', text: t('notice.email'), action: { label: t('notice.emailAction'), href: c.href('VerifyEmail', { zustand: 'incomplete' }) } });
  if (f.terms !== 'current')
    out.push({ kind: 'terms', text: t(f.terms === 'changed' ? 'notice.termsChanged' : 'notice.termsFirst'), action: { label: t('notice.termsAction'), href: c.href('TermsConsent') } });
  return out;
}

function context(c: Ctx): PageContext {
  const st = site(c);
  const f = fan(c);
  return {
    site: st,
    fan: f,
    locale: c.i.locale,
    menu: menu(c),
    notices: notices(c, f),
    languageLinks:
      st.languages.length > 1
        ? st.languages.map((l) => ({ label: l.toUpperCase(), href: c.here({ lang: l }), active: l === c.i.locale }))
        : [],
    links: {
      home: c.href('Home'),
      login: c.href('Login'),
      register: c.href('Register'),
      forgotPassword: c.href('ForgotPassword'),
      profile: c.href('Profile'),
      notifications: c.href('Notifications'),
      wallet: c.href('Wallet'),
      subscriptions: c.href('Subscriptions'),
      imprint: c.href('TextPage', { seite: 'impressum' }),
      privacy: c.href('TextPage', { seite: 'datenschutz' }),
      terms: c.href('TextPage', { seite: 'agb' }),
      help: c.href('Message', { zustand: 'not_found' }),
      logout: c.form('abmelden', c.href('Home', { s: 'gast' }))
    }
  };
}

function flash(c: Ctx): Flash | null {
  const m = c.i.query.meldung;
  if (!m) return null;
  if (m === 'fehler') return { kind: 'error', text: c.i.t('flash.checkoutError') };
  return { kind: 'success', text: c.i.t('demoAction', { name: m }) };
}

// ─── Inhalte ────────────────────────────────────────────────────────────────────────────────────

function rawList(c: Ctx): RawContent[] {
  if (c.s.lists === 'empty' || c.s.contentCount === 0) return [];
  let list = CONTENT;
  // Ohne Abo-Angebot keine reinen Abo-Inhalte (sie wären nicht erreichbar).
  if (c.s.tiers === 'none') list = list.filter((r) => r.free || r.ppv != null);
  return list.slice(0, c.s.contentCount);
}

function tierNames(c: Ctx): string[] {
  return c.s.tiers === 'many' ? ['Basis', 'VIP'] : c.s.tiers === 'one' ? ['Fanclub'] : [];
}

function access(c: Ctx, r: RawContent): Access {
  if (r.free) return { state: 'free' };
  if (c.loggedIn && r.ownedSince) return { state: 'owned', since: r.ownedSince };
  const tiers = tierNames(c);
  const packages = c.s.tiers === 'one' ? (r.packages.length ? ['Fanclub'] : []) : r.packages.filter((p) => tiers.includes(p));
  if (c.loggedIn && c.s.activeTier && packages.includes(c.s.activeTier)) return { state: 'subscription' };
  return { state: 'locked', priceCents: r.ppv, packages };
}

function card(c: Ctx, r: RawContent): ContentCard {
  const small = r.width >= r.height ? [400, Math.round((400 * r.height) / r.width)] : [Math.round((400 * r.width) / r.height), 400];
  const large = r.width >= r.height ? [1200, Math.round((1200 * r.height) / r.width)] : [Math.round((1200 * r.width) / r.height), 1200];
  return {
    slug: r.slug,
    href: c.href('ContentDetail', { inhalt: r.slug }),
    type: r.type,
    title: r.title,
    tags: r.tags,
    imageUrl: placeholder(r.slug, small[0], small[1], `klein ${small[0]}×${small[1]}`),
    imageLargeUrl: placeholder(r.slug, large[0], large[1], `groß ${large[0]}×${large[1]}`),
    imageAspect: r.width / r.height,
    preview: r.motion
      ? { sprite: { url: spriteStrip(r.slug, 12, 320, Math.round((320 * r.height) / r.width)), tiles: 12, tileWidth: 320, tileHeight: Math.round((320 * r.height) / r.width), loopMs: 5000 }, clipUrl: null }
      : { sprite: null, clipUrl: null },
    durationSeconds: r.durationSeconds,
    quality: r.quality,
    imageCount: r.imageCount,
    featured: c.s.featured && r.featured,
    createdAt: r.createdAt,
    access: access(c, r)
  };
}

function moments(c: Ctx): MomentCard[] {
  if (!c.s.moments) return [];
  const caps = ['Guten Morgen', 'Neues Shooting', 'Backstage', 'Urlaub', 'Nur für VIPs'];
  return caps.map((caption, i) => ({
    id: `m${i}`,
    kind: i % 2 ? 'video' : 'image',
    caption,
    thumbUrl: placeholder(`moment-${i}`, 160, 160, ''),
    locked: i === 4 && !(c.loggedIn && c.s.activeTier),
    packages: i === 4 ? ['VIP'] : [],
    href: c.here({ moment: `m${i}` })
  }));
}

// ─── Kaufen ─────────────────────────────────────────────────────────────────────────────────────

const INSTANT: Record<PaymentMethod, boolean> = { creditcard: true, sepa: false, 'online-uberweisen': true, direct_transfer: false };

function methodOptions(c: Ctx, blockDebit: boolean): MethodOption[] {
  const gewaehlt = (c.i.query.zahlart as PaymentMethod | undefined) ?? c.s.methods[0];
  return c.s.methods.map((m) => ({
    method: m,
    label: c.i.t(`method.${m}`),
    selected: m === gewaehlt,
    href: c.here({ zahlart: m }),
    instant: INSTANT[m],
    disabledReason: blockDebit && (m === 'sepa' || m === 'online-uberweisen') ? c.i.t('methodBlocked') : null
  }));
}

function bank(amountCents: number): BankDetails {
  return { amountCents, accountHolder: 'Beispiel GmbH', iban: 'AT61 1904 3002 3457 3201', bic: 'BKAUATWW', reference: 'MS-2026-4F7K' };
}

function purchase(c: Ctx, id: string, priceCents: number, buttonLabel: string): PurchasePanel {
  const zustand = (PURCHASE_STATES as readonly string[]).includes(c.i.query.kauf ?? '') ? c.i.query.kauf : undefined;
  const confirmHref = c.here({ dialog: id });
  const error = zustand === 'fehler' ? c.i.t('flash.checkoutError') : null;
  if (!c.loggedIn || zustand === 'guest') return { buttonLabel, priceCents, state: { kind: 'guest', loginHref: c.href('Login') }, error };
  if (zustand === 'not_configured') return { buttonLabel, priceCents, state: { kind: 'not_configured' }, error };
  if (zustand === 'email_unverified' || (!zustand && c.s.notices.emailUnverified)) return { buttonLabel, priceCents, state: { kind: 'email_unverified' }, error };
  if (zustand === 'test' || (!zustand && c.s.notices.test)) return { buttonLabel, priceCents, state: { kind: 'test', confirmHref }, error };
  if (zustand === 'pending_transfer') return { buttonLabel, priceCents, state: { kind: 'pending_transfer', bank: bank(priceCents), paymentsHref: c.href('Payments') }, error };
  if (zustand === 'done') return { buttonLabel, priceCents, state: { kind: 'done', text: c.i.t('done') }, error };
  const balance = 2500;
  return {
    buttonLabel,
    priceCents,
    state: {
      kind: 'ready',
      methods: methodOptions(c, zustand === 'lastschrift_wartet'),
      wallet: c.s.wallet
        ? { balanceCents: balance, enough: balance >= priceCents, blocked: false, confirmHref: c.here({ dialog: id, zahlart: 'wallet' }), topupHref: c.href('Wallet') }
        : null,
      confirmHref
    },
    error
  };
}

function confirm(c: Ctx, id: string, kind: 'buy' | 'subscribe' | 'pay' | 'topup', priceCents: number, extraRows: { label: string; value: string }[] = []): ConfirmDialog | null {
  if (c.i.query.dialog !== id) return null;
  const t = c.i.t;
  const f = fan(c);
  const methode = c.i.query.zahlart === 'wallet' ? t('menu.wallet') : t(`method.${(c.i.query.zahlart as PaymentMethod) ?? c.s.methods[0]}`);
  return {
    title: t(`confirm.${kind}`),
    rows: [{ label: t('confirm.price'), value: c.i.price(priceCents) }, ...extraRows, { label: t('confirm.method'), value: methode }],
    termsCheckbox: f && f.terms !== 'current' ? { label: t(f.terms === 'changed' ? 'confirm.termsChanged' : 'confirm.terms'), changed: f.terms === 'changed' } : null,
    submitLabel: kind === 'topup' ? t('confirm.submitTopup', { price: c.i.price(priceCents) }) : t('confirm.submit'),
    legalNote: t('confirm.legal'),
    submit: c.form(`kauf:${id}`, c.here({ dialog: undefined, kauf: 'done' })),
    cancelHref: c.here({ dialog: undefined })
  };
}

// ─── Abos ───────────────────────────────────────────────────────────────────────────────────────

function tiers(c: Ctx): SubscriptionTier[] {
  if (c.s.tiers === 'none' || c.s.lists === 'empty') return [];
  const t = c.i.t;
  const plan = (id: string, label: string, cents: number, recurring: boolean) => ({
    id,
    label,
    priceCents: cents,
    recurring,
    pendingTransfer: id === 'basis-90' && c.loggedIn ? bank(cents) : null,
    purchase: purchase(c, id, cents, t('button.book'))
  });
  if (c.s.tiers === 'one') {
    return [{ id: 'fanclub', name: 'Fanclub', description: 'Alle Videos und Galerien, jede Woche neue Inhalte.', active: false, activeUntil: null, plans: [plan('fc-30', '30 Tage', 999, true), plan('fc-90', '90 Tage', 2499, false)] }];
  }
  const vipAktiv = c.loggedIn && c.s.activeTier === 'VIP';
  return [
    { id: 'basis', name: 'Basis', description: 'Alle Galerien und ausgewählte Videos.', active: false, activeUntil: null, plans: [plan('basis-30', '30 Tage', 999, true), plan('basis-90', '90 Tage', 2499, false)] },
    { id: 'vip', name: 'VIP', description: 'Alles aus Basis, dazu alle Videos in voller Länge, Downloads und exklusive Momente.', active: vipAktiv, activeUntil: vipAktiv ? '2026-10-24T00:00:00Z' : null, plans: [plan('vip-30', '30 Tage', 1999, true), plan('vip-365', '1 Jahr', 17900, false)] }
  ];
}

// ─── Seiten ─────────────────────────────────────────────────────────────────────────────────────

const TEXTE: Record<string, { title: string; body: string }> = {
  impressum: { title: 'Impressum', body: '**Nova Beispiel**\nMusterstraße 1\n1010 Wien, Österreich\n\nE-Mail: kontakt@example.com\n\n## Haftung für Inhalte\n\nDie Inhalte dieser Seite wurden mit größter Sorgfalt erstellt.' },
  datenschutz: { title: 'Datenschutz', body: '## 1. Verantwortliche Stelle\n\nVerantwortlich ist die Beispiel GmbH.\n\n## 2. Welche Daten wir verarbeiten\n\n- Kontodaten (E-Mail, Benutzername)\n- Zahlungsdaten\n- Nutzungsdaten\n\n## 3. Deine Rechte\n\nDu hast das Recht auf Auskunft, Berichtigung und Löschung.\n\n| Zweck | Rechtsgrundlage |\n| --- | --- |\n| Vertrag | Art. 6 Abs. 1 lit. b DSGVO |\n| Sicherheit | Art. 6 Abs. 1 lit. f DSGVO |' },
  agb: { title: 'AGB', body: '## § 1 Geltungsbereich\n\nDiese Bedingungen gelten für alle Käufe auf dieser Seite.\n\n## § 2 Vertragsschluss\n\nDer Vertrag kommt mit Klick auf „Kostenpflichtig bestellen" zustande.\n\n## § 3 Preise\n\nAlle Preise sind Endpreise in Euro inklusive Umsatzsteuer.' },
  'ueber-mich': { title: 'Über mich', body: 'Ich fotografiere seit zehn Jahren und stehe seit fünf Jahren selbst vor der Kamera.\n\n![Beispielbild](' + placeholder('ueber', 800, 500, 'Bild im Text') + ')\n\nSchreib mir gern über die Wunsch-Anfragen!' }
};

function events(c: Ctx): EventItem[] {
  if (c.s.lists === 'empty') return [];
  const base = (id: string, title: string, startAt: string, status: EventItem['status'], extra: Partial<EventItem> = {}): EventItem => ({
    id,
    href: c.href('EventDetail', { event: id }),
    title,
    type: 'Messe',
    description: 'Komm vorbei und sag Hallo! Autogramme und Fotos am Stand.',
    imageUrl: placeholder(id, 1200, 675, 'Event 1200×675'),
    startAt,
    endAt: null,
    status,
    statusNote: null,
    online: false,
    onlineUrl: null,
    location: { name: 'Messe Wien', address: 'Messeplatz 1', city: 'Wien', mapHref: 'https://maps.example.com', website: 'https://example.com' },
    admission: 'Ab 18 Jahren, Eintritt 25 €',
    ticketUrl: 'https://example.com/tickets',
    calendarHref: '#kalender',
    ...extra
  });
  return [
    base('venus', 'Venus Berlin', '2026-10-15T10:00:00Z', 'published', { location: { name: 'Messe Berlin', address: 'Messedamm 22', city: 'Berlin', mapHref: 'https://maps.example.com', website: null }, endAt: '2026-10-18T18:00:00Z' }),
    base('livestream', 'Live-Fragestunde', '2026-10-02T18:00:00Z', 'published', { type: 'Online', online: true, onlineUrl: 'https://example.com/live', imageUrl: null, location: { name: null, address: null, city: null, mapHref: null, website: null }, admission: null, ticketUrl: null }),
    base('erotica', 'Erotica Wien', '2026-11-07T10:00:00Z', 'postponed', { statusNote: 'Verschoben auf Frühjahr 2027 — neuer Termin folgt.' }),
    base('party', 'Fan-Party', '2026-09-30T20:00:00Z', 'cancelled', { statusNote: 'Leider abgesagt.', type: null, imageUrl: null })
  ];
}

function auctions(c: Ctx): Auction[] {
  if (c.s.lists === 'empty') return [];
  const t = c.i.t;
  const a = (id: string, title: string, current: number, state: Auction['state'], img = true): Auction => ({
    id,
    href: c.href('AuctionDetail', { auktion: id }),
    title,
    description: 'Signiert und mit persönlicher Widmung. Versand weltweit.',
    imageUrl: img ? placeholder(id, 1200, 900, 'Auktion') : null,
    startPriceCents: 2000,
    currentBidCents: current,
    endsAt: '2026-10-05T20:00:00Z',
    state
  });
  return [
    a('poster', 'Signiertes Poster', 4500, { kind: 'open', minBidCents: 5000, bid: c.loggedIn ? c.form('bieten') : null, myBidCents: c.loggedIn ? 4500 : null }),
    a('outfit', 'Outfit aus dem Weihnachtsspecial', 12000, c.loggedIn ? { kind: 'won', purchase: purchase(c, 'auktion-outfit', 12000, t('button.pay', { price: c.i.price(12000) })) } : { kind: 'closed' }, false),
    a('polaroid', 'Polaroid-Set', 3500, { kind: 'won_paid' }),
    a('kalender', 'Kalender 2027', 2000, { kind: 'closed' })
  ];
}

function requests(c: Ctx): CustomRequest[] {
  if (c.s.lists === 'empty' || !c.loggedIn) return [];
  const t = c.i.t;
  return [
    { id: 'r1', description: 'Ein kurzes Video mit Grüßen zu meinem Geburtstag.', offeredCents: 3000, status: 'negotiating', messages: [{ from: 'fan', body: 'Wäre das bis Freitag möglich?', at: '2026-09-20T18:00:00Z' }, { from: 'model', body: 'Klar! Für 40 € mache ich es in 4K.', at: '2026-09-20T19:30:00Z' }], reply: c.form('antworten'), cancel: c.form('stornieren'), deliveryHref: null, purchase: null },
    { id: 'r2', description: 'Fotoserie im Stil der Strand-Serie, 20 Bilder.', offeredCents: 5000, status: 'delivered', messages: [], reply: c.form('antworten'), cancel: null, deliveryHref: null, purchase: purchase(c, 'anfrage-r2', 5000, t('button.pay', { price: c.i.price(5000) })) },
    { id: 'r3', description: 'Video mit Wunsch-Outfit.', offeredCents: 2000, status: 'rejected', messages: [{ from: 'model', body: 'Das mache ich leider nicht.', at: '2026-09-10T10:00:00Z' }], reply: null, cancel: null, deliveryHref: null, purchase: null }
  ];
}

function payments(c: Ctx): { open: PaymentEntry[]; history: PaymentEntry[] } {
  if (c.s.lists === 'empty' || !c.loggedIn) return { open: [], history: [] };
  const e = (id: string, title: string, cents: number, status: PaymentEntry['status'], extra: Partial<PaymentEntry> = {}): PaymentEntry => ({
    id,
    title,
    href: c.href('ContentDetail', { inhalt: 'hotel-suite' }),
    amountCents: cents,
    createdAt: '2026-09-20T12:00:00Z',
    method: c.i.t('method.creditcard'),
    status,
    failReason: null,
    bank: null,
    processing: false,
    cancel: null,
    ...extra
  });
  return {
    open: [
      e('p1', 'Abo Basis · 90 Tage', 2499, 'pending', { method: c.i.t('method.direct_transfer'), bank: bank(2499), cancel: c.form('bestellung-abbrechen') }),
      e('p2', 'Die Hotel-Suite', 999, 'pending', { method: c.i.t('method.sepa'), processing: true })
    ],
    history: [
      e('h1', 'Nachtfahrt', 1499, 'paid'),
      e('h2', 'Abo VIP · 30 Tage', 1999, 'paid', { href: c.href('Subscriptions') }),
      e('h3', 'Sommergarten', 499, 'failed', { failReason: 'Die Bank hat die Zahlung abgelehnt.' }),
      e('h4', 'City Walk', 899, 'refunded')
    ]
  };
}

function media(c: Ctx, r: RawContent): MediaFile[] {
  const download = c.s.modules.includes('video_download') ? '#download' : null;
  if (r.type === 'video') {
    return [{ kind: 'video', url: '', posterUrl: placeholder(r.slug, 1280, Math.round((1280 * r.height) / r.width), 'Video'), width: r.width, height: r.height, downloadHref: download }];
  }
  return Array.from({ length: Math.min(r.imageCount ?? 6, 12) }, (_, i) => ({
    kind: 'image' as const,
    url: placeholder(`${r.slug}-${i}`, 1600, 1200, `Bild ${i + 1} · 1600×1200`),
    posterUrl: placeholder(`${r.slug}-${i}`, 400, 300, `Bild ${i + 1}`),
    width: 1600,
    height: 1200,
    downloadHref: download
  }));
}

// ─── Einstieg ───────────────────────────────────────────────────────────────────────────────────

export function buildProps(i: BuildInput): Record<string, unknown> {
  const c = new Ctx(i);
  const ctx = context(c);
  const t = i.t;
  const q = i.query;

  switch (i.page) {
    case 'AgeGate':
      return { ctx, confirm: c.form('alter-bestaetigt', c.href('Home')), leaveHref: 'https://www.google.com' } satisfies P.AgeGateProps;

    case 'Home': {
      const typ = q.typ === 'video' || q.typ === 'photo_gallery' ? q.typ : undefined;
      const suche = q.q?.trim() ?? '';
      let list = rawList(c).map((r) => card(c, r));
      if (typ) list = list.filter((k) => k.type === typ);
      if (suche) list = list.filter((k) => k.title.toLowerCase().includes(suche.toLowerCase()));
      const perPage = 12;
      const pages = Math.max(1, Math.ceil(list.length / perPage));
      const page = Math.min(pages, Math.max(1, Number(q.seite ?? '1') || 1));
      return {
        ctx,
        featured: suche ? [] : list.filter((k) => k.featured),
        items: list.slice((page - 1) * perPage, page * perPage),
        filters: [
          { label: t('filter.all'), href: c.here({ typ: undefined, seite: undefined }), active: !typ },
          { label: t('filter.videos'), href: c.here({ typ: 'video', seite: undefined }), active: typ === 'video' },
          { label: t('filter.galleries'), href: c.here({ typ: 'photo_gallery', seite: undefined }), active: typ === 'photo_gallery' }
        ],
        search: { action: `/v/${i.template}/Home`, hidden: c.keep, value: suche },
        searching: !!suche,
        pagination: { page, pages, prevHref: page > 1 ? c.here({ seite: String(page - 1) }) : null, nextHref: page < pages ? c.here({ seite: String(page + 1) }) : null },
        moments: moments(c),
        tiers: tiers(c).map((tier) => ({ name: tier.name, fromCents: Math.min(...tier.plans.map((p) => p.priceCents)), href: c.href('Subscriptions') }))
      } satisfies P.HomeProps;
    }

    case 'ContentDetail': {
      const r = CONTENT.find((x) => x.slug === q.inhalt) ?? CONTENT[1];
      const k = card(c, r);
      const locked = k.access.state === 'locked';
      const a = k.access;
      return {
        ctx,
        content: { ...k, description: r.description },
        media: locked ? [] : media(c, r),
        paywall:
          a.state === 'locked'
            ? {
                purchase: a.priceCents != null ? purchase(c, `inhalt-${r.slug}`, a.priceCents, t('button.buy', { price: i.price(a.priceCents) })) : null,
                subscription: a.packages.length ? { packages: a.packages, href: c.href('Subscriptions') } : null
              }
            : null,
        confirm: a.state === 'locked' && a.priceCents != null ? confirm(c, `inhalt-${r.slug}`, 'buy', a.priceCents) : null,
        related: rawList(c).filter((x) => x.slug !== r.slug).slice(0, 4).map((x) => card(c, x)),
        backHref: c.href('Home')
      } satisfies P.ContentDetailProps;
    }

    case 'Subscriptions': {
      const list = tiers(c);
      const plan = list.flatMap((x) => x.plans).find((p) => p.id === q.dialog);
      return {
        ctx,
        tiers: list,
        confirm: plan ? confirm(c, plan.id, 'subscribe', plan.priceCents, [{ label: t('confirm.duration'), value: plan.label }]) : null
      } satisfies P.SubscriptionsProps;
    }

    case 'Bundles': {
      const bundles =
        c.s.lists === 'empty'
          ? []
          : [
              { id: 'sommer', title: 'Sommer-Paket 2026', itemCount: 5, priceCents: 2900, items: rawList(c).slice(0, 5).map((r) => card(c, r)), purchase: purchase(c, 'bundle-sommer', 2900, t('button.buy', { price: i.price(2900) })) },
              { id: 'alles', title: 'Alle Videos des Monats', itemCount: 12, priceCents: 4900, items: [], purchase: purchase(c, 'bundle-alles', 4900, t('button.buy', { price: i.price(4900) })) }
            ];
      const b = bundles.find((x) => `bundle-${x.id}` === q.dialog);
      return { ctx, bundles, confirm: b ? confirm(c, `bundle-${b.id}`, 'buy', b.priceCents) : null } satisfies P.BundlesProps;
    }

    case 'Wishlist': {
      const f = fan(c);
      const support = (fullGiftCents: number | null) =>
        c.loggedIn
          ? {
              fullGiftCents,
              minCents: 500,
              methods: methodOptions(c, false),
              walletBalanceCents: c.s.wallet ? 2500 : null,
              termsCheckbox: f && f.terms !== 'current' ? { label: t('confirm.terms'), changed: f.terms === 'changed' } : null,
              submit: c.form('wunsch-unterstuetzen'),
              submitLabel: fullGiftCents ? t('wish.gift', { price: i.price(fullGiftCents) }) : t('wish.support'),
              legalNote: t('confirm.legal')
            }
          : null;
      const wishes =
        c.s.lists === 'empty'
          ? []
          : [
              { id: 'kamera', title: 'Neue Kamera', description: 'Für noch schärfere Videos in 4K.', imageUrl: placeholder('kamera', 800, 600, 'Wunschbild'), category: 'Technik', quantity: 1, targetCents: 120000, raisedCents: 48000, progress: 0.4, externalUrl: 'https://example.com/kamera', rewardText: 'Ein exklusives Dankeschön-Video für alle Unterstützer', subscribersOnly: false, deadline: '2026-12-01T00:00:00Z', supporterCount: 14, topSupporters: [{ name: 'Tom', amountCents: 10000 }, { name: null, amountCents: 5000 }, { name: 'Alex', amountCents: 2500 }], state: 'open' as const, support: support(null), pendingTransfer: null },
              { id: 'schuhe', title: 'Rote Schuhe', description: '', imageUrl: null, category: 'Mode', quantity: 2, targetCents: 12000, raisedCents: 6000, progress: 0.5, externalUrl: null, rewardText: null, subscribersOnly: true, deadline: null, supporterCount: 2, topSupporters: [], state: 'open' as const, support: support(6000), pendingTransfer: null },
              { id: 'licht', title: 'Ringlicht', description: 'Danke euch allen!', imageUrl: placeholder('licht', 800, 600, 'Wunschbild'), category: 'Technik', quantity: 1, targetCents: 8000, raisedCents: 8000, progress: 1, externalUrl: null, rewardText: null, subscribersOnly: false, deadline: null, supporterCount: 6, topSupporters: [], state: 'fulfilled' as const, support: null, pendingTransfer: null },
              { id: 'reise', title: 'Fotoreise nach Island', description: 'Leider nicht geschafft.', imageUrl: null, category: 'Reise', quantity: 1, targetCents: 300000, raisedCents: 42000, progress: 0.14, externalUrl: null, rewardText: null, subscribersOnly: false, deadline: '2026-08-01T00:00:00Z', supporterCount: 3, topSupporters: [], state: 'expired' as const, support: null, pendingTransfer: null }
            ];
      return { ctx, wishes, flash: flash(c) } satisfies P.WishlistProps;
    }

    case 'Events': {
      const list = events(c);
      return {
        ctx,
        events: q.stadt ? list.filter((e) => e.location.city?.toLowerCase().includes(q.stadt!.toLowerCase())) : list,
        cityFilter: { action: `/v/${i.template}/Events`, hidden: c.keep, value: q.stadt ?? '', resetHref: q.stadt ? c.here({ stadt: undefined }) : null },
        near: c.loggedIn ? { cities: ['Wien', 'Berlin'], events: list.slice(0, 1), subscribe: c.form('stadt-abonnieren') } : null,
        flash: flash(c)
      } satisfies P.EventsProps;
    }

    case 'EventDetail': {
      const list = events(c.full());
      return { ctx, event: list.find((e) => e.id === q.event) ?? list[0], backHref: c.href('Events') } satisfies P.EventDetailProps;
    }

    case 'Auctions':
      return { ctx, auctions: auctions(c) } satisfies P.AuctionsProps;

    case 'AuctionDetail': {
      const list = auctions(c.full());
      const a = list.find((x) => x.id === q.auktion) ?? list[0];
      return { ctx, auction: a, backHref: c.href('Auctions'), confirm: a.state.kind === 'won' ? confirm(c, `auktion-${a.id}`, 'pay', a.currentBidCents) : null, flash: flash(c) } satisfies P.AuctionDetailProps;
    }

    case 'Requests': {
      const list = requests(c);
      const r = list.find((x) => `anfrage-${x.id}` === q.dialog);
      return {
        ctx,
        intro: 'Beschreibe deine Wunsch-Aufnahme so genau wie möglich. Bezahlt wird erst, nachdem ich sie geliefert habe.',
        create: c.form('anfrage-stellen'),
        requests: list,
        confirm: r ? confirm(c, `anfrage-${r.id}`, 'pay', r.offeredCents) : null,
        flash: flash(c)
      } satisfies P.RequestsProps;
    }

    case 'Login':
    case 'Register':
    case 'ForgotPassword':
    case 'ResetPassword':
    case 'ChangePassword':
      return {
        ctx,
        form: {
          submit: c.form(i.page.toLowerCase(), c.here({ zustand: 'fehler' })),
          values: q.zustand === 'fehler' ? { email: 'max@example.com' } : {},
          error: q.zustand === 'fehler' ? t('flash.loginError') : null,
          success: q.zustand === 'erfolg' ? t('flash.linkSent') : null
        }
      } satisfies P.AuthPageProps;

    case 'VerifyEmail': {
      const state = (['ready', 'incomplete', 'already', 'guest', 'done'] as const).find((z) => z === q.zustand) ?? 'ready';
      return { ctx, state, confirm: state === 'ready' ? c.form('bestaetigen', c.here({ zustand: 'done' })) : null, resend: state === 'incomplete' ? c.form('erneut-senden') : null } satisfies P.VerifyEmailProps;
    }

    case 'TermsConsent':
      return {
        ctx,
        changed: fan(c)?.terms === 'changed',
        alreadyAccepted: q.zustand === 'already',
        termsMarkdown: TEXTE.agb.body,
        form: { submit: c.form('agb-zustimmen', c.href('Home')), values: {}, error: null, success: null },
        laterHref: c.href('Home')
      } satisfies P.TermsConsentProps;

    case 'Profile': {
      const leer = c.s.lists === 'empty';
      return {
        ctx,
        subscriptions:
          leer || !c.s.activeTier
            ? []
            : [
                {
                  id: 's1',
                  tierName: 'VIP',
                  recurring: true,
                  until: '2026-10-24T00:00:00Z',
                  renewalPending: false,
                  cancelRecurring: c.form('verlaengerung-beenden'),
                  changeOptions: [
                    { label: 'Basis · 30 Tage · 9,99 €', target: c.form('stufe-basis-30') },
                    { label: 'Basis · 90 Tage · 24,99 €', target: c.form('stufe-basis-90') }
                  ],
                  scheduledChange: q.zustand === 'wechsel' ? { label: 'Basis (30 Tage · 9,99 €)', undo: c.form('wechsel-aufheben') } : null
                }
              ],
        pastSubscriptions: leer ? [] : [{ tierName: 'Basis', endedAt: '2026-06-01T00:00:00Z' }],
        purchases: leer ? [] : CONTENT.filter((r) => r.ownedSince).map((r) => ({ title: r.title, href: c.href('ContentDetail', { inhalt: r.slug }), imageUrl: card(c, r).imageUrl, at: r.ownedSince! })),
        requests: c.s.modules.includes('custom_requests') ? requests(c).map((r) => ({ description: r.description, status: r.status, offeredCents: r.offeredCents })) : null,
        links: { wallet: c.s.wallet ? c.href('Wallet') : null, notifications: c.href('Notifications'), payments: c.href('Payments'), password: c.href('ChangePassword') }
      } satisfies P.ProfileProps;
    }

    case 'Payments': {
      const { open, history } = payments(c);
      const r = q.zustand as 'success' | 'created' | 'failed' | 'cancelled' | undefined;
      return {
        ctx,
        result: r && ['success', 'created', 'failed', 'cancelled'].includes(r) ? { kind: r, targetHref: c.href('ContentDetail', { inhalt: 'hotel-suite' }), targetLabel: 'Die Hotel-Suite' } : null,
        open,
        history
      } satisfies P.PaymentsProps;
    }

    case 'Wallet': {
      const state = !c.s.wallet ? 'disabled' : !c.loggedIn ? 'guest' : c.s.notices.test ? 'test' : 'ok';
      const betrag = Number(q.betrag ?? '2000') || 2000;
      const leer = c.s.lists === 'empty';
      return {
        ctx,
        state,
        balanceCents: leer ? 0 : 2500,
        blocked: q.zustand === 'gesperrt',
        pendingTopups: leer ? [] : [{ ...payments(c.full()).open[0], title: t('button.topup', { price: i.price(5000) }), amountCents: 5000 }],
        topup:
          state === 'ok'
            ? {
                amounts: [1000, 2000, 5000, 10000].map((cents) => ({ cents, href: c.here({ betrag: String(cents) }), selected: cents === betrag })),
                stepCents: 500,
                maxCents: 50000,
                selectedCents: betrag,
                minusHref: betrag > 500 ? c.here({ betrag: String(betrag - 500) }) : null,
                plusHref: betrag < 50000 ? c.here({ betrag: String(betrag + 500) }) : null,
                methods: methodOptions(c, false).filter((m) => m.method !== 'sepa'),
                purchase: purchase(c, 'aufladen', betrag, t('button.topup', { price: i.price(betrag) }))
              }
            : null,
        transactions: leer
          ? []
          : [
              { id: 't1', kind: 'topup', note: '', amountCents: 5000, balanceAfterCents: 5000, createdAt: '2026-09-01T10:00:00Z' },
              { id: 't2', kind: 'spend', note: 'Nachtfahrt', amountCents: -1499, balanceAfterCents: 3501, createdAt: '2026-09-02T12:00:00Z' },
              { id: 't3', kind: 'spend', note: 'Sommergarten', amountCents: -499, balanceAfterCents: 3002, createdAt: '2026-09-05T12:00:00Z' },
              { id: 't4', kind: 'adjust', note: 'Gutschrift wegen Störung', amountCents: -502, balanceAfterCents: 2500, createdAt: '2026-09-10T12:00:00Z' }
            ],
        confirm: confirm(c, 'aufladen', 'topup', betrag)
      } satisfies P.WalletProps;
    }

    case 'Notifications': {
      const items =
        c.s.lists === 'empty' || !c.loggedIn
          ? []
          : [
              { id: 'n1', title: 'Neues Video: Abendlicht am See', body: 'Nova hat ein neues Video veröffentlicht.', read: false, at: '2026-09-21T18:05:00Z', markRead: c.form('gelesen') },
              { id: 'n2', title: 'Dein Abo verlängert sich bald', body: 'Am 24.10. wird dein VIP-Abo verlängert.', read: false, at: '2026-09-20T09:00:00Z', markRead: c.form('gelesen') },
              { id: 'n3', title: 'Neuer Termin in Berlin', body: 'Venus Berlin, 15.–18. Oktober.', read: false, at: '2026-09-18T12:00:00Z', markRead: c.form('gelesen') },
              { id: 'n4', title: 'Zahlung erhalten', body: 'Danke für deinen Kauf.', read: true, at: '2026-09-02T12:00:00Z', markRead: null }
            ];
      return { ctx, items, markAll: items.some((n) => !n.read) ? c.form('alle-gelesen') : null } satisfies P.NotificationsProps;
    }

    case 'TextPage': {
      const key = q.seite && TEXTE[q.seite] ? q.seite : 'datenschutz';
      return { ctx, title: TEXTE[key].title, markdown: TEXTE[key].body, backHref: c.href('Home'), languageNote: i.locale !== 'de' ? t('languageNote') : null } satisfies P.TextPageProps;
    }

    case 'Message': {
      const kind = (['not_found', 'site_unavailable', 'feature_unavailable', 'error', 'loading'] as const).find((z) => z === q.zustand) ?? 'not_found';
      return { ctx, kind, title: kind === 'feature_unavailable' ? t('menu.auctions') : null } satisfies P.MessagePageProps;
    }
  }
}

/** Beschreibung der Zustände, die sich je Seite über `?zustand=` o. ä. umschalten lassen (Vorschau-Leiste). */
export const PAGE_VARIANTS: Partial<Record<PageKey, { param: string; values: string[] }[]>> = {
  ContentDetail: [{ param: 'inhalt', values: CONTENT.map((c) => c.slug) }, { param: 'kauf', values: [...PURCHASE_STATES] }, { param: 'dialog', values: ['inhalt-hotel-suite', 'inhalt-sommer-garten'] }],
  Subscriptions: [{ param: 'kauf', values: [...PURCHASE_STATES] }, { param: 'dialog', values: ['basis-30', 'vip-365', 'fc-30'] }],
  Bundles: [{ param: 'kauf', values: [...PURCHASE_STATES] }, { param: 'dialog', values: ['bundle-sommer'] }],
  Wishlist: [{ param: 'meldung', values: ['wunsch-unterstuetzen', 'fehler'] }],
  EventDetail: [{ param: 'event', values: ['venus', 'livestream', 'erotica', 'party'] }],
  AuctionDetail: [{ param: 'auktion', values: ['poster', 'outfit', 'polaroid', 'kalender'] }, { param: 'dialog', values: ['auktion-outfit'] }],
  Requests: [{ param: 'dialog', values: ['anfrage-r2'] }, { param: 'meldung', values: ['anfrage-stellen'] }],
  Login: [{ param: 'zustand', values: ['fehler'] }],
  ForgotPassword: [{ param: 'zustand', values: ['erfolg'] }],
  VerifyEmail: [{ param: 'zustand', values: ['ready', 'incomplete', 'already', 'guest', 'done'] }],
  TermsConsent: [{ param: 'zustand', values: ['already'] }],
  Profile: [{ param: 'zustand', values: ['wechsel'] }],
  Payments: [{ param: 'zustand', values: ['success', 'created', 'failed', 'cancelled'] }],
  Wallet: [{ param: 'zustand', values: ['gesperrt'] }, { param: 'dialog', values: ['aufladen'] }],
  TextPage: [{ param: 'seite', values: ['impressum', 'datenschutz', 'agb', 'ueber-mich'] }],
  Message: [{ param: 'zustand', values: ['not_found', 'site_unavailable', 'feature_unavailable', 'error', 'loading'] }]
};
