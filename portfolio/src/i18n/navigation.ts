import Link from "next/link";
import { locales, defaultLocale } from "./routing";

export { Link };

export function withLocale(path: string, locale?: string): string {
    if (!locale) return path;

    return `/${locale}${path}`;
}

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
