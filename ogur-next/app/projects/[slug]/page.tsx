import { notFound } from "next/navigation";
import { allProjects } from "@/lib/mdx";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { redis } from "@/lib/redis";
import { Contact } from "@/app/components/contact";
import { Metadata } from 'next';
import { ArticleSchema } from '@/app/components/article-schema'; 

export const dynamic = 'force-dynamic';
export const revalidate = 30;

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params; // to zostaje async bo params jest Promise
    const project = allProjects.find((p) => p.slug === slug);

    if (!project) {
        return {};
    }

    const ogImage = `/og/${project.slug}.png`;
    const fallbackImage = '/og-image.png';
    
    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            url: `https://ogur.dev/projects/${project.slug}`,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
                {
                    url: fallbackImage,
                    width: 1200,
                    height: 630,
                    alt: 'Ogur - Senior .NET Developer',
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: [ogImage, fallbackImage], 
        },
    };
}

export function generateStaticParams() {
    return allProjects
        .filter((p) => p.published)
        .map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const project = allProjects.find((project) => project.slug === slug); // BEZ await

    if (!project) {
        notFound();
    }

    let views = 0;
    try {
        const redisClient = redis();
        if (redisClient.status !== "ready") {
            await redisClient.connect(); // z await bo Redis
        }
        const result = await redisClient.get(["pageviews", "projects", slug].join(":")); // z await
        views = parseInt(result || "0");
    } catch (error) {
        console.log("Redis unavailable, defaulting to 0 views");
        views = 0;
    }
    
    const ogImage = `/og/${project.slug}.png`;
    
    return (
        <div className="bg-gradient-to-br from-zinc-50 via-zinc-100/70 to-zinc-50 min-h-screen">
            <ArticleSchema
                title={project.title}
                description={project.description}
                image={ogImage}
                datePublished={project.date || new Date().toISOString()}
                url={`/projects/${project.slug}`}
            />
            <Header project={project} views={views} />
            <ReportView slug={project.slug} />
            <article className="px-4 py-12 mx-auto max-w-4xl prose prose-zinc prose-quoteless">
                <Mdx source={project.body.code} />
                <Contact website={project.contactInfo?.website} />
            </article>
        </div>
    );
}