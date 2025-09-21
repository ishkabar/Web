"use client";


import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
    children: React.ReactNode;
}

const LOCALES = ['pl', 'en'] as const;

function stripLocalePrefix(pathname: string | null): string {
    if (!pathname) return '/';
    const m = pathname.match(/^\/([a-zA-Z-]+)(?=\/|$)/);
    if (m && (LOCALES as readonly string[]).includes(m[1])) {
        const stripped = pathname.slice(m[0].length) || '/';
        return stripped.startsWith('/') ? stripped : `/${stripped}`;
    }
    return pathname;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
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
                console.log('🔍 FINAL RouteGuard Debug:', {
                    pathname,
                    path,
                    availableRoutes: routes,
                    routeKeys: Object.keys(routes),
                    pathInRoutes: path in routes,
                    routeValue: routes[path as keyof typeof routes]
                });
                
                if (!pathname) return false;

                if (path in routes) {
                    return routes[path as keyof typeof routes];
                }

                const dynamicRoutes = ["/blog", "/work"] as const;
                for (const route of dynamicRoutes) {
                    if (pathname?.startsWith(route) && routes[route]) {
                        return true;
                    }
                }

                return false;
            };

            const routeEnabled = checkRouteEnabled();
            console.log('FINAL Route enabled:', routeEnabled);
            if (!mounted) return; // ← CHECK BEFORE STATE UPDATE

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
    }, [path]);

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
        console.log('RouteGuard blocks - returning NotFound');
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
    console.log('RouteGuard allows - rendering children');

    return <>{children}</>;
};

export { RouteGuard };