// @ts-nocheck
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTACTS = {
    email: 'mailto:kontakt@ogur.dev',
    discord: 'https://discord.com/users/822151223116824588',
    linkedin: 'https://www.linkedin.com/in/dominik-karczewski-1b850b209/',
    github: 'https://github.com/ishkabar',
};

export interface Project {
    _id: string;
    type: 'Project';
    slug: string;
    path: string;
    title: string;
    description: string;
    published: boolean;
    date?: string;
    url?: string;
    repository?: string;
    category: 'commercial' | 'personal' | 'archived';
    body: {
        code: string; // HTML string
    };
    _raw: {
        flattenedPath: string;
    };
    contactInfo: typeof CONTACTS & { website: string | null };
}

export interface Page {
    _id: string;
    type: 'Page';
    slug: string;
    path: string;
    title: string;
    description?: string;
    body: {
        code: string; // HTML string
    };
    _raw: {
        flattenedPath: string;
    };
}

const contentDir = path.join(process.cwd(), 'content');

function getMDXData<T>(filePath: string): T & { body: { code: string } } {
    const source = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(source);

    const html = marked(content);

    return {
        ...data,
        body: {
            code: html,
        },
    } as T & { body: { code: string } };
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function getAllProjects(): Project[] {
    const projectsDir = path.join(contentDir, 'projects');
    const files = getAllFiles(projectsDir);

    const projects = files.map((filePath) => {
        const slug = path.basename(filePath, path.extname(filePath));
        const relativePath = path.relative(contentDir, filePath);
        const flattenedPath = relativePath.replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');

        const data = getMDXData<Omit<Project, '_id' | 'type' | 'slug' | 'path' | '_raw' | 'body' | 'contactInfo'>>(filePath);

        return {
            ...data,
            _id: `projects/${slug}`,
            type: 'Project' as const,
            slug,
            path: `/${flattenedPath}`,
            category: (data.category || 'personal') as 'commercial' | 'personal' | 'archived',
            published: data.published ?? false,
            _raw: {
                flattenedPath,
            },
            contactInfo: {
                website: data.url || null,
                ...CONTACTS,
            },
        };
    });

    return projects;
}

function getAllPages(): Page[] {
    const pagesDir = path.join(contentDir, 'pages');
    const files = getAllFiles(pagesDir);

    const pages = files.map((filePath) => {
        const slug = path.basename(filePath, path.extname(filePath));
        const relativePath = path.relative(contentDir, filePath);
        const flattenedPath = relativePath.replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');

        const data = getMDXData<Omit<Page, '_id' | 'type' | 'slug' | 'path' | '_raw' | 'body'>>(filePath);

        return {
            ...data,
            _id: `pages/${slug}`,
            type: 'Page' as const,
            slug,
            path: `/${flattenedPath}`,
            _raw: {
                flattenedPath,
            },
        };
    });

    return pages;
}

// Eksportuj synchronicznie - NIE jako Promise!
export const allProjects = getAllProjects();
export const allPages = getAllPages();