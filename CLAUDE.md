# Template-Kit — Regeln für die Arbeit an einem Template

Dieses Projekt ist ein **Starterkit** für ein Template der Fan-Seite einer Model-Plattform (Inhalte für
Erwachsene, Bezahlinhalte, Abos). Gebaut wird **nur die Darstellung**. Die Plattform selbst ist nicht Teil
dieses Projekts; sie liefert später dieselben Props aus echten Daten. Technik und Ablauf: `README.md`.
Fachliche Anforderungen: das Dokument „Template-Briefing für Designer".

Stack: Next.js 16 (App Router, Server Components), React 19, Tailwind CSS v4, next-intl 4, TypeScript strict.
Start: `npm run dev` → http://localhost:3400. Prüfen: `npm run check` und `npm run build`.

## 1. Wo gearbeitet wird

- **Nur** in `src/templates/<template>/`, dazu ein Eintrag in `src/templates/registry.ts` und neue
  Texte in `messages/de.json` + `messages/en.json`.
- **Nie ändern:** `src/kit/`, `src/mock/`, `src/app/`, `src/proxy.ts`, `src/templates/basis/`. Das ist der
  Vertrag mit der Plattform. Passt etwas nicht, in `src/templates/<template>/HINWEISE.md` notieren
  (was fehlt, wofür, Vorschlag) und mit dem vorhandenen Vertrag weiterarbeiten.
- Neues Template = Kopie von `src/templates/basis/` (siehe README).

## 2. Nur Darstellung

- Komponenten bekommen alles über Props (`src/kit/template.ts`, Datenformen in `src/kit/types.ts`). Kein
  `fetch`, keine Server Actions, keine API-Routen, kein `localStorage`/Cookies, keine eigene Datenhaltung.
- Links immer über die gelieferten `href`, Formulare immer über `FormTarget`:
  `<form method="post" action={target.action}><FormFields target={target} />…</form>`. Nie URLs erfinden.
- Plattform-Bausteine aus `src/kit/platform/` verwenden, nicht nachbauen: `MotionPreview` (bewegte
  Vorschau), `VideoPlayer`, `RichText` (formatierter Text des Models), `FormFields`.
- Keine externen Ressourcen: keine CDNs, keine Tracking-Skripte, keine eingebundenen Webschriften ohne
  Absprache (Schrift = Mehraufwand, frei lizenziert, selbst gehostet).
- Neue npm-Pakete nur nach Absprache (in HINWEISE.md begründen).

## 3. Farben und Farbwelten

- Farben **ausschließlich** über die Token-Klassen: `bg-background`, `text-foreground`, `bg-card`,
  `text-card-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`,
  `text-primary-foreground`, `bg-accent`, `text-accent-foreground`, `ring-ring`; Ecken über
  `rounded-sm … rounded-xl` (folgen dem Radius der Farbwelt). Transparenz erlaubt (`bg-primary/10`).
- **Keine festen Farbwerte** — Ausnahme sind die Zustandsfarben, die bewusst keiner Farbwelt folgen:
  grün = gekauft/erledigt, gelb = wartet/Hinweis, rot = Fehler/abgesagt, blau = Testzugang,
  halbtransparent schwarz = Overlays auf Bildern (`bg-black/55`), schwarz = 18+-Abfrage.
- Das Template liefert **sechs Paletten** (`palettes` im Template-Objekt, Form in `src/kit/theme.ts`).
  Grundflächen je Stimmung möglichst wie im Basis-Template; variiert werden Markenfarbe, Text darauf und
  Akzent. Zusätzlich muss alles mit „Eigene Farben" (`w=custom`, frei gewählte Farben) lesbar bleiben.
- Kontrast: Die Übersichtsseite prüft jede Palette. Alle Werte müssen grün sein (≥ 4,5).

## 4. Funktioniert ohne JavaScript

- Menü (auch mobil), Filter, Reiter, Suche, Blättern, Sprachwahl, 18+-Abfrage, Zahlungsart-Wahl,
  Bestätigungsdialog: Links bzw. Formulare. Mobiles Menü z. B. mit `<details>`.
- Client-Komponenten (`'use client'`) nur als Verbesserung obendrauf; ohne JS muss die Seite vollständig
  bedienbar bleiben. Kein Endlos-Scrollen, kein Karussell ohne sichtbare Scrollleiste.

## 5. Texte und Sprachen (Deutsch + Englisch, weitere später)

- **Kein Text fest im Code.** Alles über next-intl: `useTranslations('<namensraum>')`. Vorhandene
  Schlüssel wiederverwenden; neue unter dem eigenen Namensraum `"tpl_<template>"` anlegen, **immer in
  beiden Dateien** (`npm run check` prüft das).
- Texte, die aus den Props kommen (Knopftexte im Kaufbereich, `submitLabel`, `legalNote`, Hinweise),
  **wörtlich** übernehmen — viele sind rechtlich vorgegeben.
- Inhalte des Models (Titel, Beschreibungen, Namen, Vorstellungstext) stehen in der Sprache des Models:
  immer `lang={ctx.site.mainLanguage}` am Element. Auf einer englischen Seite stehen so deutsche Inhalte
  neben englischen Bedienelementen — das Layout muss das aushalten.
- Preise über `formatPrice(useFormatter(), cents)`, Daten über `format.dateTime(date, '<format>')` mit den
  Formaten aus `src/kit/formats.ts`, Laufzeiten über `formatDuration()`. Nie selbst formatieren.
- Textlängen variabel planen (andere Sprachen bis 35 % länger). Kein Text in Grafiken.

## 6. Bedienelemente bleiben stehen

- Ein Knopf, Link, Reiter oder Feld verschiebt sich nie, weil etwas nachlädt, erscheint oder betätigt
  wurde. Bedingte Elemente halten ihren Platz (`invisible` statt entfernen) oder stehen dort, wo sie
  nichts verdrängen. Zähler/Badges absolut positionieren.
- Meldungen erscheinen **unterhalb** des auslösenden Elements oder fest in einer Ecke, nie darüber.
- Sprachwahl mit fester Breite; Blätter-Knöpfe auch am Anfang/Ende an ihrem Platz (unsichtbar).

## 7. Inhaltskacheln

- Ecken: Art (Video/Galerie) oben links · Besitz (✓ Gekauft / ✓ Im Abo) oben rechts · Laufzeit + Qualität
  unten rechts · Vorschau-Knopf für Touch unten links · Schloss bei gesperrten Inhalten mittig.
- Vorschaubilder gesperrter Inhalte bleiben **scharf** (kein Weichzeichner).
- Hoch- und Querformat kommen gemischt: feste Kachelform, Bild mit `object-cover`.
- Kleine Kachel → `imageUrl` (400 px), große Kachel/Aufmacher → `imageLargeUrl` (1200 px). Nichts größer
  als 1200 px darstellen.
- Titel bis 160 Zeichen: kürzen mit `line-clamp`/`truncate`, voller Titel als `title`-Attribut.

## 8. Recht (nicht verhandelbar)

- Vor jedem Kauf der Bestätigungsdialog (`ConfirmDialog`) mit dem gelieferten Knopftext und Hinweis.
- 18+-Abfrage als schlichtes Formular, mit Sprachwahl und Links zu Impressum/Datenschutz/AGB.
- Impressum, Datenschutz, AGB auf jeder Seite in der Fußzeile.
- Preise als Endpreise, so wie formatiert geliefert. Keine Countdown-/Druck-Elemente, die nicht in den
  Daten stehen.

## 9. Module und leere Zustände

- Fehlt ein Modul (`ctx.site.modules`) oder ist eine Liste leer, verschwindet der Baustein ohne Lücke.
  Kein Platzhalter, kein „bald verfügbar". Jede Seite in den Szenarien `minimal` und `leer` prüfen.
- Menü mit 1 bis ca. 12 Punkten, auch mit langen Namen eigener Seiten.

## 10. Qualität

- Responsiv ab 360 px Breite, geprüft bei 375 / 768 / 1280 px. Tailwind-Breakpoints (`sm` 640, `lg` 1024).
- Barrierefreiheit: sinnvolle Überschriften-Reihenfolge, `alt=""` bei Schmuckbildern, sichtbarer Fokus,
  Bedienung per Tastatur, `aria-current`/`aria-selected` an Menü und Reitern.
- Animationen sparsam, `prefers-reduced-motion` respektieren.
- Vor jeder Abgabe: `npm run check` und `npm run build` fehlerfrei; jede Seite in allen Szenarien,
  Farbwelten und beiden Sprachen angesehen; jede Aktion doppelt geklickt.
