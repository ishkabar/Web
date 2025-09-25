"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";
import { isLocale } from '@/i18n/locales.generated';
import { useLocale } from "next-intl";
import {useTranslations} from 'next-intl';

interface RouteGuardProps {
    children: React.ReactNode;
}

function normalizePath(p: string): string {
    if (!p) return "/";
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

    const t = useTranslations('common.routeGuard');

    useEffect(() => {
        let mounted = true;

        const performChecks = async () => {
            if (!mounted) return;
            setLoading(true);
            setIsRouteEnabled(false);
            setIsPasswordRequired(false);
            setIsAuthenticated(false);

            const checkRouteEnabled = () => {

                if (!path) return false;
                
                if (Object.prototype.hasOwnProperty.call(routes, path)) {
                    return Boolean(routes[path as keyof typeof routes]);
                }
                
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
            setError(t('incorrectPassword'));
        }
    };

    if (loading) {
        return (
            <Flex fillWidth paddingY="128" horizontal="center">
                <Spinner />
            </Flex>
        );
    }

    if (!isRouteEnabled) { return <NotFound />; }

    if (isPasswordRequired && !isAuthenticated) {
        return (
            <Column paddingY="128" maxWidth={24} gap="24" center>
                <Heading align="center" wrap="balance">
                    {t('protectedTitle')}
                </Heading>
                <Column fillWidth gap="8" horizontal="center">
                    <PasswordInput
                        id="password"
                        label={t('passwordLabel')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={error}
                    />
                    <Button onClick={handlePasswordSubmit}>{t('submit')}</Button>
                </Column>
            </Column>
        );
    }
    
    return <>{children}</>;
};

export { RouteGuard };
