import type { Metadata } from 'next';

import { DesignWahl } from './design-wahl';
import { Feedback } from './feedback';
import { LANG_NAMES, LANGS, previewLang, toLang, UI, type Lang } from './praesentation-i18n';

/**
 * Präsentation der Designs (Startseite des Kits). Nur zum Zeigen — nicht Teil der Abgabe.
 * Sprache der Seite über `?l=de|en|sk` (Auswahl oben rechts, funktioniert ohne JavaScript).
 * Die technische Kit-Übersicht liegt unter /uebersicht.
 */

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = toLang((await searchParams).l);
  return { title: UI[lang].metaTitle, robots: { index: false } };
}

function more(lang: Lang) {
  const t = UI[lang];
  const pl = `&lang=${previewLang(lang)}`;
  const v = (page: string, q = '', s = 'voll') => `/v/aurora/${page}?s=${s}&w=gothic${q}${pl}`;
  return [
    { title: t.groups[0], links: (['voll', 'minimal', 'gast', 'hinweise', 'leer'] as const).map((s, i) => [t.home[i], v('Home', '', s)] as [string, string]) },
    {
      title: t.groups[1],
      links: [
        [t.parts[0], v('Home')],
        [t.parts[1], v('ContentDetail', '&inhalt=sommer-garten')],
        [t.parts[2], v('ContentDetail', '&inhalt=sommer-garten&dialog=inhalt-sommer-garten')]
      ] as [string, string][]
    },
    {
      title: t.groups[2],
      links: ['ready', 'guest', 'test', 'not_configured', 'email_unverified', 'pending_transfer', 'done', 'lastschrift_wartet', 'fehler'].map(
        (k) => [k, v('ContentDetail', `&inhalt=sommer-garten&kauf=${k}`)] as [string, string]
      )
    },
    {
      title: t.groups[3],
      links: (
        [
          ['ContentDetail', '&inhalt=nachtfahrt'],
          ['EventDetail', ''],
          ['AuctionDetail', ''],
          ['Login', ''],
          ['Register', ''],
          ['ForgotPassword', ''],
          ['ResetPassword', ''],
          ['ChangePassword', ''],
          ['VerifyEmail', ''],
          ['TermsConsent', ''],
          ['Profile', ''],
          ['Payments', ''],
          ['Notifications', ''],
          ['TextPage', '&seite=impressum'],
          ['Message', '&zustand=not_found']
        ] as const
      ).map(([page, q], i) => [t.more[i], v(page, q)] as [string, string])
    }
  ];
}

/** Sprachwahl als aufklappbares Menü — Links, daher auch ohne JavaScript. */
function LanguageMenu({ lang }: { lang: Lang }) {
  return (
    <details className="group relative">
      <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-4 pr-3 text-sm font-semibold backdrop-blur hover:border-white/40 [&::-webkit-details-marker]:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
        <span className="sr-only">{UI[lang].language}: </span>
        {LANG_NAMES[lang]}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-white/50 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/15 bg-[#16141c] p-1.5 shadow-2xl shadow-black/60">
        {LANGS.map((l) => (
          <li key={l}>
            <a
              href={`/?l=${l}`}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              className={`flex h-10 items-center justify-between rounded-xl px-3 text-sm ${l === lang ? 'bg-white/10 font-bold text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}
            >
              {LANG_NAMES[l]}
              <span className={`text-xs uppercase ${l === lang ? 'text-[#e0558c]' : 'text-white/35'}`}>{l === lang ? '✓' : l}</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default async function Praesentation({ searchParams }: Props) {
  const lang = toLang((await searchParams).l);
  const t = UI[lang];
  return (
    <main lang={lang} className="min-h-screen overflow-x-hidden bg-[#0c0b10] text-[#f3eff8]">
      <div aria-hidden="true" className="pointer-events-none fixed -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#e0558c]/15 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-8 flex justify-end sm:mb-10">
          <LanguageMenu lang={lang} />
        </div>

        <header className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{t.title}</h1>
          <p className="mt-3 text-lg text-white/60">{t.sub}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`/rotlicht?lang=${previewLang(lang)}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f43f5a]/60 bg-[#f43f5a]/10 px-5 text-sm font-bold text-white transition hover:bg-[#f43f5a]/25">
              <span className="h-2 w-2 rounded-full bg-[#f43f5a]" />
              {t.demo}
            </a>
            <a href="#rueckmeldung" className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
              {t.feedbackLink}
            </a>
          </div>
        </header>

        <DesignWahl lang={lang} />

        <details className="group mt-24 rounded-3xl border border-white/10 bg-white/[0.03]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg font-bold [&::-webkit-details-marker]:hidden">
            {t.allPages}
            <span className="text-white/40 transition group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-6 px-6 pb-6 md:grid-cols-2">
            {more(lang).map((g) => (
              <div key={g.title} className={g.links.length > 8 ? 'md:col-span-2' : ''}>
                <h3 className="text-sm font-bold text-white/60">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.links.map(([l, h]) => (
                    <a key={l} href={h} className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm text-white/80 transition hover:border-white/50 hover:text-white">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>

        <Feedback lang={lang} />

        <p className="mt-10 text-center text-sm text-white/35">
          <a href="/uebersicht" className="hover:text-white">
            {t.techOverview}
          </a>
        </p>
      </div>
    </main>
  );
}
