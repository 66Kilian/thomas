/** Texte der Präsentationsseite (nur Präsentation, nicht Teil der Abgabe): Deutsch, Englisch, Slowakisch. */

import type { ThemeKey } from '@/kit/theme';

export const LANGS = ['de', 'en', 'sk'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = { de: 'Deutsch', en: 'English', sk: 'Slovenčina' };

export function toLang(v: string | string[] | undefined): Lang {
  const s = Array.isArray(v) ? v[0] : v;
  return (LANGS as readonly string[]).includes(s ?? '') ? (s as Lang) : 'de';
}

/** Sprache der Vorschau: Die Fan-Seite gibt es (wie die Plattform) auf Deutsch und Englisch. */
export const previewLang = (l: Lang) => (l === 'de' ? 'de' : 'en');

export const THEME_NAMES: Record<Lang, Record<ThemeKey, string>> = {
  de: { gothic: 'Dunkel & Gruftig', playful: 'Verspielt', redlight: 'Rotlicht', tech: 'Technisch', royal: 'Pompös', light: 'Hell & Klar' },
  en: { gothic: 'Dark & Gothic', playful: 'Playful', redlight: 'Red Light', tech: 'Tech', royal: 'Royal', light: 'Light & Clear' },
  sk: { gothic: 'Tmavý & gotický', playful: 'Hravý', redlight: 'Červené svetlo', tech: 'Technický', royal: 'Pompézny', light: 'Svetlý & čistý' }
};

export const STYLE_TEXT: Record<Lang, Record<ThemeKey, string>> = {
  de: {
    gothic: 'Tiefes Schwarz, Rosé und Gold',
    playful: 'Hell und verspielt, Rosa mit Violett',
    redlight: 'Glühendes Rot auf Nachtschwarz',
    tech: 'Kühles Blau, Cyan und Neon-Grün',
    royal: 'Violett mit Gold, luxuriös',
    light: 'Weiß und klar mit Magenta'
  },
  en: {
    gothic: 'Deep black, rosé and gold',
    playful: 'Bright and playful, pink with violet',
    redlight: 'Glowing red on midnight black',
    tech: 'Cool blue, cyan and neon green',
    royal: 'Violet with gold, luxurious',
    light: 'White and clean with magenta'
  },
  sk: {
    gothic: 'Hlboká čierna, ružová a zlatá',
    playful: 'Svetlý a hravý, ružová s fialovou',
    redlight: 'Žiarivá červená na nočnej čiernej',
    tech: 'Chladná modrá, azúrová a neónovo zelená',
    royal: 'Fialová so zlatou, luxusný',
    light: 'Biela a čistá s purpurovou'
  }
};

/** Seiten der Vorschau (Schlüssel = Seite des Kits). */
export const PAGE_LABELS: Record<Lang, Record<string, string>> = {
  de: { Home: 'Startseite', ContentDetail: 'Inhalt kaufen', Subscriptions: 'Abos', Events: 'Events', Wishlist: 'Wunschliste', Bundles: 'Bundles', Auctions: 'Auktionen', Requests: 'Anfragen', TextPage: 'Über mich', Wallet: 'Konto', AgeGate: '18+' },
  en: { Home: 'Home', ContentDetail: 'Buy content', Subscriptions: 'Subscriptions', Events: 'Events', Wishlist: 'Wishlist', Bundles: 'Bundles', Auctions: 'Auctions', Requests: 'Requests', TextPage: 'About me', Wallet: 'Account', AgeGate: '18+' },
  sk: { Home: 'Úvod', ContentDetail: 'Kúpiť obsah', Subscriptions: 'Predplatné', Events: 'Podujatia', Wishlist: 'Zoznam prianí', Bundles: 'Balíčky', Auctions: 'Aukcie', Requests: 'Požiadavky', TextPage: 'O mne', Wallet: 'Účet', AgeGate: '18+' }
};

export const UI = {
  de: {
    metaTitle: 'Designs · Fan-Seite',
    language: 'Sprache',
    title: 'Wähle dein Design.',
    sub: 'Design antippen — die Vorschau zeigt sofort, wie es aussieht. Dann mit einem Klick öffnen.',
    demo: 'Beispiel mit Fotos ansehen: Rotlicht →',
    feedbackLink: 'Rückmeldung geben ↓',
    step1: '1 · Design wählen',
    step2: '2 · Seite ansehen',
    open: 'Design öffnen →',
    mobile: 'mobil',
    previewNote: '',
    allPages: 'Alle Seiten und Zustände',
    techOverview: 'Technische Übersicht',
    groups: ['Startseite in allen Zuständen', 'Bausteine', 'Kaufbereich — jeder Zustand', 'Weitere Seiten'],
    home: ['Vollausbau', 'Minimal (nichts gebucht)', 'Besucher (abgemeldet)', 'Alle Hinweisleisten', 'Leer'],
    parts: ['ContentCard (Kacheln)', 'PurchasePanel (Kaufbereich)', 'ConfirmDialog (Bestätigung)'],
    more: ['Inhalt freigeschaltet', 'Event-Detail', 'Auktion-Detail', 'Anmelden', 'Registrieren', 'Passwort vergessen', 'Neues Passwort', 'Passwort ändern', 'E-Mail bestätigen', 'AGB-Zustimmung', 'Profil', 'Zahlungen', 'Benachrichtigungen', 'Impressum', 'Seite nicht gefunden']
  },
  en: {
    metaTitle: 'Designs · Fan site',
    language: 'Language',
    title: 'Choose your design.',
    sub: 'Tap a design — the preview shows right away how it looks. Then open it with one click.',
    demo: 'See an example with photos: Red Light →',
    feedbackLink: 'Give feedback ↓',
    step1: '1 · Choose a design',
    step2: '2 · View a page',
    open: 'Open design →',
    mobile: 'mobile',
    previewNote: '',
    allPages: 'All pages and states',
    techOverview: 'Technical overview',
    groups: ['Home page in every state', 'Building blocks', 'Purchase area — every state', 'More pages'],
    home: ['Full', 'Minimal (nothing booked)', 'Visitor (logged out)', 'All notice bars', 'Empty'],
    parts: ['ContentCard (tiles)', 'PurchasePanel (purchase area)', 'ConfirmDialog (confirmation)'],
    more: ['Content unlocked', 'Event detail', 'Auction detail', 'Log in', 'Register', 'Forgot password', 'New password', 'Change password', 'Confirm e-mail', 'Accept terms', 'Profile', 'Payments', 'Notifications', 'Imprint', 'Page not found']
  },
  sk: {
    metaTitle: 'Dizajny · Fan stránka',
    language: 'Jazyk',
    title: 'Vyber si svoj dizajn.',
    sub: 'Ťukni na dizajn — náhľad hneď ukáže, ako vyzerá. Potom ho otvoríš jedným kliknutím.',
    demo: 'Pozrieť príklad s fotkami: Červené svetlo →',
    feedbackLink: 'Dať spätnú väzbu ↓',
    step1: '1 · Vyber dizajn',
    step2: '2 · Pozri si stránku',
    open: 'Otvoriť dizajn →',
    mobile: 'mobil',
    previewNote: 'Náhľad fan stránky je v angličtine — platforma zatiaľ podporuje nemčinu a angličtinu, slovenčina príde neskôr.',
    allPages: 'Všetky stránky a stavy',
    techOverview: 'Technický prehľad',
    groups: ['Úvodná stránka vo všetkých stavoch', 'Stavebné prvky', 'Nákupná časť — každý stav', 'Ďalšie stránky'],
    home: ['Plná verzia', 'Minimálna (nič nezakúpené)', 'Návštevník (odhlásený)', 'Všetky oznámenia', 'Prázdna'],
    parts: ['ContentCard (dlaždice)', 'PurchasePanel (nákupná časť)', 'ConfirmDialog (potvrdenie)'],
    more: ['Odomknutý obsah', 'Detail podujatia', 'Detail aukcie', 'Prihlásenie', 'Registrácia', 'Zabudnuté heslo', 'Nové heslo', 'Zmena hesla', 'Potvrdenie e-mailu', 'Súhlas s VOP', 'Profil', 'Platby', 'Upozornenia', 'Impresum', 'Stránka sa nenašla']
  }
} satisfies Record<Lang, Record<string, string | string[]>>;

export const FB = {
  de: {
    eyebrow: 'Für die Umsetzung',
    title: 'Rückmeldung',
    intro1: 'Bitte jeden Punkt ansehen und markieren:',
    intro2: '(dann bitte kurz schreiben, was anders sein soll). Unten als Text kopieren oder als Datei herunterladen und zurückschicken. Punkte mit',
    intro3: 'brauchen eine Änderung an Plattform/Vertrag — alles andere ist reines Frontend mit dem vorhandenen Vertrag.',
    or: 'oder',
    name: 'Name',
    namePh: 'z. B. Thomas',
    answered: (d: number, n: number) => `${d} von ${n} beantwortet`,
    saved: 'wird in diesem Browser gespeichert',
    view: 'Ansehen ↗',
    yes: 'Gefällt mir',
    no: 'Gefällt mir nicht',
    if: 'Gefiele mir, wenn …',
    commentPh: 'Kommentar (optional)',
    ifPh: 'Was soll anders sein?',
    copy: 'Als Text kopieren',
    copied: 'Kopiert ✓',
    download: 'Als Datei herunterladen',
    reportNote: ''
  },
  en: {
    eyebrow: 'For the implementation',
    title: 'Feedback',
    intro1: 'Please look at each item and mark it:',
    intro2: '(then briefly write what should be different). At the bottom, copy it as text or download it as a file and send it back. Items marked',
    intro3: 'need a change to the platform/contract — everything else is pure frontend with the existing contract.',
    or: 'or',
    name: 'Name',
    namePh: 'e.g. Thomas',
    answered: (d: number, n: number) => `${d} of ${n} answered`,
    saved: 'saved in this browser',
    view: 'View ↗',
    yes: 'I like it',
    no: "I don't like it",
    if: 'I would like it if …',
    commentPh: 'Comment (optional)',
    ifPh: 'What should be different?',
    copy: 'Copy as text',
    copied: 'Copied ✓',
    download: 'Download as file',
    reportNote: 'The exported file is always in German (for the developer).'
  },
  sk: {
    eyebrow: 'Na realizáciu',
    title: 'Spätná väzba',
    intro1: 'Pozri si prosím každý bod a označ:',
    intro2: '(potom krátko napíš, čo má byť inak). Dole to skopíruj ako text alebo stiahni ako súbor a pošli späť. Body označené',
    intro3: 'potrebujú zmenu na platforme/v zmluve — všetko ostatné je čistý frontend s existujúcou zmluvou.',
    or: 'alebo',
    name: 'Meno',
    namePh: 'napr. Thomas',
    answered: (d: number, n: number) => `${d} z ${n} zodpovedaných`,
    saved: 'uložené v tomto prehliadači',
    view: 'Pozrieť ↗',
    yes: 'Páči sa mi',
    no: 'Nepáči sa mi',
    if: 'Páčilo by sa mi, keby …',
    commentPh: 'Komentár (voliteľné)',
    ifPh: 'Čo má byť inak?',
    copy: 'Kopírovať ako text',
    copied: 'Skopírované ✓',
    download: 'Stiahnuť ako súbor',
    reportNote: 'Exportovaný súbor je vždy v nemčine (pre programátora).'
  }
};
