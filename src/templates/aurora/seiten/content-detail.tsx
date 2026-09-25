import { Check, Clock, Download, Images, Lock, Video } from 'lucide-react';
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
import { btn, Page, PageHead } from '../bausteine/ui';

/**
 * Inhaltsdetail: links Medien bzw. gesperrte Vorschau, rechts (ab 1024 px, mitlaufend) die
 * Kauf-/Abo-Karte. Freigeschaltet ⇒ Medien volle Breite. Galerie als Raster (Vollbild über Link).
 */
export function ContentDetail({ ctx, content, media, paywall, confirm, related, backHref }: ContentDetailProps) {
  const t = useTranslations('content');
  const tc = useTranslations('card');
  const format = useFormatter();
  const a = content.access;
  const dauer = formatDuration(content.durationSeconds);
  const lang = ctx.site.mainLanguage;
  const chip = 'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold';

  const meta = (
    <div className="-mt-6 mb-8 flex flex-wrap items-center gap-2">
      <span className={`${chip} bg-card ring-1 ring-border`}>
        {content.type === 'video' ? <Video aria-hidden="true" className="h-3.5 w-3.5" /> : <Images aria-hidden="true" className="h-3.5 w-3.5" />}
        {content.type === 'video' ? tc('video') : tc('gallery')}
      </span>
      {content.type === 'video' && dauer && (
        <span className={`${chip} bg-card tabular-nums ring-1 ring-border`}>
          <Clock aria-hidden="true" className="h-3.5 w-3.5" />
          {dauer}
          {content.quality ? ` · ${content.quality}` : ''}
        </span>
      )}
      {a.state === 'owned' && (
        <span className={`${chip} bg-emerald-600 text-white`}>
          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
          {a.since ? t('ownedSince', { date: format.dateTime(new Date(a.since), 'dateNumeric') }) : tc('owned')}
        </span>
      )}
      {a.state === 'subscription' && (
        <span className={`${chip} bg-emerald-600 text-white`}>
          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
          {tc('inSubscription')}
        </span>
      )}
      {content.tags.slice(0, 4).map((tag) => (
        <span key={tag} lang={lang} className="px-1 text-sm font-medium text-muted-foreground">
          #{tag}
        </span>
      ))}
    </div>
  );

  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead back={{ href: backHref, label: ctx.site.displayName }} title={content.title} lang={lang} />
        {meta}

        {paywall ? (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <div className="space-y-8">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-border">
                {content.imageLargeUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.imageLargeUrl} alt="" className="h-full w-full object-cover" />
                )}
                <MotionPreview preview={content.preview} playLabel={tc('playPreview')} pauseLabel={tc('pausePreview')} buttonClassName="bottom-4 left-4" />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black/60 via-black/10 to-transparent text-white">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/45 backdrop-blur-md">
                    <Lock aria-hidden="true" className="h-7 w-7" />
                  </span>
                  <span className="rounded-full bg-black/45 px-4 py-1.5 text-sm font-bold backdrop-blur-md">{t('lockedTitle')}</span>
                </div>
              </div>
              {content.description && <RichText markdown={content.description} lang={lang} />}
            </div>

            <aside id="kaufen" className="scroll-mt-32 lg:sticky lg:top-40">
              <div className="relative space-y-6 overflow-hidden rounded-xl border border-border bg-card p-6">
                <div aria-hidden="true" className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
                {paywall.purchase && (
                  <div className="relative">
                    <PurchasePanel ctx={ctx} panel={paywall.purchase} anchor="kaufen" />
                  </div>
                )}
                {paywall.purchase && paywall.subscription && (
                  <p className="relative flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span aria-hidden="true" className="h-px flex-1 bg-border" />
                    {t('or')}
                    <span aria-hidden="true" className="h-px flex-1 bg-border" />
                  </p>
                )}
                {paywall.subscription && (
                  <div className="relative space-y-3">
                    <p className="text-sm">
                      {t('includedIn', { names: paywall.subscription.packages.join(', ') })}
                    </p>
                    <a href={paywall.subscription.href} className={`${paywall.purchase ? btn.outline : btn.primary} w-full whitespace-normal text-center`}>
                      {ctx.fan ? t('subscribe', { name: paywall.subscription.packages[0] }) : t('viewSubscriptions')}
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        ) : (
          <div className="space-y-8">
            {media.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{t('noMedia')}</p>
            ) : content.type === 'video' ? (
              media.map((m, i) => (
                <div key={i} className="space-y-3">
                  <div className="overflow-hidden rounded-xl ring-1 ring-border">
                    <VideoPlayer file={m} className="w-full" sampleLabel={t('sampleVideo')} />
                  </div>
                  {m.downloadHref && (
                    <a href={m.downloadHref} className={btn.outline}>
                      <Download aria-hidden="true" className="h-4 w-4" />
                      {media.length > 1 ? t('downloadVideo', { n: i + 1 }) : t('download')}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {media.map((m, i) => (
                  <a key={i} href={m.url} className="group block overflow-hidden rounded-xl ring-1 ring-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.posterUrl} alt="" loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                  </a>
                ))}
              </div>
            )}
            {content.description && (
              <div className="max-w-3xl">
                <RichText markdown={content.description} lang={lang} />
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-3xl font-black tracking-tight">{t('related', { name: ctx.site.displayName })}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-5">
              {related.slice(0, 4).map((card) => (
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
