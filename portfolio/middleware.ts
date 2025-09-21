// portfolio/middleware.ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './src/i18n/locales.generated';

console.log('[mw] module loaded @portfolio/middleware.ts');

const intl = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed' as const, // ujednolicone z next-intl.config.ts
    localeDetection: false
});
// TODO: TO KURWA NIE DZIALA
export default function middleware(req: any) {
    console.log('[mw] hit pathname=', req.nextUrl.pathname);
    const res = intl(req);
    return Promise.resolve(res).then(r => {
        r.headers.set('x-mw', 'hit');
        return r;
    });
}

export const config = {
    matcher: ['/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|icon.*|apple-icon.*|manifest.json).*)']
};
