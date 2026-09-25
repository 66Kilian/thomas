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
    <a href={ctx.links.home} className="flex min-w-0 flex-1 items-center gap-2.5">
      {s.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-primary/70" />
      ) : (
        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {s.displayName.charAt(0)}
        </span>
      )}
      <span className="truncate text-[15px] font-bold tracking-tight">{s.displayName}</span>
    </a>
  );
}

/** Sprachwahl als Pillen mit fester Breite je Eintrag — beim Umschalten springt nichts. */
export function LanguageSwitch({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  if (ctx.languageLinks.length < 2) return null;
  return (
    <nav aria-label={t('language')} className="inline-flex shrink-0 rounded-full border border-border p-0.5 text-xs font-bold">
      {ctx.languageLinks.map((l) => (
        <a
          key={l.label}
          href={l.href}
          aria-current={l.active ? 'true' : undefined}
          className={`flex h-7 w-9 items-center justify-center rounded-full ${l.active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
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
              ? `block truncate rounded-xl px-4 py-3 text-base ${m.active ? 'bg-primary font-semibold text-primary-foreground' : 'hover:bg-background'}`
              : `max-w-56 truncate rounded-full px-3.5 py-1.5 text-sm transition-colors ${m.active ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`
          }
        >
          {m.label}
        </a>
      ))}
    </>
  );
}

const pill = 'h-9 items-center rounded-full text-sm font-semibold';

function Header({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  const format = useFormatter();
  const fan = ctx.fan;
  return (
    <header className="sticky top-0 z-40 isolate px-3 pt-3 sm:px-4">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-4">
        {/* Glas-Fläche als eigene Ebene: backdrop-filter am Elternteil würde das feste Klappmenü einfangen. */}
        <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-xl border border-border/70 bg-background/70 shadow-xl shadow-black/15 backdrop-blur-xl" />
        <div className="flex h-14 items-center gap-3">
          <Brand ctx={ctx} />
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitch ctx={ctx} />
            </div>
            {fan ? (
              <>
                {fan.walletCents != null && !fan.isTest && (
                  <a href={ctx.links.wallet} aria-label={t('wallet')} className={`${pill} hidden gap-1.5 border border-border px-3 tabular-nums sm:inline-flex`}>
                    <Wallet aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    {formatPrice(format, fan.walletCents)}
                  </a>
                )}
                {/* Zähler absolut — seine Breite verschiebt nichts. */}
                <a
                  href={ctx.links.notifications}
                  aria-label={t('notifications', { count: fan.unreadNotifications })}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-card"
                >
                  <Bell aria-hidden="true" className="h-5 w-5" />
                  {fan.unreadNotifications > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-foreground ring-2 ring-background">
                      {fan.unreadNotifications > 9 ? '9+' : fan.unreadNotifications}
                    </span>
                  )}
                </a>
                <a href={ctx.links.profile} className={`${pill} hidden max-w-44 gap-2 border border-border py-1 pl-1 pr-3 font-medium sm:inline-flex`}>
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                    {fan.displayName.charAt(0)}
                  </span>
                  <span className="truncate">{fan.displayName}</span>
                </a>
              </>
            ) : (
              <>
                <a href={ctx.links.login} className={`${pill} hidden px-3 hover:bg-card sm:inline-flex`}>
                  {t('login')}
                </a>
                <a href={ctx.links.register} className={`${pill} inline-flex bg-primary px-4 text-primary-foreground hover:opacity-90`}>
                  {t('register')}
                </a>
              </>
            )}
            {/* Mobiles Menü ohne JavaScript: <details> klappt nativ auf. */}
            <details className="group sm:hidden">
              <summary
                aria-label={t('menuOpen')}
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border group-open:bg-card [&::-webkit-details-marker]:hidden"
              >
                <Menu aria-hidden="true" className="h-5 w-5 group-open:hidden" />
                <X aria-hidden="true" className="hidden h-5 w-5 group-open:block" />
              </summary>
              <div className="fixed inset-x-0 bottom-0 top-[4.75rem] z-50 bg-black/55 px-3 pt-2">
                <nav className="max-h-full overflow-y-auto rounded-xl border border-border bg-card p-2 text-card-foreground shadow-2xl">
                  <MenuLinks ctx={ctx} mobile />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 pb-2 pt-4">
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
        {/* Menü ab 640 px: eigene Zeile als Pillen, bricht bei vielen/langen Punkten um. */}
        <nav aria-label={t('start')} className="hidden flex-wrap gap-1 border-t border-border/60 py-2 sm:flex">
          <MenuLinks ctx={ctx} />
        </nav>
      </div>
    </header>
  );
}

function Footer({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  return (
    <footer className="mt-24 px-3 pb-6 sm:px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-xl border border-border bg-card/60 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span className="font-semibold text-foreground">{t('rights', { year: 2026, name: ctx.site.displayName })}</span>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={ctx.links.imprint} className="hover:text-foreground">{t('imprint')}</a>
          <a href={ctx.links.privacy} className="hover:text-foreground">{t('privacy')}</a>
          <a href={ctx.links.terms} className="hover:text-foreground">{t('terms')}</a>
          {ctx.site.hasHelp && <a href={ctx.links.help} className="hover:text-foreground">{t('help')}</a>}
        </nav>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-bold">{t('adults')}</span>
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="flex w-full max-w-md items-center justify-between gap-3 text-sm">
          <a href={ctx.links.home} className="inline-flex min-w-0 items-center gap-2.5 rounded-full bg-card py-1 pl-1 pr-4 font-semibold ring-1 ring-border hover:ring-primary">
            {ctx.site.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ctx.site.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{ctx.site.displayName.charAt(0)}</span>
            )}
            <span className="truncate">{t('back', { name: ctx.site.displayName })}</span>
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
