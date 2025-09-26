import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person, paths } from "@/resources";
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

export default function Gallery() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView />
    </Flex>
  );
}
