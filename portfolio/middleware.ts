// middleware.ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '@/i18n/locales.generated';

export default createMiddleware({ locales, defaultLocale, localePrefix: 'always' });
export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };
