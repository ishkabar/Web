import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import { locales, defaultLocale, enabledLocales } from "@/i18n/locales.generated";

//const BLOCKED_ROUTES = ['/about', '/gallery'];
const BLOCKED_ROUTES = ['/gallery'];

const intlMiddleware = createMiddleware({locales, defaultLocale, localePrefix: 'always'});

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    const isValidLocale = (locales as readonly string[]).includes(firstSegment);
    const isEnabledLocale = (enabledLocales as readonly string[]).includes(firstSegment);

    // Redirect nieaktywnych locale na /en
    if (isValidLocale && !isEnabledLocale) {
        const url = request.nextUrl.clone();
        segments[0] = 'en';
        url.pathname = '/' + segments.join('/');
        return NextResponse.redirect(url);
    }

    // Sprawdź czy ścieżka jest zablokowana
    const isBlocked = BLOCKED_ROUTES.some(route => {
        if (pathname === route || pathname.startsWith(route + '/')) {
            return true;
        }
        for (const loc of locales) {
            const locPath = `/${loc}${route}`;
            if (pathname === locPath || pathname.startsWith(locPath + '/')) {
                return true;
            }
        }
        return false;
    });

    if (isBlocked) {
        const locale = isEnabledLocale ? firstSegment : 'en';
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        url.searchParams.set('blocked', '1');
        return NextResponse.redirect(url);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)']
};