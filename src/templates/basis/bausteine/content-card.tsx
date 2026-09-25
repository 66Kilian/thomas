import { useFormatter, useTranslations } from 'next-intl';

import { formatDuration, formatPrice } from '@/kit/format';
import { MotionPreview } from '@/kit/platform/motion-preview';
import type { ContentCardProps } from '@/kit/template';

/**
 * Inhaltskachel. Ecken-Belegung (bitte beibehalten): Art oben links · Besitz oben rechts ·
 * Laufzeit/Qualität unten rechts · Vorschau-Knopf (Touch) unten links · Schloss in der Mitte.
 * Feste Kachelform (hier 4:5) — Hoch- und Querformat werden zugeschnitten (object-cover).
 */
export function ContentCard({ ctx, card, size = 'small' }: ContentCardProps) {
  const t = useTranslations('card');
  const format = useFormatter();
  const a = card.access;
  const dauer = formatDuration(card.durationSeconds);
  const bild = size === 'large' ? card.imageLargeUrl : card.imageUrl;
  return (
    <a href={card.href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        {bild && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bild} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
        )}
        <MotionPreview preview={card.preview} playLabel={t('playPreview')} pauseLabel={t('pausePreview')} />
        <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[11px] text-white">
          {card.type === 'video' ? t('video') : t('gallery')}
        </span>
        {(a.state === 'owned' || a.state === 'subscription') && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white">
            ✓ {a.state === 'owned' ? t('owned') : t('inSubscription')}
          </span>
        )}
        {a.state === 'locked' && (
          <span
            className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            aria-label={t('locked')}
          >
            🔒
          </span>
        )}
        {card.type === 'video' && dauer && (
          <span className="absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[11px] tabular-nums text-white">
            🕐 {dauer}
            {card.quality ? ` · ${card.quality}` : ''}
          </span>
        )}
        {card.type === 'photo_gallery' && card.imageCount != null && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">
            {t('images', { count: card.imageCount })}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <h3 lang={ctx.site.mainLanguage} className="line-clamp-2 text-sm font-medium" title={card.title}>
          {card.title}
        </h3>
        {a.state === 'free' && <span className="shrink-0 text-xs text-emerald-700">{t('free')}</span>}
        {a.state === 'locked' && a.priceCents != null && <span className="shrink-0 text-xs font-medium">{formatPrice(format, a.priceCents)}</span>}
        {a.state === 'locked' && a.priceCents == null && a.packages.length > 0 && (
          <span className="shrink-0 text-xs text-muted-foreground">{a.packages.join(', ')}</span>
        )}
      </div>
    </a>
  );
}
