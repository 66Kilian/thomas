import { Landmark } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { BankDetails } from '@/kit/types';

/** Bankdaten einer Direktüberweisung — jede Zeile einzeln markierbar (select-all), IBAN in Monospace. */
export function BankBox({ bank }: { bank: BankDetails }) {
  const t = useTranslations('purchase');
  const format = useFormatter();
  const row = (label: string, value: string, mono = false) => (
    <div className="flex flex-col gap-0.5 rounded-xl bg-background/70 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`select-all break-all font-semibold ${mono ? 'font-mono tracking-tight' : ''}`}>{value}</dd>
    </div>
  );
  return (
    <div className="space-y-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <Landmark aria-hidden="true" className="h-4 w-4 text-amber-500" />
        {t('bankIntro', { amount: formatPrice(format, bank.amountCents) })}
      </p>
      <dl className="space-y-1.5">
        {row(t('accountHolder'), bank.accountHolder)}
        {row(t('iban'), bank.iban, true)}
        {row(t('bic'), bank.bic, true)}
        {row(t('reference'), bank.reference, true)}
      </dl>
      <p className="text-xs text-muted-foreground">{t('bankOutro')}</p>
    </div>
  );
}
