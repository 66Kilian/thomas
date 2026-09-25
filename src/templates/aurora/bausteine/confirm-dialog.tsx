import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormFields } from '@/kit/platform/form-fields';
import type { ConfirmDialogProps } from '@/kit/template';

import { btn } from './ui';

/**
 * Bestätigungsdialog vor jedem Kauf — mobil als Blatt von unten, ab 640 px mittig. Ohne JavaScript:
 * serverseitig über die Seite gelegt; „Abbrechen" ist ein Link zurück. Knopftext und Hinweis kommen
 * fertig aus den Props (rechtlich vorgeschrieben) — nicht umformulieren.
 */
export function ConfirmDialog({ dialog }: ConfirmDialogProps) {
  const t = useTranslations('confirm');
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-titel">
      <form
        method="post"
        action={dialog.submit.action}
        className="w-full max-w-md space-y-5 rounded-t-3xl border border-border bg-background p-6 pb-8 text-foreground shadow-2xl sm:rounded-3xl sm:pb-6"
      >
        <FormFields target={dialog.submit} />
        <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-border sm:hidden" />
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-[color:var(--brand-link,var(--color-primary))]">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <h3 id="dialog-titel" className="text-xl font-black tracking-tight">
            {dialog.title}
          </h3>
        </div>
        <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card text-sm">
          {dialog.rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="text-right font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
        {dialog.termsCheckbox && (
          <label className="flex items-start gap-3 rounded-2xl border border-border p-4 text-sm">
            <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
            <span>{dialog.termsCheckbox.label}</span>
          </label>
        )}
        <p className="text-xs text-muted-foreground">{dialog.legalNote}</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <a href={dialog.cancelHref} className={`${btn.outline} w-full sm:w-auto`}>
            {t('cancel')}
          </a>
          <button type="submit" className={`${btn.primary} w-full whitespace-normal text-center sm:w-auto`}>
            {dialog.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
