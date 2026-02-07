"use client";
import React, { useState, useRef, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const sponsors = [
    {
        name: "GitHub Sponsors",
        href: "https://github.com/sponsors/ishkabar/",
        icon: "💜",
    },
    {
        name: "Patreon",
        href: "https://www.patreon.com/cw/DominikKarczewski",
        icon: "❤️",
    },
];

export const SponsorMenu: React.FC<{
    isIntersecting: boolean;
    openUp?: boolean;
    showLabel?: boolean;
    showIcon?: boolean;
}> = ({
    isIntersecting,
    openUp = false,
    showLabel = true,
    showIcon = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={`duration-200 flex items-center gap-1 ${
                    isIntersecting
                        ? "text-zinc-400 hover:text-zinc-100"
                        : "text-zinc-600 hover:text-zinc-900"
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {showIcon && <Heart className="w-5 h-5" />}
                {showLabel && <span className="hidden md:inline">Wesprzyj</span>}
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 ${openUp ? 'bottom-full mb-2' : 'top-full mt-2'} w-56 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 ${
                        isIntersecting
                            ? "bg-zinc-900/95 border-zinc-800"
                            : "bg-white/95 border-zinc-200"
                    }`}
                    style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'translateY(0)' : openUp ? 'translateY(4px)' : 'translateY(-4px)',
                        pointerEvents: isOpen ? 'auto' : 'none',
                    }}
                >
                    <div className="p-2">
                        {sponsors.map((sponsor) => (
                            <Link
                                key={sponsor.href}
                                href={sponsor.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 ${
                                    isIntersecting
                                        ? "hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100"
                                        : "hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900"
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-lg">{sponsor.icon}</span>
                                <span className="text-sm font-medium">{sponsor.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};