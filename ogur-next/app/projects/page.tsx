import Link from 'next/link';
import React from 'react';
import type {Project} from '@/lib/mdx';
import {allProjects} from '@/lib/mdx';
import {Navigation} from '../components/nav';
import {Card} from '../components/card';
import {Article} from './article';
import {Eye} from 'lucide-react';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export default async function ProjectsPage() {
    const projects: Project[] = allProjects.filter(
        (p): p is Project => !!p && typeof p.slug === 'string',
    );

    const views: Record<string, number> = {};
    try {
        const redisClient = redis();
        if (redisClient.status !== "ready") {
            await redisClient.connect();
        }
        for (const project of projects) {
            const result = await redisClient.get(`pageviews:projects:${project.slug}`);
            views[project.slug] = parseInt(result || "0");
        }
    } catch (error) {
        console.log("Redis unavailable on /projects, defaulting to 0");
        projects.forEach(p => views[p.slug] = 0);
    }

    const featured = projects.find((p) => p.slug === 'OgurHub') ?? null;
    const top2 = projects.find((p) => p.slug === 'TerrariaManager') ?? null;
    const top3 = projects.find((p) => p.slug === 'OgurFishing') ?? null;

    const hero: Project[] = [featured, top2, top3].filter((p): p is Project => p !== null);
    
    const commercial = projects
        .filter((p) => p.published && p.category === 'commercial')
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

    const personal = projects
        .filter((p) => p.published && p.category === 'personal')
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

    const archived = projects
        .filter((p) => p.published && p.category === 'archived')
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

    const renderGrid = (items: Project[]) => (
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
            <div className="grid grid-cols-1 gap-4">
                {items.filter((_, i) => i % 3 === 0).map((project) => (
                    <Card key={project.slug}>
                        <Article project={project} views={views[project.slug] ?? 0}/>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
                {items.filter((_, i) => i % 3 === 1).map((project) => (
                    <Card key={project.slug}>
                        <Article project={project} views={views[project.slug] ?? 0}/>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
                {items.filter((_, i) => i % 3 === 2).map((project) => (
                    <Card key={project.slug}>
                        <Article project={project} views={views[project.slug] ?? 0}/>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="relative pb-16">
            <Navigation/>

            <div className="fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-40 pointer-events-none" />

            <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
            <div className="max-w-2xl mx-auto lg:mx-0 mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl mb-6">Projekty</h2>
                    <p className="text-lg text-zinc-400">
                        Od prostych aplikacji na bardzo drogim frameworku przez boty do gry starszej niż połowa wyświetlających, po prawdziwe systemy enterprise.
                    </p>
                </div>
                <div className="w-full h-px bg-zinc-800"/>

                {/* WYRÓŻNIONE */}
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-100">Wyróżnione</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        Moje oczka w głowie - projekty z których jestem dumny i dalej rozwijam (albo po prostu chcę się pochwalić)
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
                    {featured && (
                        <Card>
                            <Link href={`/projects/${featured.slug}`}>
                                <article className="relative w-full h-full p-4 md:p-8">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs text-zinc-100">
                                            {featured.date ? (
                                                <time dateTime={new Date(featured.date).toISOString()}>
                                                    {Intl.DateTimeFormat('pl-PL', {
                                                        dateStyle: 'medium',
                                                    }).format(new Date(featured.date))}
                                                </time>
                                            ) : (
                                                <span>WKRÓTCE</span>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                                            <Eye className="w-4 h-4"/>{' '}
                                            {Intl.NumberFormat('pl-PL', {notation: 'compact'}).format(
                                                views[featured.slug] ?? 0,
                                            )}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                                        {featured.title}
                                    </h2>
                                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 pb-12">
                                        {featured.description}
                                    </p>
                                    <div className="absolute bottom-4 md:bottom-8">
                                        <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                            Czytaj więcej <span aria-hidden="true">&rarr;</span>
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        </Card>
                    )}

                    <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
                        {[top2, top3]
                            .filter((project): project is Project => !!project)
                            .map((project) => (
                                <Card key={project.slug}>
                                    <Link href={`/projects/${project.slug}`}>
                                        <article className="relative w-full h-full p-4 md:p-8">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-xs text-zinc-100">
                                                    {project.date ? (
                                                        <time dateTime={new Date(project.date).toISOString()}>
                                                            {Intl.DateTimeFormat('pl-PL', {
                                                                dateStyle: 'medium',
                                                            }).format(new Date(project.date))}
                                                        </time>
                                                    ) : (
                                                        <span>WKRÓTCE</span>
                                                    )}
                                                </div>
                                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                    <Eye className="w-4 h-4"/>{' '}
                                                    {Intl.NumberFormat('pl-PL', {notation: 'compact'}).format(
                                                        views[project.slug] ?? 0,
                                                    )}
                                                </span>
                                            </div>

                                            <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                                                {project.title}
                                            </h2>
                                            <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 pb-12">
                                                {project.description}
                                            </p>
                                            <div className="absolute bottom-4 md:bottom-8">
                                                <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                                    Czytaj więcej <span aria-hidden="true">&rarr;</span>
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                </Card>
                            ))}
                    </div>
                </div>

                {/* OSOBISTE */}
                    <>
                        <div className="hidden w-full h-px md:block bg-zinc-800"/>
                        <div className="max-w-2xl mx-auto lg:mx-0">
                            <h3 className="text-2xl font-bold tracking-tight text-zinc-100">Osobiste</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Rzeczy które robię bo chcę, nie bo muszę
                            </p>
                        </div>
                        {renderGrid(personal)}
                    </>

                {/* KOMERCYJNE */}
                    <>
                        <div className="hidden w-full h-px md:block bg-zinc-800"/>
                        <div className="max-w-2xl mx-auto lg:mx-0">
                            <h3 className="text-2xl font-bold tracking-tight text-zinc-100">Komercyjne</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Projekty realizowane dla klientów i firm (wspominam bo prezes pozwolił)
                            </p>
                        </div>
                        {archived.length > 0 ? (
                        renderGrid(commercial)
                    ) : (
                        <div className="max-w-2xl mx-auto lg:mx-0">
                            <p className="text-zinc-500 text-center py-8">Brak projektów komercyjnych</p>
                        </div>
                    )}
                    </>
                

                {/* ARCHIWALNE */}
                <>
                    <div className="hidden w-full h-px md:block bg-zinc-800"/>
                    <div className="max-w-2xl mx-auto lg:mx-0">
                        <h3 className="text-2xl font-bold tracking-tight text-zinc-100">Archiwum</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                            Projekty które spoczywają w pokoju (niektóre zasłużenie)
                        </p>
                    </div>
                    {archived.length > 0 ? (
                        renderGrid(archived)
                    ) : (
                        <div className="max-w-2xl mx-auto lg:mx-0">
                            <p className="text-zinc-500 text-center py-8">Brak projektów w archiwum</p>
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}