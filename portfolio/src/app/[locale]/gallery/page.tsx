import { Flex, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, paths } from "@/resources";
import type { Metadata } from "next";
import {buildPageMetadata} from "@/lib/seo";
import {getTranslations} from "next-intl/server";  


export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.gallery);
}

export default async function Gallery() { 
    const t = await getTranslations("gallery");  
    const tCommon = await getTranslations("common"); 
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
    const title = t('title', { name: person.name });

    return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={t('description', { name: person.name })}
        path={paths.gallery}
        image={`/api/og/generate?title=${encodeURIComponent(title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${paths.gallery}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView />
    </Flex>
  );
}