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
 * **Basis-Template** — vollständige, bewusst schlichte Referenz. Es zeigt jede Seite mit allen
 * Zuständen und dient als Rückfall für Seiten, die ein neues Template (noch) nicht liefert.
 * Zum Start eines eigenen Templates: Ordner kopieren (siehe README).
 */
export const basis: FanTemplate = {
  key: 'basis',
  meta: {
    name: { de: 'Basis', en: 'Basic' },
    description: { de: 'Schlichte Referenz mit allen Seiten und Zuständen.', en: 'Plain reference with every page and state.' }
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
