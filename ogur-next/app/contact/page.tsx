"use client";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { useState } from "react";
import { socials } from "@/lib/contact-data";

export default function Example() {
    const [copied, setCopied] = useState(false);

    const handleClick = async (s: typeof socials[0], e: React.MouseEvent) => {
        if (s.copyable) {
            try {
                await navigator.clipboard.writeText(s.handle);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const filteredSocials = socials.filter(s => s.label !== 'Website');

    return (
        <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
            <Navigation />
            {copied && (
                <div className="fixed top-4 right-4 bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
                    Nick skopiowany!
                </div>
            )}
            <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
                <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-48 sm:mt-32 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                    {filteredSocials.map((s) => (
                        <Card key={s.label}>
                            <Link
                                href={s.href}
                                target="_blank"
                                onClick={(e) => handleClick(s, e)}
                                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-16 lg:pb-32 md:p-16"
                            >
                                <span
                                    className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                                    aria-hidden="true"
                                />
                                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                                    {s.icon}
                                </span>
                                <div className="z-10 flex flex-col items-center">
                                    <span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display text-center">
                                        {s.handle}
                                    </span>
                                    <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                                        {s.label}
                                    </span>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}