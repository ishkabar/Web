import {
    DataStyleConfig,
    DisplayConfig,
    EffectsConfig,
    FontsConfig,
    MailchimpConfig,
    ProtectedRoutesConfig,
    RoutesConfig,
    SameAsConfig,
    SchemaConfig,
    SocialSharingConfig,
    StyleConfig,
} from "@/types";

import { Geist, Geist_Mono } from "next/font/google";

export const baseURL: string = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dkarczewski.com";

export const onceUIURL = "https://once-ui.com/products/magic-portfolio";

export const routes: RoutesConfig = {
    "/": true,
    "/about": true,
    "/work": true,
    "/blog": true,
    "/gallery": true,
};

export const display: DisplayConfig = {
    location: true,
    time: true,
    themeSwitcher: true,
    localeSwitcher: true
};

// Leave empty or keep only your internal protected pages
export const protectedRoutes: ProtectedRoutesConfig = {};

const heading = Geist({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const body = Geist({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const label = Geist({ variable: "--font-label", subsets: ["latin"], display: "swap" });
const code = Geist_Mono({ variable: "--font-code", subsets: ["latin"], display: "swap" });

export const fonts: FontsConfig = { heading, body, label, code };

export const style: StyleConfig = {
    theme: "system", // dark | light | system
    neutral: "gray", // sand | gray | slate | custom
    brand: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
    accent: "red", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan | custom
    solid: "contrast", // color | contrast
    solidStyle: "flat", // flat | plastic
    border: "playful", // rounded | playful | conservative
    surface: "translucent", // filled | translucent
    transition: "all", // all | micro | macro
    scaling: "100", // 90 | 95 | 100 | 105 | 110
};

export const dataStyle: DataStyleConfig = {
    variant: "gradient",
    mode: "categorical",
    height: 24,
    axis: { stroke: "var(--neutral-alpha-weak)" },
    tick: { fill: "var(--neutral-on-background-weak)", fontSize: 11, line: false },
};

export const effects: EffectsConfig = {
    mask: { cursor: false, x: 50, y: 0, radius: 100 },
    gradient: {
        display: false, opacity: 100, x: 50, y: 60, width: 100, height: 50, tilt: 0,
        colorStart: "accent-background-strong", colorEnd: "page-background",
    },
    dots: { display: true, opacity: 40, size: "2", color: "brand-background-strong" },
    grid: { display: false, opacity: 100, color: "neutral-alpha-medium", width: "0.25rem", height: "0.25rem" },
    lines: { display: false, opacity: 100, color: "neutral-alpha-weak", size: "16", thickness: 1, angle: 45 },
};

export const mailchimp: MailchimpConfig = {
    action: process.env.NEXT_PUBLIC_MAILCHIMP_ACTION ?? "",
    effects: {
        mask: { cursor: true, x: 50, y: 0, radius: 100 },
        gradient: {
            display: true, opacity: 90, x: 50, y: 0, width: 50, height: 50, tilt: 0,
            colorStart: "accent-background-strong", colorEnd: "static-transparent",
        },
        dots: { display: true, opacity: 20, size: "2", color: "brand-on-background-weak" },
        grid: { display: false, opacity: 100, color: "neutral-alpha-medium", width: "0.25rem", height: "0.25rem" },
        lines: { display: false, opacity: 100, color: "neutral-alpha-medium", size: "16", thickness: 1, angle: 90 },
    },
};

export const schema: SchemaConfig = {
    logo: "",
    type: "Organization",
    name: "Site",
    description: "",
    email: "", //TODO
};

// Generic social (or leave empty)
export const sameAs: SameAsConfig = {
    threads: "",
    linkedin: "",
    discord: "",
};

export const socialSharing: SocialSharingConfig = {
    display: true,
    platforms: {
        x: true, linkedin: true, facebook: false, pinterest: false,
        whatsapp: false, reddit: false, telegram: false, email: true, copyLink: true,
    },
};