import '../global.css';
import { Inter } from 'next/font/google';
import LocalFont from 'next/font/local';
import type { Metadata } from 'next';
import { Analytics } from './components/analytics';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Schema } from './components/schema';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ogur.dev'),
    icons: {
        icon: '/icon.png',
        apple: '/apple-touch-icon.png',
    },
    title: {
        default: 'ogur - Senior .NET Developer',
        
        template: '%s | Ogur',
    },
    description: 'Senior .NET Developer specjalizujący się w architekturze systemów, Docker, Discord bots i aplikacjach desktop.',
    openGraph: {
        title: 'Ogur - Senior .NET Developer',
        description: 'Senior .NET Developer specjalizujący się w architekturze systemów, Docker, Discord bots i aplikacjach desktop.',
        url: 'https://ogur.dev',
        siteName: 'Ogur Portfolio',
        images: [
            {
                url: '/og-image.png', 
                width: 1200,
                height: 630,
                alt: 'Ogur - Senior .NET Developer',
            },
        ],
        locale: 'pl_PL',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ogur - Senior .NET Developer',
        description: 'Senior .NET Developer specjalizujący się w architekturze systemów',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const calSans = LocalFont({
    src: '../public/fonts/CalSans-SemiBold.ttf',
    variable: '--font-calsans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pl" className={`${inter.variable} ${calSans.variable}`}>
        <head>
            <Analytics />
            <Schema />
        </head>
        <body
            className={`bg-black ${
                process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
            }`}
        >
        {children}
        <CookieConsentBanner />
        </body>
        </html>
    );
}