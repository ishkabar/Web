import { Row, IconButton, SmartLink, Text } from "@once-ui-system/core";
import styles from "./Footer.module.scss";
import { useTranslations } from "next-intl";

const DEFAULT_SOCIAL = [
    { name: "GitHub", icon: "github", link: "https://github.com/ishkabar" },
    { name: "LinkedIn", icon: "linkedin", link: "https://www.linkedin.com/in/dominik-karczewski-1b850b209/" },
    { name: "Email", icon: "email", link: "mailto:mail@dkarczewski.com" }
];

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const t = useTranslations("common");

    // Fallback jeśli social to placeholder string lub nieprawidłowa struktura
    const rawSocial = t.raw('social');
    const social = Array.isArray(rawSocial) && rawSocial[0]?.icon
        ? rawSocial as Array<{name: string; icon: string; link: string}>
        : DEFAULT_SOCIAL;

    return (
        <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
            <Row
                className={styles.mobile}
                maxWidth="m"
                paddingY="8"
                paddingX="16"
                gap="16"
                horizontal="between"
                vertical="center"
                s={{
                    direction: "column",
                    horizontal: "center",
                    align: "center",
                }}
            >
                <Text variant="body-default-s" onBackground="neutral-strong">
                    <Text onBackground="neutral-weak">© {currentYear} /</Text>
                    <Text paddingX="4">{t('person.name')}</Text>
                    <Text onBackground="neutral-weak">
                        / Build your portfolio with{" "}
                        <SmartLink href="https://once-ui.com/products/magic-portfolio">Once UI</SmartLink>
                    </Text>
                </Text>
                <Row gap="16">
                    {social.map(item =>
                        item.link ? (
                            <IconButton
                                key={item.name}
                                href={item.link}
                                icon={item.icon}
                                tooltip={item.name}
                                size="s"
                                variant="ghost"
                            />
                        ) : null
                    )}
                </Row>
            </Row>
            <Row height="80" hide s={{ hide: false }} />
        </Row>
    );
};