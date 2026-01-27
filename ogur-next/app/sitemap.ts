import { MetadataRoute } from 'next'
import { allProjects } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
    const projects = allProjects.filter((project) => project.published)
        .map((project) => ({
            url: `https://ogur.dev/projects/${project.slug}`,
            lastModified: project.date ? new Date(project.date) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

    return [
        {
            url: 'https://ogur.dev',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://ogur.dev/projects',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://ogur.dev/contact',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://ogur.dev/legal',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...projects,
    ]
}