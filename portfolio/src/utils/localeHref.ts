/**
 * Build href for Next App Router without dynamic segments in the final string.
 * Replaces [param] with params[param] and optionally prefixes /<locale>.
 */
export function localeHref(
    pathname: string,                           // e.g. "/work/[slug]"
    params: Record<string, string | number>,   // e.g. {slug: "alpha"}
    locale?: string
): string {
    const path = pathname.replace(/\[([^\]]+)\]/g, (_, key) => {
        const v = params[key];
        if (v === undefined || v === null) throw new Error(`Missing param: ${key}`);
        return encodeURIComponent(String(v));
    });
    return locale ? `/${locale}${path}` : path;
}
