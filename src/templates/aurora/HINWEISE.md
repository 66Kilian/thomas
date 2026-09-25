# Hinweise zum Template „Aurora"

Nachtlicht-Studio: schwebende Glas-Kopfzeile, randloses Titelbild mit großem Namen, Momente-Ring,
Bento „Im Rampenlicht", Pillen-Bedienelemente, große Radien. Nur Token-Klassen; Zustandsfarben wie vorgegeben.

## Was im Vertrag fehlt

- **Datumsteile für Kalenderblätter** (Events): Wochentag, Tag, Monat einzeln. In `formats.ts` gibt es
  nur zusammengesetzte Formate. Aurora nutzt deshalb next-intl mit Inline-Optionen
  (`format.dateTime(d, { day: 'numeric' })`, `{ weekday: 'short' }`, `{ month: 'short' }`,
  `{ month: 'long', year: 'numeric' }`, `{ hour, minute }`). Vorschlag: benannte Formate
  `day`, `weekdayShort`, `monthShort`, `monthYear`, `time` ergänzen.

- **Beispielbild in „Über mich" (Kit):** `RichText` filtert die `data:`-Bild-URL der Beispieldaten heraus
  (leeres `src`, Warnung im Dev-Server) — tritt auch im Basis-Template auf, nicht Aurora-spezifisch.

## Vorschläge über den heutigen Umfang hinaus

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

## Bekannte Einschränkungen

- Konto-Seiten (Profil, Zahlungen, Guthaben, Benachrichtigungen, Anmelden …) übernehmen den Aufbau
  des Basis-Templates, aber alle Grundbausteine (Knöpfe, Felder, Karten, Kästen) im Aurora-Stil.
- Ohne Webschrift (Systemschrift, fette Gewichte); eine eigene Schrift wäre möglich (Mehraufwand).

## Nur zur Präsentation (nicht Teil der Abgabe)

- `src/app/page.tsx` + `src/app/design-wahl.tsx` — Präsentationsseite unter `/`: Design (Farbwelt) wählen,
  Seite wählen, Live-Vorschau (Desktop + Handy), „Design öffnen"; alle Zustände eingeklappt als Links.
- `src/app/uebersicht/page.tsx` — die bisherige Kit-Übersicht, verschoben von `/` nach `/uebersicht`.
- `src/app/rotlicht/[[...seite]]/page.tsx` + `public/demo/rotlicht/` — Beispiel-Website im Stil „Rotlicht"
  unter `/rotlicht`: Beispieldaten, aber echte Fotos (CC0, Quellen in `public/demo/rotlicht/QUELLEN.md`)
  statt Platzhaltern, ohne Kit-Leiste. `src/proxy.ts` kennt dafür zusätzlich `/rotlicht`.
- `src/templates/registry.ts` — listet nur `aurora`; das Basis-Template bleibt im Code (Ersatz für fehlende
  Seiten in der Vorschau), wird aber nicht mehr angeboten.

Alle können beim Einsetzen in die Plattform auf den Stand des Kits zurückgesetzt werden.
