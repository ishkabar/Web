import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, type Locale, isLocale} from './locales.generated';

const NAMESPACES = ['common','home','about','work','blog','gallery','newsletter'] as const;

function normalizeLocale(input: string | undefined): string | undefined {
    if (!input) return input;
    return input.toLowerCase().split('-')[0];
}

async function loadMonolith(loc: Locale) {
    const mod = await import(`../messages/${loc}.json`);
    return (mod as any).default ?? mod;
}

async function loadNamespaces(loc: Locale) {
    const wrapped = await Promise.all(
        NAMESPACES.map(async (ns) => {
            try {
                const mod = await import(`../messages/${loc}/${ns}.json`);
                const data = (mod as any).default ?? mod;
                return {[ns]: data};
            } catch {
                return {};
            }
        })
    );
    return Object.assign({}, ...wrapped);
}

export default getRequestConfig(async ({requestLocale}) => {
    // <- KLUCZOWA ZMIANA: await requestLocale (może być undefined)
    const rl = await requestLocale;
    const requestedNorm = normalizeLocale(rl);
    const resolved: Locale = isLocale(requestedNorm ?? '') ? (requestedNorm as Locale) : defaultLocale;

    console.log(`[i18n] request: reqLocale="${rl}"`);
    console.log(`[i18n] request: norm="${requestedNorm}" -> resolved="${resolved}"`);

    let messages: Record<string, unknown> | null = null;

    try {
        messages = await loadMonolith(resolved);
    } catch {
        const ns = await loadNamespaces(resolved);
        messages = Object.keys(ns).length ? ns : null;
    }

    if (!messages && resolved !== defaultLocale) {
        try {
            messages = await loadMonolith(defaultLocale as Locale);
        } catch {
            const ns = await loadNamespaces(defaultLocale as Locale);
            messages = Object.keys(ns).length ? ns : {};
        }
    }

    messages ??= {};

    // <- WYMAGANE w nowych wersjach: zwróć też `locale`
    return {locale: resolved, messages};
});
