import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import { FormFields } from '@/kit/platform/form-fields';
import { RichText } from '@/kit/platform/rich-text';
import type { AuctionDetailProps, AuctionsProps, EventDetailProps, EventsProps, RequestsProps } from '@/kit/template';
import type { EventItem } from '@/kit/types';

import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { PurchasePanel } from '../bausteine/purchase-panel';
import { Shell } from '../bausteine/shell';
import { Box, btn, Card, Empty, FlashBox, input, Page, Title } from '../bausteine/ui';

function EventBadges({ e }: { e: EventItem }) {
  const t = useTranslations('events');
  return (
    <div className="flex flex-wrap gap-1 text-xs">
      {e.status === 'cancelled' && <span className="rounded bg-red-600 px-1.5 py-0.5 text-white">{t('cancelled')}</span>}
      {e.status === 'postponed' && <span className="rounded bg-amber-500 px-1.5 py-0.5 text-white">{t('postponed')}</span>}
      {e.online && <span className="rounded border border-border px-1.5 py-0.5">{t('online')}</span>}
      {e.type && <span className="uppercase tracking-wide text-muted-foreground">{e.type}</span>}
    </div>
  );
}

function EventRow({ e, lang }: { e: EventItem; lang: string }) {
  const format = useFormatter();
  const t = useTranslations('events');
  const ort = [e.location.name, e.location.city].filter(Boolean).join(', ');
  return (
    <a href={e.href} className="flex gap-4 rounded-xl border border-border bg-card p-3">
      {e.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={e.imageUrl} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover sm:w-40" />
      )}
      <div className="min-w-0 space-y-1">
        <EventBadges e={e} />
        <h2 lang={lang} className={`font-semibold ${e.status === 'cancelled' ? 'line-through' : ''}`}>
          {e.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {format.dateTime(new Date(e.startAt), 'dateTimeWeekdayShort')}
          {ort && ` · ${ort}`}
        </p>
        {e.admission && <p lang={lang} className="text-xs text-muted-foreground">{t('admission')}: {e.admission}</p>}
      </div>
    </a>
  );
}

export function Events({ ctx, events, cityFilter, near, flash }: EventsProps) {
  const t = useTranslations('events');
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <Title>{t('title')}</Title>
        <form action={cityFilter.action} method="get" className="mb-6 flex gap-2">
          {Object.entries(cityFilter.hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <input name="stadt" defaultValue={cityFilter.value} placeholder={t('filterPlaceholder')} className={input} />
          <button type="submit" className={btn.outline}>
            {t('filter')}
          </button>
          {cityFilter.resetHref && (
            <a href={cityFilter.resetHref} className="self-center text-sm underline">
              {t('reset')}
            </a>
          )}
        </form>
        {near && (
          <Card className="mb-6 space-y-3">
            <h2 className="font-semibold">{t('near')}</h2>
            {near.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('nearEmpty')}</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {near.events.map((e) => (
                  <li key={e.id}>
                    <a href={e.href} className="underline">
                      {e.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">{t('subscribeHint')} ({near.cities.join(', ')})</p>
            <form method="post" action={near.subscribe.action} className="flex gap-2">
              <FormFields target={near.subscribe} />
              <input name="city" placeholder={t('cityPlaceholder')} className={input} />
              <button type="submit" className={btn.outline}>
                {t('subscribe')}
              </button>
            </form>
            <FlashBox flash={flash} />
          </Card>
        )}
        {events.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <EventRow key={e.id} e={e} lang={lang} />
            ))}
          </div>
        )}
      </Page>
    </Shell>
  );
}

export function EventDetail({ ctx, event: e, backHref }: EventDetailProps) {
  const t = useTranslations('events');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  const l = e.location;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <a href={backHref} className="text-sm text-muted-foreground">
          {t('back')}
        </a>
        {e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt="" className="mt-4 max-h-[28rem] w-full rounded-xl object-cover" />
        )}
        <div className="mt-4 space-y-2">
          <EventBadges e={e} />
          <h1 lang={lang} className="text-2xl font-semibold">
            {e.title}
          </h1>
          {e.statusNote && <Box kind="warning">{e.statusNote}</Box>}
        </div>
        <Card className="mt-6">
          <dl className="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">{t('when')}</dt>
            <dd>
              {format.dateTime(new Date(e.startAt), 'dateTimeFull')}
              {e.endAt && ` – ${format.dateTime(new Date(e.endAt), 'dateTimeFull')}`}
              {e.calendarHref && e.status !== 'cancelled' && (
                <a href={e.calendarHref} className="ml-2 underline">
                  {t('addToCalendar')}
                </a>
              )}
            </dd>
            <dt className="text-muted-foreground">{t('where')}</dt>
            <dd>
              {e.online ? (
                e.onlineUrl && <a href={e.onlineUrl} className="underline">{t('onlineLink')}</a>
              ) : (
                <>
                  {l.name && <strong>{l.name}</strong>}
                  {l.address && <div>{l.address}</div>}
                  {l.city && <div>{l.city}</div>}
                  <div className="space-x-3">
                    {l.mapHref && <a href={l.mapHref} className="underline">{t('openMap')}</a>}
                    {l.website && <a href={l.website} className="underline">{t('website')}</a>}
                  </div>
                </>
              )}
            </dd>
            {e.admission && (
              <>
                <dt className="text-muted-foreground">{t('admission')}</dt>
                <dd lang={lang}>{e.admission}</dd>
              </>
            )}
          </dl>
        </Card>
        {e.ticketUrl && e.status !== 'cancelled' && (
          <a href={e.ticketUrl} className={`${btn.primary} mt-4`}>
            {t('tickets')}
          </a>
        )}
        {e.description && <RichText markdown={e.description} lang={lang} className="mt-6" />}
      </Page>
    </Shell>
  );
}

export function Auctions({ ctx, auctions }: AuctionsProps) {
  const t = useTranslations('auctions');
  const format = useFormatter();
  return (
    <Shell ctx={ctx}>
      <Page>
        <Title>{t('title')}</Title>
        {auctions.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {auctions.map((a) => (
              <a key={a.id} href={a.href} className="block rounded-xl border border-border bg-card p-4">
                <h2 lang={ctx.site.mainLanguage} className="font-semibold">
                  {a.title}
                </h2>
                <p lang={ctx.site.mainLanguage} className="line-clamp-2 text-sm text-muted-foreground">
                  {a.description}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('currentBid')}</p>
                    <p className="text-xl font-semibold text-primary">{formatPrice(format, a.currentBidCents)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {a.state.kind === 'open' ? t('endsAt', { date: format.dateTime(new Date(a.endsAt), 'dateTimeShort') }) : t('ended')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </Page>
    </Shell>
  );
}

export function AuctionDetail({ ctx, auction: a, backHref, confirm, flash }: AuctionDetailProps) {
  const t = useTranslations('auctions');
  const format = useFormatter();
  const s = a.state;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <a href={backHref} className="text-sm text-muted-foreground">
          {t('back')}
        </a>
        <h1 lang={ctx.site.mainLanguage} className="mt-4 text-2xl font-semibold">
          {a.title}
        </h1>
        {a.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.imageUrl} alt="" className="mt-4 w-full rounded-xl object-cover" />
        )}
        <RichText markdown={a.description} lang={ctx.site.mainLanguage} className="mt-4" />
        <Card className="mt-6 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{a.currentBidCents > a.startPriceCents ? t('highestBid') : t('startPrice')}</p>
              <p className="text-2xl font-semibold">{formatPrice(format, a.currentBidCents)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {s.kind === 'open' ? t('endsAt', { date: format.dateTime(new Date(a.endsAt), 'dateTimeShort') }) : t('ended')}
            </p>
          </div>
          {s.kind === 'open' && !s.bid && (
            <a href={ctx.links.login} className={btn.primary}>
              {t('loginToBid')}
            </a>
          )}
          {s.kind === 'open' && s.bid && (
            <form method="post" action={s.bid.action} className="space-y-2">
              <FormFields target={s.bid} />
              <p className="text-sm text-muted-foreground">{t('minBid', { amount: formatPrice(format, s.minBidCents) })}</p>
              <div className="flex gap-2">
                <input name="amount" type="number" min={s.minBidCents / 100} step="1" className={input} />
                <button type="submit" className={btn.primary}>
                  {t('bid')}
                </button>
              </div>
              {s.myBidCents != null && <p className="text-sm">{t('myBid', { amount: formatPrice(format, s.myBidCents) })}</p>}
            </form>
          )}
          {s.kind === 'won' && (
            <>
              <p>{t('won', { amount: formatPrice(format, a.currentBidCents) })}</p>
              <PurchasePanel ctx={ctx} panel={s.purchase} />
            </>
          )}
          {s.kind === 'won_paid' && <Box kind="success">{t('wonPaid')}</Box>}
          {s.kind === 'closed' && <p className="text-sm text-muted-foreground">{t('closed')}</p>}
          <FlashBox flash={flash} />
        </Card>
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

const STATUS: Record<string, string> = {
  open: 'bg-amber-500',
  negotiating: 'bg-violet-600',
  accepted: 'bg-blue-600',
  delivered: 'bg-emerald-600',
  rejected: 'bg-zinc-500',
  cancelled: 'bg-zinc-500'
};

export function Requests({ ctx, intro, create, requests, confirm, flash }: RequestsProps) {
  const t = useTranslations('requests');
  const tc = useTranslations('common');
  const format = useFormatter();
  if (!ctx.fan) {
    return (
      <Shell ctx={ctx}>
        <Page width="max-w-3xl">
          <Title>{t('title')}</Title>
          <p className="mb-4 text-sm text-muted-foreground">{tc('loginRequired')}</p>
          <a href={ctx.links.login} className={btn.primary}>
            {tc('loginButton')}
          </a>
        </Page>
      </Shell>
    );
  }
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <Title>{t('title')}</Title>
        <p lang={ctx.site.mainLanguage} className="mb-4 text-sm text-muted-foreground">
          {intro}
        </p>
        <Card className="mb-8">
          <form method="post" action={create.action} className="space-y-3">
            <FormFields target={create} />
            <label className="block text-sm">
              {t('what')}
              <textarea name="description" rows={4} className={`${input} mt-1`} />
            </label>
            <label className="block text-sm">
              {t('offer')}
              <input name="offer" type="number" defaultValue={20} min={1} className={`${input} mt-1 w-32`} />
            </label>
            <button type="submit" className={btn.primary}>
              {t('submit')}
            </button>
            <FlashBox flash={flash} />
          </form>
        </Card>
        <h2 className="mb-3 text-lg font-semibold">{t('mine')}</h2>
        {requests.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <Card key={r.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm">{r.description}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs text-white ${STATUS[r.status]}`}>{t(`status.${r.status}`)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium">{formatPrice(format, r.offeredCents)}</span>
                  {r.deliveryHref && <a href={r.deliveryHref} className={btn.small}>{t('viewDelivery')}</a>}
                  {r.cancel && (
                    <form method="post" action={r.cancel.action}>
                      <FormFields target={r.cancel} />
                      <button type="submit" className={btn.small}>
                        {t('cancel')}
                      </button>
                    </form>
                  )}
                </div>
                <div className="space-y-2">
                  {r.messages.length === 0 && <p className="text-xs text-muted-foreground">{t('noMessages')}</p>}
                  {r.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'fan' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === 'fan' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p>{m.body}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {m.from === 'fan' ? t('you') : t('model')} · {format.dateTime(new Date(m.at), 'dateTimeNumeric')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {r.reply && (
                  <form method="post" action={r.reply.action} className="flex gap-2">
                    <FormFields target={r.reply} />
                    <input name="body" placeholder={t('messagePlaceholder')} className={input} />
                    <button type="submit" className={btn.outline}>
                      {t('send')}
                    </button>
                  </form>
                )}
                {r.purchase && (
                  <div className="space-y-2 border-t border-border pt-3">
                    <p className="text-sm">{t('deliveredPay')}</p>
                    <PurchasePanel ctx={ctx} panel={r.purchase} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}
