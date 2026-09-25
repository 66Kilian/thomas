import { ArrowRight, ChevronLeft, ChevronRight, Lock, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { HomeProps } from '@/kit/template';

import { ContentCard } from '../bausteine/content-card';
import { Shell } from '../bausteine/shell';
import { Empty } from '../bausteine/ui';

/**
 * Aurora-Startseite: Titelbild randlos hinter der schwebenden Kopfzeile, Name groß im Bild,
 * Kennzahlen als große Zahlen, Momente-Ring, Reihe „Empfohlen" (Highlights), Raster „Neueste" mit Filter-Pillen.
 * Fehlende Bausteine (Titelbild, Logo, Abo, Momente, Hervorgehobenes) schließen ohne Lücke.
 */
export function Home({ ctx, featured, items, filters, search, searching, pagination, moments, tiers }: HomeProps) {
  const t = useTranslations('home');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const s = ctx.site;
  const langIntro = s.profileIntro.length > 240;
  const firstMoment = moments[0];
  const hasCover = Boolean(s.coverUrl);

  const avatarInner = s.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={s.logoUrl} alt="" className="h-full w-full rounded-full border-[3px] border-background object-cover" />
  ) : (
    <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-background bg-primary text-3xl font-black text-primary-foreground">
      {s.displayName.charAt(0)}
    </span>
  );
  const avatar = (
    <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
      {firstMoment ? (
        <a href={firstMoment.href} aria-label={t('moments')} className="block h-full w-full rounded-full bg-[conic-gradient(from_200deg,var(--color-primary),var(--color-accent),var(--color-primary))] p-[3px]">
          {avatarInner}
        </a>
      ) : (
        avatarInner
      )}
    </div>
  );

  const stats = [
    { n: s.stats.posts, l: tA('statPosts', { count: s.stats.posts }) },
    { n: s.stats.videos, l: tA('statVideos', { count: s.stats.videos }) },
    { n: s.stats.galleries, l: tA('statGalleries', { count: s.stats.galleries }) }
  ];

  return (
    <Shell ctx={ctx}>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className={`relative ${hasCover ? '-mt-[4.75rem] sm:-mt-[7.5rem]' : ''}`}>
        {hasCover ? (
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.coverUrl ?? ''} alt="" className="h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
          </div>
        ) : (
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-full overflow-hidden">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          </div>
        )}

        <div className={`relative mx-auto flex max-w-6xl flex-col justify-end px-4 ${hasCover ? 'min-h-[30rem] pb-10 pt-32 sm:min-h-[38rem] sm:pt-44' : 'pb-8 pt-12 sm:pt-16'}`}>
          <div className="flex items-center gap-4">
            {avatar}
            <span className="inline-flex h-7 items-center rounded-full border border-border bg-background/60 px-3 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              {tA('creator')}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl break-words text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">{s.displayName}</h1>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <dl className="flex gap-7 sm:gap-10">
              {stats.map((st) => (
                <div key={st.l} className="flex flex-col-reverse">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{st.l}</dt>
                  <dd className="text-3xl font-black tabular-nums tracking-tight sm:text-4xl">{st.n}</dd>
                </div>
              ))}
            </dl>
            {s.subscriptionFromCents != null && (
              <a
                href={ctx.links.subscriptions}
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary pl-7 pr-2 text-base font-bold text-primary-foreground shadow-2xl shadow-primary/40 transition hover:opacity-95"
              >
                {t('subscribeFrom', { price: formatPrice(format, s.subscriptionFromCents) })}
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 transition group-hover:translate-x-0.5">
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      <main id="inhalt" className="mx-auto max-w-6xl px-4">
        {/* Vorstellung + Abo-Stufen */}
        {(s.profileIntro || tiers.length > 1) && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            {s.profileIntro &&
              (langIntro ? (
                <details className="group max-w-3xl">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <p lang={s.mainLanguage} className="line-clamp-3 whitespace-pre-line text-lg leading-8 text-foreground/90 group-open:line-clamp-none">
                      {s.profileIntro}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold">
                      <span className="group-open:hidden">{tA('readMore')}</span>
                      <span className="hidden group-open:inline">{tA('readLess')}</span>
                    </span>
                  </summary>
                </details>
              ) : (
                <p lang={s.mainLanguage} className="max-w-3xl whitespace-pre-line text-lg leading-8 text-foreground/90">
                  {s.profileIntro}
                </p>
              ))}
            {tiers.length > 1 && (
              <nav aria-label={t('tiers')} className="flex flex-wrap gap-2 lg:justify-end">
                {tiers.map((tier) => (
                  <a key={tier.name} href={tier.href} className="inline-flex h-11 items-center gap-3 rounded-full border border-border bg-card/70 pl-4 pr-1.5 text-sm backdrop-blur hover:border-primary">
                    <span lang={s.mainLanguage} className="font-bold">{tier.name}</span>
                    <span className="inline-flex h-8 items-center rounded-full bg-background px-3 font-semibold tabular-nums">{formatPrice(format, tier.fromCents)}</span>
                  </a>
                ))}
              </nav>
            )}
          </section>
        )}

        {/* Momente — waagrecht scrollbar mit sichtbarer Leiste. */}
        {moments.length > 0 && (
          <section aria-label={t('moments')} className="mt-10">
            <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]">
              {moments.map((m) => (
                <a key={m.id} href={m.href} className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center">
                  <span className={`relative rounded-full p-[3px] transition group-hover:scale-105 motion-reduce:transform-none ${m.locked ? 'bg-border' : 'bg-[conic-gradient(from_200deg,var(--color-primary),var(--color-accent),var(--color-primary))]'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.thumbUrl} alt="" className="h-[4.25rem] w-[4.25rem] rounded-full border-[3px] border-background object-cover" />
                    {m.locked && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur">
                          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    )}
                  </span>
                  <span lang={s.mainLanguage} className="w-full truncate text-xs font-medium text-muted-foreground">
                    {m.caption}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Empfohlen — die Highlights des Models in einer waagrechten Reihe (sichtbare Scrollleiste). */}
        {featured.length > 0 && !searching && (
          <section className="mt-16">
            <SectionTitle eyebrow={tA('recommendedSub', { name: s.displayName })}>{tA('recommended')}</SectionTitle>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:gap-5">
              {featured.map((card) => (
                <div key={card.slug} className="w-[62%] shrink-0 snap-start sm:w-[15.5rem] lg:w-[16.5rem]">
                  <ContentCard ctx={ctx} card={card} size="large" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Alle Inhalte */}
        <section className="mt-16">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle eyebrow={searching ? tA('browse') : tA('newestSub')} className="mb-0">
              {searching ? t('resultsFor', { q: search.value }) : tA('newest')}
            </SectionTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav role="tablist" className="inline-flex w-full rounded-full border border-border bg-card/70 p-1 backdrop-blur sm:w-auto">
                {filters.map((f) => (
                  <a
                    key={f.label}
                    href={f.href}
                    role="tab"
                    aria-selected={f.active}
                    className={`flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-semibold sm:flex-none ${f.active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f.label}
                  </a>
                ))}
              </nav>
              <form action={search.action} method="get" role="search" className="relative flex w-full sm:w-80">
                {Object.entries(search.hidden).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
                <label className="block flex-1">
                  <span className="sr-only">{t('searchPlaceholder')}</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="q"
                    defaultValue={search.value}
                    placeholder={t('searchPlaceholder')}
                    className="h-11 w-full rounded-full border border-border bg-card/70 pl-11 pr-24 text-sm backdrop-blur placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </label>
                <button type="submit" className="absolute right-1 top-1 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
                  {t('searchButton')}
                </button>
              </form>
            </div>
          </div>

          {items.length === 0 ? (
            <Empty>{searching ? t('noResults') : t('empty')}</Empty>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {items.map((card) => (
                <ContentCard key={card.slug} ctx={ctx} card={card} />
              ))}
            </div>
          )}

          {/* Blättern: Knöpfe behalten ihren Platz auch am Anfang/Ende (unsichtbar). */}
          {pagination.pages > 1 && (
            <nav className="mt-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm">
              <span className="justify-self-end">
                <PageLink href={pagination.prevHref} label={t('prev')} dir="prev" />
              </span>
              <span className="rounded-full border border-border px-4 py-2 font-semibold tabular-nums">{t('pageOf', { page: pagination.page, pages: pagination.pages })}</span>
              <span className="justify-self-start">
                <PageLink href={pagination.nextHref} label={t('next')} dir="next" />
              </span>
            </nav>
          )}
        </section>
      </main>
    </Shell>
  );
}

function PageLink({ href, label, dir }: { href: string | null; label: string; dir: 'prev' | 'next' }) {
  const cls = 'inline-flex h-11 items-center gap-2 rounded-full bg-card px-5 font-semibold ring-1 ring-border hover:ring-primary';
  const inner = (
    <>
      {dir === 'prev' && <ChevronLeft aria-hidden="true" className="h-4 w-4" />}
      {label}
      {dir === 'next' && <ChevronRight aria-hidden="true" className="h-4 w-4" />}
    </>
  );
  return href ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <span aria-hidden="true" className={`${cls} invisible`}>{inner}</span>
  );
}

function SectionTitle({ children, eyebrow, className = 'mb-6' }: { children: ReactNode; eyebrow?: string; className?: string }) {
  return (
    <div className={className}>
      {eyebrow && <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--color-primary))]">{eyebrow}</p>}
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{children}</h2>
    </div>
  );
}
