/**
 * buildPageMetadata
 * Returns Next.js Metadata using next-intl translations and canonical URL.
 *
 * - Reads `title`/`description` from i18n namespace (default keys: "title", "description").
 * - Builds canonical from baseURL + path.
 * - OG/Twitter image: dynamic `/api/og/generate?title=...` by default; can be overridden.
 */
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { baseURL } from "@/resources/ui-tokens.config";

type Options = {
    image?: string;            // override OG/Twitter image
    titleKey?: string;         // default "title"
    descriptionKey?: string;   // default "description"
    titleOverride?: string;    // skip i18n title
    descriptionOverride?: string; // skip i18n description
};

export async function buildPageMetadata(
    ns: string,                // e.g. "common.meta" / "about.meta"
    path: string,              // e.g. paths.about
    opts: Options = {}
): Promise<Metadata> {
    const t = await getTranslations(ns);

    const title = opts.titleOverride ?? t(opts.titleKey ?? "title");
    const description = opts.descriptionOverride ?? t(opts.descriptionKey ?? "description");

    const canonical = new URL(path, baseURL).toString();
    const ogImage = opts.image ?? `/api/og/generate?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: { url: canonical, title, description, images: [ogImage] },
        twitter: { card: "summary_large_image", title, description, images: [ogImage] },
        metadataBase: new URL(baseURL),
    };
}
