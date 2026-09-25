/** Checkliste für die Abstimmung mit dem Entwickler (nur Präsentation) — Deutsch, Englisch, Slowakisch. */

import type { Lang } from './praesentation-i18n';

type T = Record<Lang, string>;

export type FeedbackItem = {
  id: string;
  title: T;
  text: T;
  /** Vorschau-Link zum Ansehen (ohne Sprache — wird beim Anzeigen ergänzt). */
  href?: string;
  /** Nötige Änderung an Plattform/Vertrag — leer = reines Frontend mit dem vorhandenen Vertrag. */
  backend?: T;
};

export type FeedbackGroup = { title: T; items: FeedbackItem[] };

const v = (page: string, q = '', w = 'gothic') => `/v/aurora/${page}?s=voll&w=${w}${q}`;
const same = (s: string): T => ({ de: s, en: s, sk: s });

export const FEEDBACK: FeedbackGroup[] = [
  {
    title: { de: 'Grundlagen', en: 'Basics', sk: 'Základy' },
    items: [
      {
        id: 'paket',
        href: '/',
        title: { de: 'Ein Design-Paket „Aurora" mit 6 Farbwelten', en: 'One design package "Aurora" with 6 colour worlds', sk: 'Jeden dizajnový balík „Aurora" so 6 farebnými svetmi' },
        text: {
          de: 'Dunkel & Gruftig, Verspielt, Rotlicht, Technisch, Pompös, Hell & Klar. Grundflächen wie Plattform, eigene Markenfarbe und Akzent. Kontrast überall ≥ 4,5.',
          en: 'Dark & Gothic, Playful, Red Light, Tech, Royal, Light & Clear. Base surfaces as on the platform, own brand and accent colour. Contrast ≥ 4.5 everywhere.',
          sk: 'Tmavý & gotický, Hravý, Červené svetlo, Technický, Pompézny, Svetlý & čistý. Základné plochy ako na platforme, vlastná farba značky a akcent. Kontrast všade ≥ 4,5.'
        }
      },
      {
        id: 'playful-muted',
        href: v('Home', '', 'playful'),
        title: { de: 'Abweichung: Verspielt — grauer Text dunkler', en: 'Deviation: Playful — grey text darker', sk: 'Odchýlka: Hravý — sivý text tmavší' },
        text: {
          de: 'mutedText #9d7e92 → #7f6275, weil der Plattformwert nur 3,4 : 1 Kontrast erreicht (Soll 4,5).',
          en: 'mutedText #9d7e92 → #7f6275, because the platform value only reaches 3.4 : 1 contrast (target 4.5).',
          sk: 'mutedText #9d7e92 → #7f6275, lebo hodnota platformy dosahuje len kontrast 3,4 : 1 (cieľ 4,5).'
        }
      },
      {
        id: 'kopfzeile',
        href: v('Home'),
        title: { de: 'Schwebende Glas-Kopfzeile mit Pillen-Menü', en: 'Floating glass header with pill menu', sk: 'Plávajúca sklenená hlavička s menu v tvare piluliek' },
        text: {
          de: 'Menü, Sprache, Guthaben, Glocke, Konto in einer Glasleiste. Mobil als aufklappbares Menü ohne JavaScript (<details>).',
          en: 'Menu, language, balance, bell and account in one glass bar. On mobile a fold-out menu without JavaScript (<details>).',
          sk: 'Menu, jazyk, kredit, zvonček a účet v jednej sklenenej lište. Na mobile rozbaľovacie menu bez JavaScriptu (<details>).'
        }
      },
      {
        id: 'ecken',
        href: v('Subscriptions', '', 'tech'),
        title: { de: 'Ecken folgen dem Radius der Farbwelt', en: 'Corners follow the colour world radius', sk: 'Rohy sa riadia zaoblením farebného sveta' },
        text: {
          de: 'Karten, Knöpfe und Felder nutzen rounded-lg/xl (Technisch fast eckig, Verspielt rund). Chips, Badges, Avatare bleiben rund wie im Basis-Template.',
          en: 'Cards, buttons and fields use rounded-lg/xl (Tech almost square, Playful round). Chips, badges and avatars stay round as in the base template.',
          sk: 'Karty, tlačidlá a polia používajú rounded-lg/xl (Technický takmer hranatý, Hravý okrúhly). Čipy, odznaky a avatary zostávajú okrúhle ako v základnej šablóne.'
        }
      },
      {
        id: 'schrift',
        title: { de: 'Systemschrift (keine Webschrift)', en: 'System font (no web font)', sk: 'Systémové písmo (žiadne webové písmo)' },
        text: {
          de: 'Fette Gewichte der Systemschrift. Eine eigene, selbst gehostete Schrift wäre möglich (Mehraufwand).',
          en: 'Bold weights of the system font. A custom, self-hosted font would be possible (extra effort).',
          sk: 'Tučné rezy systémového písma. Vlastné, samostatne hostované písmo by bolo možné (viac práce).'
        }
      },
      {
        id: 'ohne-js',
        title: { de: 'Alles funktioniert ohne JavaScript', en: 'Everything works without JavaScript', sk: 'Všetko funguje bez JavaScriptu' },
        text: {
          de: 'Menü, Filter, Suche, Blättern, Abo-Auswahl, Zahlungsart, Dialog: Links und Formulare. Nach dem Klick bleibt die Seite an der Stelle. JavaScript nur als Verbesserung (Story).',
          en: 'Menu, filters, search, paging, plan choice, payment method, dialog: links and forms. After a click the page stays in place. JavaScript only as an enhancement (story).',
          sk: 'Menu, filtre, vyhľadávanie, stránkovanie, výber predplatného, spôsob platby, dialóg: odkazy a formuláre. Po kliknutí stránka zostane na mieste. JavaScript len ako vylepšenie (story).'
        }
      }
    ]
  },
  {
    title: { de: 'Startseite', en: 'Home page', sk: 'Úvodná stránka' },
    items: [
      {
        id: 'hero',
        href: v('Home'),
        title: { de: 'Hero: Titelbild randlos hinter der Kopfzeile', en: 'Hero: full-bleed cover behind the header', sk: 'Hero: titulná fotka bez okrajov za hlavičkou' },
        text: {
          de: 'Großer Name, Kennzahlen als große Zahlen, „Abonnieren – ab …" als Hauptknopf, Abo-Stufen als Pillen.',
          en: 'Big name, key figures as large numbers, "Subscribe – from …" as the main button, subscription tiers as pills.',
          sk: 'Veľké meno, štatistiky ako veľké čísla, „Predplatiť – od …" ako hlavné tlačidlo, úrovne predplatného ako pilulky.'
        }
      },
      {
        id: 'story',
        href: '/rotlicht',
        title: { de: 'Story am Profilbild (wie Instagram)', en: 'Story on the profile picture (like Instagram)', sk: 'Story na profilovej fotke (ako na Instagrame)' },
        text: {
          de: 'Drehender Farbring + „Story"-Label. Öffnet Vollbild-Story: alle Momente → neuester Inhalt → Abo-Folie. Tippen links/rechts, Halten = Pause, nach unten wischen = schließen, 5 s pro Folie. Danach Ring grau + „Gesehen".',
          en: 'Spinning colour ring + "Story" label. Opens a full-screen story: all moments → newest content → subscription slide. Tap left/right, hold = pause, swipe down = close, 5 s per slide. Afterwards the ring turns grey + "Seen".',
          sk: 'Otáčajúci sa farebný krúžok + štítok „Story". Otvorí story na celú obrazovku: všetky momenty → najnovší obsah → snímka s predplatným. Ťuknutie vľavo/vpravo, podržanie = pauza, potiahnutie nadol = zavrieť, 5 s na snímku. Potom je krúžok sivý + „Videné".'
        },
        backend: {
          de: 'Empfohlen: MomentCard.mediaUrl (Bild/Video im Hochformat, derzeit nur 160-px-Kreisbild) und createdAt. Optional MomentCard.seen, damit „Gesehen" dauerhaft bleibt (derzeit nur solange die Seite offen ist).',
          en: 'Recommended: MomentCard.mediaUrl (portrait image/video; currently only a 160 px circle image) and createdAt. Optional MomentCard.seen so "Seen" persists (currently only while the page is open).',
          sk: 'Odporúčané: MomentCard.mediaUrl (obrázok/video na výšku, teraz len 160 px okrúhly obrázok) a createdAt. Voliteľne MomentCard.seen, aby „Videné" zostalo natrvalo (teraz len kým je stránka otvorená).'
        }
      },
      {
        id: 'highlights',
        href: '/rotlicht',
        title: { de: 'Highlights (Momente-Kreise) öffnen die Story', en: 'Highlights (moment circles) open the story', sk: 'Highlights (krúžky momentov) otvárajú story' },
        text: {
          de: 'Gleicher Ring wie die Story, öffnen die Story an ihrer Stelle. Gesperrte Momente: scharfes Bild, Schloss, „Mit Abo ansehen".',
          en: 'Same ring as the story, they open the story at their position. Locked moments: sharp image, lock, "Watch with subscription".',
          sk: 'Rovnaký krúžok ako story, otvoria story na svojom mieste. Zamknuté momenty: ostrý obrázok, zámok, „Pozrieť s predplatným".'
        },
        backend: { de: 'Wie Story (mediaUrl).', en: 'Same as story (mediaUrl).', sk: 'Ako pri story (mediaUrl).' }
      },
      {
        id: 'intro',
        href: v('Home'),
        title: { de: 'Vorstellungstext mit „Mehr lesen"', en: 'Intro text with "Read more"', sk: 'Predstavenie s „Čítať viac"' },
        text: { de: 'Lange Texte aufklappbar (ohne JavaScript).', en: 'Long texts can be expanded (without JavaScript).', sk: 'Dlhé texty sa dajú rozbaliť (bez JavaScriptu).' }
      },
      {
        id: 'empfohlen',
        href: v('Home'),
        title: { de: 'Reihe „Empfohlen" (Highlights des Models)', en: '"Recommended" row (the model\'s highlights)', sk: 'Rad „Odporúčané" (highlights modelky)' },
        text: {
          de: 'Hervorgehobene Inhalte groß in einer waagrechten Reihe mit sichtbarer Scrollleiste.',
          en: 'Featured content shown large in a horizontal row with a visible scrollbar.',
          sk: 'Zvýraznený obsah veľký vo vodorovnom rade s viditeľným posuvníkom.'
        }
      },
      {
        id: 'neueste',
        href: v('Home'),
        title: { de: 'Raster „Neueste" mit Filter-Pillen und Suche', en: '"Newest" grid with filter pills and search', sk: 'Mriežka „Najnovšie" s filtrami a vyhľadávaním' },
        text: {
          de: 'Alle / Videos / Galerien, Suche rechts, Blättern mit festen Knöpfen.',
          en: 'All / Videos / Galleries, search on the right, paging with fixed buttons.',
          sk: 'Všetko / Videá / Galérie, vyhľadávanie vpravo, stránkovanie s pevnými tlačidlami.'
        }
      }
    ]
  },
  {
    title: { de: 'Inhalte & Kauf', en: 'Content & purchase', sk: 'Obsah & nákup' },
    items: [
      {
        id: 'kachel',
        href: v('Home'),
        title: { de: 'Inhaltskachel (ContentCard)', en: 'Content tile (ContentCard)', sk: 'Dlaždica obsahu (ContentCard)' },
        text: {
          de: 'Art oben links, Besitz/Preis oben rechts, Laufzeit unten rechts, Vorschau-Knopf unten links, Schloss mittig. Hover: „Freischalten/Ansehen"-Leiste. Darunter „oder im Paket …".',
          en: 'Type top left, ownership/price top right, duration bottom right, preview button bottom left, lock in the centre. Hover: "Unlock/Watch" bar. Below: "or in package …".',
          sk: 'Typ vľavo hore, vlastníctvo/cena vpravo hore, dĺžka vpravo dole, tlačidlo náhľadu vľavo dole, zámok v strede. Pri prejdení myšou: lišta „Odomknúť/Pozrieť". Pod tým „alebo v balíku …".'
        }
      },
      {
        id: 'inhaltsseite',
        href: v('ContentDetail', '&inhalt=sommer-garten'),
        title: { de: 'Inhaltsseite zweispaltig mit mitlaufender Kaufkarte', en: 'Two-column content page with sticky purchase card', sk: 'Stránka obsahu v dvoch stĺpcoch s pohyblivou nákupnou kartou' },
        text: {
          de: 'Gesperrte Vorschau scharf mit Schloss, rechts Kauf/Abo. Freigeschaltet: Player, Download, „Mehr von …".',
          en: 'Locked preview stays sharp with a lock, purchase/subscription on the right. Unlocked: player, download, "More from …".',
          sk: 'Zamknutý náhľad ostrý so zámkom, vpravo nákup/predplatné. Odomknuté: prehrávač, stiahnutie, „Viac od …".'
        }
      },
      {
        id: 'kaufbereich',
        href: v('ContentDetail', '&inhalt=sommer-garten&kauf=pending_transfer'),
        title: { de: 'Kaufbereich (PurchasePanel) im Aurora-Stil', en: 'Purchase area (PurchasePanel) in Aurora style', sk: 'Nákupná časť (PurchasePanel) v štýle Aurora' },
        text: {
          de: 'Guthaben-Kauf, Zahlungsarten als Pillen, Bankdaten-Box. Knopftexte wörtlich aus den Props, brechen um statt abgeschnitten zu werden.',
          en: 'Buying with balance, payment methods as pills, bank details box. Button texts verbatim from the props; they wrap instead of being cut off.',
          sk: 'Nákup z kreditu, spôsoby platby ako pilulky, box s bankovými údajmi. Texty tlačidiel doslovne z props, zalomia sa namiesto orezania.'
        }
      },
      {
        id: 'dialog',
        href: v('ContentDetail', '&inhalt=sommer-garten&dialog=inhalt-sommer-garten'),
        title: { de: 'Bestätigungsdialog als Blatt von unten (mobil)', en: 'Confirmation dialog as a bottom sheet (mobile)', sk: 'Potvrdzovací dialóg ako panel zdola (mobil)' },
        text: { de: 'Desktop mittig, Handy von unten.', en: 'Centred on desktop, from the bottom on phones.', sk: 'Na počítači v strede, na mobile zdola.' }
      }
    ]
  },
  {
    title: { de: 'Abos, Bundles, Wünsche', en: 'Subscriptions, bundles, wishes', sk: 'Predplatné, balíčky, priania' },
    items: [
      {
        id: 'abos',
        href: v('Subscriptions'),
        title: { de: 'Abos: Laufzeiten als wählbare Karten', en: 'Subscriptions: durations as selectable cards', sk: 'Predplatné: obdobia ako karty na výber' },
        text: {
          de: 'Kaufbereich der gewählten Laufzeit erscheint darunter. Auswahl ohne JavaScript über Anker (#plan-…); der Anker wird an die Zahlungsart-Links angehängt, damit die Auswahl beim Wechsel bleibt.',
          en: 'The purchase area of the chosen duration appears below. Selection without JavaScript via anchors (#plan-…); the anchor is added to the payment method links so the choice stays when switching.',
          sk: 'Nákupná časť zvoleného obdobia sa zobrazí pod ním. Výber bez JavaScriptu cez kotvy (#plan-…); kotva sa pridá k odkazom na spôsob platby, aby výber pri zmene zostal.'
        }
      },
      {
        id: 'beliebt',
        href: v('Subscriptions'),
        title: { de: 'Hervorhebung „Beliebt" auf der teuersten Stufe', en: '"Popular" highlight on the most expensive tier', sk: 'Zvýraznenie „Obľúbené" na najdrahšej úrovni' },
        text: { de: 'Nur bei mehreren Stufen.', en: 'Only when there are several tiers.', sk: 'Len pri viacerých úrovniach.' }
      },
      {
        id: 'bundles',
        href: v('Bundles'),
        title: { de: 'Bundles mit Collage der enthaltenen Inhalte', en: 'Bundles with a collage of the included content', sk: 'Balíčky s koláží obsiahnutého obsahu' },
        text: { de: 'Nutzt bundle.items; ohne Items Farbverlauf.', en: 'Uses bundle.items; without items a gradient.', sk: 'Používa bundle.items; bez položiek farebný prechod.' }
      },
      {
        id: 'wuensche',
        href: v('Wishlist'),
        title: { de: 'Wunschliste mit Fortschritt und Unterstützern', en: 'Wishlist with progress and supporters', sk: 'Zoznam prianí s postupom a podporovateľmi' },
        text: {
          de: 'Große Beträge, Fortschrittsbalken im Markenverlauf, Belohnung, Top-Unterstützer. Meldungen fest unten in der Ecke.',
          en: 'Large amounts, progress bar in the brand gradient, reward, top supporters. Messages fixed in the bottom corner.',
          sk: 'Veľké sumy, ukazovateľ postupu vo farbách značky, odmena, top podporovatelia. Hlásenia pevne dole v rohu.'
        }
      }
    ]
  },
  {
    title: { de: 'Events, Auktionen, Anfragen', en: 'Events, auctions, requests', sk: 'Podujatia, aukcie, požiadavky' },
    items: [
      {
        id: 'events',
        href: v('Events'),
        title: { de: 'Events: „Triff … live." mit nächstem Termin', en: 'Events: "Meet … live." with the next date', sk: 'Podujatia: „Stretni … naživo." s najbližším termínom' },
        text: {
          de: 'Nächster Termin groß, Stadt-Pillen (Formulare), Suche, Monats-Zeitleiste mit Kalenderblättern, Tickets/Kalender/Karte direkt am Termin.',
          en: 'Next date shown large, city pills (forms), search, monthly timeline with calendar sheets, tickets/calendar/map right at the date.',
          sk: 'Najbližší termín veľký, mestá ako pilulky (formuláre), vyhľadávanie, časová os po mesiacoch s kalendárnymi lístkami, vstupenky/kalendár/mapa priamo pri termíne.'
        },
        backend: {
          de: 'Empfohlen: benannte Datumsformate day, weekdayShort, monthShort, monthYear, time in formats.ts; vollständige Städteliste cityFilter.cities (bei aktivem Filter verschwinden sonst die anderen Städte).',
          en: 'Recommended: named date formats day, weekdayShort, monthShort, monthYear, time in formats.ts; a complete city list cityFilter.cities (otherwise the other cities disappear while a filter is active).',
          sk: 'Odporúčané: pomenované formáty dátumu day, weekdayShort, monthShort, monthYear, time vo formats.ts; úplný zoznam miest cityFilter.cities (inak ostatné mestá pri aktívnom filtri zmiznú).'
        }
      },
      {
        id: 'auktionen',
        href: v('Auctions'),
        title: { de: 'Auktionen mit Bild und großem Gebot', en: 'Auctions with image and large bid', sk: 'Aukcie s obrázkom a veľkou ponukou' },
        text: {
          de: 'Karten mit Bild, Endzeit, aktuellem Gebot; Detailseite mit Gebotskarte.',
          en: 'Cards with image, end time and current bid; detail page with a bid card.',
          sk: 'Karty s obrázkom, časom konca a aktuálnou ponukou; stránka detailu s kartou na prihadzovanie.'
        }
      },
      {
        id: 'anfragen',
        href: v('Requests'),
        title: { de: 'Wunsch-Anfragen als Chat', en: 'Custom requests as a chat', sk: 'Požiadavky ako chat' },
        text: {
          de: 'Formular links, Verlauf wie ein Chat rechts, Status als farbige Pillen.',
          en: 'Form on the left, history like a chat on the right, status as coloured pills.',
          sk: 'Formulár vľavo, história ako chat vpravo, stav ako farebné pilulky.'
        }
      }
    ]
  },
  {
    title: { de: 'Seiten & Konto', en: 'Pages & account', sk: 'Stránky & účet' },
    items: [
      {
        id: 'ueber',
        href: v('TextPage', '&seite=ueber-mich'),
        title: { de: 'Eigene Seiten („Über mich") mit Profilkopf', en: 'Custom pages ("About me") with profile header', sk: 'Vlastné stránky („O mne") s profilovou hlavičkou' },
        text: {
          de: 'Titelband, Profil, große Überschrift, ruhige Lesespalte, Abo-Karte daneben. Rechtstexte bleiben schlicht.',
          en: 'Cover band, profile, large heading, calm reading column, subscription card beside it. Legal texts stay plain.',
          sk: 'Titulný pás, profil, veľký nadpis, pokojný stĺpec na čítanie, karta predplatného vedľa. Právne texty zostávajú jednoduché.'
        },
        backend: {
          de: 'Kit: RichText filtert die data:-Bild-URL der Beispieldaten heraus (leeres Bild in der Vorschau, auch im Basis-Template).',
          en: 'Kit: RichText filters out the data: image URL of the sample data (empty image in the preview, also in the base template).',
          sk: 'Kit: RichText odfiltruje data: URL obrázka zo vzorových dát (prázdny obrázok v náhľade, aj v základnej šablóne).'
        }
      },
      {
        id: 'konto',
        href: v('Wallet'),
        title: { de: 'Konto: Guthaben-Karte, Aufladen, Profil, Zahlungen', en: 'Account: balance card, top-up, profile, payments', sk: 'Účet: karta kreditu, dobitie, profil, platby' },
        text: { de: 'Aufbau wie Basis, Bausteine im Aurora-Stil.', en: 'Structure as in the base template, building blocks in Aurora style.', sk: 'Štruktúra ako v základnej šablóne, prvky v štýle Aurora.' }
      },
      {
        id: 'anmelden',
        href: v('Login'),
        title: { de: 'Anmelden/Registrieren als Glas-Karte', en: 'Log in/register as a glass card', sk: 'Prihlásenie/registrácia ako sklenená karta' },
        text: { de: 'Alle Anmelde-Seiten im gleichen Stil.', en: 'All login pages in the same style.', sk: 'Všetky prihlasovacie stránky v rovnakom štýle.' }
      },
      {
        id: 'agegate',
        href: v('AgeGate'),
        title: { de: '18+-Abfrage schwarz mit Lichtschein', en: '18+ check in black with a glow', sk: 'Overenie 18+ v čiernej so žiarou' },
        text: {
          de: 'Sprache oben, Eintreten/Verlassen, Rechtslinks. Ohne JavaScript.',
          en: 'Language at the top, enter/leave, legal links. Without JavaScript.',
          sk: 'Jazyk hore, vstúpiť/odísť, právne odkazy. Bez JavaScriptu.'
        }
      },
      {
        id: '404',
        href: v('Message', '&zustand=not_found'),
        title: { de: 'Fehlerseite „404" als große Zahl', en: 'Error page "404" as a large number', sk: 'Chybová stránka „404" ako veľké číslo' },
        text: same('')
      }
    ]
  },
  {
    title: { de: 'Nur zur Präsentation (nicht für die Plattform)', en: 'Presentation only (not for the platform)', sk: 'Len na prezentáciu (nie pre platformu)' },
    items: [
      {
        id: 'praes',
        title: { de: 'Präsentationsseite unter / (Design wählen + Vorschau)', en: 'Presentation page at / (choose design + preview)', sk: 'Prezentačná stránka na / (výber dizajnu + náhľad)' },
        text: {
          de: 'src/app/page.tsx, design-wahl.tsx, feedback.tsx, praesentation-i18n.ts (Deutsch/Englisch/Slowakisch). Kit-Übersicht nach /uebersicht verschoben.',
          en: 'src/app/page.tsx, design-wahl.tsx, feedback.tsx, praesentation-i18n.ts (German/English/Slovak). Kit overview moved to /uebersicht.',
          sk: 'src/app/page.tsx, design-wahl.tsx, feedback.tsx, praesentation-i18n.ts (nemčina/angličtina/slovenčina). Prehľad kitu presunutý na /uebersicht.'
        }
      },
      {
        id: 'rotlicht',
        href: '/rotlicht',
        title: { de: 'Beispiel-Website /rotlicht mit echten Fotos', en: 'Example website /rotlicht with real photos', sk: 'Ukážková stránka /rotlicht so skutočnými fotkami' },
        text: {
          de: 'CC0-Fotos (public/demo/rotlicht, Quellen in QUELLEN.md) statt Platzhaltern, ohne Kit-Leiste. src/proxy.ts kennt /rotlicht.',
          en: 'CC0 photos (public/demo/rotlicht, sources in QUELLEN.md) instead of placeholders, without the kit bar. src/proxy.ts knows /rotlicht.',
          sk: 'Fotky CC0 (public/demo/rotlicht, zdroje v QUELLEN.md) namiesto zástupných obrázkov, bez lišty kitu. src/proxy.ts pozná /rotlicht.'
        }
      },
      {
        id: 'registry',
        title: { de: 'Basis-Template aus der Auswahl genommen', en: 'Base template removed from the selection', sk: 'Základná šablóna odstránená z výberu' },
        text: {
          de: 'registry.ts listet im Repo nur aurora; in der Abgabe { basis, aurora }.',
          en: 'In the repo registry.ts lists only aurora; in the delivery { basis, aurora }.',
          sk: 'V repozitári registry.ts obsahuje len aurora; v odovzdaní { basis, aurora }.'
        }
      }
    ]
  }
];
