import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {getLocale, getTranslations} from "next-intl/server";

import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { baseURL, } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import {getBlogPostsLocaleAware} from "@/utils/utils";
import { Metadata } from "next";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";
import { paths } from '@/resources/site.config';
import {useTranslations} from "next-intl";
import { buildPageMetadata } from "@/lib/seo";


const locale = await getLocale();

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const locale = await getLocale(); // ✅ Przenieś tutaj
    const posts = getBlogPostsLocaleAware(locale);
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata(): Promise<Metadata> {
        return buildPageMetadata("common.meta", paths.blog);
    //return buildPageMetadata("blog.meta", paths.blog, { titleKey: "pageTitle" });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
    const locale = await getLocale();
    const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let post = getBlogPostsLocaleAware(locale).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

    const t = await getTranslations("blog"); 
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

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${paths.blog}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={
              post.metadata.image ||
              `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
            }
            author={{
              name: person.name,
              url: `${baseURL}${paths.about}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">{t('titleShort')}</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Heading variant="display-strong-m">{post.metadata.title}</Heading>
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>
          
          <ShareSection 
            title={post.metadata.title} 
            url={`${baseURL}${paths.blog}/${post.slug}`} 
          />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
                {t('earlierPosts')}
            </Heading>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
            {t('onPage')}
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
