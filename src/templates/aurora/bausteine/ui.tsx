import type { ReactNode } from 'react';

import type { Flash } from '@/kit/types';

/**
 * Kleine Grundbausteine des Basis-Templates. Nur Token-Klassen (bg-primary, text-muted-foreground …),
 * nie feste Farben — so funktionieren alle Farbwelten ohne Zutun. Ausnahme: Zustandsfarben
 * (grün = erledigt, gelb = wartet, rot = Fehler, blau = Test), die bewusst keiner Welt folgen.
 */

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50',
  small: 'inline-flex items-center justify-center rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted'
};

export const input = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';

export function Page({ children, width = 'max-w-5xl' }: { children: ReactNode; width?: string }) {
  return <main id="inhalt" className={`mx-auto w-full ${width} px-4 py-8`}>{children}</main>;
}

export function Title({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 text-2xl font-semibold">{children}</h1>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-5 text-card-foreground ${className}`}>{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{children}</p>;
}

const FLASH: Record<Flash['kind'], string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
  error: 'border-red-500/40 bg-red-500/10 text-red-700',
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-800',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-800'
};

/** Zustandskasten — Farben folgen der Bedeutung, nicht der Farbwelt. */
export function Box({ kind, children }: { kind: Flash['kind']; children: ReactNode }) {
  return <div className={`rounded-lg border px-3 py-2 text-sm ${FLASH[kind]}`}>{children}</div>;
}

export function FlashBox({ flash }: { flash: Flash | null }) {
  return flash ? <Box kind={flash.kind}>{flash.text}</Box> : null;
}
