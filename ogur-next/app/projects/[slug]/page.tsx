import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { redis } from "@/lib/redis";
import { Contact } from "@/app/components/contact";
import { Metadata } from 'next';

export const revalidate = 60;

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = allProjects.find((p) => p.slug === slug);

    if (!project) {
        return {};
    }

    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            url: `https://ogur.dev/projects/${project.slug}`,
            images: [
                {
                    url: `/og/${project.slug}.png`,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: [`/og/${project.slug}.png`],
        },
    };
}

export async function generateStaticParams() {
    return allProjects
        .filter((p) => p.published)
        .map((p) => ({
            slug: p.slug,
        }));
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const project = allProjects.find((project) => project.slug === slug);

    if (!project) {
        notFound();
    }

    let views = 0;
    try {
        const redisClient = redis();
        await redisClient.connect();
        const result = await redisClient.get(["pageviews", "projects", slug].join(":"));
        views = parseInt(result || "0");
    } catch (error) {
        console.log("Redis unavailable during build, defaulting to 0 views");
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <Header project={project} views={views} />
            <ReportView slug={project.slug} />

            <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                <Mdx code={project.body.code} />
                <Contact website={project.contactInfo?.website} />
            </article>
        </div>
    );
}