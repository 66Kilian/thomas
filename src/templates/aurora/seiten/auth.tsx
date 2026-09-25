import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { FormFields } from '@/kit/platform/form-fields';
import { RichText } from '@/kit/platform/rich-text';
import type { AuthPageProps, TermsConsentProps, VerifyEmailProps } from '@/kit/template';
import type { AuthForm } from '@/kit/types';

import { Shell } from '../bausteine/shell';
import { Box, btn, input, Page } from '../bausteine/ui';

/**
 * Anmelde-Seiten: schlichte zentrierte Karte OHNE Kopfzeile (`Shell bare`). Feldnamen sind fest
 * (email, password, username, displayName, terms, currentPassword, newPassword, repeatPassword) —
 * die Plattform wertet sie so aus.
 */

function AuthCard({ title, form, children, footer }: { title: string; form: AuthForm; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
      <h1 className="mb-4 text-xl font-semibold">{title}</h1>
      <form method="post" action={form.submit.action} className="space-y-3">
        <FormFields target={form.submit} />
        {form.success && <Box kind="success">{form.success}</Box>}
        {children}
        {form.error && <p className="text-sm text-red-600">{form.error}</p>}
      </form>
      {footer && <div className="mt-4 space-y-1 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}

function Field({ name, label, type = 'text', value, autoComplete }: { name: string; label: string; type?: string; value?: string; autoComplete?: string }) {
  return (
    <label className="block text-sm">
      {label}
      <input name={name} type={type} defaultValue={value} autoComplete={autoComplete} className={`${input} mt-1`} />
    </label>
  );
}

export function Login({ ctx, form }: AuthPageProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <AuthCard
        title={t('loginTitle')}
        form={form}
        footer={
          <>
            <p>
              {t('noAccount')} <a href={ctx.links.register} className="underline">{t('registerLink')}</a>
            </p>
            <p>
              <a href={ctx.links.forgotPassword} className="underline">{t('forgotLink')}</a>
            </p>
          </>
        }
      >
        <Field name="email" type="email" label={t('email')} value={form.values.email} autoComplete="email" />
        <Field name="password" type="password" label={t('password')} autoComplete="current-password" />
        <button type="submit" className={`${btn.primary} w-full`}>
          {t('loginButton')}
        </button>
      </AuthCard>
    </Shell>
  );
}

export function Register({ ctx, form }: AuthPageProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <AuthCard
        title={t('registerTitle')}
        form={form}
        footer={
          <p>
            {t('haveAccount')} <a href={ctx.links.login} className="underline">{t('loginLink')}</a>
          </p>
        }
      >
        <Field name="displayName" label={t('displayName')} />
        <Field name="username" label={t('username')} />
        <Field name="email" type="email" label={t('email')} />
        <Field name="password" type="password" label={t('passwordMin')} autoComplete="new-password" />
        <p className="text-xs text-muted-foreground">{t('ageNote')}</p>
        <p className="text-xs text-muted-foreground">{t('mailNote')}</p>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-1" />
          <span>
            <a href={ctx.links.terms} className="underline">{t('termsAgree')}</a>
          </span>
        </label>
        <button type="submit" className={`${btn.primary} w-full`}>
          {t('registerButton')}
        </button>
      </AuthCard>
    </Shell>
  );
}

export function ForgotPassword({ ctx, form }: AuthPageProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <AuthCard title={t('forgotTitle')} form={form} footer={<a href={ctx.links.login} className="underline">{t('backToLogin')}</a>}>
        {!form.success && (
          <>
            <p className="text-sm text-muted-foreground">{t('forgotText')}</p>
            <Field name="email" type="email" label={t('email')} />
            <button type="submit" className={`${btn.primary} w-full`}>
              {t('requestLink')}
            </button>
          </>
        )}
      </AuthCard>
    </Shell>
  );
}

export function ResetPassword({ ctx, form }: AuthPageProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <AuthCard title={t('resetTitle')} form={form}>
        <Field name="newPassword" type="password" label={t('newPassword')} autoComplete="new-password" />
        <Field name="repeatPassword" type="password" label={t('repeatPassword')} autoComplete="new-password" />
        <button type="submit" className={`${btn.primary} w-full`}>
          {t('setPassword')}
        </button>
      </AuthCard>
    </Shell>
  );
}

/** Passwort ändern — MIT Kopfzeile (der Fan ist angemeldet). */
export function ChangePassword({ ctx, form }: AuthPageProps) {
  const t = useTranslations('auth');
  const tp = useTranslations('profile');
  return (
    <Shell ctx={ctx}>
      <Page width="max-w-md">
        <a href={ctx.links.profile} className="text-sm text-muted-foreground">
          ← {tp('password')}
        </a>
        <div className="mt-4">
          <AuthCard title={t('changeTitle')} form={form}>
            <Field name="currentPassword" type="password" label={t('currentPassword')} autoComplete="current-password" />
            <Field name="newPassword" type="password" label={t('newPassword')} autoComplete="new-password" />
            <Field name="repeatPassword" type="password" label={t('repeatPassword')} autoComplete="new-password" />
            <p className="text-xs text-muted-foreground">{t('changeNote')}</p>
            <button type="submit" className={`${btn.primary} w-full`}>
              {t('changeButton')}
            </button>
          </AuthCard>
        </div>
      </Page>
    </Shell>
  );
}

export function VerifyEmail({ ctx, state, confirm, resend }: VerifyEmailProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">{t('verifyTitle')}</h1>
        {state === 'done' || state === 'already' ? <Box kind="success">{t(`verify.${state}`)}</Box> : <p className="text-sm">{t(`verify.${state}`)}</p>}
        {confirm && (
          <form method="post" action={confirm.action}>
            <FormFields target={confirm} />
            <button type="submit" className={`${btn.primary} w-full`}>
              {t('verifyButton')}
            </button>
          </form>
        )}
        {resend && (
          <form method="post" action={resend.action}>
            <FormFields target={resend} />
            <button type="submit" className={`${btn.outline} w-full`}>
              {t('resend')}
            </button>
          </form>
        )}
        {state === 'guest' && (
          <a href={ctx.links.login} className={`${btn.primary} w-full`}>
            {t('loginLink')}
          </a>
        )}
        {(state === 'done' || state === 'already') && (
          <a href={ctx.links.home} className={`${btn.outline} w-full`}>
            {t('toSite')}
          </a>
        )}
      </div>
    </Shell>
  );
}

export function TermsConsent({ ctx, changed, alreadyAccepted, termsMarkdown, form, laterHref }: TermsConsentProps) {
  const t = useTranslations('auth');
  return (
    <Shell ctx={ctx} bare>
      <div className="w-full max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">{changed ? t('termsTitleChanged') : t('termsTitleFirst')}</h1>
        {alreadyAccepted ? (
          <>
            <Box kind="success">{t('termsAlready')}</Box>
            <a href={laterHref} className={btn.primary}>
              {t('continue')}
            </a>
          </>
        ) : (
          <form method="post" action={form.submit.action} className="space-y-4">
            <FormFields target={form.submit} />
            <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-border p-4">
              <RichText markdown={termsMarkdown} lang="de" />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="terms" required className="mt-1" /> {t('termsAccept')}
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className={btn.primary}>
                {t('termsSubmit')}
              </button>
              <a href={laterHref} className="text-sm text-muted-foreground underline">
                {t('later')}
              </a>
            </div>
          </form>
        )}
      </div>
    </Shell>
  );
}
