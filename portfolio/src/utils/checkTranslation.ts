import { readFileSync, existsSync } from 'fs';
import { join } from 'path';


export function hasTranslation(type: 'posts' | 'projects', slug: string, locale: string): boolean {
    const contentPath = join(process.cwd(), 'src', 'content', type, slug, `${locale}.json`);
    return existsSync(contentPath);
}
export function hasAllTranslations(type: 'posts' | 'projects', slugs: string[], locale: string): boolean {
    return slugs.every(slug => hasTranslation(type, slug, locale));
}