import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MethodOption } from '@/kit/types';

/**
 * Zahlungsart-Auswahl als Chips (keine Aufklappliste). Jeder Chip ist ein Link — funktioniert ohne
 * JavaScript. Eine einzige Zahlungsart ⇒ nur Text. Gesperrte Chips gestrichelt mit Begründung.
 */
export function MethodChips({ methods }: { methods: MethodOption[] }) {
  const t = useTranslations('purchase');
  if (methods.length === 0) return null;
  const gewaehlt = methods.find((m) => m.selected) ?? methods[0];
  const gesperrt = methods.find((m) => m.disabledReason);
  return (
    <div className="space-y-2.5 text-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('method')}</p>
      {methods.length === 1 ? (
        <p className="font-semibold">{methods[0].label}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {methods.map((m) =>
            m.disabledReason ? (
              <span key={m.method} title={m.disabledReason} className="inline-flex h-10 cursor-not-allowed items-center rounded-full border border-dashed border-border px-4 text-sm text-muted-foreground">
                {m.label}
              </span>
            ) : (
              <a
                key={m.method}
                href={m.href}
                aria-current={m.selected ? 'true' : undefined}
                className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition ${
                  m.selected ? 'bg-foreground text-background' : 'bg-card ring-1 ring-border hover:ring-primary'
                }`}
              >
                {/* Häkchen-Platz immer reserviert — beim Wechsel verschiebt sich nichts. */}
                <Check aria-hidden="true" className={`h-3.5 w-3.5 ${m.selected ? '' : 'hidden'}`} strokeWidth={3} />
                {m.label}
              </a>
            )
          )}
        </div>
      )}
      {gesperrt && <p className="text-xs text-muted-foreground">⏳ {gesperrt.disabledReason}</p>}
      <p className="text-xs text-muted-foreground">{gewaehlt.instant ? t('instant') : t('notInstant')}</p>
    </div>
  );
}
