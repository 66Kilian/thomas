import type { ModuleKey, PaymentMethod } from '@/kit/types';

/**
 * **Szenarien** — dieselbe Seite in unterschiedlichen Ausbaustufen. Ein Template muss in ALLEN
 * gut aussehen (Briefing: „Minimal- und Vollausbau zeigen").
 */
export interface Scenario {
  label: string;
  description: string;
  loggedIn: boolean;
  modules: ModuleKey[];
  wallet: boolean;
  cover: boolean;
  logo: boolean;
  moments: boolean;
  /** Abo-Angebot: keines, genau eine Stufe, mehrere Stufen (Modul `vip_subscription`). */
  tiers: 'none' | 'one' | 'many';
  /** Aktive Abo-Stufe des Fans (nur angemeldet). */
  activeTier: string | null;
  methods: PaymentMethod[];
  languages: ('de' | 'en')[];
  /** Anzahl Inhalte (0 = leere Seite). */
  contentCount: number;
  featured: boolean;
  notices: { test: boolean; impersonated: boolean; emailUnverified: boolean; terms: 'current' | 'first' | 'changed' };
  lists: 'full' | 'empty';
  unread: number;
  hasHelp: boolean;
}

export const SCENARIOS = {
  voll: {
    label: 'Vollausbau',
    description: 'Angemeldet, alle Module, mehrere Abo-Stufen (VIP aktiv), Guthaben, Momente, Titelbild und Logo.',
    loggedIn: true,
    modules: ['vip_subscription', 'video_download', 'custom_requests', 'auctions', 'events'],
    wallet: true,
    cover: true,
    logo: true,
    moments: true,
    tiers: 'many',
    activeTier: 'VIP',
    methods: ['creditcard', 'sepa', 'online-uberweisen', 'direct_transfer'],
    languages: ['de', 'en'],
    contentCount: 14,
    featured: true,
    notices: { test: false, impersonated: false, emailUnverified: false, terms: 'current' },
    lists: 'full',
    unread: 3,
    hasHelp: true
  },
  gast: {
    label: 'Besucher',
    description: 'Abgemeldet, ein Abo mit zwei Laufzeiten, Events gebucht, Titelbild, kein Guthaben.',
    loggedIn: false,
    modules: ['events'],
    wallet: false,
    cover: true,
    logo: true,
    moments: true,
    tiers: 'one',
    activeTier: null,
    methods: ['creditcard', 'direct_transfer'],
    languages: ['de', 'en'],
    contentCount: 14,
    featured: true,
    notices: { test: false, impersonated: false, emailUnverified: false, terms: 'current' },
    lists: 'full',
    unread: 0,
    hasHelp: true
  },
  minimal: {
    label: 'Minimalausbau',
    description: 'Abgemeldet, kein Modul, kein Abo, kein Titelbild, kein Logo, keine Momente, nur Deutsch, eine Zahlungsart.',
    loggedIn: false,
    modules: [],
    wallet: false,
    cover: false,
    logo: false,
    moments: false,
    tiers: 'none',
    activeTier: null,
    methods: ['direct_transfer'],
    languages: ['de'],
    contentCount: 5,
    featured: false,
    notices: { test: false, impersonated: false, emailUnverified: false, terms: 'current' },
    lists: 'full',
    unread: 0,
    hasHelp: false
  },
  hinweise: {
    label: 'Alle Hinweise',
    description: 'Angemeldet als Testzugang in Fan-Ansicht, E-Mail unbestätigt, AGB geändert — alle vier Hinweisleisten.',
    loggedIn: true,
    modules: ['vip_subscription', 'events'],
    wallet: true,
    cover: true,
    logo: true,
    moments: false,
    tiers: 'many',
    activeTier: null,
    methods: ['creditcard', 'sepa'],
    languages: ['de', 'en'],
    contentCount: 8,
    featured: false,
    notices: { test: true, impersonated: true, emailUnverified: true, terms: 'changed' },
    lists: 'full',
    unread: 12,
    hasHelp: true
  },
  leer: {
    label: 'Leer',
    description: 'Angemeldet, alle Module, aber noch keine Inhalte und alle Listen leer.',
    loggedIn: true,
    modules: ['vip_subscription', 'custom_requests', 'auctions', 'events'],
    wallet: true,
    cover: false,
    logo: true,
    moments: false,
    tiers: 'none',
    activeTier: null,
    methods: ['creditcard'],
    languages: ['de', 'en'],
    contentCount: 0,
    featured: false,
    notices: { test: false, impersonated: false, emailUnverified: false, terms: 'current' },
    lists: 'empty',
    unread: 0,
    hasHelp: false
  }
} satisfies Record<string, Scenario>;

export type ScenarioKey = keyof typeof SCENARIOS;
export const SCENARIO_KEYS = Object.keys(SCENARIOS) as ScenarioKey[];

export function scenario(key: string | undefined): { key: ScenarioKey; s: Scenario } {
  const k = (key && key in SCENARIOS ? key : 'voll') as ScenarioKey;
  return { key: k, s: SCENARIOS[k] };
}

/** Kauf-Zustände, die sich über `?kauf=` erzwingen lassen (Kaufbereich überall). */
export const PURCHASE_STATES = ['ready', 'guest', 'test', 'not_configured', 'email_unverified', 'pending_transfer', 'done', 'lastschrift_wartet', 'fehler'] as const;
