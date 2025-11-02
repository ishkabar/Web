// No imports here – pure utils, locale/data are passed in.

/**
 * Replace {a.b.c} placeholders using values from `data`.
 * Leaves unknown placeholders intact.
 */


/*
server:
import { resolveWithCommon } from "@/utils/placeholders";
import about from "@/messages/pl/about.json"; // lub dynamicznie tak jak common

export default async function AboutPage() {
  const locale = "pl"; // albo z next-intl/server: const locale = await getLocale();
  const resolved = await resolveWithCommon(about, locale);

  return (
    <main>
      <h1>{resolved.title}</h1>
      <p>{resolved.description}</p>
    </main>
  );
}
*/

/*
client:

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { loadCommon, resolveObjectWithData, replacePlaceholders } from "@/utils/placeholders";

export function usePlaceholderResolver() {
  const locale = useLocale();
  const [common, setCommon] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadCommon(locale).then((c) => mounted && setCommon(c));
    return () => { mounted = false; };
  }, [locale]);

  const ready = !!common;

  const resolveString = useMemo(() => {
    return (s: string) => (common ? replacePlaceholders(s, common) : s);
  }, [common]);

  const resolveObject = useMemo(() => {
    return <T,>(o: T) => (common ? resolveObjectWithData<T>(o, common) : o);
  }, [common]);

  return { ready, resolveString, resolveObject, common };
}

*/
 

export function replacePlaceholders(
    str: string,
    data: Record<string, any>
): string {
    return str.replace(/\{([^}]+)\}/g, (_, path) => {
        const keys = String(path).split(".");
        let value: any = data;
        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) return `{${path}}`; // keep as-is
        }
        return String(value);
    });
}

/**
 * Deep-resolves placeholders in strings/arrays/objects.
 */
export function resolveObjectWithData<T = any>(
    obj: T,
    data: Record<string, any>
): T {
    const walk = (val: any): any => {
        if (typeof val === "string") return replacePlaceholders(val, data);
        if (Array.isArray(val)) return val.map(walk);
        if (val && typeof val === "object") {
            return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, walk(v)]));
        }
        return val;
    };
    return walk(obj);
}

/**
 * Dynamically load messages/<locale>/common.json (server or client).
 */
export async function loadCommon(locale: string): Promise<Record<string, any>> {
    // Next can import JSON dynamically; .default holds the actual object.
    const mod = await import(`@/messages/${locale}/common.json`);
    return (mod as any).default ?? mod;
}

/**
 * Convenience: load common for locale and resolve placeholders in `obj`.
 * Use in Server Components or server code.
 */
export async function resolveWithCommon<T = any>(
    obj: T,
    locale: string
): Promise<T> {
    const common = await loadCommon(locale);
    return resolveObjectWithData<T>(obj, common);
}
