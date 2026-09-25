import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { PurchasePanelProps } from '@/kit/template';

import { BankBox } from './bank-box';
import { MethodChips } from './methods';
import { Box, btn } from './ui';

/** Kaufbereich — alle Zustände an einer Stelle. Der Knopf öffnet den Bestätigungsdialog (Link). */
export function PurchasePanel({ panel }: PurchasePanelProps) {
  const t = useTranslations('purchase');
  const format = useFormatter();
  const preis = formatPrice(format, panel.priceCents);
  const s = panel.state;
  return (
    <div className="space-y-3">
      {s.kind === 'guest' && (
        <a href={s.loginHref} className={btn.outline}>
          {t('guest', { price: preis })}
        </a>
      )}
      {s.kind === 'not_configured' && <Box kind="info">{t('notConfigured')}</Box>}
      {s.kind === 'email_unverified' && <Box kind="warning">{t('emailUnverified')}</Box>}
      {s.kind === 'test' && (
        <a href={s.confirmHref} className="inline-flex items-center rounded-lg border border-dashed border-sky-500 px-4 py-2 text-sm text-sky-800">
          {t('test', { price: preis })}
        </a>
      )}
      {s.kind === 'ready' && (
        <>
          {s.wallet && !s.wallet.blocked && s.wallet.enough && (
            <div className="space-y-1">
              <a href={s.wallet.confirmHref} className={btn.primary}>
                {t('fromWallet', { price: preis })}
              </a>
              <p className="text-xs text-muted-foreground">{t('walletBalance', { amount: formatPrice(format, s.wallet.balanceCents) })}</p>
            </div>
          )}
          {s.wallet && !s.wallet.blocked && !s.wallet.enough && (
            <p className="text-xs text-muted-foreground">
              {t('walletShort', {
                balance: formatPrice(format, s.wallet.balanceCents),
                missing: formatPrice(format, panel.priceCents - s.wallet.balanceCents)
              })}{' '}
              <a href={s.wallet.topupHref} className="underline">
                {t('topup')}
              </a>
            </p>
          )}
          {s.wallet?.blocked && <Box kind="warning">{t('walletBlocked')}</Box>}
          <MethodChips methods={s.methods} />
          <a href={s.confirmHref} className={s.wallet?.enough ? btn.outline : btn.primary}>
            {panel.buttonLabel}
          </a>
        </>
      )}
      {s.kind === 'pending_transfer' && (
        <>
          <BankBox bank={s.bank} />
          <a href={s.paymentsHref} className="text-sm underline">
            {t('toPayments')}
          </a>
        </>
      )}
      {s.kind === 'done' && <Box kind="success">{s.text}</Box>}
      {panel.error && <p className="text-sm text-red-600">{panel.error}</p>}
    </div>
  );
}
