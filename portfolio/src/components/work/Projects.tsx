import { getWorkPostsLocaleAware, type ProjectPost } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { href } from "@/i18n/navigation";

interface ProjectsProps {
    range?: [number, number?];
    exclude?: string[];
    locale?: string;
}

function clampRange<T>(items: T[], range?: [number, number?]): T[] {
    if (!items?.length || !range) return items ?? [];
    const start1 = Math.max(1, range[0] ?? 1);
    const start = Math.min(items.length, start1) - 1;
    const end1 = range[1] ?? items.length;
    const end = Math.max(start + 1, Math.min(items.length, end1));
    return items.slice(start, end);
}

function safeDate(d?: string): number {
    const t = d ? Date.parse(d) : NaN;
    return Number.isFinite(t) ? t : 0;
}

export function Projects({ range, exclude, locale }: ProjectsProps) {
    let all: ProjectPost[] = getWorkPostsLocaleAware(locale);

    if (exclude?.length) {
        const ex = new Set(exclude);
        all = all.filter((p) => !ex.has(p.slug));
    }

    const sorted = [...all].sort(
        (a, b) => safeDate(b.metadata?.publishedAt) - safeDate(a.metadata?.publishedAt)
    );

    const shown = clampRange(sorted, range);
    if (!shown.length) return null;

    return (
        <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
            {shown.map((post, idx) => {
                const to = href("/work/[slug]", { slug: post.slug }, locale);

                return (
                    <ProjectCard
                        key={post.slug}
                        priority={idx < 2}
                        href={to}                           // <-- finalny URL TU
                        images={post.metadata?.images ?? []}
                        title={post.metadata?.title ?? post.slug}
                        description={post.metadata?.summary ?? ""}
                        content={post.content ?? ""}
                        avatars={
                            Array.isArray(post.metadata?.team)
                                ? post.metadata.team.map((m) => ({ src: m?.avatar ?? "" }))
                                : []
                        }
                        link={post.metadata?.link ?? ""}
                    />
                );
            })}
        </Column>
    );
}
