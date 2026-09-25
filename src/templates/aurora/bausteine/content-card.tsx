import { Check, Clock, Images, Lock, Video } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatDuration, formatPrice } from '@/kit/format';
import { MotionPreview } from '@/kit/platform/motion-preview';
import type { ContentCardProps } from '@/kit/template';

/**
 * Aurora-Kachel: feste Hochformat-Fläche 3:4 (Bilder jeder Form werden zugeschnitten), darunter Titel,
 * Datum und Zugangszeile mit fester Höhe — Größe und Anordnung ändern sich in keinem Zustand.
 * Ecken: Art oben links · Besitz oben rechts · Laufzeit/Qualität bzw. Bildanzahl unten rechts ·
 * Vorschau-Knopf (Touch) unten links · Schloss mittig. Vorschaubilder bleiben scharf.
 */
export function ContentCard({ ctx, card, size = 'small' }: ContentCardProps) {
  const t = useTranslations('card');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const a = card.access;
  const dauer = formatDuration(card.durationSeconds);
  const bild = size === 'large' ? card.imageLargeUrl ?? card.imageUrl : card.imageUrl;
  const chip = 'absolute z-10 inline-flex h-6 items-center gap-1 rounded-full bg-black/60 px-2 text-[11px] font-semibold text-white';
  return (
    <a
      href={card.href}
      title={card.title}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {bild && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bild} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent via-40% to-black/55" />
        <MotionPreview preview={card.preview} playLabel={t('playPreview')} pauseLabel={t('pausePreview')} />

        <span className={`${chip} left-2 top-2 w-7 justify-center px-0`} title={card.type === 'video' ? t('video') : t('gallery')}>
          {card.type === 'video' ? <Video aria-hidden="true" className="h-3.5 w-3.5" /> : <Images aria-hidden="true" className="h-3.5 w-3.5" />}
          <span className="sr-only">{card.type === 'video' ? t('video') : t('gallery')}</span>
        </span>

        {(a.state === 'owned' || a.state === 'subscription') && (
          <span className={`${chip} right-2 top-2 max-w-[calc(100%-3rem)] bg-emerald-600`}>
            <Check aria-hidden="true" className="h-3 w-3 shrink-0" strokeWidth={3} />
            <span className="truncate">{a.state === 'owned' ? t('owned') : t('inSubscription')}</span>
          </span>
        )}

        {a.state === 'locked' && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white" aria-label={t('locked')}>
              <Lock aria-hidden="true" className="h-5 w-5" />
            </span>
          </span>
        )}

        {card.type === 'video' && dauer && (
          <span className={`${chip} bottom-2 right-2 tabular-nums`}>
            <Clock aria-hidden="true" className="h-3 w-3" />
            {dauer}
            {card.quality ? ` · ${card.quality}` : ''}
          </span>
        )}
        {card.type === 'photo_gallery' && card.imageCount != null && (
          <span className={`${chip} bottom-2 right-2`}>{t('images', { count: card.imageCount })}</span>
        )}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-1.5 p-3">
        <h3 lang={ctx.site.mainLanguage} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5">
          {card.title}
        </h3>
        <time dateTime={card.createdAt} className="truncate text-xs text-muted-foreground">
          {format.dateTime(new Date(card.createdAt), 'dateLong')}
        </time>
        {/* Zugangszeile mit fester Höhe — leer bei frei/gekauft/im Abo, damit alle Kacheln gleich hoch bleiben. */}
        <div className="flex h-6 min-w-0 items-center gap-1.5">
          {a.state === 'locked' && a.priceCents != null && (
            <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-red-600 px-2 text-xs font-bold tabular-nums text-white">
              {formatPrice(format, a.priceCents)}
            </span>
          )}
          {a.state === 'locked' && a.priceCents != null && a.packages.length > 0 && (
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{tA('or')}</span>
          )}
          {a.state === 'locked' && a.packages.length > 0 && (
            <span lang={ctx.site.mainLanguage} className="inline-flex h-6 min-w-0 items-center rounded-md bg-red-600 px-2 text-xs font-bold text-white">
              <span className="truncate">{a.packages.join(' · ')}</span>
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
