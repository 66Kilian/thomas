# Hinweise zum Template „Aurora"

Nachtlicht-Studio: schwebende Glas-Kopfzeile, randloses Titelbild mit großem Namen, Story-Ring und Highlights,
Reihe „Empfohlen" + Raster „Neueste", Pillen für Chips/Filter. Ecken folgen dem Radius der Farbwelt
(Karten `rounded-xl`, Knöpfe/Felder `rounded-lg`). Nur Token-Klassen; Zustandsfarben wie vorgegeben.

## Was im Vertrag fehlt

- **Datumsteile für Kalenderblätter** (Events): Wochentag, Tag, Monat einzeln. In `formats.ts` gibt es
  nur zusammengesetzte Formate. Aurora nutzt deshalb next-intl mit Inline-Optionen
  (`format.dateTime(d, { day: 'numeric' })`, `{ weekday: 'short' }`, `{ month: 'short' }`,
  `{ month: 'long', year: 'numeric' }`, `{ hour, minute }`). Vorschlag: benannte Formate
  `day`, `weekdayShort`, `monthShort`, `monthYear`, `time` ergänzen.

- **Beispielbild in „Über mich" (Kit):** `RichText` filtert die `data:`-Bild-URL der Beispieldaten heraus
  (leeres `src`, Warnung im Dev-Server) — tritt auch im Basis-Template auf, nicht Aurora-spezifisch.

- **Story: volles Bild pro Moment fehlt.** `MomentCard` hat nur `thumbUrl` (Kreisbild, 160 px). Die Story-Ansicht
  zeigt dieses Bild groß (unscharf bei echten Fotos). Vorschlag: `mediaUrl` (Bild/Video im Hochformat) und
  `createdAt` ergänzen.

## Vorschläge über den heutigen Umfang hinaus

- **Story + Highlights** (`bausteine/story-viewer.tsx`, Client-Komponente als Verbesserung): Avatar mit drehendem
  Ring und „Story"-Label öffnet die Story (alle Momente → neuester Inhalt → Abo-Folie); die Highlight-Kreise
  (Momente) öffnen dieselbe Ansicht an ihrer Stelle. Tippen links/rechts, Halten = Pause, nach unten wischen =
  schließen, Pfeiltasten/Esc, 5 s pro Folie. Gesehene Ringe werden grau („Gesehen") — nur solange die Seite
  offen ist, ohne Speicher (keine eigene Datenhaltung). Dauerhaft „gesehen" bräuchte ein Feld im Vertrag (`seen`). Ohne JavaScript bleiben es die normalen Links (`href` des Moments).

- **Bundle-Vorschau:** Collage der enthaltenen Inhalte (nutzt `bundle.items`; ohne Items Farbverlauf).
- **Weitere Inhalte** auf der Inhaltsseite (`related`, max. 4 Kacheln).
- **Nächster Termin** groß über der Event-Liste; Liste nach Monaten gruppiert.
- **Startseite:** Reihe „Empfohlen" (hervorgehobene Inhalte, waagrecht scrollbar), darunter Raster „Neueste".
- **Eigene Seiten des Models** (aktiver Menüpunkt `page:…`, z. B. „Über mich") mit Profilkopf, Kennzahlen und Abo-Knopf;
  Rechtstexte bleiben eine schlichte Lesespalte.
- **Abos mit Laufzeit-Karten:** Laufzeiten als wählbare Karten; der Kaufbereich der gewählten Laufzeit erscheint
  darunter. Auswahl ohne JavaScript über Anker (`#plan-<id>`, `:target` + `:has()`); die Zahlungsart-Links hängen
  den Anker an, damit die Auswahl beim Wechsel erhalten bleibt. Ohne Anker ist je Stufe die erste Laufzeit
  gewählt, deren Kaufbereich nicht „bereit" ist (Fehler, Überweisung offen …), sonst die erste.
- **Auktionen mit Bild** (nutzt `imageUrl`, sonst Farbverlauf mit Symbol).
- **Hervorhebung „Beliebt"** auf der teuersten Abo-Stufe (nur bei mehreren Stufen).
- Fehlerseite „404" als große Zahl.

## Farbwelten

Grundflächen wie Plattform, Markenfarbe/Akzent eigen. Einzige Abweichung: **Playful `mutedText`
`#9d7e92` → `#7f6275`** — der Plattformwert erreicht auf `#fff5fa` nur 3,4 : 1 (AA verlangt 4,5).

## Neue Texte (Namensraum `tpl_aurora`)

Dachzeilen je Seite, „Mehr lesen/Weniger", „Im Rampenlicht", „Alle Inhalte", Kennzahl-Labels (Plural),
„Nächster Termin", „Alle Events/Auktionen", „Beliebt", „oder", Fortschritt „von {amount}", „Dein Angebot".

## Farbvariablen

Verläufe/Ringe nutzen `var(--primary)` / `var(--accent)`, nicht `var(--color-primary)`: Letztere wird durch
`@theme inline` schon auf `:root` aufgelöst und zeigt deshalb in der Seite immer den Standardwert.

## Bekannte Einschränkungen

- Konto-Seiten (Profil, Zahlungen, Guthaben, Benachrichtigungen, Anmelden …) übernehmen den Aufbau
  des Basis-Templates, aber alle Grundbausteine (Knöpfe, Felder, Karten, Kästen) im Aurora-Stil.
- Ohne Webschrift (Systemschrift, fette Gewichte); eine eigene Schrift wäre möglich (Mehraufwand).

## Nur zur Präsentation (nicht Teil der Abgabe)

- `src/app/page.tsx` + `design-wahl.tsx` + `feedback.tsx`/`feedback-items.ts` — Präsentationsseite (mit Rückmelde-Checkliste) unter `/`: Design (Farbwelt) wählen,
  Seite wählen, Live-Vorschau (Desktop + Handy), „Design öffnen"; alle Zustände eingeklappt als Links.
- `src/app/uebersicht/page.tsx` — die bisherige Kit-Übersicht, verschoben von `/` nach `/uebersicht`.
- `src/app/rotlicht/[[...seite]]/page.tsx` + `public/demo/rotlicht/` — Beispiel-Website im Stil „Rotlicht"
  unter `/rotlicht`: Beispieldaten, aber echte Fotos (CC0, Quellen in `public/demo/rotlicht/QUELLEN.md`)
  statt Platzhaltern, ohne Kit-Leiste. `src/proxy.ts` kennt dafür zusätzlich `/rotlicht`.
- `src/templates/registry.ts` — listet nur `aurora`; das Basis-Template bleibt im Code (Ersatz für fehlende
  Seiten in der Vorschau), wird aber nicht mehr angeboten.

Alle können beim Einsetzen in die Plattform auf den Stand des Kits zurückgesetzt werden.
