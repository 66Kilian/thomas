import type { FanTemplate } from '@/kit/template';

import { ConfirmDialog } from './bausteine/confirm-dialog';
import { ContentCard } from './bausteine/content-card';
import { PurchasePanel } from './bausteine/purchase-panel';
import { Shell } from './bausteine/shell';
import { palettes } from './palettes';
import { Notifications, Payments, Profile, Wallet } from './seiten/account';
import { ChangePassword, ForgotPassword, Login, Register, ResetPassword, TermsConsent, VerifyEmail } from './seiten/auth';
import { Bundles, Subscriptions, Wishlist } from './seiten/commerce';
import { ContentDetail } from './seiten/content-detail';
import { Home } from './seiten/home';
import { AuctionDetail, Auctions, EventDetail, Events, Requests } from './seiten/interaction';
import { AgeGate, Message, TextPage } from './seiten/misc';

/**
 * **Aurora** — Nachtlicht-Studio: großes Porträt im Lichtschein, Momente-Ring um das Profilbild,
 * ruhige Hochformat-Kacheln und klare Kaufwege. Für alle Models wählbar, in allen sechs Farbwelten.
 */
export const aurora: FanTemplate = {
  key: 'aurora',
  meta: {
    name: { de: 'Aurora', en: 'Aurora' },
    description: {
      de: 'Nachtlicht-Studio: großes Porträt im Lichtschein, Momente-Ring und ruhige Hochformat-Kacheln.',
      en: 'Night-light studio: a large portrait in a soft glow, a moments ring and calm portrait tiles.'
    }
  },
  palettes,
  Shell,
  ContentCard,
  PurchasePanel,
  ConfirmDialog,
  AgeGate,
  Home,
  ContentDetail,
  Subscriptions,
  Bundles,
  Wishlist,
  Events,
  EventDetail,
  Auctions,
  AuctionDetail,
  Requests,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  VerifyEmail,
  TermsConsent,
  Profile,
  Payments,
  Wallet,
  Notifications,
  TextPage,
  Message
};
