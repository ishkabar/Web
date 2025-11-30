import {
    Heading, Text, Button, Avatar, RevealFx, Column, Badge, Row, Schema, Line,
} from "@once-ui-system/core";
import {baseURL, routes, paths} from "@/resources";
import {Mailchimp} from "@/components";
import {Projects} from "@/components/work/Projects";
import {Posts} from "@/components/blog/Posts";

export const runtime = "nodejs";
import {Logo} from "@once-ui-system/core";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {buildPageMetadata} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return buildPageMetadata("common.meta", paths.about, {titleKey: "title"});
}

export default async function Home(
    {params, searchParams}: {
        params: Promise<{ locale: string }>;
        searchParams: Promise<{ blocked?: string }>;
    }
) {
    const {locale} = await params;
    const {blocked} = await searchParams;
    const wasBlocked = blocked === '1';

    const tHome = await getTranslations({locale, namespace: "home"});
    const tAbout = await getTranslations({locale, namespace: "about"});
    const t = await getTranslations({locale, namespace: "common"});

    const featured = tHome.raw("featured") as {
        display: boolean;
        title?: string;
        subtitle?: string;
        href: string;
    };

    const aboutAvatar = (tAbout.raw("avatar") as { display: boolean } | undefined)?.display === true;
    const aboutTitle = tAbout("title", {name: t("person.name")});

    const personAvatar = t("person.avatar");
    const personName = t("person.name");

    try {
        return (
            <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">

                {/* Komunikat o zablokowanej stronie */}
                {wasBlocked && (
                    <Row fillWidth padding="16" background="warning-alpha-medium" radius="m" horizontal="center">
                        <Text>{t('underConstruction')}</Text>
                    </Row>
                )}

                {/* Schema.org */}
                {(() => {
                    return (
                        <Schema
                            as="webPage"
                            baseURL={baseURL}
                            path={paths.home}
                            title={tHome("title", {name: personName})}
                            description={tHome("description", {role: t("person.role")})}
                            image={`/api/og/generate?title=${encodeURIComponent(tHome("title", {name: personName}))}`}
                            author={{
                                name: personName,
                                url: `${baseURL}${paths.about}`,
                                image: `${baseURL}${personAvatar}`,
                            }}
                        />
                    );
                })()}

                {/* Hero */}
                {(() => {
                    return (
                        <Column fillWidth horizontal="center" gap="m">
                            <Column maxWidth="s" horizontal="center" align="center">
                                {featured?.display && (() => {
                                    return (
                                        <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="32"
                                                  paddingLeft="12">
                                            <Badge
                                                background="brand-alpha-weak"
                                                paddingX="12"
                                                paddingY="4"
                                                onBackground="neutral-strong"
                                                textVariant="label-default-s"
                                                arrow={false}
                                                href={featured.href}
                                            >
                                                <Row gap="12" vertical="center" paddingY="2">
                                                    <strong className="ml-4">{featured.title}</strong>
                                                    <div style={{
                                                        width: 1,
                                                        height: 20,
                                                        background: "var(--brand-alpha-strong)"
                                                    }}/>
                                                    <Text as="span" marginRight="4" onBackground="brand-medium">
                                                        {featured.subtitle}
                                                    </Text>
                                                </Row>
                                            </Badge>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    return (
                                        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
                                            <Heading wrap="balance" variant="display-strong-l">
                                                {tHome("headline")}
                                            </Heading>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    return (
                                        <RevealFx
                                            translateY="8"
                                            delay={0.2}
                                            fillWidth
                                            horizontal="center"
                                            paddingBottom="32"
                                        >
                                            <Text
                                                wrap="balance"
                                                onBackground="neutral-weak"
                                                variant="heading-default-xl"
                                            >
                                                {tHome.rich("sublineRich", {
                                                    firstName: t('person.firstName'),
                                                    Logo: () => (
                                                        <Logo
                                                            dark
                                                            icon="/trademarks/wordmark-dark.svg"
                                                            style={{
                                                                display: "inline-flex",
                                                                top: "0.25em",
                                                                marginLeft: "-0.25em"
                                                            }}
                                                        />
                                                    ),
                                                    br: () => <br/>
                                                })}
                                            </Text>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    return (
                                        <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
                                            <Button
                                                id="about"
                                                data-border="rounded"
                                                href={paths.about}
                                                variant="secondary"
                                                size="m"
                                                weight="default"
                                                arrowIcon
                                            >
                                                <Row gap="8" vertical="center" paddingRight="4">
                                                    {aboutAvatar && (
                                                        <Avatar
                                                            marginRight="8"
                                                            style={{marginLeft: "-0.75rem"}}
                                                            src={personAvatar}
                                                            size="m"
                                                        />
                                                    )}
                                                    {aboutTitle}
                                                </Row>
                                            </Button>
                                        </RevealFx>
                                    );
                                })()}
                            </Column>
                        </Column>
                    );
                })()}

                {(() => {
                    return (
                        <RevealFx translateY="16" delay={0.6}>
                            <Projects range={[1, 1]} locale={locale}/>
                        </RevealFx>
                    );
                })()}

                {routes["/blog"] && (() => {
                    return (
                        <Column fillWidth gap="24" marginBottom="l">
                            <Row fillWidth paddingRight="64">
                                <Line maxWidth={48}/>
                            </Row>
                            <Row fillWidth gap="24" marginTop="40" s={{direction: "column"}}>
                                <Row flex={1} paddingLeft="l" paddingTop="24">
                                    <Heading as="h2" variant="display-strong-xs" wrap="balance">
                                        {tHome("blog.latest")}
                                    </Heading>
                                </Row>
                                <Row flex={3} paddingX="20">
                                    {(() => {
                                        return <Posts range={[1, 2]} columns="2"/>;
                                    })()}
                                </Row>
                            </Row>
                            <Row fillWidth paddingLeft="64" horizontal="end">
                                <Line maxWidth={48}/>
                            </Row>
                        </Column>
                    );
                })()}

                {(() => {
                    return <Projects range={[2]} locale={locale}/>
                })()}

                {(() => {
                    return <Mailchimp/>;
                })()}

            </Column>
        );
    } catch (error) {
        return (
            <div style={{background: 'red', color: 'white', padding: '50px'}}>
                ERROR: {String(error)}
            </div>
        );
    }
}