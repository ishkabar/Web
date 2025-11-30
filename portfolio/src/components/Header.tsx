"use client";

import {usePathname} from "next/navigation";
import {useEffect, useState, useLayoutEffect, useRef, Suspense} from "react";
import React from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";

import {Fade, Flex, Line, Row, ToggleButton} from "@once-ui-system/core";

import {routes, display} from "@/resources";
import {ThemeToggle} from "./ThemeToggle";
import styles from "./Header.module.scss";
import {locales, defaultLocale, type Locale} from "@/i18n/routing";
import {useTranslations} from 'next-intl';

const DEFAULT_TIMEZONE = "Europe/Warsaw";

type TimeDisplayProps = {
    timeZone: string;
    locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({timeZone, locale = "en-GB"}) => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(now);
            setCurrentTime(timeString);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return <>{currentTime}</>;
};

export default TimeDisplay;

function detectLocaleFromPath(pathname: string): Locale {
    const seg = (pathname.split("/")[1] ?? "") as Locale;
    return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

function withLocale(path: string, locale: string | undefined) {
    if (!locale) return path;
    return `/${locale}${path}`;
}

function normalize(p: string) {
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
}


export const Header = () => {
    const pathnameRaw = usePathname() ?? "/";
    const pathname = normalize(pathnameRaw);
    const locale = detectLocaleFromPath(pathnameRaw);

    const t = useTranslations('common.header');
    const tPerson = useTranslations('common.person');

    const H = (p: string) => normalize(withLocale(p, locale));
    const isAt = (p: string) => pathname === H(p);
    const isUnder = (p: string) => pathname === H(p) || pathname.startsWith(H(p) + "/");

    const isHomeActive = () => {
        const homeLocalized = H("/");       // np. "/pl"
        return pathname === homeLocalized   // "/pl" lub "/pl/"
            || pathname === "/";            // root bez prefixu
    };

    const headerRef = useRef<HTMLDivElement | null>(null);
    const [dock, setDock] = useState<'top' | 'bottom'>('top');

    useLayoutEffect(() => {
        const update = () => {
            const el = headerRef.current;
            if (!el) return;
            const cs = getComputedStyle(el);
            // jeżeli bottom != 'auto' → CSS przypiął do dołu
            const isBottom = cs.bottom !== 'auto' && cs.bottom !== '0px' ? true
                : cs.bottom === '0px'; // najczęstszy wariant
            setDock(isBottom ? 'bottom' : 'top');
        };
        update();
        const ro = new ResizeObserver(update);
        if (headerRef.current) ro.observe(headerRef.current);
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, {passive: true});
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, []);

    return (
        <>
            <Fade s={{hide: true}} fillWidth position="fixed" height="80" zIndex={9}/>
            <Fade hide s={{hide: false}} fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9}/>
            <Row
                ref={headerRef as any}
                data-header-dock={dock}
                fitHeight
                className={styles.position}
                position="sticky"
                as="header"
                zIndex={9}
                fillWidth
                padding="8"
                horizontal="center"
                data-border="rounded"
                s={{position: "fixed"}}
            >
                <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
                    {display.location && <Row s={{hide: true}}>{tPerson('location')}</Row>}
                </Row>

                <Row fillWidth horizontal="center">
                    <Row
                        background="page"
                        border="neutral-alpha-weak"
                        radius="m-4"
                        shadow="l"
                        padding="4"
                        horizontal="center"
                        zIndex={1}
                    >
                        <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
                            {routes["/"] && (
                                <ToggleButton
                                    prefixIcon="home"
                                    href={withLocale("/", locale)}
                                    //label={t('')}
                                    title={t('home')}
                                    aria-label={t('home')}
                                    selected={isHomeActive()}
                                />
                            )}

                            <Line background="neutral-alpha-medium" vert maxHeight="24"/>

                            {routes["/about"] && (
                                <>
                                    <Row s={{hide: true}}>
                                        <ToggleButton
                                            prefixIcon="person"
                                            href={H("/about")}
                                            label={t('about')}
                                            title={t('about')}
                                            aria-label={t('about')}
                                            selected={isAt("/about")}
                                        />
                                    </Row>
                                    <Row hide s={{hide: false}}>
                                        <ToggleButton
                                            prefixIcon="person"
                                            href={H("/about")}
                                            label={t('about')}
                                            title={t('about')}
                                            aria-label={t('about')}
                                            selected={isAt("/about")}
                                        />
                                    </Row>
                                </>
                            )}

                            {routes["/work"] && (
                                <>
                                    <Row s={{hide: true}}>
                                        <ToggleButton
                                            prefixIcon="grid"
                                            href={H("/work")}
                                            label={t('work')}
                                            title={t('work')}
                                            aria-label={t('work')}
                                            selected={isUnder("/work")}
                                        />
                                    </Row>
                                    <Row hide s={{hide: false}}>
                                        <ToggleButton
                                            prefixIcon="grid"
                                            href={H("/work")}
                                            //label={t('work')}
                                            title={t('work')}
                                            aria-label={t('work')}
                                            selected={isUnder("/work")}
                                        />
                                    </Row>
                                </>
                            )}

                            {routes["/blog"] && (
                                <>
                                    <Row s={{hide: true}}>
                                        <ToggleButton
                                            prefixIcon="book"
                                            href={H("/blog")}
                                            label={t('blog')}
                                            title={t('blog')}
                                            aria-label={t('blog')}
                                            selected={isUnder("/blog")}
                                        />
                                    </Row>
                                    <Row hide s={{hide: false}}>
                                        <ToggleButton
                                            prefixIcon="book"
                                            //label={t('blog')}
                                            title={t('blog')}
                                            aria-label={t('blog')}
                                            href={H("/blog")}
                                            selected={isUnder("/blog")}
                                        />
                                    </Row>
                                </>
                            )}

                            {routes["/gallery"] && (
                                <>
                                    <Row s={{hide: true}}>
                                        <ToggleButton
                                            prefixIcon="gallery"
                                            href={H("/gallery")}
                                            label={t('gallery')}
                                            title={t('gallery')}
                                            aria-label={t('gallery')}
                                            selected={isUnder("/gallery")}
                                        />
                                    </Row>
                                    <Row hide s={{hide: false}}>
                                        <ToggleButton
                                            prefixIcon="gallery"
                                            href={H("/gallery")}
                                            //label={t('gallery')}
                                            title={t('gallery')}
                                            aria-label={t('gallery')}
                                            selected={isUnder("/gallery")}
                                        />
                                    </Row>
                                </>
                            )}
                            <Line background="neutral-alpha-medium" vert maxHeight="24"/>

                            {display.localeSwitcher && (
                                <Suspense fallback={
                                    <div style={{width: 40, height: 40}} aria-label="Loading language switcher"/>
                                }>
                                    <LocaleSwitcher/>
                                </Suspense>
                            )}

                            {display.themeSwitcher && (
                                <>
                                    <ThemeToggle/>
                                </>
                            )}
                        </Row>
                    </Row>
                </Row>

                <Flex fillWidth horizontal="end" vertical="center">
                    <Flex paddingRight="12" horizontal="end" vertical="center" textVariant="body-default-s" gap="20">
                        <Flex s={{hide: true}}>
                            {display.time && (
                                <TimeDisplay
                                    timeZone={tPerson('location').startsWith('common.') ? DEFAULT_TIMEZONE : tPerson('location')}
                                />
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Row>
        </>
    );
};