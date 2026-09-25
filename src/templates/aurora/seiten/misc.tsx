import { ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

/** Textseiten (Impressum, AGB …): ruhige Lesespalte mit großzügigem Zeilenabstand. */
export function TextPage({ ctx, title, markdown, backHref, languageNote }: TextPageProps) {
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
