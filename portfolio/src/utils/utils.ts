import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export type Team = { name: string; role: string; avatar: string; linkedIn: string; };
export type Metadata = {
    title: string; publishedAt: string; summary: string;
    image?: string; images: string[]; tag?: string | string[];
    team: Team[]; link?: string; order?: number;
};
export type ProjectPost = { metadata: Metadata; slug: string; content: string; };

const DEFAULT_LOCALE = "en";

type LocaleData = {
    title?: string;
    summary?: string;
    content?: string;
};

function loadLocaleJson(dir: string, locale: string): LocaleData | null {
    const localePath = path.join(dir, `${locale}.json`);
    if (fs.existsSync(localePath)) {
        try {
            return JSON.parse(fs.readFileSync(localePath, "utf-8"));
        } catch {
            return null;
        }
    }
    return null;
}

function readProjectFolder(dir: string, locale: string): Omit<ProjectPost, "slug"> | null {
    const mdxPath = path.join(dir, "content.mdx");
    if (!fs.existsSync(mdxPath)) return null;

    const raw = fs.readFileSync(mdxPath, "utf-8");
    const { data } = matter(raw);

    // Załaduj tłumaczenia: locale -> defaultLocale -> pusty
    const localeData = loadLocaleJson(dir, locale)
        || loadLocaleJson(dir, DEFAULT_LOCALE)
        || {};

    const metadata: Metadata = {
        title: localeData.title || data.title || "",
        publishedAt: data.publishedAt || "",
        summary: localeData.summary || data.summary || "",
        image: data.image || "",
        images: Array.isArray(data.images) ? data.images : [],
        tag: data.tag || undefined,
        team: Array.isArray(data.team) ? data.team : [],
        link: data.link || "",
        order: data.order || undefined,
    };

    const content = localeData.content || "";

    return { metadata, content };
}

function collectProjectsFromFolders(baseDir: string, locale: string): ProjectPost[] {
    if (!fs.existsSync(baseDir)) return [];

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    const projects: ProjectPost[] = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const projectDir = path.join(baseDir, entry.name);
            const result = readProjectFolder(projectDir, locale);
            if (result) {
                projects.push({
                    ...result,
                    slug: entry.name,
                });
            }
        }
    }

    return projects;
}

// Legacy: obsługa starych plików .mdx (dla backwards compatibility)
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

function collectLegacyPosts(dir: string): ProjectPost[] {
    const files = getMDXFiles(dir);
    return files.map((file) => {
        const slug = path.basename(file, ".mdx");
        const { metadata, content } = readMDXFile(path.join(dir, file));
        return { metadata, slug, content };
    });
}

/**
 * /[locale]/work → loads from src/content/projects
 */
export function getWorkPostsLocaleAware(locale: string = DEFAULT_LOCALE): ProjectPost[] {
    const base = path.join(process.cwd(), "src", "content", "projects");

    // Nowa struktura: foldery z content.mdx + {locale}.json
    const folderProjects = collectProjectsFromFolders(base, locale);

    // Legacy: stare pliki .mdx w roocie
    const legacyProjects = collectLegacyPosts(base);

    // Merge - foldery mają priorytet
    const slugs = new Set(folderProjects.map(p => p.slug));
    const combined = [
        ...folderProjects,
        ...legacyProjects.filter(p => !slugs.has(p.slug))
    ];

    return combined.sort((a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    );
}

/**
 * /[locale]/blog → loads from src/content/posts
 */
export function getBlogPostsLocaleAware(locale: string = DEFAULT_LOCALE): ProjectPost[] {
    const base = path.join(process.cwd(), "src", "content", "posts");

    const folderPosts = collectProjectsFromFolders(base, locale);
    const legacyPosts = collectLegacyPosts(base);

    const slugs = new Set(folderPosts.map(p => p.slug));
    const combined = [
        ...folderPosts,
        ...legacyPosts.filter(p => !slugs.has(p.slug))
    ];

    return combined.sort((a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    );
}

/**
 * Get single project by slug
 */
export function getProjectBySlug(slug: string, locale: string = DEFAULT_LOCALE): ProjectPost | null {
    const base = path.join(process.cwd(), "src", "content", "projects", slug);

    if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
        const result = readProjectFolder(base, locale);
        if (result) return { ...result, slug };
    }

    // Fallback to legacy
    const mdxPath = path.join(process.cwd(), "src", "content", "projects", `${slug}.mdx`);
    if (fs.existsSync(mdxPath)) {
        const { metadata, content } = readMDXFile(mdxPath);
        return { metadata, slug, content };
    }

    return null;
}

/**
 * Get single post by slug
 */
export function getPostBySlug(slug: string, locale: string = DEFAULT_LOCALE): ProjectPost | null {
    const base = path.join(process.cwd(), "src", "content", "posts", slug);

    if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
        const result = readProjectFolder(base, locale);
        if (result) return { ...result, slug };
    }

    const mdxPath = path.join(process.cwd(), "src", "content", "posts", `${slug}.mdx`);
    if (fs.existsSync(mdxPath)) {
        const { metadata, content } = readMDXFile(mdxPath);
        return { metadata, slug, content };
    }

    return null;
}