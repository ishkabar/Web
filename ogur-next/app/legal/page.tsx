import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Navigation } from "@/app/components/nav";
import React from "react";

export const metadata = {
    title: "Regulamin",
    description: "Regulamin świadczenia usług programistycznych",
};

export default function LegalPage() {

    const page = allPages.find((p) => p._raw.flattenedPath === "pages/legal");


    if (!page) {
        notFound();
    }

    return (
        <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0 relative min-h-screen pb-16">
            <Navigation />

            <div className="fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-40 pointer-events-none" />

            <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
                <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-1 lg:gap-16">
                    <div className="w-full max-w-4xl mx-auto pt-32">
                        <article className="prose prose-zinc prose-invert prose-quoteless">
                            <Mdx code={page.body.code} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}