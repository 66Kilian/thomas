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
import { Box, btn, Card, Empty, keep, Page, PageHead, Title } from '../bausteine/ui';

/** Muster „abgemeldet": Überschrift, Aufforderung, Anmelde-Knopf. */
function GuestOnly({ ctx, title }: { ctx: PageContext; title: string }) {
  const t = useTranslations('common');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-3xl">
        <PageHead title={title} sub={t('loginRequired')} />
        <a href={ctx.links.login} className={btn.large}>
          {t('loginButton')}
        </a>
      </Page>
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-2xl font-black tracking-tight">{title}</h2>
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
        <div className="relative flex flex-col gap-5 overflow-hidden rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex min-w-0 items-center gap-4">
            <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-black text-primary-foreground">{fan.displayName.charAt(0)}</span>
            <div className="min-w-0">
              <h1 className="truncate text-3xl font-black tracking-tight">{fan.displayName}</h1>
              <p className="truncate text-sm text-muted-foreground">{fan.email}</p>
            </div>
          </div>
          <form method="post" action={ctx.links.logout.action} className="relative">
            <FormFields target={ctx.links.logout} />
            <button type="submit" className={btn.outline}>
              {t('logout')}
            </button>
          </form>
        </div>
        <nav className="mt-5 flex flex-wrap gap-2 text-sm">
          {links.wallet && fan.walletCents != null && (
            <a href={links.wallet} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground">
              {t('wallet', { amount: formatPrice(format, fan.walletCents) })}
            </a>
          )}
          <a href={links.notifications} className="inline-flex h-10 items-center rounded-lg bg-card px-4 font-semibold ring-1 ring-border hover:ring-primary">{t('notifications')}</a>
          <a href={links.payments} className="inline-flex h-10 items-center rounded-lg bg-card px-4 font-semibold ring-1 ring-border hover:ring-primary">{t('payments')}</a>
          <a href={links.password} className="inline-flex h-10 items-center rounded-lg bg-card px-4 font-semibold ring-1 ring-border hover:ring-primary">{t('password')}</a>
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
                <p key={p.endedAt} className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
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
                  <a href={p.href} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition hover:border-primary">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    )}
                    <span lang={ctx.site.mainLanguage} className="flex-1 truncate font-semibold">{p.title}</span>
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
              <ul className="space-y-2 text-sm">
                {requests.map((r, i) => (
                  <li key={i} className="flex justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
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
  const farbe = { pending: 'bg-amber-400 text-amber-950', paid: 'bg-emerald-600 text-white', failed: 'bg-zinc-500 text-white', refunded: 'bg-amber-600 text-white' }[p.status];
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 text-sm">
        <div className="min-w-0">
          {p.href ? <a href={p.href} className="font-bold hover:underline">{p.title}</a> : <span className="font-bold">{p.title}</span>}
          <p className="text-xs text-muted-foreground">
            {format.dateTime(new Date(p.createdAt), 'dateTimeShort')} · {p.method}
          </p>
          {p.failReason && <p className="text-xs text-muted-foreground">⚠ {p.failReason}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${farbe}`}>{t(`status.${p.status}`)}</span>
          <span className="text-lg font-black tabular-nums">{formatPrice(format, p.amountCents)}</span>
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
            <div className="relative space-y-2 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent p-7 text-primary-foreground shadow-2xl shadow-primary/30 sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/15 blur-2xl" />
              <p className="relative text-sm font-semibold opacity-85">{t('title', { name: ctx.site.displayName })}</p>
              <p className="relative text-6xl font-black tabular-nums tracking-tight">{formatPrice(format, balanceCents)}</p>
            </div>
            {blocked && <div className="mt-4"><Box kind="warning">{t('blocked')}</Box></div>}
            {pendingTopups.length > 0 && (
              <Section title={t('pending')}>
                <ul className="space-y-2 text-sm">
                  {pendingTopups.map((p) => (
                    <li key={p.id} className="flex justify-between rounded-xl border border-border bg-card px-4 py-3">
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
                <Card className="scroll-mt-32 space-y-4" id="aufladen">
                  <div className="flex flex-wrap items-center gap-2">
                    {topup.amounts.map((a) => (
                      <a key={a.cents} href={keep(a.href, 'aufladen')} className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-bold tabular-nums ${a.selected ? 'bg-foreground text-background' : 'bg-background ring-1 ring-border hover:ring-primary'}`}>
                        {formatPrice(format, a.cents)}
                      </a>
                    ))}
                    <span className="ml-2 flex items-center gap-2">
                      {topup.minusHref ? <a href={keep(topup.minusHref, 'aufladen')} className={btn.small}>−</a> : <span className={`${btn.small} opacity-40`}>−</span>}
                      <span className="w-24 text-center text-lg font-black tabular-nums">{formatPrice(format, topup.selectedCents)}</span>
                      {topup.plusHref ? <a href={keep(topup.plusHref, 'aufladen')} className={btn.small}>+</a> : <span className={`${btn.small} opacity-40`}>+</span>}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('step', { step: formatPrice(format, topup.stepCents), max: formatPrice(format, topup.maxCents) })}
                  </p>
                  <MethodChips methods={topup.methods} anchor="aufladen" />
                  <p className="text-sm font-semibold">{t('notRefundable')}</p>
                  {topup.purchase.state.kind === 'ready' ? (
                    <a href={topup.purchase.state.confirmHref} className={`${btn.large} w-full`}>
                      {topup.purchase.buttonLabel}
                    </a>
                  ) : (
                    <span aria-disabled="true" className={`${btn.large} w-full cursor-not-allowed opacity-50`}>
                      {topup.purchase.buttonLabel}
                    </span>
                  )}
                </Card>
              </Section>
            )}
            <Section title={t('historyTitle')}>
              {transactions.length === 0 ? (
                <Empty>{t('noTx')}</Empty>
              ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{tx.note || t(`kind.${tx.kind}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {format.dateTime(new Date(tx.createdAt), 'dateNumeric')}
                          {tx.balanceAfterCents != null && ` · ${t('after', { amount: formatPrice(format, tx.balanceAfterCents) })}`}
                        </p>
                      </div>
                      <span className={`shrink-0 font-bold tabular-nums ${tx.amountCents > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl font-black tracking-tight">{t('title', { count: items.filter((n) => !n.read).length })}</h1>
          {markAll && (
            <form method="post" action={markAll.action}>
              <FormFields target={markAll} />
              <button type="submit" className={btn.outline}>
                {t('markAll')}
              </button>
            </form>
          )}
        </div>
        {items.length === 0 ? (
          <Empty>{t('empty')}</Empty>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div key={n.id} className={`relative rounded-xl border bg-card p-5 pl-7 ${n.read ? 'border-border opacity-70' : 'border-primary/50 shadow-lg shadow-primary/10'}`}>
                {!n.read && <span aria-hidden="true" className="absolute left-3 top-6 h-2 w-2 rounded-full bg-primary" />}
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{n.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{format.dateTime(new Date(n.at), 'dateTimeShort')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                {n.markRead && (
                  <form method="post" action={n.markRead.action} className="mt-1">
                    <FormFields target={n.markRead} />
                    <button type="submit" className="text-xs font-semibold underline decoration-primary decoration-2 underline-offset-4">
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
