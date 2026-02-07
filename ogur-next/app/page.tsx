import Link from 'next/link';
import React from 'react';
import Particles from './components/particles';
import Slogan from '@/app/components/Slogan';
import { SponsorMenu } from './components/SponsorMenu';


const navigation = [
    {name: 'Projekty', href: '/projects'},
    {name: 'Kontakt', href: '/contact'},
    {name: 'Sponsor', href: '#', isSponsor: true},
    {name: 'Regulamin', href: '/legal'},
];

export default function Home() {
    return (
        <div
            className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
            <nav className="my-16 animate-fade-in">
                <ul className="flex items-center justify-center gap-7">
                    {navigation.map((item) => (
                    item.isSponsor ? (
                        <SponsorMenu
                            key="sponsor"
                            isIntersecting={true}
                            openUp={true}
                            showLabel={true}
                            showIcon={false}
                            className="text-sm md:text-xl duration-500 text-zinc-500 hover:text-zinc-300"
                        />
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm md:text-xl duration-500 text-zinc-500 hover:text-zinc-300"
                        >
                            {item.name}
                        </Link>
                        )
                    ))}
                </ul>
            </nav>
            <div
                className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"/>
            <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={100}/>
            <h1 className="py-3.5 px-0.5 z-10 text-5xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-7xl md:text-[10rem] whitespace-nowrap bg-clip-text">
                ogur.dev
                <span className="sr-only"> - Senior .NET Developer specjalizujący się w C#, ASP.NET Core, Docker, Discord Bots i aplikacjach desktop</span>
            </h1>

            <div
                className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"/>
            <div className="my-16 text-center animate-fade-in">
                <h2 className="text-sm md:text-xl text-zinc-500">
                    <Slogan/>{' '}
                </h2>
            </div>
        </div>
    );
}
