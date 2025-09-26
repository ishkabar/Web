import { Column, Heading } from "@once-ui-system/core";
import { Posts } from "@/components/blog/Posts";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mailchimp } from "@/components/Mailchimp";
import { baseURL } from "@/resources/ui-tokens.config";
import { paths } from "@/resources/site.config";
import { Schema } from "@once-ui-system/core";
import { buildPageMetadata } from "@/lib/seo";


export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.blog);
    //return buildPageMetadata("blog.meta", paths.blog, { titleKey: "pageTitle" });
}

export default async function Blog() {
    const t = await getTranslations("blog");
    const title = t("title");
    const description = t("description");
    const path = paths.blog;
    const image = `/api/og/generate?title=${encodeURIComponent(title)}`;
    


    return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={title}
        description= {description}
        path={path}
        image={image}
        author={{
            name: t("author.name"),
            url: `${baseURL}${path}`,
            image: `${baseURL}/images/avatar.jpg`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Posts range={[1, 1]} thumbnail />
        <Posts range={[2, 3]} columns="2" thumbnail direction="column" />
        <Mailchimp marginBottom="l" />
        <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
            {t("earlierPosts")}
        </Heading>
        <Posts range={[4]} columns="2" />
      </Column>
    </Column>
  );
}
