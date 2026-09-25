import { Check, Clock, Images, Lock, Video } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatDuration, formatPrice } from '@/kit/format';
import { MotionPreview } from '@/kit/platform/motion-preview';
import type { ContentCardProps } from '@/kit/template';

/**
 * Aurora-Kachel: randloses Bild mit großem Radius und weichem Leuchten beim Überfahren, darunter
 * Titel, Datum und Zugangszeile mit fester Höhe — Größe und Anordnung ändern sich in keinem Zustand.
 * `size="large"`: Bildfläche füllt die Höhe ihrer Rasterzelle (Bento-Aufmacher), sonst fest 3:4.
 * Ecken: Art oben links · Besitz oben rechts · Laufzeit/Bildanzahl unten rechts · Vorschau-Knopf
 * (Touch) unten links · Schloss mittig. Vorschaubilder bleiben scharf.
 */
export function ContentCard({ ctx, card, size = 'small' }: ContentCardProps) {
  const t = useTranslations('card');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const a = card.access;
  const large = size === 'large';
  const dauer = formatDuration(card.durationSeconds);
  const bild = large ? card.imageLargeUrl ?? card.imageUrl : card.imageUrl;
  const chip = 'absolute z-10 inline-flex h-7 items-center gap-1 rounded-full bg-black/55 px-2.5 text-[11px] font-semibold text-white backdrop-blur-md';
  return (
    <a href={card.href} title={card.title} className="group flex h-full flex-col gap-3 rounded-2xl outline-offset-4">
      <div
        className={`relative overflow-hidden rounded-2xl bg-muted ring-1 ring-border transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:ring-primary/60 motion-reduce:transform-none ${
          large ? 'aspect-[3/4] sm:aspect-auto sm:min-h-[18rem] sm:flex-1' : 'aspect-[3/4]'
        }`}
      >
        {bild && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bild} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent via-45% to-black/50" />
        <MotionPreview preview={card.preview} playLabel={t('playPreview')} pauseLabel={t('pausePreview')} buttonClassName="bottom-2.5 left-2.5" />

        <span className={`${chip} left-2.5 top-2.5`}>
          {card.type === 'video' ? <Video aria-hidden="true" className="h-3.5 w-3.5" /> : <Images aria-hidden="true" className="h-3.5 w-3.5" />}
          {card.type === 'video' ? t('video') : t('gallery')}
        </span>

        {(a.state === 'owned' || a.state === 'subscription') && (
          <span className={`${chip} right-2.5 top-2.5 max-w-[calc(100%-6.5rem)] bg-emerald-600/90`}>
            <Check aria-hidden="true" className="h-3 w-3 shrink-0" strokeWidth={3} />
            <span className="truncate">{a.state === 'owned' ? t('owned') : t('inSubscription')}</span>
          </span>
        )}
        {a.state === 'locked' && (
          <span lang={ctx.site.mainLanguage} className={`${chip} right-2.5 top-2.5 max-w-[calc(100%-6.5rem)] bg-red-600/95`}>
            <span className="truncate tabular-nums">{a.priceCents != null ? formatPrice(format, a.priceCents) : a.packages.join(' · ') || t('subscription')}</span>
          </span>
        )}

        {a.state === 'locked' && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md" aria-label={t('locked')}>
              <Lock aria-hidden="true" className="h-5 w-5" />
            </span>
          </span>
        )}

        {card.type === 'video' && dauer && (
          <span className={`${chip} bottom-2.5 right-2.5 tabular-nums`}>
            <Clock aria-hidden="true" className="h-3 w-3" />
            {dauer}
            {card.quality ? ` · ${card.quality}` : ''}
          </span>
        )}
        {card.type === 'photo_gallery' && card.imageCount != null && (
          <span className={`${chip} bottom-2.5 right-2.5`}>{t('images', { count: card.imageCount })}</span>
        )}
        {/* Maus: Aufforderung am unteren Rand (Touch-Geräte sehen sie nicht). */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-20 hidden h-9 translate-y-2 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex">
          {a.state === 'locked' ? tA('unlock') : tA('watch')}
        </span>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-1 px-0.5">
        <h3 lang={ctx.site.mainLanguage} className={`line-clamp-2 font-semibold leading-snug tracking-tight ${large ? 'min-h-[2.75rem] text-base' : 'min-h-[2.5rem] text-sm'}`}>
          {card.title}
        </h3>
        <time dateTime={card.createdAt} className="truncate text-xs text-muted-foreground">
          {format.dateTime(new Date(card.createdAt), 'dateLong')}
        </time>
        {/* Zugangszeile mit fester Höhe: bei „Einzelkauf oder Abo" steht hier die Abo-Alternative (Preis oben im Bild). */}
        <div className="flex h-6 min-w-0 items-center gap-1.5 overflow-hidden text-xs">
          {a.state === 'locked' && a.priceCents != null && a.packages.length > 0 && (
            <>
              <span className="shrink-0 text-muted-foreground">{tA('or')}</span>
              <span lang={ctx.site.mainLanguage} className="inline-flex h-6 min-w-0 items-center rounded-full bg-red-600 px-2.5 font-bold text-white">
                <span className="truncate">{a.packages.join(' · ')}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
