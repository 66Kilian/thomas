import { Wallet } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { PurchasePanelProps } from '@/kit/template';

import { BankBox } from './bank-box';
import { MethodChips } from './methods';
import { Box, btn } from './ui';

/**
 * Kaufbereich — alle Zustände an einer Stelle. Der Kaufknopf öffnet den Bestätigungsdialog (Link).
 * Knöpfe über volle Breite, damit längere Übersetzungen umbrechen statt zu überlaufen.
 */
export function PurchasePanel({ panel }: PurchasePanelProps) {
  const t = useTranslations('purchase');
  const format = useFormatter();
  const preis = formatPrice(format, panel.priceCents);
  const s = panel.state;
  const full = 'w-full whitespace-normal text-center';
  return (
    <div className="space-y-4">
      {s.kind === 'guest' && (
        <a href={s.loginHref} className={`${btn.primary} ${full}`}>
          {t('guest', { price: preis })}
        </a>
      )}
      {s.kind === 'not_configured' && <Box kind="info">{t('notConfigured')}</Box>}
      {s.kind === 'email_unverified' && <Box kind="warning">{t('emailUnverified')}</Box>}
      {s.kind === 'test' && (
        <a href={s.confirmHref} className={`inline-flex h-11 w-full items-center justify-center rounded-full border-2 border-dashed border-sky-500 px-5 text-sm font-semibold ${full}`}>
          {t('test', { price: preis })}
        </a>
      )}
      {s.kind === 'ready' && (
        <>
          {s.wallet && !s.wallet.blocked && s.wallet.enough && (
            <div className="space-y-2">
              <a href={s.wallet.confirmHref} className={`${btn.primary} ${full}`}>
                <Wallet aria-hidden="true" className="h-4 w-4 shrink-0" />
                {t('fromWallet', { price: preis })}
              </a>
              <p className="text-center text-xs text-muted-foreground">{t('walletBalance', { amount: formatPrice(format, s.wallet.balanceCents) })}</p>
            </div>
          )}
          {s.wallet && !s.wallet.blocked && !s.wallet.enough && (
            <p className="rounded-2xl bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              {t('walletShort', {
                balance: formatPrice(format, s.wallet.balanceCents),
                missing: formatPrice(format, panel.priceCents - s.wallet.balanceCents)
              })}{' '}
              <a href={s.wallet.topupHref} className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                {t('topup')}
              </a>
            </p>
          )}
          {s.wallet?.blocked && <Box kind="warning">{t('walletBlocked')}</Box>}
          <MethodChips methods={s.methods} />
          <a href={s.confirmHref} className={`${s.wallet?.enough ? btn.outline : btn.primary} ${full}`}>
            {panel.buttonLabel}
          </a>
        </>
      )}
      {s.kind === 'pending_transfer' && (
        <>
          <BankBox bank={s.bank} />
          <a href={s.paymentsHref} className="inline-block text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">
            {t('toPayments')}
          </a>
        </>
      )}
      {s.kind === 'done' && <Box kind="success">{s.text}</Box>}
      {panel.error && <p className="text-sm font-medium text-red-500">{panel.error}</p>}
    </div>
  );
}
