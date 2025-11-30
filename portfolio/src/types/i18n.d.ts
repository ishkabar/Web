declare module '@/i18n/locales.generated' {
    export const locales: readonly string[];
    export type Locale = typeof locales[number];
    export const defaultLocale: Locale;

    export const enabledLocales: readonly string[];
    export type EnabledLocale = typeof enabledLocales[number];

    export const localeMeta: Record<Locale, { label: string; flag: string }>;
    export function isLocale(x: string): x is Locale;
}