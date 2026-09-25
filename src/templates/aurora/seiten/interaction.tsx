import { ArrowRight, CalendarPlus, Clock, Gavel, Globe, MapPin, Map as MapIcon, MessageCircle, Search, Send, Ticket, Timer } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import { FormFields } from '@/kit/platform/form-fields';
import { RichText } from '@/kit/platform/rich-text';
import type { AuctionDetailProps, AuctionsProps, EventDetailProps, EventsProps, RequestsProps } from '@/kit/template';
import type { EventItem } from '@/kit/types';

import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { PurchasePanel } from '../bausteine/purchase-panel';
import { Shell } from '../bausteine/shell';
import { Box, btn, Card, Empty, FlashBox, input, label, Page, PageHead } from '../bausteine/ui';

// ─── Events ────────────────────────────────────────────────────────────────────────────────────

function EventBadges({ e }: { e: EventItem }) {
  const t = useTranslations('events');
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
      {e.status === 'cancelled' && <span className="rounded-full bg-red-600 px-2.5 py-1 text-white">{t('cancelled')}</span>}
      {e.status === 'postponed' && <span className="rounded-full bg-amber-400 px-2.5 py-1 text-amber-950">{t('postponed')}</span>}
      {e.online && (
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 ring-1 ring-border">
          <Globe aria-hidden="true" className="h-3 w-3" />
          {t('online')}
        </span>
      )}
      {e.type && <span className="px-1 text-muted-foreground">{e.type}</span>}
    </div>
  );
}

/** Kalenderblatt: Wochentag · Tag · Monat. */
function DateTile({ iso, large, muted }: { iso: string; large?: boolean; muted?: boolean }) {
  const format = useFormatter();
  const d = new Date(iso);
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl text-center ${large ? 'h-28 w-24' : 'h-20 w-[4.5rem]'} ${
        muted ? 'bg-card text-muted-foreground ring-1 ring-border' : 'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25'
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider opacity-85">{format.dateTime(d, { weekday: 'short' })}</span>
      <span className={`font-black leading-none tabular-nums ${large ? 'text-5xl' : 'text-3xl'}`}>{format.dateTime(d, { day: 'numeric' })}</span>
      <span className="text-[11px] font-bold uppercase tracking-wider opacity-85">{format.dateTime(d, { month: 'short' })}</span>
    </div>
  );
}

function place(e: EventItem) {
  return [e.location.name, e.location.city].filter(Boolean).join(', ');
}

function EventRow({ e, lang }: { e: EventItem; lang: string }) {
  const format = useFormatter();
  const t = useTranslations('events');
  const tA = useTranslations('tpl_aurora');
  const off = e.status === 'cancelled';
  const ort = place(e);
  const act = 'inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-bold';
  return (
    <article className={`group rounded-xl border border-border bg-card p-4 transition hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 sm:p-5 ${off ? 'opacity-70' : ''}`}>
      <div className="flex gap-4 sm:gap-5">
        <DateTile iso={e.startAt} muted={off} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <EventBadges e={e} />
          <h3 lang={lang} className={`text-lg font-bold leading-snug tracking-tight sm:text-xl ${off ? 'line-through' : ''}`}>
            <a href={e.href} className="hover:underline">{e.title}</a>
          </h3>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {format.dateTime(new Date(e.startAt), { hour: '2-digit', minute: '2-digit' })}
              {e.endAt && ` – ${format.dateTime(new Date(e.endAt), { hour: '2-digit', minute: '2-digit' })}`}
            </span>
            {(ort || e.online) && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                {e.online ? <Globe aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{e.online ? t('online') : ort}</span>
              </span>
            )}
          </p>
          {e.admission && (
            <p lang={lang} className="pt-1">
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-xl bg-background px-3 py-1.5 text-xs font-semibold ring-1 ring-border">
                <Ticket aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[color:var(--brand-link,var(--primary))]" />
                <span className="truncate">{e.admission}</span>
              </span>
            </p>
          )}
        </div>
        {e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt="" className="hidden h-24 w-36 shrink-0 rounded-xl object-cover md:block" />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 sm:pl-[5.75rem]">
        {e.ticketUrl && !off && (
          <a href={e.ticketUrl} className={`${act} bg-primary text-primary-foreground`}>
            <Ticket aria-hidden="true" className="h-3.5 w-3.5" />
            {t('tickets')}
          </a>
        )}
        {e.calendarHref && !off && (
          <a href={e.calendarHref} className={`${act} bg-background ring-1 ring-border hover:ring-primary`}>
            <CalendarPlus aria-hidden="true" className="h-3.5 w-3.5" />
            {tA('calendar')}
          </a>
        )}
        {e.location.mapHref && !e.online && (
          <a href={e.location.mapHref} className={`${act} bg-background ring-1 ring-border hover:ring-primary`}>
            <MapIcon aria-hidden="true" className="h-3.5 w-3.5" />
            {tA('map')}
          </a>
        )}
        <a href={e.href} className={`${act} ml-auto text-muted-foreground hover:text-foreground`}>
          {tA('details')}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

/** Nächster Termin groß — mit Bild als Hintergrund, sonst Lichtschein der Farbwelt. */
function NextEvent({ e, lang }: { e: EventItem; lang: string }) {
  const format = useFormatter();
  const t = useTranslations('events');
  const tA = useTranslations('tpl_aurora');
  const ort = place(e);
  return (
    <article className="group relative overflow-hidden rounded-xl border border-primary/40 bg-card shadow-2xl shadow-primary/15">
      {e.imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={e.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/25" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/30 via-card to-card">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        </div>
      )}
      <div className={`relative flex min-h-[20rem] flex-col justify-end gap-5 p-6 sm:p-8 ${e.imageUrl ? 'text-white' : ''}`}>
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          {tA('nextEvent')}
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <DateTile iso={e.startAt} large />
          <div className="min-w-0 flex-1 space-y-2">
            <h2 lang={lang} className="break-words text-3xl font-black leading-tight tracking-tight sm:text-4xl">{e.title}</h2>
            <p className="flex flex-col gap-1 text-sm opacity-90">
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {format.dateTime(new Date(e.startAt), 'dateTimeFull')}
              </span>
              {(ort || e.online) && (
                <span className="inline-flex items-center gap-1.5">
                  {e.online ? <Globe aria-hidden="true" className="h-4 w-4" /> : <MapPin aria-hidden="true" className="h-4 w-4" />}
                  {e.online ? t('online') : [e.location.address, e.location.city].filter(Boolean).join(', ') || ort}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {e.ticketUrl ? (
            <a href={e.ticketUrl} className={btn.primary}>
              <Ticket aria-hidden="true" className="h-4 w-4" />
              {t('tickets')}
            </a>
          ) : (
            <a href={e.href} className={btn.primary}>
              {tA('details')}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
          {e.calendarHref && (
            <a href={e.calendarHref} className="inline-flex h-11 items-center gap-2 rounded-lg bg-black/35 px-5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-md">
              <CalendarPlus aria-hidden="true" className="h-4 w-4" />
              {tA('calendar')}
            </a>
          )}
          {e.location.mapHref && !e.online && (
            <a href={e.location.mapHref} className="inline-flex h-11 items-center gap-2 rounded-lg bg-black/35 px-5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-md">
              <MapIcon aria-hidden="true" className="h-4 w-4" />
              {tA('map')}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Events({ ctx, events, cityFilter, near, flash }: EventsProps) {
  const t = useTranslations('events');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  const next = !cityFilter.value ? events.find((e) => e.status !== 'cancelled') : undefined;
  const rest = events.filter((e) => e !== next);
  const cities = [...new Set(events.map((e) => e.location.city).filter((c): c is string => Boolean(c)))];
  // Nach Monat gruppieren (Reihenfolge der Plattform bleibt erhalten).
  const groups: { key: string; items: EventItem[] }[] = [];
  for (const e of rest) {
    const key = format.dateTime(new Date(e.startAt), { month: 'long', year: 'numeric' });
    const g = groups.find((x) => x.key === key);
    if (g) g.items.push(e);
    else groups.push({ key, items: [e] });
  }
  const chip = 'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition';
  return (
    <Shell ctx={ctx}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1fr_28rem] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--primary))]">{tA('liveEyebrow')}</p>
            <h1 className="mt-3 break-words text-5xl font-black leading-[1.02] tracking-tighter sm:text-7xl">{tA('liveTitle', { name: ctx.site.displayName })}</h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">{tA('liveSub')}</p>
            <p className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex h-9 items-center rounded-full bg-card px-4 text-sm font-semibold ring-1 ring-border">{tA('dates', { count: events.length })}</span>
              {cities.length > 0 && <span className="inline-flex h-9 items-center rounded-full bg-card px-4 text-sm font-semibold ring-1 ring-border">{tA('cities', { count: cities.length })}</span>}
            </p>
          </div>
          {next && <NextEvent e={next} lang={lang} />}
        </div>
      </section>

      {/* Stadt-Auswahl: Pillen (je ein GET-Formular des Stadtfilters) + freie Suche. Funktioniert ohne JavaScript. */}
      <div className="sticky top-[5.25rem] z-30 border-y border-border bg-background/80 backdrop-blur-xl sm:top-[7.75rem]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:thin]">
          {cityFilter.resetHref ? (
            <a href={cityFilter.resetHref} className={`${chip} bg-card ring-1 ring-border hover:ring-primary`}>{tA('all')}</a>
          ) : (
            <span aria-current="true" className={`${chip} bg-foreground text-background`}>{tA('all')}</span>
          )}
          {cities.map((c) => {
            const on = cityFilter.value.toLowerCase() === c.toLowerCase();
            return (
              <form key={c} action={cityFilter.action} method="get" className="shrink-0">
                {Object.entries(cityFilter.hidden).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
                <input type="hidden" name="stadt" value={c} />
                <button type="submit" aria-pressed={on} className={`${chip} ${on ? 'bg-foreground text-background' : 'bg-card ring-1 ring-border hover:ring-primary'}`}>
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {c}
                </button>
              </form>
            );
          })}
          <form action={cityFilter.action} method="get" role="search" className="relative ml-auto hidden shrink-0 sm:block">
            {Object.entries(cityFilter.hidden).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <label>
              <span className="sr-only">{t('filterPlaceholder')}</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input name="stadt" defaultValue={cities.some((c) => c.toLowerCase() === cityFilter.value.toLowerCase()) ? '' : cityFilter.value} placeholder={t('filterPlaceholder')} className={`${input} h-10 w-56 rounded-lg pl-10`} />
            </label>
          </form>
        </div>
      </div>

      <Page width="max-w-4xl">
        {near && (
          <section className="relative mb-12 overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_20rem]">
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
                  <MapPin aria-hidden="true" className="h-5 w-5 text-[color:var(--brand-link,var(--primary))]" />
                  {t('near')}
                </h2>
                {near.cities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {near.cities.map((c) => (
                      <span key={c} className="inline-flex h-8 items-center rounded-full bg-background px-3.5 text-sm font-semibold ring-1 ring-border">{c}</span>
                    ))}
                  </div>
                )}
                {near.events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('nearEmpty')}</p>
                ) : (
                  <ul className="space-y-2">
                    {near.events.map((e) => (
                      <li key={e.id}>
                        <a href={e.href} className="flex items-center gap-3 rounded-xl bg-background/70 px-4 py-3 text-sm hover:ring-1 hover:ring-primary">
                          <span className="font-bold tabular-nums">{format.dateTime(new Date(e.startAt), 'dateTimeShort')}</span>
                          <span lang={lang} className="truncate">{e.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <form method="post" action={near.subscribe.action} className="space-y-3 self-end">
                <FormFields target={near.subscribe} />
                <p className="text-xs text-muted-foreground">{t('subscribeHint')}</p>
                <div className="flex gap-2">
                  <input name="city" placeholder={t('cityPlaceholder')} className={`${input} h-11`} />
                  <button type="submit" className={btn.primary}>{t('subscribe')}</button>
                </div>
                <FlashBox flash={flash} />
              </form>
            </div>
          </section>
        )}

        {events.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.key}>
                <h2 className="mb-5 flex items-baseline gap-3">
                  <span className="text-3xl font-black tracking-tight">{g.key}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{tA('dates', { count: g.items.length })}</span>
                  <span aria-hidden="true" className="h-px flex-1 self-center bg-border" />
                </h2>
                <div className="space-y-3">
                  {g.items.map((e) => (
                    <EventRow key={e.id} e={e} lang={lang} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Page>
    </Shell>
  );
}

export function EventDetail({ ctx, event: e, backHref }: EventDetailProps) {
  const t = useTranslations('events');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  const l = e.location;
  const off = e.status === 'cancelled';
  const info = 'flex gap-4 border-t border-border py-5 first:border-t-0 first:pt-0';
  const icon = 'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-[color:var(--brand-link,var(--primary))]';
  const link = 'inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4';
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-5xl">
        <PageHead back={{ href: backHref, label: tA('allEvents') }} title={<span className={off ? 'line-through decoration-4' : ''}>{e.title}</span>} lang={lang} />
        <div className="-mt-6 mb-8 space-y-3">
          <EventBadges e={e} />
          {e.statusNote && <Box kind={off ? 'error' : 'warning'}>{e.statusNote}</Box>}
        </div>

        {e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt="" className="mb-10 aspect-[21/9] w-full rounded-xl object-cover" />
        )}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="order-2 lg:order-1">{e.description && <RichText markdown={e.description} lang={lang} />}</div>

          <aside className="order-1 space-y-4 lg:sticky lg:top-40 lg:order-2">
            <Card>
              <div className="flex items-center gap-4 pb-5">
                <DateTile iso={e.startAt} muted={off} />
                <div className="min-w-0 text-sm">
                  <p className="font-bold">{format.dateTime(new Date(e.startAt), 'dateTimeFull')}</p>
                  {e.endAt && <p className="text-muted-foreground">– {format.dateTime(new Date(e.endAt), 'dateTimeFull')}</p>}
                </div>
              </div>
              <dl>
                {e.calendarHref && !off && (
                  <div className={info}>
                    <span className={icon}><CalendarPlus aria-hidden="true" className="h-5 w-5" /></span>
                    <div>
                      <dt className="sr-only">{t('when')}</dt>
                      <dd><a href={e.calendarHref} className={link}>{t('addToCalendar')}</a></dd>
                    </div>
                  </div>
                )}
                <div className={info}>
                  <span className={icon}>{e.online ? <Globe aria-hidden="true" className="h-5 w-5" /> : <MapPin aria-hidden="true" className="h-5 w-5" />}</span>
                  <div className="min-w-0 space-y-1 text-sm">
                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('where')}</dt>
                    {e.online ? (
                      <dd>{e.onlineUrl && <a href={e.onlineUrl} className={link}>{t('onlineLink')}</a>}</dd>
                    ) : (
                      <dd className="space-y-1">
                        {l.name && <p className="font-bold">{l.name}</p>}
                        {l.address && <p>{l.address}</p>}
                        {l.city && <p>{l.city}</p>}
                        <p className="flex flex-wrap gap-4 pt-1">
                          {l.mapHref && (
                            <a href={l.mapHref} className={link}>
                              <MapIcon aria-hidden="true" className="h-4 w-4" />
                              {t('openMap')}
                            </a>
                          )}
                          {l.website && <a href={l.website} className={link}>{t('website')}</a>}
                        </p>
                      </dd>
                    )}
                  </div>
                </div>
                {e.admission && (
                  <div className={info}>
                    <span className={icon}><Ticket aria-hidden="true" className="h-5 w-5" /></span>
                    <div className="text-sm">
                      <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('admission')}</dt>
                      <dd lang={lang} className="font-semibold">{e.admission}</dd>
                    </div>
                  </div>
                )}
              </dl>
              {e.ticketUrl && !off && (
                <a href={e.ticketUrl} className={`${btn.large} mt-2 w-full`}>
                  <Ticket aria-hidden="true" className="h-5 w-5" />
                  {t('tickets')}
                </a>
              )}
            </Card>
          </aside>
        </div>
      </Page>
    </Shell>
  );
}

// ─── Auktionen ─────────────────────────────────────────────────────────────────────────────────

export function Auctions({ ctx, auctions }: AuctionsProps) {
  const t = useTranslations('auctions');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead eyebrow={tA('auctionsEyebrow')} title={t('title')} />
        {auctions.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {auctions.map((a) => {
              const open = a.state.kind === 'open';
              return (
                <a key={a.id} href={a.href} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary hover:shadow-2xl hover:shadow-primary/15 motion-reduce:transform-none">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {a.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.imageUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none" />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center bg-gradient-to-br from-primary/35 via-card to-accent/30">
                        <Gavel className="h-14 w-14 opacity-40" />
                      </div>
                    )}
                    <span className={`absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-bold backdrop-blur-md ${open ? 'bg-black/55 text-white' : 'bg-black/40 text-white/80'}`}>
                      <Timer aria-hidden="true" className="h-3.5 w-3.5" />
                      {open ? t('endsAt', { date: format.dateTime(new Date(a.endsAt), 'dateTimeShort') }) : t('ended')}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h2 lang={lang} className="line-clamp-2 text-lg font-bold tracking-tight">{a.title}</h2>
                    <p lang={lang} className="line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('currentBid')}</p>
                        <p className="text-3xl font-black tabular-nums tracking-tight text-[color:var(--brand-link,var(--primary))]">{formatPrice(format, a.currentBidCents)}</p>
                      </div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:translate-x-0.5">
                        <ArrowRight aria-hidden="true" className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </Page>
    </Shell>
  );
}

export function AuctionDetail({ ctx, auction: a, backHref, confirm, flash }: AuctionDetailProps) {
  const t = useTranslations('auctions');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const s = a.state;
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead back={{ href: backHref, label: tA('allAuctions') }} title={a.title} lang={lang} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <div className="space-y-8">
            {a.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.imageUrl} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
            )}
            <RichText markdown={a.description} lang={lang} />
          </div>
          <aside className="lg:sticky lg:top-40">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{a.currentBidCents > a.startPriceCents ? t('highestBid') : t('startPrice')}</p>
                  <p className="text-5xl font-black tabular-nums tracking-tight">{formatPrice(format, a.currentBidCents)}</p>
                </div>
                <p className="inline-flex h-8 items-center gap-1.5 rounded-full bg-background px-3 text-sm font-semibold ring-1 ring-border">
                  <Timer aria-hidden="true" className="h-4 w-4" />
                  {s.kind === 'open' ? t('endsAt', { date: format.dateTime(new Date(a.endsAt), 'dateTimeShort') }) : t('ended')}
                </p>
                {s.kind === 'open' && !s.bid && (
                  <a href={ctx.links.login} className={`${btn.large} w-full`}>
                    {t('loginToBid')}
                  </a>
                )}
                {s.kind === 'open' && s.bid && (
                  <form method="post" action={s.bid.action} className="space-y-3">
                    <FormFields target={s.bid} />
                    <p className="text-xs text-muted-foreground">{t('minBid', { amount: formatPrice(format, s.minBidCents) })}</p>
                    <div className="flex gap-2">
                      <label className="relative flex-1">
                        <span className="sr-only">{t('bid')}</span>
                        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">€</span>
                        <input name="amount" type="number" inputMode="numeric" min={s.minBidCents / 100} step="1" defaultValue={s.minBidCents / 100} className={`${input} h-14 pl-9 text-lg font-bold tabular-nums`} />
                      </label>
                      <button type="submit" className={`${btn.primary} h-14 px-6`}>
                        <Gavel aria-hidden="true" className="h-4 w-4" />
                        {t('bid')}
                      </button>
                    </div>
                    {s.myBidCents != null && <Box kind="info">{t('myBid', { amount: formatPrice(format, s.myBidCents) })}</Box>}
                  </form>
                )}
                {s.kind === 'won' && (
                  <div className="space-y-4">
                    <Box kind="success">{t('won', { amount: formatPrice(format, a.currentBidCents) })}</Box>
                    <PurchasePanel ctx={ctx} panel={s.purchase} />
                  </div>
                )}
                {s.kind === 'won_paid' && <Box kind="success">{t('wonPaid')}</Box>}
                {s.kind === 'closed' && <p className="text-sm text-muted-foreground">{t('closed')}</p>}
                <FlashBox flash={flash} />
              </div>
            </div>
          </aside>
        </div>
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

// ─── Wunsch-Anfragen ───────────────────────────────────────────────────────────────────────────

const STATUS: Record<string, string> = {
  open: 'bg-amber-400 text-amber-950',
  negotiating: 'bg-violet-600 text-white',
  accepted: 'bg-sky-600 text-white',
  delivered: 'bg-emerald-600 text-white',
  rejected: 'bg-zinc-500 text-white',
  cancelled: 'bg-zinc-500 text-white'
};

export function Requests({ ctx, intro, create, requests, confirm, flash }: RequestsProps) {
  const t = useTranslations('requests');
  const tA = useTranslations('tpl_aurora');
  const tc = useTranslations('common');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  if (!ctx.fan) {
    return (
      <Shell ctx={ctx}>
        <Page width="max-w-3xl">
          <PageHead eyebrow={tA('requestsEyebrow')} title={t('title')} sub={tc('loginRequired')} />
          <a href={ctx.links.login} className={btn.large}>
            {tc('loginButton')}
          </a>
        </Page>
      </Shell>
    );
  }
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-5xl">
        <PageHead eyebrow={tA('requestsEyebrow')} title={t('title')} sub={<span lang={lang}>{intro}</span>} />
        <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
          <form method="post" action={create.action} className="relative space-y-5 overflow-hidden rounded-xl border border-border bg-card p-6 lg:sticky lg:top-40">
            <div aria-hidden="true" className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
            <FormFields target={create} />
            <label className={`relative ${label}`}>
              {t('what')}
              <textarea name="description" rows={5} className={`${input} mt-2 resize-y`} />
            </label>
            <label className={`relative ${label}`}>
              {t('offer')}
              <span className="relative mt-2 block">
                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">€</span>
                <input name="offer" type="number" inputMode="numeric" defaultValue={20} min={1} className={`${input} h-12 pl-9 text-base font-bold tabular-nums`} />
              </span>
            </label>
            <button type="submit" className={`${btn.primary} relative w-full`}>
              <Send aria-hidden="true" className="h-4 w-4" />
              {t('submit')}
            </button>
            <FlashBox flash={flash} />
          </form>

          <section>
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-black tracking-tight">
              <MessageCircle aria-hidden="true" className="h-6 w-6 text-[color:var(--brand-link,var(--primary))]" />
              {t('mine')}
            </h2>
            {requests.length === 0 ? (
              <Empty>{t('empty')}</Empty>
            ) : (
              <div className="space-y-5">
                {requests.map((r) => (
                  <article key={r.id} className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-6">{r.description}</p>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${STATUS[r.status]}`}>{t(`status.${r.status}`)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-8 items-center rounded-full bg-background px-3 text-sm font-bold tabular-nums ring-1 ring-border">
                        {tA('yourOffer')}: {formatPrice(format, r.offeredCents)}
                      </span>
                      {r.deliveryHref && (
                        <a href={r.deliveryHref} className={btn.small}>
                          {t('viewDelivery')}
                        </a>
                      )}
                      {r.cancel && (
                        <form method="post" action={r.cancel.action}>
                          <FormFields target={r.cancel} />
                          <button type="submit" className={btn.small}>
                            {t('cancel')}
                          </button>
                        </form>
                      )}
                    </div>
                    <div className="space-y-2 rounded-xl bg-background/60 p-3">
                      {r.messages.length === 0 && <p className="px-1 text-xs text-muted-foreground">{t('noMessages')}</p>}
                      {r.messages.map((m, i) => (
                        <div key={i} className={`flex ${m.from === 'fan' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${m.from === 'fan' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-card ring-1 ring-border'}`}>
                            <p>{m.body}</p>
                            <p className="mt-1 text-[10px] opacity-70">
                              {m.from === 'fan' ? t('you') : t('model')} · {format.dateTime(new Date(m.at), 'dateTimeNumeric')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {r.reply && (
                        <form method="post" action={r.reply.action} className="relative mt-2 flex">
                          <FormFields target={r.reply} />
                          <label className="block flex-1">
                            <span className="sr-only">{t('messagePlaceholder')}</span>
                            <input name="body" placeholder={t('messagePlaceholder')} className={`${input} h-11 rounded-lg pr-14`} />
                          </label>
                          <button type="submit" aria-label={t('send')} className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Send aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                    </div>
                    {r.purchase && (
                      <div className="space-y-3 border-t border-border pt-4">
                        <p className="text-sm font-semibold">{t('deliveredPay')}</p>
                        <PurchasePanel ctx={ctx} panel={r.purchase} />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}
