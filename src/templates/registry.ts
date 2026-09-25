import type { FanTemplate } from '@/kit/template';

import { aurora } from './aurora';

/**
 * Alle Templates im Kit. Ein neues Template hier eintragen — dann erscheint es in der Vorschau.
 *
 *   import { meinTemplate } from './mein-template';
 *   export const TEMPLATES = { basis, [meinTemplate.key]: meinTemplate };
 */
export const TEMPLATES: Record<string, FanTemplate> = { aurora };
