import { ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';

import { FormFields } from '@/kit/platform/form-fields';
import { RichText } from '@/kit/platform/rich-text';
import type { AgeGateProps, MessagePageProps, TextPageProps } from '@/kit/template';

import { Shell } from '../bausteine/shell';
import { Box, btn, Page, PageHead } from '../bausteine/ui';

/**
 * 18+-Abfrage — schwarz (feste Farbe laut Briefing), mit weichem Markenlicht. Reines Formular,
 * Sprachwahl sichtbar, Rechtslinks erreichbar. Kein Shell-Rahmen.
 */
export function AgeGate({ ctx, confirm, leaveHref }: AgeGateProps) {
  const t = useTranslations('gate');
  const ts = useTranslations('shell');
  const s = ctx.site;
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4 text-white">
      <div aria-hidden="true" className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/30 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[120px]" />
      <div className="relative w-full max-w-md space-y-7 rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        {ctx.languageLinks.length > 1 && (
          <nav className="absolute right-5 top-5 inline-flex rounded-full border border-white/20 p-0.5 text-xs font-bold" aria-label={ts('language')}>
            {ctx.languageLinks.map((l) => (
              <a key={l.label} href={l.href} aria-current={l.active ? 'true' : undefined} className={`flex h-7 w-9 items-center justify-center rounded-full ${l.active ? 'bg-white text-black' : 'text-white/70'}`}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
        <div className="flex flex-col items-center gap-4 pt-4">
          {s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logoUrl} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-white/30" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-black ring-2 ring-white/30">{s.displayName.charAt(0)}</span>
          )}
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">{s.displayName}</p>
        </div>
        <div className="space-y-3">
          <span aria-hidden="true" className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-sm leading-6 text-white/70">{t('text')}</p>
        </div>
        <form method="post" action={confirm.action}>
          <FormFields target={confirm} />
          <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-bold text-black transition hover:bg-white/90">
            {t('enter')}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </form>
        <a href={leaveHref} className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white/80 hover:bg-white/10">
          {t('leave')}
        </a>
        <nav className="flex justify-center gap-5 text-xs text-white/55">
          <a href={ctx.links.imprint} className="hover:text-white">{ts('imprint')}</a>
          <a href={ctx.links.privacy} className="hover:text-white">{ts('privacy')}</a>
          <a href={ctx.links.terms} className="hover:text-white">{ts('terms')}</a>
        </nav>
        <p className="text-[11px] text-white/40">{t('stored')}</p>
      </div>
    </div>
  );
}

/**
 * Textseiten. Eigene Seiten des Models (aktiver Menüpunkt „page:…", z. B. „Über mich") bekommen einen
 * Profilkopf mit Titelbild, Porträt, Kennzahlen und Abo-/Start-Knöpfen. Rechtstexte (nicht im Menü)
 * bleiben eine ruhige Lesespalte.
 */
export function TextPage(props: TextPageProps) {
  const eigene = props.ctx.menu.some((m) => m.active && m.key.startsWith('page:'));
  return eigene ? <ModelPage {...props} /> : <LegalPage {...props} />;
}

function ModelPage({ ctx, title, markdown, languageNote }: TextPageProps) {
  const tA = useTranslations('tpl_aurora');
  const th = useTranslations('home');
  const format = useFormatter();
  const s = ctx.site;
  const stats = [
    { n: s.stats.posts, l: tA('statPosts', { count: s.stats.posts }) },
    { n: s.stats.videos, l: tA('statVideos', { count: s.stats.videos }) },
    { n: s.stats.galleries, l: tA('statGalleries', { count: s.stats.galleries }) }
  ];
  return (
    <Shell ctx={ctx}>
      <section className={`relative ${s.coverUrl ? '-mt-[4.75rem] sm:-mt-[7.5rem]' : ''}`}>
        {s.coverUrl ? (
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.coverUrl} alt="" className="h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-black/30" />
          </div>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          </div>
        )}
        <div className={`relative mx-auto max-w-6xl px-4 ${s.coverUrl ? 'pb-10 pt-36 sm:pt-52' : 'pb-8 pt-12 sm:pt-16'}`}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--color-primary))]">{s.displayName}</p>
          <h1 lang={s.mainLanguage} className="max-w-4xl break-words text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl">
            {title}
          </h1>
        </div>
      </section>

      <main id="inhalt" className="mx-auto max-w-6xl px-4 pb-8">
        {languageNote && (
          <div className="mb-8 max-w-3xl">
            <Box kind="info">{languageNote}</Box>
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <article className="rounded-[2rem] border border-border bg-card p-6 text-[17px] leading-8 sm:p-10 [&_.rich-text_img]:rounded-3xl [&_.rich-text_p:first-child]:text-xl [&_.rich-text_p:first-child]:font-semibold [&_.rich-text_p:first-child]:leading-9">
            <RichText markdown={markdown} lang={s.mainLanguage} />
          </article>

          <aside className="space-y-4 lg:sticky lg:top-40">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 text-center">
              <div aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative mx-auto h-24 w-24 rounded-full bg-[conic-gradient(from_200deg,var(--color-primary),var(--color-accent),var(--color-primary))] p-[3px]">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt="" className="h-full w-full rounded-full border-[3px] border-card object-cover" />
                ) : (
                  <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-card bg-primary text-3xl font-black text-primary-foreground">
                    {s.displayName.charAt(0)}
                  </span>
                )}
              </div>
              <p className="relative mt-3 text-lg font-black tracking-tight">{s.displayName}</p>
              <dl className="relative mt-4 grid grid-cols-3 gap-2">
                {stats.map((st) => (
                  <div key={st.l} className="flex flex-col-reverse rounded-2xl bg-background/70 px-2 py-3">
                    <dt className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{st.l}</dt>
                    <dd className="text-xl font-black tabular-nums">{st.n}</dd>
                  </div>
                ))}
              </dl>
              <div className="relative mt-5 space-y-2">
                {s.subscriptionFromCents != null && (
                  <a href={ctx.links.subscriptions} className={`${btn.primary} w-full whitespace-normal text-center`}>
                    {th('subscribeFrom', { price: formatPrice(format, s.subscriptionFromCents) })}
                  </a>
                )}
                <a href={ctx.links.home} className={`${btn.outline} w-full`}>
                  {tA('toContent')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
}

function LegalPage({ ctx, title, markdown, backHref, languageNote }: TextPageProps) {
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <PageHead back={{ href: backHref, label: ctx.site.displayName }} title={title} lang={ctx.site.mainLanguage} />
        {languageNote && (
          <div className="mb-8">
            <Box kind="info">{languageNote}</Box>
          </div>
        )}
        <article className="rounded-[2rem] border border-border bg-card p-6 text-[15px] leading-7 sm:p-10">
          <RichText markdown={markdown} lang={ctx.site.mainLanguage} />
        </article>
      </Page>
    </Shell>
  );
}

/** Meldungsseiten: nicht gefunden, Seite nicht verfügbar, Modul nicht gebucht, Fehler, Laden. */
export function Message({ ctx, kind, title }: MessagePageProps) {
  const t = useTranslations('message');
  const big = kind === 'not_found' ? '404' : kind === 'error' ? '!' : null;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-2xl">
        <div className="relative flex flex-col items-center py-16 text-center sm:py-24">
          <div aria-hidden="true" className="absolute top-8 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          {kind === 'loading' ? (
            <Loader2 aria-label={t('loading')} className="relative h-12 w-12 animate-spin text-[color:var(--brand-link,var(--color-primary))] motion-reduce:animate-none" />
          ) : (
            big && <p className="relative bg-gradient-to-b from-foreground to-foreground/30 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">{big}</p>
          )}
          {title && <h1 className="relative mt-4 text-3xl font-black tracking-tight">{title}</h1>}
          {kind !== 'loading' && <p className="relative mt-3 max-w-md text-muted-foreground">{t(kind)}</p>}
          {kind !== 'loading' && (
            <a href={ctx.links.home} className={`${btn.primary} relative mt-8`}>
              {t('toStart')}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </Page>
    </Shell>
  );
}
