import { useTranslations } from 'next-intl';

import type { MethodOption } from '@/kit/types';

/**
 * Zahlungsart-Auswahl als Chips (keine Aufklappliste!). Jeder Chip ist ein Link, der die Auswahl
 * setzt — funktioniert ohne JavaScript. Eine einzige Zahlungsart ⇒ nur Text.
 */
export function MethodChips({ methods }: { methods: MethodOption[] }) {
  const t = useTranslations('purchase');
  if (methods.length === 0) return null;
  const gewaehlt = methods.find((m) => m.selected) ?? methods[0];
  return (
    <div className="space-y-2 text-sm">
      {methods.length === 1 ? (
        <p>
          {t('method')} <strong>{methods[0].label}</strong>
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">{t('method')}</span>
          {methods.map((m) =>
            m.disabledReason ? (
              <span key={m.method} title={m.disabledReason} className="cursor-not-allowed rounded-full border border-dashed border-border px-3 py-1 text-xs opacity-60">
                {m.label}
              </span>
            ) : (
              <a
                key={m.method}
                href={m.href}
                aria-current={m.selected ? 'true' : undefined}
                className={`rounded-full border px-3 py-1 text-xs ${m.selected ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:bg-muted'}`}
              >
                {m.label}
              </a>
            )
          )}
        </div>
      )}
      {methods.some((m) => m.disabledReason) && <p className="text-xs text-amber-700">⏳ {methods.find((m) => m.disabledReason)!.disabledReason}</p>}
      <p className={`text-xs ${gewaehlt.instant ? 'text-emerald-700' : 'text-muted-foreground'}`}>{gewaehlt.instant ? t('instant') : t('notInstant')}</p>
    </div>
  );
}
