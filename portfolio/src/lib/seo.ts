/**
 * buildPageMetadata
 * Returns Next.js Metadata using next-intl translations and canonical URL.
 *
 * Features:
 * - Reads `title`/`description` from i18n namespace
 * - Builds canonical URL from baseURL + locale + path
 * - Generates alternateLanguages (hreflang) for all enabled locales
 * - OG/Twitter with proper locale tags
 */
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { baseURL } from "@/resources/ui-tokens.config";

const ENABLED_LOCALES = ["pl", "en", "de","da"] as const;
const DEFAULT_LOCALE = "en";

type Options = {
    image?: string;
    titleKey?: string;
    descriptionKey?: string;
    titleOverride?: string;
    descriptionOverride?: string;
};

export async function buildPageMetadata(
    ns: string,
    path: string,
    opts: Options = {}
): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations(ns);

    const title = opts.titleOverride ?? t(opts.titleKey ?? "title");
    const description = opts.descriptionOverride ?? t(opts.descriptionKey ?? "description");

    // Canonical z locale
    const canonicalPath = path === "/" || path === "" ? `/${locale}` : `/${locale}${path}`;
    const canonical = new URL(canonicalPath, baseURL).toString();

    // Alternate languages (hreflang)
    const languages: Record<string, string> = {};
    for (const loc of ENABLED_LOCALES) {
        const altPath = path === "/" || path === "" ? `/${loc}` : `/${loc}${path}`;
        languages[loc] = new URL(altPath, baseURL).toString();
    }
    // x-default wskazuje na domyślny język
    languages["x-default"] = new URL(`/${DEFAULT_LOCALE}${path === "/" ? "" : path}`, baseURL).toString();

    const ogImage = opts.image ?? `/api/og/generate?title=${encodeURIComponent(title)}&locale=${locale}`;

    // Mapowanie locale na OG locale format
    const ogLocaleMap: Record<string, string> = {
        pl: "pl_PL",
        en: "en_US",
        de: "de_DE",
        da: "da_DK",
    };

    return {
        title,
        description,
        alternates: {
            canonical,
            languages,
        },
        openGraph: {
            url: canonical,
            title,
            description,
            images: [ogImage],
            locale: ogLocaleMap[locale] || "en_US",
            alternateLocale: ENABLED_LOCALES.filter(l => l !== locale).map(l => ogLocaleMap[l]),
            type: "website",
            siteName: title.split("–")[0]?.trim() || title,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        metadataBase: new URL(baseURL),
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}