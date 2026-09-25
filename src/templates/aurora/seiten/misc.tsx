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
      <div className="relative w-full max-w-md space-y-7 rounded-xl border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
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
          <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-bold text-black transition hover:bg-white/90">
            {t('enter')}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </form>
        <a href={leaveHref} className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/20 px-4 text-sm font-semibold text-white/80 hover:bg-white/10">
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
      {/* Titelbild als Band — Schrift steht darunter, nie im Bild. */}
      {s.coverUrl ? (
        <div className="relative mx-auto mt-4 max-w-6xl px-4">
          <div className="relative h-48 overflow-hidden rounded-xl sm:h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.coverUrl} alt="" className="h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      ) : (
        <div aria-hidden="true" className="relative mx-auto mt-4 h-24 max-w-6xl overflow-hidden px-4">
          <div className="absolute -left-10 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        </div>
      )}

      <main id="inhalt" className="mx-auto max-w-6xl px-4 pb-8">
        {/* Profilzeile */}
        <section className={`relative flex flex-col gap-5 px-2 sm:flex-row sm:items-end sm:gap-6 sm:px-6 ${s.coverUrl ? '-mt-14' : ''}`}>
          <div className="h-28 w-28 shrink-0 rounded-full bg-[conic-gradient(from_200deg,var(--primary),var(--accent),var(--primary))] p-[3px] shadow-2xl shadow-primary/30">
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoUrl} alt="" className="h-full w-full rounded-full border-4 border-background object-cover" />
            ) : (
              <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full border-4 border-background bg-primary text-4xl font-black text-primary-foreground">{s.displayName.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="break-words text-3xl font-black tracking-tight sm:text-4xl">{s.displayName}</p>
            <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {stats.map((st) => (
                <div key={st.l} className="flex items-baseline gap-1.5">
                  <dd className="font-black tabular-nums">{st.n}</dd>
                  <dt className="text-sm text-muted-foreground">{st.l}</dt>
                </div>
              ))}
            </dl>
          </div>
          {s.subscriptionFromCents != null && (
            <a href={ctx.links.subscriptions} className={`${btn.primary} h-12 px-7`}>
              {th('subscribeFrom', { price: formatPrice(format, s.subscriptionFromCents) })}
            </a>
          )}
        </section>

        {/* Inhalt */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <article className="relative overflow-hidden rounded-xl border border-border bg-card p-7 sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--primary))]">{s.displayName}</p>
            <h1 lang={s.mainLanguage} className="relative mt-3 break-words pt-1 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {title}
            </h1>
            <span aria-hidden="true" className="relative mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
            {languageNote && (
              <div className="relative mt-6">
                <Box kind="info">{languageNote}</Box>
              </div>
            )}
            <div className="relative mt-8 max-w-2xl text-[17px] leading-8 [&_.rich-text_img]:my-8 [&_.rich-text_img]:rounded-xl [&_.rich-text_p:first-child]:text-xl [&_.rich-text_p:first-child]:font-semibold [&_.rich-text_p:first-child]:leading-9">
              <RichText markdown={markdown} lang={s.mainLanguage} />
            </div>
          </article>

          <aside className="space-y-3 lg:sticky lg:top-40">
            {s.subscriptionFromCents != null && (
              <a href={ctx.links.subscriptions} className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-xl shadow-primary/25">
                <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-foreground/15 blur-2xl" />
                <p className="relative text-sm font-semibold opacity-85">{tA('subsEyebrow')}</p>
                <p className="relative mt-1 text-2xl font-black tabular-nums">{tA('from', { price: formatPrice(format, s.subscriptionFromCents) })}</p>
                <p className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold">
                  {tA('subscribeCta')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
                </p>
              </a>
            )}
            <a href={ctx.links.home} className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 font-bold hover:border-primary">
              {tA('toContent')}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
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
        <article className="rounded-xl border border-border bg-card p-6 text-[15px] leading-7 sm:p-10">
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
            <Loader2 aria-label={t('loading')} className="relative h-12 w-12 animate-spin text-[color:var(--brand-link,var(--primary))] motion-reduce:animate-none" />
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
