import { useFormatter, useTranslations } from 'next-intl';

import { formatPrice } from '@/kit/format';
import type { ShellProps } from '@/kit/template';
import type { Notice, PageContext } from '@/kit/types';

const NOTICE: Record<Notice['kind'], string> = {
  test: 'bg-sky-100 text-sky-900',
  impersonation: 'bg-amber-100 text-amber-900',
  email: 'bg-red-100 text-red-900',
  terms: 'bg-amber-100 text-amber-900'
};

/** Hinweisleisten über der Kopfzeile — Reihenfolge fest, Farben nach Bedeutung. */
function Notices({ ctx }: { ctx: PageContext }) {
  return (
    <>
      {ctx.notices.map((n) => (
        <div key={n.kind} className={`px-4 py-2 text-center text-sm ${NOTICE[n.kind]}`}>
          {n.text}{' '}
          {n.action && (
            <a href={n.action.href} className="font-medium underline">
              {n.action.label}
            </a>
          )}
        </div>
      ))}
    </>
  );
}

function Logo({ ctx }: { ctx: PageContext }) {
  const s = ctx.site;
  return (
    <a href={ctx.links.home} className="flex min-w-0 items-center gap-2 font-semibold">
      {s.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">{s.displayName.charAt(0)}</span>
      )}
      <span className="truncate">{s.displayName}</span>
    </a>
  );
}

/** Sprachwahl DE/EN — feste Breite, damit beim Umschalten nichts springt. */
function LanguageSwitch({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  if (ctx.languageLinks.length < 2) return null;
  return (
    <nav aria-label={t('language')} className="flex items-center gap-1 text-xs">
      {ctx.languageLinks.map((l) => (
        <a
          key={l.label}
          href={l.href}
          aria-current={l.active ? 'true' : undefined}
          className={`w-8 rounded py-1 text-center ${l.active ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

function Header({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  const format = useFormatter();
  const fan = ctx.fan;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Logo ctx={ctx} />
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto sm:flex">
          {ctx.menu.map((m) => (
            <a
              key={m.key}
              href={m.href}
              aria-current={m.active ? 'page' : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm ${m.active ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'} ${m.key === 'start' ? 'text-primary' : ''}`}
            >
              {m.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitch ctx={ctx} />
          </div>
          {fan ? (
            <>
              {fan.walletCents != null && !fan.isTest && (
                <a href={ctx.links.wallet} className="hidden rounded-full border border-border px-2.5 py-1 text-xs tabular-nums sm:inline-block">
                  {formatPrice(format, fan.walletCents)}
                </a>
              )}
              {/* Zähler absolut positioniert — seine Breite verschiebt nichts. */}
              <a href={ctx.links.notifications} className="relative p-2" aria-label={t('notifications', { count: fan.unreadNotifications })}>
                🔔
                {fan.unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 text-primary-foreground">
                    {fan.unreadNotifications > 9 ? '9+' : fan.unreadNotifications}
                  </span>
                )}
              </a>
              <a href={ctx.links.profile} className="max-w-32 truncate rounded-full bg-muted px-3 py-1 text-sm">
                {fan.displayName}
              </a>
            </>
          ) : (
            <>
              <a href={ctx.links.login} className="text-sm">
                {t('login')}
              </a>
              <a href={ctx.links.register} className="rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                {t('register')}
              </a>
            </>
          )}
          {/* Mobiles Menü ohne JavaScript: <details> klappt nativ auf. */}
          <details className="relative sm:hidden">
            <summary className="list-none rounded-md border border-border px-2 py-1 text-sm" aria-label={t('menuOpen')}>
              ☰
            </summary>
            <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
              {ctx.menu.map((m) => (
                <a key={m.key} href={m.href} className={`block rounded-md px-3 py-2 text-sm ${m.active ? 'bg-muted font-medium' : ''}`}>
                  {m.label}
                </a>
              ))}
              <div className="mt-2 border-t border-border px-3 pt-2">
                <LanguageSwitch ctx={ctx} />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function Footer({ ctx }: { ctx: PageContext }) {
  const t = useTranslations('shell');
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground">
        <span>{t('rights', { year: 2026, name: ctx.site.displayName })}</span>
        <nav className="flex flex-wrap items-center gap-4">
          <a href={ctx.links.imprint}>{t('imprint')}</a>
          <a href={ctx.links.privacy}>{t('privacy')}</a>
          <a href={ctx.links.terms}>{t('terms')}</a>
          {ctx.site.hasHelp && <a href={ctx.links.help}>{t('help')}</a>}
          <span className="text-xs">{t('adults')}</span>
        </nav>
        <div className="w-full sm:hidden">
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-10">
        <div className="flex w-full max-w-sm items-center justify-between text-sm">
          <a href={ctx.links.home} className="text-muted-foreground">
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
      <a href="#inhalt" className="sr-only focus:not-sr-only">
        {t('skip')}
      </a>
      <Notices ctx={ctx} />
      <Header ctx={ctx} />
      <div className="flex-1">{children}</div>
      <Footer ctx={ctx} />
    </div>
  );
}
