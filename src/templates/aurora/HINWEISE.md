# Hinweise zum Template „Aurora"

Nachtlicht-Studio: schwebende Glas-Kopfzeile, randloses Titelbild mit großem Namen, Story-Ring und Highlights,
Reihe „Empfohlen" + Raster „Neueste", Pillen für Chips/Filter. Ecken folgen dem Radius der Farbwelt
(Karten `rounded-xl`, Knöpfe/Felder `rounded-lg`, Chips/Badges/Avatare `rounded-full` wie im Basis-Template).
Nur Token-Klassen; feste Farben nur für Zustände (grün/gelb/rot/blau), Bild-Overlays (`bg-black/…`) und die
18+-Abfrage — dieselben Zustandsfarben wie im Basis-Template.

## Was im Vertrag fehlt

- **Vollständige Städteliste für den Event-Filter.** `cityFilter` liefert keine Städte; Aurora bildet die
  Stadt-Pillen aus den gelieferten Terminen. Ist ein Filter aktiv, kommen nur noch Termine dieser Stadt —
  die anderen Pillen verschwinden (zurück über „Alle"). Vorschlag: `cityFilter.cities: string[]` (alle Städte
  mit Terminen, unabhängig vom Filter).

- **Datumsteile für Kalenderblätter** (Events): Wochentag, Tag, Monat einzeln. In `formats.ts` gibt es nur
  zusammengesetzte Formate. Aurora nutzt deshalb next-intl mit Inline-Optionen
  (`format.dateTime(d, { day: 'numeric' })`, `{ weekday: 'short' }`, `{ month: 'short' }`,
  `{ month: 'long', year: 'numeric' }`, `{ hour, minute }`). Vorschlag: benannte Formate `day`,
  `weekdayShort`, `monthShort`, `monthYear`, `time` ergänzen.

- **Story: volles Bild pro Moment.** `MomentCard` hat nur `thumbUrl` (Kreisbild, 160 px). Die Story-Ansicht
  zeigt dieses Bild groß (bei echten Fotos unscharf). Vorschlag: `mediaUrl` (Bild/Video im Hochformat) und
  `createdAt`. Optional `seen: boolean`, damit „Gesehen" dauerhaft bleibt (siehe Story unten).

- **Zuordnung von Meldungen.** `flash` sagt nicht, zu welchem Wunsch/Element eine Meldung gehört. Aurora zeigt
  die Meldung der Wunschliste deshalb fest unten in der Ecke (Regel 6 erlaubt „fest in einer Ecke").

- **Kit, nicht Aurora-spezifisch:** `RichText` filtert die `data:`-Bild-URL der Beispieldaten heraus (leeres
  Bild in „Über mich", Warnung im Dev-Server) — tritt auch im Basis-Template auf. Außerdem fehlt ein
  `favicon.ico` (404 in der Vorschau).

## Klicks bleiben an der Stelle (ohne JavaScript)

Zahlungsart, Filter, Suche, Blättern, Betrag wählen laden die Seite neu (Links/Formulare, Regel 4) — ohne
Gegenmaßnahme landet man danach oben. Aurora hängt deshalb an die **gelieferten** Links/Formularziele ein
Sprungziel an (`keep(href, anker)` in `bausteine/ui.tsx`; Links mit eigenem `#` bleiben unverändert). Der
Browser springt nach dem Neuladen wieder an die Stelle (auch nach POST + Weiterleitung, weil Browser das
Sprungziel bei Weiterleitungen übernehmen):

| Seite | Sprungziel | angehängt an |
| --- | --- | --- |
| Wunschliste | `#wunsch-<id>` | Zahlungsart-Chips, Unterstützen-Formular |
| Inhalt | `#kaufen` | Zahlungsart-Chips im Kaufbereich |
| Abos | `#plan-<id>` | Zahlungsart-Chips der Laufzeit (hält zugleich die gewählte Laufzeit) |
| Bundles | `#bundle-<id>` | Zahlungsart-Chips |
| Auktion (gewonnen) | `#bezahlen` | Zahlungsart-Chips |
| Anfragen | `#anfrage-<id>` | Zahlungsart-Chips |
| Guthaben | `#aufladen` | Beträge, −/+, Zahlungsart-Chips |
| Startseite | `#neueste` | Filter, Suche, Blättern |
| Events | `#termine` | Stadt-Pillen, „Alle", Stadtsuche |

`PurchasePanel` und `MethodChips` haben dafür eine zusätzliche, optionale Eigenschaft `anchor` (ohne sie
verhalten sie sich wie im Vertrag). Angesprungene Karten nutzen `overflow-clip` statt `overflow-hidden`:
Mit `overflow-hidden` wird die Karte selbst zum Scroll-Container und Chrome ignoriert ihren `scroll-margin`
(die Karte läge dann unter der Kopfzeile). Besser wäre langfristig, wenn die Plattform die Sprungziele gleich
mitliefert — dann kann `keep()` entfallen.

## Abweichungen vom Basis-Template

Alle Seiten und Bausteine sind neu gestaltet; der **Aufbau** folgt dem Basis-Template, wo nicht anders genannt.

- **Kopfzeile:** schwebende Glasleiste mit Pillen-Menü; mobil `<details>`-Menü. Glas als eigenes Element
  hinter der Leiste, damit `backdrop-filter` das fest positionierte Mobilmenü nicht einfängt.
- **Startseite:** Titelbild randlos hinter der Kopfzeile, großer Name, Kennzahlen, Abo-Knopf; Vorstellung mit
  „Mehr lesen" (`<details>`); Story-Ring + Highlights (Momente); Reihe „Empfohlen" (hervorgehobene Inhalte,
  waagrecht mit sichtbarer Scrollleiste); Raster „Neueste" mit Filter-Pillen, Suche und Blättern
  (Platzhalter hält die Knöpfe an ihrem Platz).
- **Inhaltskachel:** Ecken wie vorgegeben (Art, Besitz/Preis, Laufzeit, Vorschau-Knopf, Schloss); zusätzlich
  Hover-Leiste „Freischalten/Ansehen" (nur bei Maus) und Zeile „oder im Paket …", wenn es Preis und Paket gibt.
- **Inhaltsseite:** zwei Spalten, Kaufkarte läuft ab 1024 px mit; gesperrte Vorschau scharf mit Schloss;
  „Mehr von …" (`related`, max. 4).
- **Kaufbereich / Dialog:** Knöpfe volle Breite und umbrechend (keine feste Höhe) — lange, rechtlich
  vorgegebene Knopftexte laufen nicht über; Dialog auf dem Handy als Blatt von unten.
- **Abos:** Laufzeiten als wählbare Karten, Kaufbereich der gewählten Laufzeit darunter. Auswahl ohne
  JavaScript über `#plan-<id>` + `:target`/`:has()`. Ohne Sprungziel ist je Stufe die erste Laufzeit gewählt,
  deren Kaufbereich nicht „bereit" ist (Fehler, Überweisung offen …), sonst die erste. „Beliebt" auf der
  teuersten Stufe (nur bei mehreren Stufen).
- **Bundles:** Collage der enthaltenen Inhalte (`bundle.items`; ohne Items Farbverlauf).
- **Wunschliste:** große Beträge, Fortschritt im Markenverlauf, Top-Unterstützer; Meldung fest unten in der
  Ecke (siehe oben).
- **Events:** „Triff … live." mit nächstem Termin groß, Stadt-Pillen (je ein GET-Formular des Stadtfilters),
  Monats-Zeitleiste mit Kalenderblättern, Tickets/Kalender/Karte direkt am Termin.
- **Auktionen:** Karten mit Bild (`imageUrl`, sonst Verlauf mit Symbol), großes aktuelles Gebot.
- **Anfragen:** Formular links, Verlauf wie ein Chat rechts.
- **Eigene Seiten** (aktiver Menüpunkt `page:…`, z. B. „Über mich"): Titelband, Profilkopf, Abo-Karte;
  Rechtstexte bleiben eine schlichte Lesespalte.
- **Konto:** Aufbau wie Basis; Guthaben als große Karte. Aufladen-Knopf wird bei nicht bereitem Kauf als
  deaktivierter Knopf gezeigt (statt Link auf `#`).
- **18+-Abfrage:** schwarz mit Lichtschein, Sprachwahl oben, Rechtslinks; Formular wie vorgegeben.
- **Fehlerseite:** „404" als große Zahl.
- **Farbwelten:** Grundflächen wie Plattform, Markenfarbe/Akzent eigen. Einzige Abweichung: **Verspielt
  `mutedText` `#9d7e92` → `#7f6275`** — der Plattformwert erreicht auf `#fff5fa` nur 3,4 : 1 (Soll 4,5).
- **Farbvariablen:** Verläufe/Ringe nutzen `var(--primary)` / `var(--accent)`, nicht `var(--color-primary)` —
  Letztere wird durch `@theme inline` schon auf `:root` aufgelöst und zeigt in der Seite immer den Standardwert.

## Vorschläge über den heutigen Umfang hinaus

- **Story + Highlights** (`bausteine/story-viewer.tsx`, einzige Client-Komponente, nur Verbesserung): Profilbild
  mit drehendem Ring und „Story"-Label öffnet die Story (alle Momente → neuester Inhalt → Abo-Folie); die
  Highlight-Kreise öffnen dieselbe Ansicht an ihrer Stelle. Tippen links/rechts, Halten = Pause, nach unten
  wischen = schließen, Pfeiltasten/Esc, 5 s pro Folie, `prefers-reduced-motion` beachtet. Gesehene Ringe
  werden grau („Gesehen") — nur solange die Seite offen ist, ohne Speicher (keine eigene Datenhaltung).
  **Ohne JavaScript** bleiben Ring und Kreise die normalen Links (`href` des Moments). Gesperrte Momente:
  scharfes Bild, Schloss, „Mit Abo ansehen" (`ctx.links.subscriptions`).
- Eigene, selbst gehostete Webschrift (derzeit Systemschrift) — Mehraufwand, nur nach Absprache.

## Neue Texte (Namensraum `tpl_aurora`, 64 Schlüssel)

Dachzeilen je Seite; „Mehr lesen/Weniger"; Kennzahl-Labels (Plural); „Empfohlen/Neueste" mit Unterzeilen;
„Nächster Termin", „Live erleben", Termine/Städte-Zähler, „Kalender", „Karte", „Alle"; „Alle
Events/Auktionen"; „Beliebt", „Ausgewählt", „Auswählen", „Wähle deine Laufzeit", „Verlängern"; „oder",
„von {amount}", „Dein Angebot"; „Freischalten/Ansehen"; Story/Highlights („Story", „Gesehen", „Story von
{name}", „Neu hochgeladen", „Jetzt ansehen", „Voller Zugang ab {price}.", „Abo wählen", „Nur für Mitglieder",
„Mit Abo ansehen", „Highlights"). Keine vorhandenen Schlüssel geändert.

## Bekannte Einschränkungen

- Event-Filter: Bei aktivem Filter sind nur „Alle" und die gewählte Stadt als Pille da (siehe Vertrag).
- Story-Bilder unscharf, solange nur `thumbUrl` (160 px) geliefert wird.
- Ohne Webschrift (Systemschrift, fette Gewichte).

## Geprüft

- `npm run check` und `npm run build` fehlerfrei.
- Alle 24 Seiten × 5 Szenarien (375 px), × 7 Farbwelten inkl. „Eigene Farben" (1280 px), Englisch (768 px),
  360 px: kein waagrechtes Überlaufen, keine JS-Fehler, keine fehlgeschlagenen Anfragen; Kontrast aller
  Farbwelten ≥ 4,5.
- **Ohne JavaScript** durchgeklickt: mobiles Menü, Filter, Suche, Blättern, Sprachwahl, 18+-Abfrage, Kauf bis
  zum Bestätigungsdialog, Abo-Laufzeit + Zahlungsart, Wunsch unterstützen, Stadtfilter, Guthaben-Betrag,
  Story-Links — alles funktioniert, und die Seite bleibt jeweils an der Stelle.
- Doppelklick: Zahlungsart-Chips, Filter, Blättern verschieben sich nicht (Häkchen-Platz reserviert).

## Dateien außerhalb von `src/templates/aurora/`

- `messages/de.json`, `messages/en.json` — nur Namensraum `tpl_aurora` ergänzt.
- `src/templates/registry.ts` — Eintrag `aurora` (in der Abgabe: `{ basis, aurora }`).
- **Nur zur Präsentation, nicht Teil der Abgabe** (im Repo, nicht im ZIP): `src/app/page.tsx`,
  `design-wahl.tsx`, `feedback.tsx`, `feedback-items.ts`, `praesentation-i18n.ts` (Design-Auswahl +
  Rückmelde-Liste unter `/`, Sprachwahl Deutsch/Englisch/Slowakisch über `?l=`),
  `src/app/uebersicht/page.tsx` (Kit-Übersicht nach `/uebersicht` verschoben),
  `src/app/rotlicht/[[...seite]]/page.tsx` + `public/demo/rotlicht/` (Beispiel mit CC0-Fotos unter
  `/rotlicht`), `src/proxy.ts` (Matcher um `/rotlicht` ergänzt). `src/kit/`, `src/mock/` und
  `src/templates/basis/` sind unverändert.
