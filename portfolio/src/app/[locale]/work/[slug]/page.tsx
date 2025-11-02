import { notFound } from "next/navigation";
import { getWorkPostsLocaleAware } from "@/utils/utils";
import {
    Schema,
    AvatarGroup,
    Column,
    Row,
    Text,
    Heading,
    Media,
    Line,
} from "@once-ui-system/core";
import {baseURL, paths} from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import type { Metadata } from "next";
import { Projects } from "@/components/work/Projects";
import { getLocale } from "next-intl/server";
import {buildPageMetadata} from "@/lib/seo";
import {useTranslations} from "next-intl";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const posts = getWorkPostsLocaleAware(undefined);
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.work);
}

export default async function Project({
                                          params,
                                      }: {
    params: Promise<{ slug: string }>; 
}) {
    const { slug } = await params; 
    const locale = await getLocale();
    const posts = getWorkPostsLocaleAware(locale);
    const post = posts.find((p) => p.slug === slug);

    if (!post) notFound();

    const avatars =
        post.metadata.team?.map((m) => ({ src: m.avatar })) ?? [];

    const t = useTranslations("work");
    const tCommon = useTranslations("common");
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
    const title = t('title');

    return (
        <Column as="section" maxWidth="m" horizontal="center" gap="l">
            <Schema
                as="blogPosting"
                baseURL={baseURL}
                path={`${paths.work}/${slug}`}  
                title={post.metadata.title}
                description={post.metadata.summary}
                datePublished={post.metadata.publishedAt}
                dateModified={post.metadata.publishedAt}
                image={post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${paths.about}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            <Column maxWidth="s" gap="16" horizontal="center" align="center">
                <a href="/work">
                    <Text variant="label-strong-m">{t('projects')}</Text>
                </a>
                <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
                    {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
                </Text>
                <Heading variant="display-strong-m">{post.metadata.title}</Heading>
            </Column>

            {post.metadata.team?.length ? (
                <Row marginBottom="32" horizontal="center">
                    <Row gap="16" vertical="center">
                        <AvatarGroup reverse avatars={avatars} size="s" />
                        <Text variant="label-default-m" onBackground="brand-weak">
                            {post.metadata.team.map((member, idx) => (
                                <span key={idx}>
                  {idx > 0 && (
                      <Text as="span" onBackground="neutral-weak">
                          ,{" "}
                      </Text>
                  )}
                                    <a href={member.linkedIn}>{member.name}</a>
                </span>
                            ))}
                        </Text>
                    </Row>
                </Row>
            ) : null}

            {post.metadata.images?.length ? (
                <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={post.metadata.images[0]} />
            ) : null}

            <Column as="article" style={{ margin: "auto" }} maxWidth="xs">
                <CustomMDX source={post.content} />
            </Column>

            <Column fillWidth gap="40" horizontal="center" marginTop="40">
                <Line maxWidth="40" />
                <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
                    {t('ralated')}
                </Heading>
                
                <Projects exclude={[post.slug]} range={[2]} locale={locale} />
            </Column>

            <ScrollToHash />
        </Column>
    );
}
