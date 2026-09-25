import { CalendarClock, Check, ExternalLink, Gift, Layers, Lock, Repeat, Sparkles, Users } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import { FormFields } from '@/kit/platform/form-fields';
import type { BundlesProps, SubscriptionsProps, WishlistProps } from '@/kit/template';

import { BankBox } from '../bausteine/bank-box';
import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { MethodChips } from '../bausteine/methods';
import { PurchasePanel } from '../bausteine/purchase-panel';
import { Shell } from '../bausteine/shell';
import { Box, btn, Empty, FlashBox, input, label, Page, PageHead } from '../bausteine/ui';

// ─── Abos ──────────────────────────────────────────────────────────────────────────────────────

/*
 * Laufzeit-Auswahl ohne JavaScript über Anker (`#plan-…` + `:target`): Jede Laufzeit ist eine Karte
 * (Link auf ihren Kaufbereich), sichtbar ist immer genau ein Kaufbereich. Ohne Anker gilt die
 * Standard-Laufzeit (erste mit offenem Zustand, sonst die erste). Tailwind braucht feste Klassen —
 * daher die Tabellen für bis zu 8 Laufzeiten je Stufe.
 */
const SHOW_PANEL = [
  '[&:has([data-p="0"]:target)_[data-p="0"]]:block',
  '[&:has([data-p="1"]:target)_[data-p="1"]]:block',
  '[&:has([data-p="2"]:target)_[data-p="2"]]:block',
  '[&:has([data-p="3"]:target)_[data-p="3"]]:block',
  '[&:has([data-p="4"]:target)_[data-p="4"]]:block',
  '[&:has([data-p="5"]:target)_[data-p="5"]]:block',
  '[&:has([data-p="6"]:target)_[data-p="6"]]:block',
  '[&:has([data-p="7"]:target)_[data-p="7"]]:block'
].join(' ');
const MARK_CARD = [
  '[&:has([data-p="0"]:target)_[data-c="0"]]:border-primary [&:has([data-p="0"]:target)_[data-c="0"]]:bg-primary/10 [&:has([data-p="0"]:target)_[data-c="0"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="1"]:target)_[data-c="1"]]:border-primary [&:has([data-p="1"]:target)_[data-c="1"]]:bg-primary/10 [&:has([data-p="1"]:target)_[data-c="1"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="2"]:target)_[data-c="2"]]:border-primary [&:has([data-p="2"]:target)_[data-c="2"]]:bg-primary/10 [&:has([data-p="2"]:target)_[data-c="2"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="3"]:target)_[data-c="3"]]:border-primary [&:has([data-p="3"]:target)_[data-c="3"]]:bg-primary/10 [&:has([data-p="3"]:target)_[data-c="3"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="4"]:target)_[data-c="4"]]:border-primary [&:has([data-p="4"]:target)_[data-c="4"]]:bg-primary/10 [&:has([data-p="4"]:target)_[data-c="4"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="5"]:target)_[data-c="5"]]:border-primary [&:has([data-p="5"]:target)_[data-c="5"]]:bg-primary/10 [&:has([data-p="5"]:target)_[data-c="5"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="6"]:target)_[data-c="6"]]:border-primary [&:has([data-p="6"]:target)_[data-c="6"]]:bg-primary/10 [&:has([data-p="6"]:target)_[data-c="6"]_[data-dot]]:after:scale-100',
  '[&:has([data-p="7"]:target)_[data-c="7"]]:border-primary [&:has([data-p="7"]:target)_[data-c="7"]]:bg-primary/10 [&:has([data-p="7"]:target)_[data-c="7"]_[data-dot]]:after:scale-100'
].join(' ');
/** Ohne Anker in dieser Stufe: Standard-Laufzeit zeigen und markieren. */
const DEFAULT =
  '[&:not(:has([data-p]:target))_[data-p][data-default]]:block [&:not(:has([data-p]:target))_[data-c][data-default]]:border-primary [&:not(:has([data-p]:target))_[data-c][data-default]]:bg-primary/10 [&:not(:has([data-p]:target))_[data-c][data-default]_[data-dot]]:after:scale-100';

/** Hängt den Anker der Laufzeit an die Links des Kaufbereichs — nach dem Neuladen bleibt sie gewählt. */
function withAnchor(panel: SubscriptionsProps['tiers'][number]['plans'][number]['purchase'], anchor: string) {
  const s = panel.state;
  if (s.kind !== 'ready') return panel;
  const a = (h: string) => (h.includes('#') ? h : `${h}#${anchor}`);
  return { ...panel, state: { ...s, methods: s.methods.map((m) => ({ ...m, href: a(m.href) })) } };
}

export function Subscriptions({ ctx, tiers, confirm }: SubscriptionsProps) {
  const t = useTranslations('subscriptions');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  const s = ctx.site;
  const minPrice = (p: { priceCents: number }[]) => (p.length ? Math.min(...p.map((x) => x.priceCents)) : 0);
  const top = tiers.length > 1 ? tiers.reduce((a, b) => (minPrice(b.plans) > minPrice(a.plans) ? b : a)) : null;
  return (
    <Shell ctx={ctx}>
      {/* Kopf wie auf der Startseite: Porträt im Lichtschein, Name, großer Titel. */}
      <section className="relative overflow-hidden">
        {s.coverUrl && (
          <div aria-hidden="true" className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.coverUrl} alt="" className="h-full w-full object-cover opacity-40 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
          </div>
        )}
        <div aria-hidden="true" className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-10 pt-12 text-center sm:pt-16">
          <div className="h-20 w-20 rounded-full bg-[conic-gradient(from_200deg,var(--primary),var(--accent),var(--primary))] p-[3px]">
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoUrl} alt="" className="h-full w-full rounded-full border-[3px] border-background object-cover" />
            ) : (
              <span aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-background bg-primary text-2xl font-black text-primary-foreground">{s.displayName.charAt(0)}</span>
            )}
          </div>
          <p className="mt-3 font-bold">{s.displayName}</p>
          <p className="mt-1 flex gap-4 text-sm text-muted-foreground">
            <span>{tA('statPosts', { count: s.stats.posts })}: <b className="text-foreground tabular-nums">{s.stats.posts}</b></span>
            <span>{tA('statVideos', { count: s.stats.videos })}: <b className="text-foreground tabular-nums">{s.stats.videos}</b></span>
          </p>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--primary))]">{tA('subsEyebrow')}</p>
          <h1 className="mt-2 text-5xl font-black tracking-tighter sm:text-6xl">{t('title')}</h1>
          <p className="mt-3 max-w-md text-muted-foreground">{tA('allIncluded')}</p>
        </div>
      </section>

      <main id="inhalt" className="mx-auto max-w-6xl px-4">
        {tiers.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-16">
            {tiers.map((tier) => {
              const featured = tier === top;
              const def = Math.max(0, tier.plans.findIndex((p) => p.purchase.state.kind !== 'ready' || p.purchase.error != null || p.pendingTransfer != null));
              const cols = tier.plans.length >= 4 ? 'lg:grid-cols-4' : tier.plans.length === 3 ? 'lg:grid-cols-3' : '';
              return (
                <section key={tier.id} className={`${SHOW_PANEL} ${MARK_CARD} ${DEFAULT}`}>
                  {/* Stufen-Kopf */}
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 lang={lang} className="break-words text-3xl font-black tracking-tight">{tier.name}</h2>
                        {tier.active && (
                          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-emerald-600 px-3 text-xs font-bold text-white">
                            <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                            {t('active')}
                          </span>
                        )}
                        {featured && !tier.active && (
                          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">
                            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                            {tA('popular')}
                          </span>
                        )}
                      </div>
                      {tier.description && <p lang={lang} className="mt-2 max-w-2xl text-muted-foreground">{tier.description}</p>}
                    </div>
                    {tier.plans.length > 1 && <p className="shrink-0 text-sm font-semibold text-muted-foreground">{tA('choosePlan')}</p>}
                  </div>
                  {tier.active && tier.activeUntil && (
                    <div className="mb-6">
                      <Box kind="success">{t('activeUntil', { date: format.dateTime(new Date(tier.activeUntil), 'dateLong') })} {t('extend')}</Box>
                    </div>
                  )}
                  {tier.plans.length === 0 && <p className="text-sm text-muted-foreground">{t('noPlans')}</p>}

                  {/* Laufzeit-Karten */}
                  <div className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${cols}`}>
                    {tier.plans.map((plan, i) => (
                      <a
                        key={plan.id}
                        href={`#plan-${plan.id}`}
                        data-c={i}
                        data-default={i === def ? '' : undefined}
                        className="group relative flex flex-col rounded-xl border-[1.5px] border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/60 motion-reduce:transform-none sm:p-6"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span lang={lang} className="truncate text-lg font-bold">{plan.label}</span>
                          <span data-dot="" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border after:h-2.5 after:w-2.5 after:scale-0 after:rounded-full after:bg-primary after:transition after:content-['']" />
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          {plan.recurring ? <Repeat aria-hidden="true" className="h-3.5 w-3.5" /> : <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />}
                          {plan.recurring ? t('recurring') : t('once')}
                        </span>
                        <span className="mt-6 text-4xl font-black tabular-nums tracking-tight">{formatPrice(format, plan.priceCents)}</span>
                        <span className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-background text-sm font-bold ring-1 ring-border group-hover:ring-primary">
                          {tier.active ? tA('extendShort') : tA('choose')}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Kaufbereich der gewählten Laufzeit */}
                  {tier.plans.map((plan, i) => (
                    <div
                      key={plan.id}
                      id={`plan-${plan.id}`}
                      data-p={i}
                      data-default={i === def ? '' : undefined}
                      className="mt-4 hidden scroll-mt-40 rounded-xl border border-border bg-card p-6 sm:p-8"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{tA('selected')}</p>
                          <p lang={lang} className="mt-1 text-2xl font-black tracking-tight">
                            {tier.name} · {plan.label}
                          </p>
                          <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-[color:var(--brand-link,var(--primary))]">{formatPrice(format, plan.priceCents)}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{plan.recurring ? t('recurring') : t('once')}</p>
                        </div>
                        <div className="space-y-4">
                          {plan.pendingTransfer ? (
                            <>
                              <Box kind="warning">{t('openTransfer')}</Box>
                              <BankBox bank={plan.pendingTransfer} />
                            </>
                          ) : (
                            <PurchasePanel ctx={ctx} panel={withAnchor(plan.purchase, `plan-${plan.id}`)} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        )}
      </main>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

// ─── Bundles ───────────────────────────────────────────────────────────────────────────────────

/** Bundle-Karte mit Collage der enthaltenen Inhalte (Vorschlag) — ohne Vorschau ein Farbverlauf. */
export function Bundles({ ctx, bundles, confirm }: BundlesProps) {
  const t = useTranslations('bundles');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead eyebrow={tA('bundlesEyebrow')} title={t('title')} />
        {bundles.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bundles.map((b) => {
              const pics = b.items.filter((it) => it.imageUrl).slice(0, 4);
              return (
                <article key={b.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {pics.length >= 3 ? (
                      <div className="grid h-full grid-cols-3 grid-rows-2 gap-1">
                        {pics.map((it, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={it.slug} src={it.imageUrl ?? ''} alt="" className={`h-full w-full object-cover ${i === 0 ? 'col-span-2 row-span-2' : ''} ${i > 2 ? 'hidden' : ''}`} />
                        ))}
                      </div>
                    ) : pics.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pics[0].imageUrl ?? ''} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center bg-gradient-to-br from-primary/40 via-card to-accent/35">
                        <Layers className="h-16 w-16 opacity-40" />
                      </div>
                    )}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex h-8 items-center gap-1.5 rounded-full bg-black/55 px-3 text-sm font-bold text-white backdrop-blur-md">
                      <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                      {t('count', { count: b.itemCount })}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h2 lang={ctx.site.mainLanguage} className="break-words text-2xl font-black tracking-tight">
                        {b.title}
                      </h2>
                      <span className="shrink-0 text-3xl font-black tabular-nums tracking-tight">{formatPrice(format, b.priceCents)}</span>
                    </div>
                    <div className="mt-auto">
                      <PurchasePanel ctx={ctx} panel={b.purchase} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

// ─── Wunschliste ───────────────────────────────────────────────────────────────────────────────

export function Wishlist({ ctx, wishes, flash }: WishlistProps) {
  const t = useTranslations('wishlist');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead eyebrow={tA('wishesEyebrow')} title={t('title')} />
        {flash && (
          <div className="mb-6">
            <FlashBox flash={flash} />
          </div>
        )}
        {wishes.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {wishes.map((w) => {
              const pct = Math.round(Math.min(1, w.progress) * 100);
              const done = w.state === 'fulfilled';
              return (
                <article key={w.id} className={`flex flex-col overflow-hidden rounded-xl border bg-card ${done ? 'border-emerald-500/60' : 'border-border'} ${w.state === 'expired' ? 'opacity-70' : ''}`}>
                  {w.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.imageUrl} alt="" className="h-full w-full object-cover" />
                      {w.category && (
                        <span lang={lang} className="absolute left-4 top-4 inline-flex h-7 items-center rounded-full bg-black/55 px-3 text-xs font-bold text-white backdrop-blur-md">
                          {w.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                    <div className="space-y-2">
                      {!w.imageUrl && w.category && (
                        <span lang={lang} className="inline-flex h-7 items-center rounded-full bg-background px-3 text-xs font-bold ring-1 ring-border">
                          {w.category}
                        </span>
                      )}
                      <h2 lang={lang} className="break-words text-2xl font-black tracking-tight">
                        {w.title} {w.quantity > 1 && <span className="text-muted-foreground">×{w.quantity}</span>}
                      </h2>
                      {w.description && (
                        <p lang={lang} className="text-sm leading-6 text-muted-foreground">
                          {w.description}
                        </p>
                      )}
                    </div>

                    {/* Fortschritt */}
                    <div className="space-y-2">
                      <div className="flex items-end justify-between gap-3">
                        <p>
                          <span className="text-3xl font-black tabular-nums tracking-tight">{formatPrice(format, w.raisedCents)}</span>{' '}
                          <span className="text-sm text-muted-foreground">{tA('of', { amount: formatPrice(format, w.targetCents) })}</span>
                        </p>
                        <span className="text-sm font-bold tabular-nums">{pct} %</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-background ring-1 ring-border" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-accent'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {w.supporterCount > 0 && (
                        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-background px-3 font-semibold ring-1 ring-border">
                          <Users aria-hidden="true" className="h-3.5 w-3.5" />
                          {t('supporters', { count: w.supporterCount })}
                        </span>
                      )}
                      {w.deadline && (
                        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-background px-3 font-semibold ring-1 ring-border">
                          <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
                          {t('deadline', { date: format.dateTime(new Date(w.deadline), 'dateLong') })}
                        </span>
                      )}
                      {w.subscribersOnly && (
                        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-background px-3 font-semibold ring-1 ring-border">
                          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                          {t('subscribersOnly')}
                        </span>
                      )}
                      {w.externalUrl && (
                        <a href={w.externalUrl} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-background px-3 font-semibold ring-1 ring-border hover:ring-primary">
                          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                          {t('viewItem')}
                        </a>
                      )}
                    </div>
                    {w.topSupporters.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {t('top', { names: w.topSupporters.map((s) => `${s.name ?? t('anonymousName')} (${formatPrice(format, s.amountCents)})`).join(', ') })}
                      </p>
                    )}
                    {w.rewardText && (
                      <p className="flex items-start gap-2.5 rounded-xl bg-primary/10 px-4 py-3 text-sm">
                        <Gift aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-link,var(--primary))]" />
                        <span>{t('reward', { text: w.rewardText })}</span>
                      </p>
                    )}

                    <div className="mt-auto space-y-4">
                      {done && <Box kind="success">{t('fulfilled')}</Box>}
                      {w.state === 'expired' && <p className="text-sm text-muted-foreground">{t('expired')}</p>}
                      {w.state === 'open' && !w.support && !ctx.fan && (
                        <a href={ctx.links.login} className={`${btn.primary} w-full`}>
                          {t('loginToSupport')}
                        </a>
                      )}
                      {w.pendingTransfer && <BankBox bank={w.pendingTransfer} />}
                      {w.state === 'open' && w.support && (
                        <form method="post" action={w.support.submit.action} className="space-y-4 rounded-xl border border-border bg-background/60 p-5">
                          <FormFields target={w.support.submit} />
                          {w.support.fullGiftCents == null && (
                            <label className={label}>
                              {t('amount')}
                              <span className="relative mt-2 block">
                                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">€</span>
                                <input name="amount" type="number" inputMode="decimal" min={w.support.minCents / 100} step="0.01" className={`${input} h-12 pl-9 text-base font-bold tabular-nums`} />
                              </span>
                              <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{t('min', { amount: formatPrice(format, w.support.minCents) })}</span>
                            </label>
                          )}
                          <MethodChips methods={w.support.methods} />
                          <label className="block">
                            <span className="sr-only">{t('message')}</span>
                            <input name="message" placeholder={t('message')} className={input} />
                          </label>
                          <label className="flex items-center gap-2.5 text-sm">
                            <input type="checkbox" name="anonymous" className="h-4 w-4 accent-[var(--primary)]" /> {t('anonymous')}
                          </label>
                          {w.support.termsCheckbox && (
                            <label className="flex items-start gap-2.5 text-sm">
                              <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 accent-[var(--primary)]" /> {w.support.termsCheckbox.label}
                            </label>
                          )}
                          <p className="text-xs text-muted-foreground">{w.support.legalNote}</p>
                          <button type="submit" className={`${btn.primary} w-full whitespace-normal text-center`}>
                            {w.support.submitLabel}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Page>
    </Shell>
  );
}
