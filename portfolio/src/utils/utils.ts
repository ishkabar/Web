import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";


export type Team = { name: string; role: string; avatar: string; linkedIn: string; };
export type Metadata = {
    title: string; publishedAt: string; summary: string;
    image?: string; images: string[]; tag?: string | string[];
    team: Team[]; link?: string;
};
export type ProjectPost = { metadata: Metadata; slug: string; content: string; };

function getMDXFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => path.extname(f) === ".mdx");
}

function readMDXFile(filePath: string): Omit<ProjectPost, "slug"> {
    if (!fs.existsSync(filePath)) notFound();
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const metadata: Metadata = {
        title: data.title || "",
        publishedAt: data.publishedAt || "",
        summary: data.summary || "",
        image: data.image || "",
        images: Array.isArray(data.images) ? data.images : [],
        tag: data.tag || undefined,
        team: Array.isArray(data.team) ? data.team : [],
        link: data.link || "",
    };
    return { metadata, content };
}

function collectPosts(dir: string): ProjectPost[] {
    const files = getMDXFiles(dir);
    return files.map((file) => {
        const slug = path.basename(file, ".mdx");
        const { metadata, content } = readMDXFile(path.join(dir, file));
        return { metadata, slug, content };
    });
}


/*
export function getWorkPostsLocaleAware(locale?: string): ProjectPost[] {
    const base = path.join(process.cwd(), "src", "content");
    const globalDir = path.join(base, "posts", "projects");
    const localeDir = locale ? path.join(base, locale, "work", "projects") : "";

    const globalPosts = collectPosts(globalDir);
    if (!localeDir || !fs.existsSync(localeDir)) return globalPosts;

    const localPosts = collectPosts(localeDir);

    const map = new Map<string, ProjectPost>();
    for (const p of globalPosts) map.set(p.slug, p);
    for (const p of localPosts) map.set(p.slug, p); // override by locale
    return Array.from(map.values());
}
*/
/**
 * /[locale]/work → loads from src/content/projects (+ optional locale override)
 */
export function getWorkPostsLocaleAware(locale?: string): ProjectPost[] {
    const base = path.join(process.cwd(), "src", "content");
    const globalDir = path.join(base, "projects");
    const localeDir = locale ? path.join(base, locale, "projects") : "";

    const globalPosts = collectPosts(globalDir);
    if (!localeDir || !fs.existsSync(localeDir)) return globalPosts;

    const localPosts = collectPosts(localeDir);

    const map = new Map<string, ProjectPost>();
    for (const p of globalPosts) map.set(p.slug, p);
    for (const p of localPosts) map.set(p.slug, p); // override by locale
    return Array.from(map.values());
}

/**
 * /[locale]/blog → loads from src/content/posts (+ optional locale override)
 */
export function getBlogPostsLocaleAware(locale?: string): ProjectPost[] {
    const base = path.join(process.cwd(), "src", "content");
    const globalDir = path.join(base, "posts");
    const localeDir = locale ? path.join(base, locale, "posts") : "";

    const globalPosts = collectPosts(globalDir);
    if (!localeDir || !fs.existsSync(localeDir)) return globalPosts;

    const localPosts = collectPosts(localeDir);

    const map = new Map<string, ProjectPost>();
    for (const p of globalPosts) map.set(p.slug, p);
    for (const p of localPosts) map.set(p.slug, p); // override by locale
    return Array.from(map.values());
}