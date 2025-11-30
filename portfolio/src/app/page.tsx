import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';
import type { Metadata } from 'next';
import en from '@/messages/pl/common.json';

export const metadata: Metadata = {
    title: en.meta.title,
    description: en.meta.description,
    openGraph: {
        title: en.meta.title,
        description: en.meta.description,
        url: "https://dkarczewski.com",
        type: "website",
    },
};

export default function Index() {
    redirect(`/${defaultLocale}`);
}