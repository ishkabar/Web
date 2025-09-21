import Link from "next/link";
import { locales, defaultLocale } from "./routing";

// Re-eksport Link, działa w Server Components.
export { Link };

/**
 * Prefixuje ścieżkę locale-em, jeśli podano.
 * Jeżeli nie podasz locale -> zwraca path bez prefiksu.
 */
export function withLocale(path: string, locale?: string): string {
    if (!locale) return path;
    // (opcjonalnie: walidacja, jeśli chcesz twardo pilnować listy)
    // if (!locales.includes(locale)) throw new Error(`Unknown locale: ${locale}`);
    return `/${locale}${path}`;
}

/**
 * Buduje finalny href bez segmentów dynamicznych ([...]).
 * Przykład: href("/work/[slug]", {slug:"alpha"}, "pl") => "/pl/work/alpha"
 */
export function href(
    pathname: string,
    params: Record<string, string | number> = {},
    locale?: string
): string {
    const path = pathname.replace(/\[([^\]]+)\]/g, (_, key) => {
        const v = params[key];
        if (v === undefined || v === null) {
            throw new Error(`Missing param: ${key}`);
        }
        return encodeURIComponent(String(v));
    });
    return withLocale(path, locale);
}
