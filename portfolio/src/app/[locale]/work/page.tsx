import { Column, Heading, Row, Schema, Text } from "@once-ui-system/core";
import { baseURL, paths } from "@/resources";
import { Projects } from "@/components/work/Projects";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { loadCommon, replacePlaceholders } from "@/utils/placeholders";
import { hasAllTranslations } from "@/utils/checkTranslation";
import { getWorkPostsLocaleAware  } from "@/utils/utils";


export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.work, { titleKey: "title" });
}

export default async function Work() {
    const locale = await getLocale();

    const tWork = await getTranslations("work");
    const tCommon = await getTranslations("common");

    const common = await loadCommon(locale);

    // Sprawdź tłumaczenia projektów
    const projects = getWorkPostsLocaleAware(locale); // <-- ZMIANA
    const allSlugs = projects.map(p => p.slug);
    const hasFullTranslation = hasAllTranslations('projects', allSlugs, locale);

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

    const rawTitle = (tWork.raw("title") as string | undefined) ?? "";
    const title = rawTitle.includes("{")
        ? (() => {
            try {
                return tWork("title", { name: person.name });
            } catch {
                return replacePlaceholders(rawTitle, common);
            }
        })()
        : rawTitle || tWork("title");

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

            {!hasFullTranslation && (
                <Row
                    fillWidth
                    padding="16"
                    background="warning-alpha-medium"
                    radius="m"
                    horizontal="center"
                    marginBottom="l"
                >
                    <Text>{tCommon('translationInProgress')}</Text>
                </Row>
            )}

            <Heading marginBottom="l" variant="heading-strong-xl" align="center">
                {title}
            </Heading>

            <Projects locale={locale} />
        </Column>
    );
}