import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import { FormFields } from '@/kit/platform/form-fields';
import type { BundlesProps, SubscriptionsProps, WishlistProps } from '@/kit/template';

import { BankBox } from '../bausteine/bank-box';
import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { MethodChips } from '../bausteine/methods';
import { PurchasePanel } from '../bausteine/purchase-panel';
import { Shell } from '../bausteine/shell';
import { Box, btn, Card, Empty, FlashBox, input, Page, Title } from '../bausteine/ui';

export function Subscriptions({ ctx, tiers, confirm }: SubscriptionsProps) {
  const t = useTranslations('subscriptions');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page>
        <Title>{t('title')}</Title>
        {tiers.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tiers.map((tier) => (
              <Card key={tier.id} className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 lang={lang} className="text-lg font-semibold">
                    {tier.name}
                  </h2>
                  {tier.active && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">{t('active')}</span>}
                </div>
                {tier.description && (
                  <p lang={lang} className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                )}
                {tier.active && tier.activeUntil && (
                  <Box kind="success">
                    {t('activeUntil', { date: format.dateTime(new Date(tier.activeUntil), 'dateNumeric') })} {t('extend')}
                  </Box>
                )}
                {tier.plans.length === 0 && <p className="text-sm text-muted-foreground">{t('noPlans')}</p>}
                {tier.plans.map((plan) => (
                  <div key={plan.id} className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-baseline justify-between">
                      <span lang={lang} className="text-lg font-medium">
                        {plan.label}
                      </span>
                      <span className="font-semibold">{formatPrice(format, plan.priceCents)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.recurring ? t('recurring') : t('once')}</p>
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
              </Card>
            ))}
          </div>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

export function Bundles({ ctx, bundles, confirm }: BundlesProps) {
  const t = useTranslations('bundles');
  const format = useFormatter();
  return (
    <Shell ctx={ctx}>
      <Page>
        <Title>{t('title')}</Title>
        {bundles.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bundles.map((b) => (
              <Card key={b.id} className="space-y-3">
                <h2 lang={ctx.site.mainLanguage} className="text-lg font-semibold">
                  {b.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('count', { count: b.itemCount })} · {formatPrice(format, b.priceCents)}
                </p>
                {b.items.length > 0 && (
                  <div className="flex gap-1">
                    {b.items.slice(0, 5).map((it) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={it.slug} src={it.imageUrl ?? ''} alt="" className="h-14 w-14 rounded object-cover" />
                    ))}
                  </div>
                )}
                <PurchasePanel ctx={ctx} panel={b.purchase} />
              </Card>
            ))}
          </div>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

export function Wishlist({ ctx, wishes, flash }: WishlistProps) {
  const t = useTranslations('wishlist');
  const format = useFormatter();
  const lang = ctx.site.mainLanguage;
  return (
    <Shell ctx={ctx}>
      <Page>
        <Title>{t('title')}</Title>
        <div className="mb-4">
          <FlashBox flash={flash} />
        </div>
        {wishes.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {wishes.map((w) => (
              <Card key={w.id} className="space-y-3">
                {w.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.imageUrl} alt="" className="h-48 w-full rounded-lg object-cover" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h2 lang={lang} className="font-semibold">
                    {w.title} {w.quantity > 1 && <span className="text-muted-foreground">×{w.quantity}</span>}
                  </h2>
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatPrice(format, w.raisedCents)} / {formatPrice(format, w.targetCents)}
                  </span>
                </div>
                {w.category && <span lang={lang} className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs">{w.category}</span>}
                {w.description && (
                  <p lang={lang} className="text-sm text-muted-foreground">
                    {w.description}
                  </p>
                )}
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${Math.round(w.progress * 100)}%` }} />
                </div>
                {w.rewardText && <Box kind="warning">{t('reward', { text: w.rewardText })}</Box>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {w.externalUrl && <a href={w.externalUrl} className="underline">{t('viewItem')}</a>}
                  {w.deadline && <span>{t('deadline', { date: format.dateTime(new Date(w.deadline), 'dateLong') })}</span>}
                  {w.subscribersOnly && <span>{t('subscribersOnly')}</span>}
                  {w.supporterCount > 0 && (
                    <span>
                      {t('supporters', { count: w.supporterCount })}
                      {w.topSupporters.length > 0 &&
                        ` · ${t('top', { names: w.topSupporters.map((s) => `${s.name ?? t('anonymousName')} (${formatPrice(format, s.amountCents)})`).join(', ') })}`}
                    </span>
                  )}
                </div>
                {w.state === 'fulfilled' && <Box kind="success">{t('fulfilled')}</Box>}
                {w.state === 'expired' && <p className="text-sm text-muted-foreground">{t('expired')}</p>}
                {w.state === 'open' && !w.support && !ctx.fan && (
                  <a href={ctx.links.login} className={btn.outline}>
                    {t('loginToSupport')}
                  </a>
                )}
                {w.pendingTransfer && <BankBox bank={w.pendingTransfer} />}
                {w.state === 'open' && w.support && (
                  <form method="post" action={w.support.submit.action} className="space-y-3 border-t border-border pt-3">
                    <FormFields target={w.support.submit} />
                    {w.support.fullGiftCents == null && (
                      <label className="block text-sm">
                        {t('amount')}
                        <input name="amount" type="number" min={w.support.minCents / 100} step="0.01" className={`${input} mt-1`} />
                      </label>
                    )}
                    <MethodChips methods={w.support.methods} />
                    <input name="message" placeholder={t('message')} className={input} />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="anonymous" /> {t('anonymous')}
                    </label>
                    <p className="text-xs text-muted-foreground">{t('min', { amount: formatPrice(format, w.support.minCents) })}</p>
                    {w.support.termsCheckbox && (
                      <label className="flex items-start gap-2 text-sm">
                        <input type="checkbox" name="terms" required className="mt-1" /> {w.support.termsCheckbox.label}
                      </label>
                    )}
                    <p className="text-xs text-muted-foreground">{w.support.legalNote}</p>
                    <button type="submit" className={btn.primary}>
                      {w.support.submitLabel}
                    </button>
                  </form>
                )}
              </Card>
            ))}
          </div>
        )}
      </Page>
    </Shell>
  );
}
