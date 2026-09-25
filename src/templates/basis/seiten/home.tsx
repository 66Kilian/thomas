import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { HomeProps } from '@/kit/template';

import { ContentCard } from '../bausteine/content-card';
import { Shell } from '../bausteine/shell';
import { btn, Empty, input } from '../bausteine/ui';

/**
 * Startseite des Basis-Templates: Titelbild, Profilkopf, Momente, Empfohlen, Filter + Suche, Raster.
 * Bewusst schlicht — sie zeigt, WELCHE Bausteine es gibt, nicht wie ein Template aussehen soll.
 */
export function Home({ ctx, featured, items, filters, search, searching, pagination, moments, tiers }: HomeProps) {
  const t = useTranslations('home');
  const format = useFormatter();
  const s = ctx.site;
  return (
    <Shell ctx={ctx}>
      {/* Kopfbereich: Titelbild kann fehlen — dann schließt der Profilkopf ohne Lücke an. */}
      {s.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.coverUrl} alt="" className="h-40 w-full object-cover sm:h-64" />
      )}
      <main id="inhalt" className="mx-auto max-w-6xl px-4 py-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logoUrl} alt="" className={`h-24 w-24 rounded-full border-4 border-background object-cover ${s.coverUrl ? '-mt-16' : ''}`} />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">{s.displayName.charAt(0)}</span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold">{s.displayName}</h1>
            <p className="text-sm text-muted-foreground">
              {t('posts', { count: s.stats.posts })} · {t('videos', { count: s.stats.videos })} · {t('galleries', { count: s.stats.galleries })}
            </p>
          </div>
          {s.subscriptionFromCents != null && (
            <a href={ctx.links.subscriptions} className={btn.primary}>
              {t('subscribeFrom', { price: formatPrice(format, s.subscriptionFromCents) })}
            </a>
          )}
        </section>
        {s.profileIntro && (
          <p lang={s.mainLanguage} className="mt-4 max-w-2xl whitespace-pre-line text-sm">
            {s.profileIntro}
          </p>
        )}

        {moments.length > 0 && (
          <section className="mt-6" aria-label={t('moments')}>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {moments.map((m) => (
                <a key={m.id} href={m.href} className="flex w-16 shrink-0 flex-col items-center gap-1 text-center">
                  <span className="rounded-full bg-gradient-to-tr from-primary to-amber-400 p-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.thumbUrl} alt="" className={`h-14 w-14 rounded-full border-2 border-background object-cover ${m.locked ? 'opacity-60' : ''}`} />
                  </span>
                  <span lang={s.mainLanguage} className="w-full truncate text-[11px]">
                    {m.locked ? '🔒 ' : ''}
                    {m.caption}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {tiers.length > 0 && (
          <section className="mt-6 flex flex-wrap gap-2" aria-label={t('tiers')}>
            {tiers.map((tier) => (
              <a key={tier.name} href={tier.href} className={btn.outline}>
                {tier.name} · {formatPrice(format, tier.fromCents)}
              </a>
            ))}
          </section>
        )}

        {featured.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">{t('featured')}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.slice(0, 4).map((card) => (
                <ContentCard key={card.slug} ctx={ctx} card={card} size="large" />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <nav className="flex gap-1" role="tablist">
              {filters.map((f) => (
                <a
                  key={f.label}
                  href={f.href}
                  role="tab"
                  aria-selected={f.active}
                  className={`rounded-full px-3 py-1 text-sm ${f.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {f.label}
                </a>
              ))}
            </nav>
            <form action={search.action} method="get" className="ml-auto flex w-full gap-2 sm:w-72">
              {Object.entries(search.hidden).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <input name="q" defaultValue={search.value} placeholder={t('searchPlaceholder')} className={input} />
              <button type="submit" className={btn.outline}>
                {t('searchButton')}
              </button>
            </form>
          </div>
          {searching && <h2 className="mb-3 text-lg font-semibold">{t('resultsFor', { q: search.value })}</h2>}
          {items.length === 0 ? (
            <Empty>{searching ? t('noResults') : t('empty')}</Empty>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((card) => (
                <ContentCard key={card.slug} ctx={ctx} card={card} />
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-4 text-sm">
              {pagination.prevHref ? <a href={pagination.prevHref} className={btn.outline}>{t('prev')}</a> : <span className={`${btn.outline} invisible`}>{t('prev')}</span>}
              <span className="text-muted-foreground">{t('pageOf', { page: pagination.page, pages: pagination.pages })}</span>
              {pagination.nextHref ? <a href={pagination.nextHref} className={btn.outline}>{t('next')}</a> : <span className={`${btn.outline} invisible`}>{t('next')}</span>}
            </nav>
          )}
        </section>
      </main>
    </Shell>
  );
}
