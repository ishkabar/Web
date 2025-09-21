import {createNavigation} from 'next-intl/navigation';
import {locales, defaultLocale} from './routing';


export const {usePathname, useRouter} =
    createNavigation({
        locales,
        defaultLocale
    });