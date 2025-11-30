import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, type Locale, isLocale} from './locales.generated';

const NAMESPACES = ['common','home','about','work','blog','gallery','newsletter'] as const;

function normalizeLocale(input: string | undefined): string | undefined {
    return input?.toLowerCase().split('-')[0];
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

// Generuje placeholder klucze z struktury obiektu
function generatePlaceholders(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = generatePlaceholders(value as Record<string, unknown>, path);
        } else if (Array.isArray(value)) {
            // Dla tablic zachowaj strukturę ale z placeholderami
            result[key] = value.map((item, i) => {
                if (item && typeof item === 'object') {
                    return generatePlaceholders(item as Record<string, unknown>, `${path}[${i}]`);
                }
                return `${path}[${i}]`;
            });
        } else {
            result[key] = path;
        }
    }

    return result;
}

// Deep merge - locale nadpisuje placeholdery
function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
    const result = {...base};

    for (const [key, value] of Object.entries(override)) {
        if (value && typeof value === 'object' && !Array.isArray(value) &&
            result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }

    return result;
}

export default getRequestConfig(async ({requestLocale}) => {
    const raw = await requestLocale;
    const norm = normalizeLocale(raw);
    const resolved: Locale = isLocale(norm ?? '') ? (norm as Locale) : defaultLocale;

    // Ładuj strukturę z defaultLocale jako template dla placeholderów
    let template: Record<string, unknown> = {};
    try {
        template = await loadMonolith(defaultLocale);
    } catch {
        template = await loadNamespaces(defaultLocale);
    }

    // Generuj placeholdery z template
    const placeholders = generatePlaceholders(template);

    // Ładuj właściwy locale
    let localeMessages: Record<string, unknown> = {};
    try {
        localeMessages = await loadMonolith(resolved);
    } catch {
        localeMessages = await loadNamespaces(resolved);
    }

    // Merge: placeholdery jako base, locale nadpisuje
    const messages = deepMerge(placeholders, localeMessages);


    return {locale: resolved, messages, timeZone: 'Europe/Warsaw'};
});