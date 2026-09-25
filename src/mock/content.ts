/**
 * Beispiel-Inhalte eines erfundenen Models. Titel bewusst auf Deutsch (Sprache des Models), damit
 * die Mischung „englische Oberfläche, deutsche Inhalte" sichtbar wird. Die Mischung deckt ab:
 * Video/Galerie, Hoch-/Querformat, frei/Einzelkauf/Abo/beides, gekauft/im Abo, mit und ohne bewegte
 * Vorschau, kurze und sehr lange Titel, Laufzeiten über eine Stunde.
 */

export interface RawContent {
  slug: string;
  type: 'video' | 'photo_gallery';
  title: string;
  description: string;
  tags: string[];
  /** Maße des Vorschaubilds bzw. Videos. */
  width: number;
  height: number;
  durationSeconds: number | null;
  quality: string | null;
  imageCount: number | null;
  free: boolean;
  /** Einzelpreis in Cent, `null` = nicht einzeln kaufbar. */
  ppv: number | null;
  /** Abo-Stufen, in denen der Inhalt enthalten ist. */
  packages: string[];
  /** Gekauft (nur wenn angemeldet), Datum ISO. */
  ownedSince: string | null;
  featured: boolean;
  motion: boolean;
  createdAt: string;
}

const BESCHREIBUNG = `Ein ruhiger Nachmittag im Studio — Licht, Farben und viel Zeit.

**Was dich erwartet:**
- ungeschnittene Szenen
- Blick hinter die Kulissen
- Musik von einem befreundeten Künstler

Mehr dazu in meinem [Blog](https://example.com).`;

export const CONTENT: RawContent[] = [
  { slug: 'abendlicht', type: 'video', title: 'Abendlicht am See', description: BESCHREIBUNG, tags: ['sommer', 'outdoor'], width: 1920, height: 1080, durationSeconds: 754, quality: '1080p', imageCount: null, free: true, ppv: null, packages: [], ownedSince: null, featured: true, motion: true, createdAt: '2026-09-21T18:00:00Z' },
  { slug: 'hotel-suite', type: 'video', title: 'Die Hotel-Suite', description: BESCHREIBUNG, tags: ['indoor', 'hotel', 'luxus'], width: 3840, height: 2160, durationSeconds: 1450, quality: '4K', imageCount: null, free: false, ppv: 999, packages: ['VIP'], ownedSince: null, featured: true, motion: true, createdAt: '2026-09-19T20:00:00Z' },
  { slug: 'sommer-garten', type: 'photo_gallery', title: 'Sommergarten', description: BESCHREIBUNG, tags: ['sommer'], width: 1080, height: 1350, durationSeconds: null, quality: null, imageCount: 36, free: false, ppv: 499, packages: [], ownedSince: null, featured: false, motion: false, createdAt: '2026-09-17T10:00:00Z' },
  { slug: 'backstage-tag', type: 'video', title: 'Ein Tag backstage', description: BESCHREIBUNG, tags: ['backstage'], width: 1080, height: 1920, durationSeconds: 485, quality: '1080p', imageCount: null, free: false, ppv: null, packages: ['Basis', 'VIP'], ownedSince: null, featured: false, motion: true, createdAt: '2026-09-15T16:00:00Z' },
  { slug: 'strand-serie', type: 'photo_gallery', title: 'Strand-Serie', description: BESCHREIBUNG, tags: ['strand', 'sommer'], width: 1600, height: 1067, durationSeconds: null, quality: null, imageCount: 18, free: true, ppv: null, packages: [], ownedSince: null, featured: false, motion: false, createdAt: '2026-09-12T09:00:00Z' },
  { slug: 'nachtfahrt', type: 'video', title: 'Nachtfahrt', description: BESCHREIBUNG, tags: ['stadt', 'nacht'], width: 1920, height: 1080, durationSeconds: 1932, quality: '1080p', imageCount: null, free: false, ppv: 1499, packages: [], ownedSince: '2026-09-02T12:00:00Z', featured: false, motion: true, createdAt: '2026-09-10T22:00:00Z' },
  { slug: 'lingerie-shooting', type: 'photo_gallery', title: 'Shooting in Schwarz', description: BESCHREIBUNG, tags: ['studio'], width: 1080, height: 1440, durationSeconds: null, quality: null, imageCount: 52, free: false, ppv: null, packages: ['VIP'], ownedSince: null, featured: false, motion: false, createdAt: '2026-09-08T14:00:00Z' },
  { slug: 'weihnachtsspecial', type: 'video', title: 'Weihnachtsspecial 2025', description: BESCHREIBUNG, tags: ['special'], width: 1920, height: 1080, durationSeconds: 3723, quality: '1080p', imageCount: null, free: false, ppv: 1999, packages: ['VIP'], ownedSince: null, featured: true, motion: true, createdAt: '2026-09-05T19:00:00Z' },
  { slug: 'morgenroutine', type: 'video', title: 'Meine Morgenroutine', description: BESCHREIBUNG, tags: ['alltag'], width: 960, height: 540, durationSeconds: 192, quality: '540p', imageCount: null, free: true, ppv: null, packages: [], ownedSince: null, featured: false, motion: true, createdAt: '2026-09-03T07:00:00Z' },
  { slug: 'studio-portraits', type: 'photo_gallery', title: 'Studio-Porträts', description: BESCHREIBUNG, tags: ['studio', 'portrait'], width: 1200, height: 1200, durationSeconds: null, quality: null, imageCount: 48, free: false, ppv: 699, packages: ['Basis', 'VIP'], ownedSince: null, featured: false, motion: false, createdAt: '2026-08-30T11:00:00Z' },
  { slug: 'ueberlaenge', type: 'video', title: 'Ein ganz besonders langer Titel, der zeigen soll, wie das Template mit Überlänge umgeht – mit Umlauten, Gedankenstrichen und noch mehr Text bis ans Ende', description: BESCHREIBUNG, tags: ['test'], width: 1920, height: 1080, durationSeconds: 1290, quality: '720p', imageCount: null, free: false, ppv: null, packages: ['Basis'], ownedSince: null, featured: false, motion: true, createdAt: '2026-08-27T15:00:00Z' },
  { slug: 'regentag', type: 'video', title: 'Regentag', description: BESCHREIBUNG, tags: ['alltag'], width: 1280, height: 720, durationSeconds: 402, quality: null, imageCount: null, free: true, ppv: null, packages: [], ownedSince: null, featured: false, motion: false, createdAt: '2026-08-24T13:00:00Z' },
  { slug: 'city-walk', type: 'video', title: 'City Walk', description: BESCHREIBUNG, tags: ['stadt'], width: 1080, height: 1920, durationSeconds: 655, quality: '1080p', imageCount: null, free: false, ppv: 899, packages: [], ownedSince: '2026-08-20T12:00:00Z', featured: false, motion: true, createdAt: '2026-08-20T10:00:00Z' },
  { slug: 'polaroids', type: 'photo_gallery', title: 'Polaroids', description: BESCHREIBUNG, tags: ['analog'], width: 1000, height: 1200, durationSeconds: null, quality: null, imageCount: 9, free: true, ppv: null, packages: [], ownedSince: null, featured: false, motion: false, createdAt: '2026-08-15T10:00:00Z' }
];
