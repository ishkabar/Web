// src/app/layout.tsx
import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";
import 'flag-icons/css/flag-icons.min.css';



import classNames from "classnames";
import { fonts, style, dataStyle } from "@/resources";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <body style={{ margin: 0 }}>{children}</body>

        </html>
    );
}
