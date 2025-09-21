import {NextResponse, NextRequest} from 'next/server';
import {defaultLocale, locales, LOCALE_BYPASS} from './src/i18n/routing';

export const config = {
    // Middleware działa wszędzie poza wyjątkami poniżej
    matcher: [
        '/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|icon.*|apple-icon.*|manifest.json).*)',
    ],
};

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    // 1) Bypass dla precyzyjnych wyjątków (drugi bezpiecznik)
    if (LOCALE_BYPASS.some((re) => new RegExp(re).test(pathname))) {
        return NextResponse.next();
    }

    // 2) Jeśli ścieżka już ma locale - przechodzimy
    const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
    if (hasLocale) return NextResponse.next();

    // 3) Redirect z `/` i każdej nieoplecionej ścieżki -> z domyślnym locale
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
}
