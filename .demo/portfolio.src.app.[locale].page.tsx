import { Heading, Text, Button, Avatar, RevealFx, Column, Badge, Row, Schema, Meta, Line,} 
    from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";

export async function generateMetadata() {
    console.log('📋 generateMetadata START');
    try {
        return Meta.generate({
            title: home.title,
            description: home.description,
            baseURL: baseURL,
            path: home.path,
            image: home.image,
        });
    } catch (error) {
        console.error('❌ generateMetadata ERROR:', error);
        throw error;
    }
}

export default function Home() {
    console.log('🚨 [locale]/page.tsx RENDERUJE SIĘ!');
    try {
        console.log('📦 Rendering Column wrapper...');

        return (
            <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
                <div style={{background: 'red', color: 'white', padding: '10px'}}>
                    DEBUG: [locale]/page.tsx works!
                </div>

                {(() => {
                    console.log('🔗 Rendering Schema...');
                    return (
                        <Schema
                            as="webPage"
                            baseURL={baseURL}
                            path={home.path}
                            title={home.title}
                            description={home.description}
                            image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
                            author={{
                                name: person.name,
                                url: `${baseURL}${about.path}`,
                                image: `${baseURL}${person.avatar}`,
                            }}
                        />
                    );
                })()}

                {(() => {
                    console.log('📋 Rendering main content Column...');
                    return (
                        <Column fillWidth horizontal="center" gap="m">
                            <Column maxWidth="s" horizontal="center" align="center">
                                {home.featured.display && (() => {
                                    console.log('🎯 Rendering Featured Badge...');
                                    return (
                                        <RevealFx fillWidth horizontal="center" paddingTop="16" paddingBottom="32" paddingLeft="12">
                                            <Badge
                                                background="brand-alpha-weak"
                                                paddingX="12"
                                                paddingY="4"
                                                onBackground="neutral-strong"
                                                textVariant="label-default-s"
                                                arrow={false}
                                                href={home.featured.href}
                                            >
                                                <Row paddingY="2">{home.featured.title}</Row>
                                            </Badge>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    console.log('📝 Rendering Heading...');
                                    return (
                                        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
                                            <Heading wrap="balance" variant="display-strong-l">
                                                {home.headline}
                                            </Heading>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    console.log('📄 Rendering Subline...');
                                    return (
                                        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
                                            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
                                                {home.subline}
                                            </Text>
                                        </RevealFx>
                                    );
                                })()}

                                {(() => {
                                    console.log('🔘 Rendering About Button...');
                                    return (
                                        <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
                                            <Button
                                                id="about"
                                                data-border="rounded"
                                                href={about.path}
                                                variant="secondary"
                                                size="m"
                                                weight="default"
                                                arrowIcon
                                            >
                                                <Row gap="8" vertical="center" paddingRight="4">
                                                    {about.avatar.display && (
                                                        <Avatar
                                                            marginRight="8"
                                                            style={{ marginLeft: "-0.75rem" }}
                                                            src={person.avatar}
                                                            size="m"
                                                        />
                                                    )}
                                                    {about.title}
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
                    console.log('🚀 Rendering Projects 1...');
                    return (
                        <RevealFx translateY="16" delay={0.6}>
                            <Projects range={[1, 1]} />
                        </RevealFx>
                    );
                })()}

                {routes["/blog"] && (() => {
                    console.log('📰 Rendering Blog section...');
                    return (
                        <Column fillWidth gap="24" marginBottom="l">
                            <Row fillWidth paddingRight="64">
                                <Line maxWidth={48} />
                            </Row>
                            <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
                                <Row flex={1} paddingLeft="l" paddingTop="24">
                                    <Heading as="h2" variant="display-strong-xs" wrap="balance">
                                        Latest from the blog
                                    </Heading>
                                </Row>
                                <Row flex={3} paddingX="20">
                                    {(() => {
                                        console.log('📃 Rendering Posts...');
                                        return <Posts range={[1, 2]} columns="2" />;
                                    })()}
                                </Row>
                            </Row>
                            <Row fillWidth paddingLeft="64" horizontal="end">
                                <Line maxWidth={48} />
                            </Row>
                        </Column>
                    );
                })()}

                {(() => {
                    console.log('🚀 Rendering Projects 2...');
                    return <Projects range={[2]} />;
                })()}
                {(() => {
                    console.log('📧 Rendering Mailchimp...');
                    return <Mailchimp />;
                })()}
            </Column>
        );
    } catch (error) {
        console.error('❌ RENDER ERROR:', error);
        return (
            <div style={{background: 'red', color: 'white', padding: '50px'}}>
                ERROR: {String(error)}
            </div>
        );
    }
}