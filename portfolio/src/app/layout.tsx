// src/app/layout.tsx
import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";
import 'flag-icons/css/flag-icons.min.css';

import classNames from "classnames";
import Script from "next/script";
import {fonts, style, dataStyle} from "@/resources";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Dominik Karczewski | Senior .NET Developer",
    description: "Senior .NET Developer specializing in ERP integrations, solution architecture and DevOps.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID_PORTFOLIO;

    return (
        <html
            className={classNames(
                fonts.heading.variable,
                fonts.body.variable,
                fonts.label.variable,
                fonts.code.variable
            )}
            data-scroll-behavior="smooth"
            data-brand={style.brand}
            data-accent={style.accent}
            data-neutral={style.neutral}
            data-solid={style.solid}
            data-solid-style={style.solidStyle}
            data-border={style.border}
            data-surface={style.surface}
            data-transition={style.transition}
            data-scaling={style.scaling}
            data-viz-style={dataStyle.variant}
            data-theme="dark"
        >
        <body style={{margin: 0}}>
        {gaId && (
            <>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `}
                </Script>
            </>
        )}
        {children}
        </body>
        </html>
    );
}