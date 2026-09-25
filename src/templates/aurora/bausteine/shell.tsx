import { Bell, Menu, Wallet, X } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { ShellProps } from '@/kit/template';
import type { Notice, PageContext } from '@/kit/types';

/** Hinweisleisten — feste Zustandsfarben (blau = Test, gelb = Hinweis, rot = E-Mail), unabhängig von der Farbwelt. */
const NOTICE: Record<Notice['kind'], string> = {
  test: 'bg-sky-700 text-white',
  impersonation: 'bg-amber-300 text-amber-950',
  email: 'bg-red-700 text-white',
  terms: 'bg-amber-300 text-amber-950'
};

function Notices({ ctx }: { ctx: PageContext }) {
  if (ctx.notices.length === 0) return null;
  return (
    <div>
      {ctx.notices.map((n) => (
        <div key={n.kind} className={`text-sm ${NOTICE[n.kind]}`}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2">
            <span>{n.text}</span>
            {n.action && (
              <a href={n.action.href} className="font-semibold underline underline-offset-2">
                {n.action.label}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Logo bzw. Initiale + Name. Fehlt das Logo, trägt die Initiale die Markenfarbe. */
function Brand({ ctx }: { ctx: PageContext }) {
  const s = ctx.site;
  return (
    <a href={ctx.links.home} className="flex min-w-0 flex-1 items-center gap-3">
      {s.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logoUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/60 ring-offset-2 ring-offset-background" />
      ) : (
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
          {s.displayName.charAt(0)}
        </span>
      )}
      <span className="truncate text-base font-semibold tracking-tight">{s.displayName}</span>
    </a>
  );
}

/** Sprachwahl mit fester Breite je Eintrag — beim Umschalten springt nichts. */
export function LanguageSwitch({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  if (ctx.languageLinks.length < 2) return null;
  return (
    <nav aria-label={t('language')} className="inline-flex shrink-0 overflow-hidden rounded-md border border-border text-xs font-semibold">
      {ctx.languageLinks.map((l) => (
        <a
          key={l.label}
          href={l.href}
          aria-current={l.active ? 'true' : undefined}
          className={`flex h-8 w-9 items-center justify-center ${l.active ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

function MenuLinks({ ctx, mobile }: { ctx: PageContext; mobile?: boolean }) {
  return (
    <>
      {ctx.menu.map((m) => (
        <a
          key={m.key}
          href={m.href}
          aria-current={m.active ? 'page' : undefined}
          className={
            mobile
              ? `block truncate rounded-md px-3 py-3 text-base ${m.active ? 'bg-background font-semibold shadow-[inset_3px_0_0_var(--color-primary)]' : 'hover:bg-background'}`
              : `max-w-56 truncate rounded-md px-3 py-1.5 text-sm ${m.active ? 'bg-card font-semibold text-foreground shadow-[inset_0_-2px_0_var(--color-primary)]' : 'text-muted-foreground hover:text-foreground'}`
          }
        >
          {m.label}
        </a>
      ))}
    </>
  );
}

function Header({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  const format = useFormatter();
  const fan = ctx.fan;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center gap-3">
          <Brand ctx={ctx} />
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitch ctx={ctx} />
            </div>
            {fan ? (
              <>
                {fan.walletCents != null && !fan.isTest && (
                  <a
                    href={ctx.links.wallet}
                    aria-label={t('wallet')}
                    className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm font-semibold tabular-nums sm:inline-flex"
                  >
                    <Wallet aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    {formatPrice(format, fan.walletCents)}
                  </a>
                )}
                {/* Zähler absolut — seine Breite verschiebt nichts. */}
                <a
                  href={ctx.links.notifications}
                  aria-label={t('notifications', { count: fan.unreadNotifications })}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-card"
                >
                  <Bell aria-hidden="true" className="h-5 w-5" />
                  {fan.unreadNotifications > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-foreground">
                      {fan.unreadNotifications > 9 ? '9+' : fan.unreadNotifications}
                    </span>
                  )}
                </a>
                <a
                  href={ctx.links.profile}
                  className="hidden h-9 max-w-44 items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm font-medium sm:inline-flex"
                >
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold">
                    {fan.displayName.charAt(0)}
                  </span>
                  <span className="truncate">{fan.displayName}</span>
                </a>
              </>
            ) : (
              <>
                <a href={ctx.links.login} className="hidden h-9 items-center rounded-md border border-border px-3 text-sm font-semibold sm:inline-flex">
                  {t('login')}
                </a>
                <a href={ctx.links.register} className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  {t('register')}
                </a>
              </>
            )}
            {/* Mobiles Menü ohne JavaScript: <details> klappt nativ auf. */}
            <details className="group sm:hidden">
              <summary
                aria-label={t('menuOpen')}
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-border group-open:bg-card [&::-webkit-details-marker]:hidden"
              >
                <Menu aria-hidden="true" className="h-5 w-5 group-open:hidden" />
                <X aria-hidden="true" className="hidden h-5 w-5 group-open:block" />
              </summary>
              <div className="fixed inset-x-0 bottom-0 top-16 z-50 bg-black/55">
                <nav className="max-h-full overflow-y-auto border-b border-border bg-card px-4 pb-5 pt-2 text-card-foreground">
                  <MenuLinks ctx={ctx} mobile />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 pt-4">
                    {fan ? (
                      <a href={ctx.links.profile} className="truncate text-sm font-semibold">
                        {fan.displayName}
                        {fan.walletCents != null && !fan.isTest && (
                          <span className="ml-2 font-normal tabular-nums text-muted-foreground">{formatPrice(format, fan.walletCents)}</span>
                        )}
                      </a>
                    ) : (
                      <a href={ctx.links.login} className="text-sm font-semibold">
                        {t('login')}
                      </a>
                    )}
                    <LanguageSwitch ctx={ctx} />
                  </div>
                </nav>
              </div>
            </details>
          </div>
        </div>
        {/* Menü ab 640 px: eigene Zeile, bricht bei vielen/langen Punkten um statt zu scrollen. */}
        <nav aria-label={t('start')} className="hidden flex-wrap gap-x-1 gap-y-1 pb-3 sm:flex">
          <MenuLinks ctx={ctx} />
        </nav>
      </div>
    </header>
  );
}

function Footer({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>{t('rights', { year: 2026, name: ctx.site.displayName })}</span>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={ctx.links.imprint} className="hover:text-foreground">{t('imprint')}</a>
          <a href={ctx.links.privacy} className="hover:text-foreground">{t('privacy')}</a>
          <a href={ctx.links.terms} className="hover:text-foreground">{t('terms')}</a>
          {ctx.site.hasHelp && <a href={ctx.links.help} className="hover:text-foreground">{t('help')}</a>}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs">{t('adults')}</span>
          <LanguageSwitch ctx={ctx} />
        </div>
      </div>
    </footer>
  );
}

export function Shell({ ctx, children, bare }: ShellProps) {
  const t = useTranslations('shell');
  if (bare) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-10">
        <div className="flex w-full max-w-sm items-center justify-between gap-3 text-sm">
          <a href={ctx.links.home} className="truncate text-muted-foreground hover:text-foreground">
            {t('back', { name: ctx.site.displayName })}
          </a>
          <LanguageSwitch ctx={ctx} />
        </div>
        {children}
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        {t('skip')}
      </a>
      <Notices ctx={ctx} />
      <Header ctx={ctx} />
      <div className="flex-1">{children}</div>
      <Footer ctx={ctx} />
    </div>
  );
}
