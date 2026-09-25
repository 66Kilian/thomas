import { ChevronLeft, ChevronRight, Lock, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { HomeProps } from '@/kit/template';

import { ContentCard } from '../bausteine/content-card';
import { Shell } from '../bausteine/shell';
import { btn, Empty, input } from '../bausteine/ui';

/**
 * Aurora-Startseite: Titelbild mit weichem Übergang, Profilbild mit Momente-Ring, Vorstellung,
 * Momente-Reihe, „Im Rampenlicht", Filter + Suche, Raster, Blättern.
 * Fehlende Bausteine (Titelbild, Logo, Abo, Momente, Hervorgehobenes) schließen ohne Lücke.
 */
export function Home({ ctx, featured, items, filters, search, searching, pagination, moments, tiers }: HomeProps) {
  const t = useTranslations('home');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const s = ctx.site;
  const langIntro = s.profileIntro.length > 280;
  const firstMoment = moments[0];

  const avatar = s.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={s.logoUrl} alt="" className="h-full w-full rounded-full border-4 border-background object-cover" />
  ) : (
    <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full border-4 border-background bg-primary text-4xl font-semibold text-primary-foreground">
      {s.displayName.charAt(0)}
    </span>
  );

  return (
    <Shell ctx={ctx}>
      {/* Titelbild — fehlt es, trägt der Lichtschein der Farbwelt den Kopf. */}
      {s.coverUrl ? (
        <div className="relative h-56 w-full overflow-hidden sm:h-80 lg:h-[26rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.coverUrl} alt="" className="h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
      ) : (
        <div aria-hidden="true" className="h-10 sm:h-16" />
      )}

      <main id="inhalt" className="mx-auto max-w-6xl px-4">
        {/* Profilkopf */}
        <section className={`relative flex flex-col gap-5 sm:flex-row sm:items-end ${s.coverUrl ? '-mt-20 sm:-mt-24' : ''}`}>
          <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
            {firstMoment ? (
              <a
                href={firstMoment.href}
                aria-label={t('moments')}
                className="block h-full w-full rounded-full bg-[conic-gradient(from_210deg,var(--color-primary),var(--color-accent),var(--color-primary))] p-[3px]"
              >
                {avatar}
              </a>
            ) : (
              avatar
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">{s.displayName}</h1>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span>{t('posts', { count: s.stats.posts })}</span>
              <span>{t('videos', { count: s.stats.videos })}</span>
              <span>{t('galleries', { count: s.stats.galleries })}</span>
            </p>
          </div>
          {s.subscriptionFromCents != null && (
            <a href={ctx.links.subscriptions} className={`${btn.primary} h-12 px-6 text-base shadow-lg shadow-primary/20`}>
              {t('subscribeFrom', { price: formatPrice(format, s.subscriptionFromCents) })}
            </a>
          )}
        </section>

        {/* Vorstellung: kurz = ganz; lang = gekürzt mit „Mehr lesen" (ohne JavaScript). */}
        {s.profileIntro &&
          (langIntro ? (
            <details className="group mt-6 max-w-3xl">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <p lang={s.mainLanguage} className="line-clamp-4 whitespace-pre-line text-[15px] leading-7 group-open:line-clamp-none">
                  {s.profileIntro}
                </p>
                <span className="mt-2 inline-block text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                  <span className="group-open:hidden">{tA('readMore')}</span>
                  <span className="hidden group-open:inline">{tA('readLess')}</span>
                </span>
              </summary>
            </details>
          ) : (
            <p lang={s.mainLanguage} className="mt-6 max-w-3xl whitespace-pre-line text-[15px] leading-7">
              {s.profileIntro}
            </p>
          ))}

        {/* Abo-Stufen als Schnellwahl — nur bei mehreren Stufen, sonst reicht der Knopf oben. */}
        {tiers.length > 1 && (
          <nav aria-label={t('tiers')} className="mt-5 flex flex-wrap gap-2">
            {tiers.map((tier) => (
              <a key={tier.name} href={tier.href} className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm">
                <span lang={s.mainLanguage} className="font-semibold">{tier.name}</span>
                <span className="tabular-nums text-muted-foreground">{formatPrice(format, tier.fromCents)}</span>
              </a>
            ))}
          </nav>
        )}

        {/* Momente — waagrecht scrollbar mit sichtbarer Leiste. */}
        {moments.length > 0 && (
          <section aria-label={t('moments')} className="mt-8">
            <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
              {moments.map((m) => (
                <a key={m.id} href={m.href} className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5 text-center">
                  <span className={`relative rounded-full p-[3px] ${m.locked ? 'bg-border' : 'bg-[conic-gradient(from_210deg,var(--color-primary),var(--color-accent),var(--color-primary))]'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.thumbUrl} alt="" className="h-16 w-16 rounded-full border-[3px] border-background object-cover" />
                    {m.locked && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    )}
                  </span>
                  <span lang={s.mainLanguage} className="w-full truncate text-xs text-muted-foreground">
                    {m.caption}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Im Rampenlicht — nur wenn das Model etwas hervorhebt und nicht gesucht wird. */}
        {featured.length > 0 && !searching && (
          <section className="mt-12">
            <SectionTitle>{tA('spotlight')}</SectionTitle>
            <div className={`grid gap-3 sm:gap-4 ${SPOT_COLS[Math.min(featured.length, 4)]}`}>
              {featured.slice(0, 4).map((card, i) => (
                <div key={card.slug} className={featured.length === 3 && i === 0 ? 'col-span-2 sm:col-span-1' : undefined}>
                  <ContentCard ctx={ctx} card={card} size="large" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle className="mb-0">{searching ? t('resultsFor', { q: search.value }) : tA('allContent')}</SectionTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav role="tablist" className="inline-flex w-full rounded-lg border border-border bg-card p-1 sm:w-auto">
                {filters.map((f) => (
                  <a
                    key={f.label}
                    href={f.href}
                    role="tab"
                    aria-selected={f.active}
                    className={`flex h-8 flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm sm:flex-none ${f.active ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f.label}
                  </a>
                ))}
              </nav>
              <form action={search.action} method="get" role="search" className="flex w-full gap-2 sm:w-72">
                {Object.entries(search.hidden).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
                <label className="relative block flex-1">
                  <span className="sr-only">{t('searchPlaceholder')}</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input name="q" defaultValue={search.value} placeholder={t('searchPlaceholder')} className={`${input} h-10 pl-9`} />
                </label>
                <button type="submit" className={`${btn.outline} h-10`}>
                  {t('searchButton')}
                </button>
              </form>
            </div>
          </div>

          {items.length === 0 ? (
            <Empty>{searching ? t('noResults') : t('empty')}</Empty>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {items.map((card) => (
                <ContentCard key={card.slug} ctx={ctx} card={card} />
              ))}
            </div>
          )}

          {/* Blättern: Knöpfe behalten ihren Platz auch am Anfang/Ende (unsichtbar). */}
          {pagination.pages > 1 && (
            <nav className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm">
              <span className="justify-self-end">
                {pagination.prevHref ? (
                  <a href={pagination.prevHref} className={btn.outline}>
                    <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    {t('prev')}
                  </a>
                ) : (
                  <span aria-hidden="true" className={`${btn.outline} invisible`}>
                    <ChevronLeft className="h-4 w-4" />
                    {t('prev')}
                  </span>
                )}
              </span>
              <span className="tabular-nums text-muted-foreground">{t('pageOf', { page: pagination.page, pages: pagination.pages })}</span>
              <span className="justify-self-start">
                {pagination.nextHref ? (
                  <a href={pagination.nextHref} className={btn.outline}>
                    {t('next')}
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                ) : (
                  <span aria-hidden="true" className={`${btn.outline} invisible`}>
                    {t('next')}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </span>
            </nav>
          )}
        </section>
      </main>
    </Shell>
  );
}

/** Spalten für „Im Rampenlicht" nach Anzahl — keine leeren Plätze. */
const SPOT_COLS: Record<number, string> = {
  1: 'grid-cols-1 sm:max-w-sm',
  2: 'grid-cols-2 lg:max-w-3xl',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4'
};

function SectionTitle({ children, className = 'mb-5' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl ${className}`}>
      <span aria-hidden="true" className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
      {children}
    </h2>
  );
}
