import { getWorkPostsLocaleAware } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { getLocale } from "next-intl/server";
import {localeHref} from "@/utils/localeHref";

const locale = await getLocale();

export default async function sitemap() {
  const blogs = getWorkPostsLocaleAware(locale).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const works = getWorkPostsLocaleAware(locale).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...works];
}
