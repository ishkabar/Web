// Uses auto-generated locales from /src/i18n/locales.generated.ts
import {
    locales,
    defaultLocale,
    isLocale,
    type Locale,
    localeMeta
} from './locales.generated';

export { locales, defaultLocale, isLocale, type Locale, localeMeta };

// Paths that must bypass locale prefix (assets, _next, API, icons, etc.)
export const LOCALE_BYPASS = [
    '^/(?:_next|api)(?:/|$)',
    '^/(?:favicon\\.ico|robots\\.txt|sitemap\\.xml)$',
    '^/(?:icon\\.\\w+|apple-icon\\.\\w+|manifest\\.json)$'
] as const;
