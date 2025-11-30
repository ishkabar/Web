import {getBlogPostsLocaleAware, getWorkPostsLocaleAware} from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { enabledLocales } from "@/i18n/locales.generated";

export default async function sitemap() {
    const routes: Array<{url: string; lastModified: string}> = [];

    const activeRoutes = Object.keys(routesConfig).filter(
        (route) => routesConfig[route as keyof typeof routesConfig],
    );

    for (const locale of enabledLocales) {
        const prefix = `/${locale}`;

        for (const route of activeRoutes) {
            routes.push({
                url: `${baseURL}${prefix}${route !== "/" ? route : ""}`,
                lastModified: new Date().toISOString().split("T")[0],
            });
        }

        const blogs = getBlogPostsLocaleAware(locale);
        for (const post of blogs) {
            routes.push({
                url: `${baseURL}${prefix}/blog/${post.slug}`,
                lastModified: post.metadata.publishedAt,
            });
        }

        const works = getWorkPostsLocaleAware(locale);
        for (const post of works) {
            routes.push({
                url: `${baseURL}${prefix}/work/${post.slug}`,
                lastModified: post.metadata.publishedAt,
            });
        }
    }

    return routes;
}