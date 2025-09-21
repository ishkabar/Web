/*
import {getRequestConfig} from 'next-intl/server';
import {isLocale, defaultLocale, type Locale} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
    const rl = typeof requestLocale === 'string' ? requestLocale : undefined;
    const locale: Locale = isLocale(rl) ? (rl as Locale) : defaultLocale;

    // Debug
    console.log('[i18n/request] resolved locale =', locale, 'from', requestLocale);

    const mod = await import(`../messages/${locale}.json`);
    return {locale, messages: (mod as any).default ?? mod};
});
*/

import {getRequestConfig, type GetRequestConfigParams} from 'next-intl/server';

const allLocales = ['en', 'pl'] as const;
type Locale = typeof allLocales[number];
const defaultLocale: Locale = 'pl';

const fastLocale =
    process.env.FAST_DEV === '1'
        ? ((process.env.FAST_LOCALE as Locale) || defaultLocale)
        : null;

const activeLocales: readonly Locale[] = fastLocale ? [fastLocale] : allLocales;

/**
 * Default export wymagany przez next-intl.
 * Zwracamy pewny string w polu `locale` (nigdy undefined),
 * żeby naprawić błąd TS2345.
 */
export default getRequestConfig(async ({locale}: GetRequestConfigParams) => {
    // Ustal pewne locale
    const requested = (locale ?? defaultLocale) as string;
    const resolved: Locale = (activeLocales as readonly string[]).includes(requested)
        ? (requested as Locale)
        : defaultLocale;

    // Upewnij się, że ścieżka zgadza się ze strukturą projektu.
    // Jeśli pliki są w: src/messages/pl.json, użyj ../messages
    const messages = (await import(`../messages/${resolved}.json`)).default;

    return {
        locale: resolved,
        messages
    };
});

// (opcjonalne named exports, jeśli chcesz gdzieś użyć)
export {allLocales, activeLocales, defaultLocale};
