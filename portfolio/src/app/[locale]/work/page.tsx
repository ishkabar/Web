import { Column, Heading, Schema } from "@once-ui-system/core";
import { baseURL, paths } from "@/resources";
import { Projects } from "@/components/work/Projects";


import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import {useTranslations} from "next-intl";



export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("blog.meta", paths.work, { titleKey: "title" });
    //return buildPageMetadata("common.meta", paths.home, { image: ogImage });
}

export default function Work() {
    const t = useTranslations("work");
    const title = t('title');
    const person = (t.raw("common.person") || {
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
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={paths.work}
        title={title}
        description={t('description')}
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
      <Projects />
    </Column>
  );
}
