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

/**
 * Abo-Stufen als Preiskarten. Die teuerste Stufe (bei mehreren) wird als Premium hervorgehoben;
 * jede Laufzeit ist eine eigene Zeile mit Kaufbereich. Funktioniert mit 1 Stufe/1 Plan wie mit vielen.
 */
export function Subscriptions({ ctx, tiers, confirm }: SubscriptionsProps) {
  const t = useTranslations('subscriptions');
  const tA = useTranslations('tpl_aurora');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  const minPrice = (p: { priceCents: number }[]) => (p.length ? Math.min(...p.map((x) => x.priceCents)) : 0);
  const top = tiers.length > 1 ? tiers.reduce((a, b) => (minPrice(b.plans) > minPrice(a.plans) ? b : a)) : null;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-6xl">
        <PageHead eyebrow={tA('subsEyebrow')} title={t('title')} />
        {tiers.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className={`grid gap-6 ${tiers.length === 1 ? 'max-w-xl' : tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {tiers.map((tier) => {
              const featured = tier === top;
              return (
                <article
                  key={tier.id}
                  className={`relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-8 ${
                    featured ? 'bg-gradient-to-b from-primary/25 via-card to-card ring-2 ring-primary shadow-2xl shadow-primary/20' : 'border border-border bg-card'
                  }`}
                >
                  {featured && <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />}
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 lang={lang} className="break-words text-2xl font-black tracking-tight">
                        {tier.name}
                      </h2>
                      {tier.plans.length > 0 && (
                        <p className="mt-3 flex items-baseline gap-1.5">
                          <span className="text-4xl font-black tabular-nums tracking-tight">{formatPrice(format, minPrice(tier.plans))}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
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
                  </div>
                  {tier.description && (
                    <p lang={lang} className="relative mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                      {tier.description}
                    </p>
                  )}
                  {tier.active && tier.activeUntil && (
                    <div className="relative mt-5">
                      <Box kind="success">
                        {t('activeUntil', { date: format.dateTime(new Date(tier.activeUntil), 'dateLong') })} {t('extend')}
                      </Box>
                    </div>
                  )}
                  <div className="relative mt-6 flex-1 space-y-4">
                    {tier.plans.length === 0 && <p className="text-sm text-muted-foreground">{t('noPlans')}</p>}
                    {tier.plans.map((plan) => (
                      <div key={plan.id} className="space-y-4 rounded-3xl border border-border bg-background/70 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p lang={lang} className="text-lg font-bold">{plan.label}</p>
                            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              {plan.recurring ? <Repeat aria-hidden="true" className="h-3.5 w-3.5" /> : <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />}
                              {plan.recurring ? t('recurring') : t('once')}
                            </p>
                          </div>
                          <span className="shrink-0 text-2xl font-black tabular-nums tracking-tight">{formatPrice(format, plan.priceCents)}</span>
                        </div>
                        {plan.pendingTransfer ? (
                          <>
                            <Box kind="warning">{t('openTransfer')}</Box>
                            <BankBox bank={plan.pendingTransfer} />
                          </>
                        ) : (
                          <PurchasePanel ctx={ctx} panel={plan.purchase} />
                        )}
                      </div>
                    ))}
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
                <article key={b.id} className="flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card">
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
                <article key={w.id} className={`flex flex-col overflow-hidden rounded-[2rem] border bg-card ${done ? 'border-emerald-500/60' : 'border-border'} ${w.state === 'expired' ? 'opacity-70' : ''}`}>
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
                      <p className="flex items-start gap-2.5 rounded-2xl bg-primary/10 px-4 py-3 text-sm">
                        <Gift aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-link,var(--color-primary))]" />
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
                        <form method="post" action={w.support.submit.action} className="space-y-4 rounded-3xl border border-border bg-background/60 p-5">
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
                            <input type="checkbox" name="anonymous" className="h-4 w-4 accent-[var(--color-primary)]" /> {t('anonymous')}
                          </label>
                          {w.support.termsCheckbox && (
                            <label className="flex items-start gap-2.5 text-sm">
                              <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]" /> {w.support.termsCheckbox.label}
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
