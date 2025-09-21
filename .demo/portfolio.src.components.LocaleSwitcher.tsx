
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@once-ui-system/core';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const otherLocale = locale === 'pl' ? 'en' : 'pl';
    const pathname = usePathname();
    const router = useRouter();

    const handleLocaleSwitch = () => {
        router.push(pathname, { locale: otherLocale });
    };

    return (
        <Button
            onClick={handleLocaleSwitch}
            variant="secondary"
            size="s"
            style={{
                position: "relative",
                zIndex: 100,
                pointerEvents: "auto"
            }}
        >
            {otherLocale.toUpperCase()}
        </Button>
    );
}

/*
export default function LocaleSwitcher() {
    const locale = useLocale();
    const otherLocale = locale === 'pl' ? 'en' : 'pl';
    const pathname = usePathname();
    const router = useRouter();

    const handleLocaleSwitch = () => {
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
        const newPath = `/${otherLocale}${pathWithoutLocale}`;
        router.push(newPath);
    };

    return (
        <Button
            onClick={handleLocaleSwitch}
            variant="secondary"
            size="s"
        >
            {otherLocale.toUpperCase()}
        </Button>
    );
}
*/

/*

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Row, Text } from '@once-ui-system/core';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const otherLocale = locale === 'pl' ? 'en' : 'pl';
    const pathname = usePathname();
    const router = useRouter();

    const handleLocaleSwitch = () => {
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
        const newPath = `/${otherLocale}${pathWithoutLocale}`;
        router.push(newPath);
    };

    return (
        <Button
            onClick={handleLocaleSwitch}
            variant="ghost"
            size="s"
            style={{ 
                minWidth: '3rem',
                transition: 'all 0.2s ease'
            }}
        >
            <Text 
                variant="label-default-s" 
                onBackground="neutral-medium"
            >
                {otherLocale.toUpperCase()}
            </Text>
        </Button>
    );
}
 */