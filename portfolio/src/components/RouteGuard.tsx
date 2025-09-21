"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";
import { isLocale } from '@/i18n/locales.generated';
import { useLocale } from "next-intl";

interface RouteGuardProps {
    children: React.ReactNode;
}

function normalizePath(p: string): string {
    if (!p) return "/";
    // usuwamy trailing slash > 1 znak
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
}

function stripLocalePrefix(pathname: string | null): string {
    if (!pathname) return "/";
    const seg = pathname.split("/")[1] ?? "";
    if (isLocale(seg)) {
        const rest = pathname.slice(1 + seg.length) || "/";
        return normalizePath(rest.startsWith("/") ? rest : `/${rest}`);
    }
    return normalizePath(pathname);
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const locale = useLocale();
    const pathname = usePathname();
    const path = useMemo(() => stripLocalePrefix(pathname), [pathname]);

    const [isRouteEnabled, setIsRouteEnabled] = useState(false);
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const performChecks = async () => {
            if (!mounted) return;
            setLoading(true);
            setIsRouteEnabled(false);
            setIsPasswordRequired(false);
            setIsAuthenticated(false);

            const checkRouteEnabled = () => {
                // Debug: ważne, że path to już wersja bez prefiksu locale
                console.log("🔍 FINAL RouteGuard Debug:", {
                    locale,
                    pathname,
                    path,
                    routeKeys: Object.keys(routes),
                    pathInRoutes: Object.prototype.hasOwnProperty.call(routes, path),
                    routeValue: routes[path as keyof typeof routes],
                });

                if (!path) return false;

                // 1) Dokładne dopasowanie
                if (Object.prototype.hasOwnProperty.call(routes, path)) {
                    return Boolean(routes[path as keyof typeof routes]);
                }

                // 2) Prefiksy dla sekcji dynamicznych (UŻYWAJ path, nie pathname)
                const dynamicPrefixes = ["/blog", "/work"] as const;
                for (const base of dynamicPrefixes) {
                    if (path === base || path.startsWith(base + "/")) {
                        return Boolean(routes[base]);
                    }
                }

                return false;
            };

            const routeEnabled = checkRouteEnabled();
            if (!mounted) return;
            console.log("FINAL Route enabled:", routeEnabled);
            setIsRouteEnabled(routeEnabled);

            if (protectedRoutes[path as keyof typeof protectedRoutes]) {
                setIsPasswordRequired(true);
                try {
                    const response = await fetch("/api/check-auth");
                    if (mounted && response.ok) {
                        setIsAuthenticated(true);
                    }
                } catch {
                    // ignore
                }
            }

            setLoading(false);
        };

        performChecks();
        return () => {
            mounted = false;
        };
    }, [path, locale, pathname]);

    const handlePasswordSubmit = async () => {
        const response = await fetch("/api/authenticate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            setError(undefined);
        } else {
            setError("Incorrect password");
        }
    };

    if (loading) {
        return (
            <Flex fillWidth paddingY="128" horizontal="center">
                <Spinner />
            </Flex>
        );
    }

    if (!isRouteEnabled) {
        console.log("RouteGuard blocks - returning NotFound");
        return <NotFound />;
    }

    if (isPasswordRequired && !isAuthenticated) {
        return (
            <Column paddingY="128" maxWidth={24} gap="24" center>
                <Heading align="center" wrap="balance">
                    This page is password protected
                </Heading>
                <Column fillWidth gap="8" horizontal="center">
                    <PasswordInput
                        id="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={error}
                    />
                    <Button onClick={handlePasswordSubmit}>Submit</Button>
                </Column>
            </Column>
        );
    }

    console.log("RouteGuard allows - rendering children");
    return <>{children}</>;
};

export { RouteGuard };
