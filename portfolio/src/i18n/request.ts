import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, type Locale, isLocale} from './locales.generated';

const NAMESPACES = ['common','home','about','work','blog','gallery','newsletter'] as const;

function normalizeLocale(input: string | undefined): string | undefined {
    return input?.toLowerCase().split('-')[0];
}

function isThenable<T = unknown>(v: unknown): v is Promise<T> {
    return !!v && typeof (v as any).then === 'function';
}

async function loadMonolith(loc: Locale) {
    const mod = await import(`../messages/${loc}.json`);
    return (mod as any).default ?? mod;
}

async function loadNamespaces(loc: Locale) {
    const parts = await Promise.all(
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
    return Object.assign({}, ...parts);
}

export default getRequestConfig(async ({locale}) => {
    // locale can be string or Promise<string> (Next 15) or undefined
    const raw = typeof locale === 'string' ? locale : (isThenable<string>(locale) ? await locale : undefined);
    const norm = normalizeLocale(raw);
    const resolved: Locale = isLocale(norm ?? '') ? (norm as Locale) : defaultLocale;

    // Try monolith first; fallback to namespaces; final fallback {}
    let messages: Record<string, unknown> | null = null;

    try {
        messages = await loadMonolith(resolved);
    } catch {
        const ns = await loadNamespaces(resolved);
        messages = Object.keys(ns).length ? ns : null;
    }

    if (!messages && resolved !== defaultLocale) {
        try {
            messages = await loadMonolith(defaultLocale);
        } catch {
            const ns = await loadNamespaces(defaultLocale);
            messages = Object.keys(ns).length ? ns : {};
        }
    }

    messages ??= {};

    // Required: return both locale and messages
    return {locale: resolved, messages};
});
