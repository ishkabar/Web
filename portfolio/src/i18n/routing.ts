// Central place for locales + helpers
export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

export function isLocale(v: string | undefined): v is Locale {
    return !!v && (locales as readonly string[]).includes(v);
}

// Paths that must bypass locale prefix (assets, _next, API, icons, etc.)
export const LOCALE_BYPASS = [
    '^/(?:_next|api)(?:/|$)',
    '^/(?:favicon\\.ico|robots\\.txt|sitemap\\.xml)$',
    '^/(?:icon\\.\\w+|apple-icon\\.\\w+|manifest\\.json)$'
];
