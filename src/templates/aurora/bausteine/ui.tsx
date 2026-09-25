import { ArrowLeft, CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import type { Flash } from '@/kit/types';

/**
 * Aurora-Grundbausteine: Pillen-Knöpfe, weiche Felder, große Überschriften mit Dachzeile, Karten mit
 * großem Radius. Nur Token-Klassen — Ausnahme: Zustandsfarben (grün/gelb/rot/blau), die keiner Farbwelt folgen.
 */

const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition disabled:opacity-50';
export const btn = {
  primary: `${base} h-11 bg-primary px-6 text-sm text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90`,
  outline: `${base} h-11 bg-card px-5 text-sm ring-1 ring-border hover:ring-primary`,
  small: `${base} h-8 bg-card px-3.5 text-xs ring-1 ring-border hover:ring-primary`,
  large: `${base} h-14 bg-primary px-8 text-base text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90`
};

export const input =
  'w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15';

export const label = 'block text-sm font-semibold';

export function Page({ children, width = 'max-w-5xl' }: { children: ReactNode; width?: string }) {
  return <main id="inhalt" className={`mx-auto w-full ${width} px-4 pb-8 pt-10 sm:pt-14`}>{children}</main>;
}

/** Seitenkopf: optionaler Zurück-Link, Dachzeile, große Überschrift, Unterzeile. */
export function PageHead({ back, eyebrow, title, sub, lang, children }: { back?: { href: string; label: string }; eyebrow?: string; title: ReactNode; sub?: ReactNode; lang?: string; children?: ReactNode }) {
  return (
    <header className="mb-10">
      {back && (
        <a href={back.href} className="mb-6 inline-flex h-9 items-center gap-2 rounded-full bg-card pl-2.5 pr-4 text-sm font-medium text-muted-foreground ring-1 ring-border hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {back.label}
        </a>
      )}
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-link,var(--color-primary))]">{eyebrow}</p>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 lang={lang} className="break-words text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {children}
      </div>
      {sub && <div className="mt-3 max-w-2xl text-base text-muted-foreground">{sub}</div>}
    </header>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return <h1 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl">{children}</h1>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-border bg-card p-6 text-card-foreground ${className}`}>{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <span aria-hidden="true" className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-[1px]" />
      <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

const FLASH: Record<Flash['kind'], { cls: string; Icon: typeof Info }> = {
  success: { cls: 'border-emerald-500/50 bg-emerald-500/10 [&>svg]:text-emerald-500', Icon: CircleCheck },
  error: { cls: 'border-red-500/50 bg-red-500/10 [&>svg]:text-red-500', Icon: CircleAlert },
  info: { cls: 'border-sky-500/50 bg-sky-500/10 [&>svg]:text-sky-500', Icon: Info },
  warning: { cls: 'border-amber-500/50 bg-amber-500/10 [&>svg]:text-amber-500', Icon: TriangleAlert }
};

/** Zustandskasten — Farben folgen der Bedeutung, nicht der Farbwelt. */
export function Box({ kind, children }: { kind: Flash['kind']; children: ReactNode }) {
  const { cls, Icon } = FLASH[kind];
  return (
    <div className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm ${cls}`}>
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function FlashBox({ flash }: { flash: Flash | null }) {
  return flash ? <Box kind={flash.kind}>{flash.text}</Box> : null;
}
