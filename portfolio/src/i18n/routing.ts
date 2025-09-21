import { defineRouting } from 'next-intl/routing';

export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

// EKSPORTUJ routing
export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: 'always' as const
});

// Backward compatibility
const config = {
    locales,
    defaultLocale,
    localePrefix: 'always' as const
};

export default config;