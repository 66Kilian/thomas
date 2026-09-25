import { useTranslations } from 'next-intl';

import { FormFields } from '@/kit/platform/form-fields';
import { RichText } from '@/kit/platform/rich-text';
import type { AgeGateProps, MessagePageProps, TextPageProps } from '@/kit/template';

import { Shell } from '../bausteine/shell';
import { Box, btn, Page } from '../bausteine/ui';

/**
 * 18+-Abfrage — erster Kontakt jedes Besuchers. Reines Formular (funktioniert ohne JavaScript),
 * Sprachwahl sichtbar, Rechtslinks erreichbar. Kein Shell-Rahmen: die Abfrage steht allein.
 */
export function AgeGate({ ctx, confirm, leaveHref }: AgeGateProps) {
  const t = useTranslations('gate');
  const ts = useTranslations('shell');
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{ctx.site.displayName}</p>
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-white/75">{t('text')}</p>
        <form method="post" action={confirm.action}>
          <FormFields target={confirm} />
          <button type="submit" className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black">
            {t('enter')}
          </button>
        </form>
        <a href={leaveHref} className="block rounded-lg border border-white/25 px-4 py-2 text-sm">
          {t('leave')}
        </a>
        {ctx.languageLinks.length > 1 && (
          <nav className="flex justify-center gap-2 text-xs" aria-label={ts('language')}>
            {ctx.languageLinks.map((l) => (
              <a key={l.label} href={l.href} className={`w-8 rounded py-1 ${l.active ? 'bg-white/20 font-semibold' : 'text-white/60'}`}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
        <nav className="flex justify-center gap-4 text-xs text-white/60">
          <a href={ctx.links.imprint}>{ts('imprint')}</a>
          <a href={ctx.links.privacy}>{ts('privacy')}</a>
          <a href={ctx.links.terms}>{ts('terms')}</a>
        </nav>
        <p className="text-[11px] text-white/40">{t('stored')}</p>
      </div>
    </div>
  );
}

export function TextPage({ ctx, title, markdown, backHref, languageNote }: TextPageProps) {
  const ts = useTranslations('shell');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <a href={backHref} className="text-sm text-muted-foreground">
          {ts('back', { name: ctx.site.displayName })}
        </a>
        <h1 lang={ctx.site.mainLanguage} className="mb-6 mt-4 text-3xl font-semibold">
          {title}
        </h1>
        {languageNote && (
          <div className="mb-4">
            <Box kind="info">{languageNote}</Box>
          </div>
        )}
        <RichText markdown={markdown} lang={ctx.site.mainLanguage} />
      </Page>
    </Shell>
  );
}

/** Meldungsseiten: nicht gefunden, Seite nicht verfügbar, Modul nicht gebucht, Fehler, Laden. */
export function Message({ ctx, kind, title }: MessagePageProps) {
  const t = useTranslations('message');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-xl">
        <div className="py-16 text-center">
          {title && <h1 className="mb-3 text-2xl font-semibold">{title}</h1>}
          {kind === 'loading' ? (
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" aria-label={t('loading')} />
          ) : (
            <p className="text-muted-foreground">{t(kind)}</p>
          )}
          {kind !== 'loading' && (
            <a href={ctx.links.home} className={`${btn.outline} mt-6`}>
              {t('toStart')}
            </a>
          )}
        </div>
      </Page>
    </Shell>
  );
}
