import { useTranslations } from 'next-intl';

import { FormFields } from '@/kit/platform/form-fields';
import type { ConfirmDialogProps } from '@/kit/template';

import { btn } from './ui';

/**
 * Bestätigungsdialog vor jedem Kauf. Ohne JavaScript: Er wird serverseitig über die Seite gelegt,
 * sobald die URL ihn anfordert; „Abbrechen" ist ein Link zurück. Nicht per Klick daneben schließbar.
 * Knopftext und Hinweis kommen fertig aus den Props (rechtlich vorgeschrieben) — nicht umformulieren.
 */
export function ConfirmDialog({ dialog }: ConfirmDialogProps) {
  const t = useTranslations('confirm');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-titel">
      <form method="post" action={dialog.submit.action} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-background p-5 shadow-xl">
        <FormFields target={dialog.submit} />
        <h3 id="dialog-titel" className="text-lg font-semibold">
          {dialog.title}
        </h3>
        <dl className="space-y-1 text-sm">
          {dialog.rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
        {dialog.termsCheckbox && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="terms" required className="mt-1" />
            <span>{dialog.termsCheckbox.label}</span>
          </label>
        )}
        <p className="text-xs text-muted-foreground">{dialog.legalNote}</p>
        <div className="flex justify-end gap-2">
          <a href={dialog.cancelHref} className={btn.outline}>
            {t('cancel')}
          </a>
          <button type="submit" className={btn.primary}>
            {dialog.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
