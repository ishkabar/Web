import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work, paths } from "@/resources";
import { Projects } from "@/components/work/Projects";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("common.meta");
    const title = t("title");
    const description = t("description");
    const url = new URL(paths.about, baseURL).toString();
    const ogImage = `/api/og/generate?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            url,
            title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        metadataBase: new URL(baseURL),
    };
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {work.title}
      </Heading>
      <Projects />
    </Column>
  );
}
