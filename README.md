# Template-Kit für die Fan-Seite

**Kit-Fassung 1.0.0 · 25.09.2026**

Mit diesem Kit gestaltest du ein **Template** für die öffentliche Fan-Seite unserer Model-Plattform —
ohne Zugang zur Plattform selbst. Du baust Darstellungs-Komponenten, das Kit liefert Beispieldaten in
allen Zuständen, wir setzen dein Template anschließend in die Plattform ein.

**Fachliche Anforderungen** (was ein Template leisten muss, alle Seiten und Zustände, Recht, Sprachen):
im Dokument **„Template-Briefing für Designer"**, das du mit diesem Kit bekommen hast. Dieses README
erklärt nur die Technik.

## Start

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Dann <http://localhost:3400> öffnen. Die Übersicht zeigt alle Templates, welche Seiten sie schon
liefern, die Szenarien und eine Kontrastprüfung der Farbwelten. Jede Vorschauseite hat **unten** eine
Leiste zum Umschalten von Szenario, Farbwelt, Sprache, Seite und Seitenzustand.

## Aufbau

| Ordner / Datei | Inhalt | Darfst du ändern? |
| --- | --- | --- |
| `src/kit/types.ts` | **Datenvertrag:** alle Daten, die ein Template bekommt | nein |
| `src/kit/template.ts` | **Template-Vertrag:** welche Seiten/Bausteine ein Template liefert, mit welchen Props | nein |
| `src/kit/theme.ts` | Farbwelten, CSS-Variablen, Kontrastprüfung | nein |
| `src/kit/platform/` | Plattform-Bausteine mit festem Verhalten (bewegte Vorschau, Videoplayer, formatierter Text, Formularfelder) | nein — verwenden, nicht nachbauen |
| `src/kit/format.ts`, `formats.ts` | Preise, Laufzeiten, Datumsformate | nein |
| `src/mock/` | Beispieldaten und Szenarien | nein |
| `src/app/` | Vorschau-Anwendung des Kits | nein |
| `src/templates/basis/` | **Basis-Template:** vollständige, schlichte Referenz aller Seiten | nein — kopieren |
| `src/templates/<dein-template>/` | **dein Template** | ja |
| `src/templates/registry.ts` | Liste der Templates (eine Zeile für deins) | ja, nur Eintrag |
| `messages/de.json`, `messages/en.json` | Texte der Oberfläche | ja, nur ergänzen |

Fehlt dir etwas im Vertrag (ein Feld, ein Zustand, ein Text der Plattform), ändere ihn **nicht**,
sondern schreib es in `src/templates/<dein-template>/HINWEISE.md`. Wir klären es und liefern eine neue
Kit-Fassung.

## Eigenes Template anlegen

1. Ordner kopieren: `src/templates/basis` → `src/templates/<name>` (Kleinbuchstaben, z. B. `noir`).
2. In `src/templates/<name>/index.ts`: Export umbenennen, `key` auf `<name>` setzen, `meta` (Name und
   Leitidee auf Deutsch und Englisch) ausfüllen.
3. In `src/templates/registry.ts` eintragen:
   ```ts
   import { noir } from './noir';
   export const TEMPLATES: Record<string, FanTemplate> = { basis, noir };
   ```
4. In der Übersicht erscheint dein Template. Jetzt Seite für Seite gestalten.

Seiten, die du aus dem Template-Objekt entfernst, zeigt die Vorschau vom Basis-Template (die Leiste
unten meldet das). Ein **vollständiges** Template liefert alle Seiten und alle drei Bausteine
(`ContentCard`, `PurchasePanel`, `ConfirmDialog`) — die Übersicht zeigt, was noch fehlt.

## Szenarien und Zustände

Jede Seite muss in allen Szenarien gut aussehen:

| Szenario | Was es zeigt |
| --- | --- |
| `voll` | Angemeldet, alle Module, mehrere Abo-Stufen, Guthaben, Momente |
| `gast` | Abgemeldet, ein Abo, Events |
| `minimal` | Nichts gebucht, kein Abo, kein Titelbild, kein Logo, nur Deutsch |
| `hinweise` | Alle vier Hinweisleisten über der Kopfzeile |
| `leer` | Alle Listen leer |

Dazu je Seite eigene Zustände (Leiste unten), z. B. auf der Inhaltsseite `inhalt=…` (frei, gesperrt,
gekauft, im Abo, Galerie, Hoch-/Querformat, Überlänge), `kauf=…` (alle Zustände des Kaufbereichs) und
`dialog=…` (Bestätigungsdialog).

Formulare funktionieren im Kit: Sie landen bei `/kit/aktion` und kehren mit einer Meldung zurück.

## Prüfen vor der Abgabe

```bash
npm run check   # Typprüfung + gleiche Textschlüssel in de/en
npm run build   # muss fehlerfrei durchlaufen
```

Außerdem:

- Jede Seite in jedem Szenario, jeder Farbwelt (inkl. „Eigene Farben") und beiden Sprachen ansehen.
- Breiten 375, 768 und 1280 px.
- Mit **abgeschaltetem JavaScript** durchklicken: Menü, Filter, Suche, Sprachwahl, 18+-Abfrage, Kauf
  bis zum Dialog müssen funktionieren.
- Jede Aktion **doppelt** klicken: Kein Bedienelement darf sich verschoben haben.
- Übersicht: Alle Kontrastwerte deiner Farbwelten grün.

## Abgabe

Als ZIP (ohne `node_modules` und `.next`):

- `src/templates/<name>/` komplett, inkl. `HINWEISE.md`
- `messages/de.json` und `messages/en.json` (mit deinen Ergänzungen)
- optional Screenshots

Wir setzen das Template danach in die Plattform ein. Deine Komponenten bekommen dort dieselben Props
aus echten Daten — deshalb ist es wichtig, dass sie wirklich nur mit dem Vertrag arbeiten.
