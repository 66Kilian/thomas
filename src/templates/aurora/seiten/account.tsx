import type { ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import { FormFields } from '@/kit/platform/form-fields';
import type { NotificationsProps, PaymentsProps, ProfileProps, WalletProps } from '@/kit/template';
import type { PageContext, PaymentEntry } from '@/kit/types';

import { BankBox } from '../bausteine/bank-box';
import { ConfirmDialog } from '../bausteine/confirm-dialog';
import { MethodChips } from '../bausteine/methods';
import { Shell } from '../bausteine/shell';
import { Box, btn, Card, Empty, Page, Title } from '../bausteine/ui';

/** Muster „abgemeldet": Überschrift, Aufforderung, Anmelde-Knopf. */
function GuestOnly({ ctx, title }: { ctx: PageContext; title: string }) {
  const t = useTranslations('common');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <Title>{title}</Title>
        <p className="mb-4 text-sm text-muted-foreground">{t('loginRequired')}</p>
        <a href={ctx.links.login} className={btn.primary}>
          {t('loginButton')}
        </a>
      </Page>
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Profile({ ctx, subscriptions, pastSubscriptions, purchases, requests, links }: ProfileProps) {
  const t = useTranslations('profile');
  const tr = useTranslations('requests');
  const format = useFormatter();
  const fan = ctx.fan;
  if (!fan) return <GuestOnly ctx={ctx} title={t('mySubscriptions')} />;
  const date = (iso: string) => format.dateTime(new Date(iso), 'dateNumeric');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{fan.displayName}</h1>
            <p className="text-sm text-muted-foreground">{fan.email}</p>
          </div>
          <form method="post" action={ctx.links.logout.action}>
            <FormFields target={ctx.links.logout} />
            <button type="submit" className={btn.outline}>
              {t('logout')}
            </button>
          </form>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2 text-sm">
          {links.wallet && fan.walletCents != null && (
            <a href={links.wallet} className="rounded-full border border-primary px-3 py-1">
              {t('wallet', { amount: formatPrice(format, fan.walletCents) })}
            </a>
          )}
          <a href={links.notifications} className="rounded-full border border-border px-3 py-1">{t('notifications')}</a>
          <a href={links.payments} className="rounded-full border border-border px-3 py-1">{t('payments')}</a>
          <a href={links.password} className="rounded-full border border-border px-3 py-1">{t('password')}</a>
        </nav>

        <Section title={t('mySubscriptions')}>
          {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('noSubscription')} <a href={ctx.links.subscriptions} className="underline">{t('viewSubscriptions')}</a>
            </p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((s) => (
                <Card key={s.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.renewalPending ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <strong lang={ctx.site.mainLanguage}>{s.tierName}</strong>
                      {s.recurring && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t('autoRenew')}</span>}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {s.renewalPending ? t('renewalPending') : s.recurring ? t('renewsOn', { date: date(s.until) }) : t('activeUntil', { date: date(s.until) })}
                    </span>
                  </div>
                  {s.cancelRecurring && (
                    <form method="post" action={s.cancelRecurring.action}>
                      <FormFields target={s.cancelRecurring} />
                      <button type="submit" className={btn.small}>
                        {t('endRenewal')}
                      </button>
                    </form>
                  )}
                  {s.scheduledChange ? (
                    <Box kind="warning">
                      {t('scheduled', { label: s.scheduledChange.label })}{' '}
                      <form method="post" action={s.scheduledChange.undo.action} className="inline">
                        <FormFields target={s.scheduledChange.undo} />
                        <button type="submit" className="underline">
                          {t('undo')}
                        </button>
                      </form>
                    </Box>
                  ) : (
                    s.changeOptions.length > 0 && (
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{t('changeTier')}</p>
                        {/* Wechsel als Optionen, keine native Aufklappliste (unlesbar in dunklen Farbwelten). */}
                        <div className="flex flex-wrap gap-2">
                          {s.changeOptions.map((o) => (
                            <form key={o.label} method="post" action={o.target.action}>
                              <FormFields target={o.target} />
                              <button type="submit" className={btn.small}>
                                {o.label}
                              </button>
                            </form>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </Card>
              ))}
            </div>
          )}
          {pastSubscriptions.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('past')}</p>
              {pastSubscriptions.map((p) => (
                <p key={p.endedAt} className="rounded-lg border border-dashed border-border px-3 py-2 text-sm">
                  {p.tierName} · {t('endedAt', { date: date(p.endedAt) })}
                </p>
              ))}
            </div>
          )}
        </Section>

        <Section title={t('purchases')}>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('noPurchases')} <a href={ctx.links.home} className="underline">{t('discover')}</a>
            </p>
          ) : (
            <ul className="space-y-2">
              {purchases.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="flex items-center gap-3 rounded-lg border border-border p-2">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
                    )}
                    <span lang={ctx.site.mainLanguage} className="flex-1 truncate text-sm">{p.title}</span>
                    <span className="text-xs text-muted-foreground">{date(p.at)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {requests && (
          <Section title={t('requests')}>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noRequests')}</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {requests.map((r, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="truncate">{r.description}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {tr(`status.${r.status}`)} · {formatPrice(format, r.offeredCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}
      </Page>
    </Shell>
  );
}

function PaymentRow({ p }: { p: PaymentEntry }) {
  const t = useTranslations('payments');
  const format = useFormatter();
  const farbe = { pending: 'bg-amber-500', paid: 'bg-emerald-600', failed: 'bg-zinc-500', refunded: 'bg-amber-600' }[p.status];
  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-3 text-sm">
        <div className="min-w-0">
          {p.href ? <a href={p.href} className="font-medium underline">{p.title}</a> : <span className="font-medium">{p.title}</span>}
          <p className="text-xs text-muted-foreground">
            {format.dateTime(new Date(p.createdAt), 'dateTimeShort')} · {p.method}
          </p>
          {p.failReason && <p className="text-xs text-amber-700">{p.failReason}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs text-white ${farbe}`}>{t(`status.${p.status}`)}</span>
          <span className="font-medium tabular-nums">{formatPrice(format, p.amountCents)}</span>
        </div>
      </div>
      {p.processing && <Box kind="warning">{t('processing')}</Box>}
      {p.bank && <BankBox bank={p.bank} />}
      {p.cancel && (
        <form method="post" action={p.cancel.action}>
          <FormFields target={p.cancel} />
          <button type="submit" className={btn.small}>
            {t('cancelOrder')}
          </button>
        </form>
      )}
    </div>
  );
}

export function Payments({ ctx, result, open, history }: PaymentsProps) {
  const t = useTranslations('payments');
  if (!ctx.fan) return <GuestOnly ctx={ctx} title={t('title', { count: 0 })} />;
  const kind = result ? ({ success: 'success', created: 'warning', failed: 'error', cancelled: 'error' } as const)[result.kind] : null;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        {result && kind && (
          <div className="mb-6 space-y-3">
            <Box kind={kind}>{t(`result.${result.kind}`)}</Box>
            <div className="flex flex-wrap gap-2">
              {result.targetHref && (
                <a href={result.targetHref} className={btn.primary}>
                  {result.targetLabel} →
                </a>
              )}
              <a href={ctx.links.home} className={btn.outline}>
                {t('continue')}
              </a>
            </div>
          </div>
        )}
        <Title>{t('title', { count: open.length })}</Title>
        {open.length === 0 ? <Empty>{t('noneOpen')}</Empty> : <div className="space-y-3">{open.map((p) => <PaymentRow key={p.id} p={p} />)}</div>}
        {history.length > 0 && (
          <Section title={t('history')}>
            <div className="space-y-2">{history.map((p) => <PaymentRow key={p.id} p={p} />)}</div>
          </Section>
        )}
      </Page>
    </Shell>
  );
}

export function Wallet({ ctx, state, balanceCents, blocked, pendingTopups, topup, transactions, confirm }: WalletProps) {
  const t = useTranslations('wallet');
  const format = useFormatter();
  if (state === 'guest') return <GuestOnly ctx={ctx} title={t('title', { name: ctx.site.displayName })} />;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        {state === 'disabled' && <Empty>{t('disabled')}</Empty>}
        {state === 'test' && <Box kind="info">{t('test')}</Box>}
        {state === 'ok' && (
          <>
            <Card className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('title', { name: ctx.site.displayName })}</p>
              <p className="text-4xl font-semibold tabular-nums">{formatPrice(format, balanceCents)}</p>
              {blocked && <Box kind="warning">{t('blocked')}</Box>}
            </Card>
            {pendingTopups.length > 0 && (
              <Section title={t('pending')}>
                <ul className="space-y-1 text-sm">
                  {pendingTopups.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>
                        {p.method} · {format.dateTime(new Date(p.createdAt), 'dateNumeric')}
                      </span>
                      <span className="tabular-nums">{formatPrice(format, p.amountCents)}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {topup && (
              <Section title={t('topupTitle')}>
                <Card className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {topup.amounts.map((a) => (
                      <a key={a.cents} href={a.href} className={`rounded-full border px-3 py-1 text-sm ${a.selected ? 'border-primary bg-primary/10 font-medium' : 'border-border'}`}>
                        {formatPrice(format, a.cents)}
                      </a>
                    ))}
                    <span className="ml-2 flex items-center gap-2">
                      {topup.minusHref ? <a href={topup.minusHref} className={btn.small}>−</a> : <span className={`${btn.small} opacity-40`}>−</span>}
                      <span className="w-20 text-center tabular-nums">{formatPrice(format, topup.selectedCents)}</span>
                      {topup.plusHref ? <a href={topup.plusHref} className={btn.small}>+</a> : <span className={`${btn.small} opacity-40`}>+</span>}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('step', { step: formatPrice(format, topup.stepCents), max: formatPrice(format, topup.maxCents) })}
                  </p>
                  <MethodChips methods={topup.methods} />
                  <p className="text-sm font-semibold">{t('notRefundable')}</p>
                  <a href={topup.purchase.state.kind === 'ready' ? topup.purchase.state.confirmHref : '#'} className={btn.primary}>
                    {topup.purchase.buttonLabel}
                  </a>
                </Card>
              </Section>
            )}
            <Section title={t('historyTitle')}>
              {transactions.length === 0 ? (
                <Empty>{t('noTx')}</Empty>
              ) : (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{tx.note || t(`kind.${tx.kind}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {format.dateTime(new Date(tx.createdAt), 'dateNumeric')}
                          {tx.balanceAfterCents != null && ` · ${t('after', { amount: formatPrice(format, tx.balanceAfterCents) })}`}
                        </p>
                      </div>
                      <span className={`shrink-0 tabular-nums ${tx.amountCents > 0 ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                        {tx.amountCents > 0 ? '+' : '−'}
                        {formatPrice(format, Math.abs(tx.amountCents))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </>
        )}
      </Page>
      {confirm && <ConfirmDialog ctx={ctx} dialog={confirm} />}
    </Shell>
  );
}

export function Notifications({ ctx, items, markAll }: NotificationsProps) {
  const t = useTranslations('notifications');
  const format = useFormatter();
  if (!ctx.fan) return <GuestOnly ctx={ctx} title={t('title', { count: 0 })} />;
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{t('title', { count: items.filter((n) => !n.read).length })}</h1>
          {markAll && (
            <form method="post" action={markAll.action}>
              <FormFields target={markAll} />
              <button type="submit" className={`${btn.outline} border-primary`}>
                {t('markAll')}
              </button>
            </form>
          )}
        </div>
        {items.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <div key={n.id} className={`rounded-lg border border-border bg-card p-3 ${n.read ? 'opacity-70' : 'border-l-4 border-l-primary'}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{n.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{format.dateTime(new Date(n.at), 'dateTimeShort')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                {n.markRead && (
                  <form method="post" action={n.markRead.action} className="mt-1">
                    <FormFields target={n.markRead} />
                    <button type="submit" className="text-xs underline">
                      {t('markRead')}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </Page>
    </Shell>
  );
}
