import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Schema,
  Row,
} from "@once-ui-system/core";
import { baseURL } from "@/resources"; //about, person, social
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";
import { buildPageMetadata } from "@/lib/seo";
import { useTranslations } from "next-intl";

import type { Metadata } from "next";
import { paths } from '@/resources/site.config';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("common.meta", paths.about, { titleKey: "title" });
}

export default function About() {
  const t = useTranslations("about");
    const tCommon = useTranslations("common");

  const intro = t.raw("intro") as {
    display: boolean;
    title: string;
    description: string;
  };

  const work = t.raw("work") as {
    display: boolean;
    title: string;
    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: string[];
      images?: Array<{ src: string; alt: string; width: number; height: number }>;
    }>;
  };

  const studies = t.raw("studies") as {
    display: boolean;
    title: string;
    institutions: Array<{ name: string; description: string }>;
  };

  const technical = t.raw("technical") as {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description: string;
      tags?: Array<{ name: string; icon?: string }>;
      images?: Array<{ src: string; alt: string; width: number; height: number }>;
    }>;
  };

  //const tableOfContent = (t.raw("tableOfContent") || { display: false }) as { display: boolean; subItems?: boolean; };
    const tocRaw = (t.raw("tableOfContent") ?? {}) as Partial<{ display: boolean; subItems: boolean }>;
    const tableOfContent: { display: boolean; subItems: boolean } = {
        display: !!tocRaw.display,
        subItems: tocRaw.subItems ?? false
    };
    const aboutForToc: { tableOfContent: { display: boolean; subItems: boolean } } = { tableOfContent };


    const avatar = (t.raw("avatar") || { display: false }) as {
    display: boolean;
  };

  const calendar = (t.raw("calendar") || { display: false, link: "" }) as {
    display: boolean;
    link: string;
  };

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

  const social =
    (tCommon.raw("social") as Array<{ name: string; icon: string; link?: string }>) || [];

    const structure = [
        { title: intro.title,     display: intro.display,     items: [] as string[] },
        { title: work.title,      display: work.display,      items: work.experiences?.map(x => x.company) ?? [] },
        { title: studies.title,   display: studies.display,   items: studies.institutions?.map(x => x.name) ?? [] },
        { title: technical.title, display: technical.display, items: technical.skills?.map(x => x.title) ?? [] },
    ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={t("title", { name: person.name })}
        description={t("description")}
        path={paths.about}
        image={`/api/og/generate?title=${encodeURIComponent(t("title"))}`}
        author={{
          name: person.name,
          url: `${baseURL}${paths.about}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

        {tableOfContent.display && (
            <Column
                left="0"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                position="fixed"
                paddingLeft="24"
                gap="32"
                s={{ hide: true }}
            >
                <TableOfContents structure={structure} about={aboutForToc} />
            </Column>
        )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Row>
            {person.languages?.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column id={intro.title} fillWidth minHeight="160" vertical="center" marginBottom="32">
            {calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{ backdropFilter: "blur(var(--static-space-1))" }}
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="8">{t("calendar.cta")}</Row>
                <IconButton
                  href={calendar.link}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text className={styles.textAlign} variant="display-default-xs" onBackground="neutral-weak">
              {t("role", { default: "" }) || person["role" as keyof typeof person] || ""}
            </Text>

            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social.map(
                  (item) =>
                    item.link && (
                      <React.Fragment key={item.name}>
                        <Row s={{ hide: true }}>
                          <Button
                            key={item.name}
                            href={item.link}
                            prefixIcon={item.icon}
                            label={item.name}
                            size="s"
                            weight="default"
                            variant="secondary"
                          />
                        </Row>
                        <Row hide s={{ hide: false }}>
                          <IconButton
                            size="l"
                            key={`${item.name}-icon`}
                            href={item.link}
                            icon={item.icon}
                            variant="secondary"
                          />
                        </Row>
                      </React.Fragment>
                    )//,
                )}
              </Row>
            )}
          </Column>

          {intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {intro.description}
            </Column>
          )}

          {work.display && (
            <>
              <Heading as="h2" id={work.title} variant="display-strong-s" marginBottom="m">
                {work.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {work.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                      <Text id={experience.company} variant="heading-strong-l">
                        {experience.company}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {experience.timeframe}
                      </Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                      {experience.role}
                    </Text>
                    <Column as="ul" gap="16">
                      {experience.achievements.map((achievement, i) => (
                        <Text as="li" variant="body-default-m" key={`${experience.company}-${i}`}>
                          {achievement}
                        </Text>
                      ))}
                    </Column>
                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth paddingTop="m" paddingLeft="40" gap="12" wrap>
                        {experience.images.map((image, i) => (
                          <Row
                            key={i}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                              priority
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {studies.display && (
            <>
              <Heading as="h2" id={studies.title} variant="display-strong-s" marginBottom="m">
                {studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {technical.display && (
            <>
              <Heading as="h2" id={technical.title} variant="display-strong-s" marginBottom="40">
                {technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {technical.skills.map((skill, index) => (
                  <Column key={`${skill.title}-${index}`} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l">
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, i) => (
                          <Row
                            key={i}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                              priority
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}