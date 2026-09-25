import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { BankDetails } from '@/kit/types';

/** Bankdaten einer Direktüberweisung — IBAN und Verwendungszweck gut kopierbar (Monospace, markierbar). */
export function BankBox({ bank }: { bank: BankDetails }) {
  const t = useTranslations('purchase');
  const format = useFormatter();
  const row = (label: string, value: string) => (
    <div className="flex flex-wrap justify-between gap-x-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="select-all font-mono">{value}</dd>
    </div>
  );
  return (
    <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
      <p className="font-medium">{t('bankIntro', { amount: formatPrice(format, bank.amountCents) })}</p>
      <dl className="space-y-1">
        {row(t('accountHolder'), bank.accountHolder)}
        {row(t('iban'), bank.iban)}
        {row(t('bic'), bank.bic)}
        {row(t('reference'), bank.reference)}
      </dl>
      <p className="text-xs text-muted-foreground">{t('bankOutro')}</p>
    </div>
  );
}
