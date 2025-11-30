import { Column, Heading, Schema } from "@once-ui-system/core";
import { baseURL, paths } from "@/resources";
import { Projects } from "@/components/work/Projects";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { loadCommon, replacePlaceholders } from "@/utils/placeholders";

// Użyj klucza, który masz w PL (np. work.meta albo common.meta)
export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.work, { titleKey: "title" });
}

export default async function Work() {
    const locale = await getLocale();

    // Server API next-intl
    const tWork = await getTranslations("work");
    const tCommon = await getTranslations("common");

    // Wczytaj common.[locale].json do podmiany placeholderów (person.name itd.)
    const common = await loadCommon(locale);

    // Person z namespace "common"
    const person = (tCommon.raw("person") || {
        name: "",
        avatar: "",
        location: "",
        languages: [] as string[],
    }) as {
        name: string;
        avatar: string;
        location: string;
        languages: string[];
    };

    // Title/description mogą być:
    // - ICU: "Projects – {name}" => tWork("title", { name: person.name })
    // - albo z naszymi placeholderami {person.name} => replacePlaceholders(raw, common)
    //
    // Poniżej obsłużone oba przypadki – priorytet ICU, fallback na placeholdery.
    const rawTitle = (tWork.raw("title") as string | undefined) ?? "";
    const title = rawTitle.includes("{")
        ? (() => {
            try {
                // Spróbuj ICU:
                return tWork("title", { name: person.name });
            } catch {
                // Fallback: nasze placeholdery {person.name}
                return replacePlaceholders(rawTitle, common);
            }
        })()
        : rawTitle || tWork("title"); // gdyby był zwykły string bez placeholderów

    const rawDesc = (tWork.raw("description") as string | undefined) ?? "";
    const description = rawDesc
        ? (() => {
            try {
                return tWork("description", { name: person.name });
            } catch {
                return replacePlaceholders(rawDesc, common);
            }
        })()
        : "";

    return (
        <Column maxWidth="m" paddingTop="24">
            <Schema
                as="webPage"
                baseURL={baseURL}
                path={paths.work}
                title={title}
                description={description}
                image={`/api/og/generate?title=${encodeURIComponent(title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${paths.about}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            <Heading marginBottom="l" variant="heading-strong-xl" align="center">
                {title}
            </Heading>

            <Projects locale={locale} />
        </Column>
    );
}
