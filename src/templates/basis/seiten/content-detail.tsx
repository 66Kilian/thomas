import { useFormatter, useTranslations } from 'next-intl';

import { formatDuration } from '@/kit/format';
import { MotionPreview } from '@/kit/platform/motion-preview';
import { RichText } from '@/kit/platform/rich-text';
import { VideoPlayer } from '@/kit/platform/video-player';
import type { ContentDetailProps } from '@/kit/template';

import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { ContentCard } from '../bausteine/content-card';
import { PurchasePanel } from '../bausteine/purchase-panel';
import { Shell } from '../bausteine/shell';
import { btn, Page } from '../bausteine/ui';

/** Inhaltsdetail: freigeschaltet ⇒ Medien; gesperrt ⇒ Paywall mit Einzelkauf und/oder Abo. */
export function ContentDetail({ ctx, content, media, paywall, confirm, related, backHref }: ContentDetailProps) {
  const t = useTranslations('content');
  const tc = useTranslations('card');
  const ts = useTranslations('shell');
  const format = useFormatter();
  const a = content.access;
  const dauer = formatDuration(content.durationSeconds);
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <a href={backHref} className="text-sm text-muted-foreground">
          {ts('back', { name: ctx.site.displayName })}
        </a>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-black/55 px-1.5 py-0.5 text-white">{content.type === 'video' ? tc('video') : tc('gallery')}</span>
          {a.state === 'owned' && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-white">
              ✓ {a.since ? t('ownedSince', { date: format.dateTime(new Date(a.since), 'dateNumeric') }) : tc('owned')}
            </span>
          )}
          {a.state === 'subscription' && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-white">✓ {tc('inSubscription')}</span>}
          {content.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
        <h1 lang={lang} className="mt-2 text-2xl font-semibold">
          {content.title}
        </h1>
        {content.type === 'video' && dauer && (
          <p className="mt-1 text-sm text-muted-foreground">
            🕐 {dauer}
            {content.quality ? ` · ${content.quality}` : ''}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {paywall ? (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-video bg-muted">
                {content.imageLargeUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.imageLargeUrl} alt="" className="h-full w-full object-cover" />
                )}
                <MotionPreview preview={content.preview} playLabel={tc('playPreview')} pauseLabel={tc('pausePreview')} />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-2xl text-white">
                  🔒
                </span>
              </div>
              <div className="space-y-4 p-5 text-center">
                <p className="font-medium">{t('lockedTitle')}</p>
                {paywall.purchase && (
                  <div className="flex justify-center">
                    <PurchasePanel ctx={ctx} panel={paywall.purchase} />
                  </div>
                )}
                {paywall.purchase && paywall.subscription && <p className="text-sm text-muted-foreground">{t('or')}</p>}
                {paywall.subscription && (
                  <div className="space-y-2">
                    <p className="text-sm">{t('includedIn', { names: paywall.subscription.packages.join(', ') })}</p>
                    <a href={paywall.subscription.href} className={btn.primary}>
                      {ctx.fan ? t('subscribe', { name: paywall.subscription.packages[0] }) : t('viewSubscriptions')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : media.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noMedia')}</p>
          ) : content.type === 'video' ? (
            media.map((m, i) => (
              <div key={i} className="space-y-2">
                <VideoPlayer file={m} className="rounded-xl" sampleLabel={t('sampleVideo')} />
                {m.downloadHref && (
                  <a href={m.downloadHref} className={btn.outline}>
                    {media.length > 1 ? t('downloadVideo', { n: i + 1 }) : t('download')}
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {media.map((m, i) => (
                <a key={i} href={m.url} className="block overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.posterUrl} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {content.description && <RichText markdown={content.description} lang={lang} className="mt-8" />}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 text-lg font-semibold">{t('related', { name: ctx.site.displayName })}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((card) => (
                <ContentCard key={card.slug} ctx={ctx} card={card} />
              ))}
            </div>
          </section>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}
