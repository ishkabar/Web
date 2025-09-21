'use client';

import * as React from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ToggleButton} from '@once-ui-system/core';
import {defaultLocale, type Locale, isLocale} from '@/i18n/routing';

type LocaleDef = { code: Locale; label: string; flag: string };
const LOCALES: LocaleDef[] = [
    {code: 'pl', label: 'Polski',      flag: 'pl'},
    {code: 'en', label: 'English',     flag: 'gb'},
    {code: 'ua', label: 'Українська',  flag: 'ua'},
];

const listHideDelay = 300;

function detectLocaleFromPath(pathname: string): Locale {
    const seg = pathname.split('/')[1] ?? '';
    return isLocale(seg) ? seg : defaultLocale;
}
function switchLocalePath(pathname: string, target: Locale) {
    const segs = pathname.split('/');
    if (isLocale(segs[1] ?? '')) segs[1] = target;
    else segs.splice(1, 0, target);
    const next = segs.join('/') || `/${target}`;
    return next.replace(/\/{2,}/g, '/');
}

function useThemeName() {
    const [theme, setTheme] = React.useState<string>(() =>
        typeof document !== 'undefined'
            ? document.documentElement.getAttribute('data-theme') || 'light'
            : 'light'
    );
    React.useEffect(() => {
        const el = document.documentElement;
        const obs = new MutationObserver(() => {
            setTheme(el.getAttribute('data-theme') || 'light');
        });
        obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
        return () => obs.disconnect();
    }, []);
    return theme;
}

export default function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname() || '/';
    const searchParams = useSearchParams();
    const current = detectLocaleFromPath(pathname);

    const [openUp, setOpenUp] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLDivElement | null>(null);

    // mount + animate
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const currentIdx = React.useMemo(() => LOCALES.findIndex(l => l.code === current), [current]);
    const [focusIdx, setFocusIdx] = React.useState<number>(currentIdx);
    const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

    const hideTimerRef = React.useRef<number | null>(null);
    const scheduleHide = (delay = listHideDelay) => {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
            setMenuOpen(false);
            window.setTimeout(() => setMenuVisible(false), 160);
            setHoverIdx(null);
            setFocusIdx(currentIdx);
            triggerRef.current?.blur();
        }, delay);
    };
    const cancelHide = () => {
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const buildTargetHref = (code: Locale) => {
        const base = switchLocalePath(pathname, code);
        const qs = searchParams?.toString();
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        return qs && qs.length > 0 ? `${base}?${qs}${hash}` : `${base}${hash}`;
    };

    // outside click -> close
    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                cancelHide();
                setMenuOpen(false);
                setTimeout(() => setMenuVisible(false), 160);
                setHoverIdx(null);
                setFocusIdx(currentIdx);
            }
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [currentIdx]);

    // ESC -> close
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                cancelHide();
                setMenuOpen(false);
                setTimeout(() => setMenuVisible(false), 160);
                setHoverIdx(null);
                setFocusIdx(currentIdx);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [currentIdx]);

    // route change -> close
    React.useEffect(() => {
        cancelHide();
        setMenuOpen(false);
        setTimeout(() => setMenuVisible(false), 160);
        setHoverIdx(null);
        setFocusIdx(currentIdx);
    }, [pathname, currentIdx]);

    // global mousemove fallback: pointer poza wrapperem -> hide (1s)
    React.useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!menuVisible) return;
            const w = wrapperRef.current;
            if (!w) return;
            if (!w.contains(e.target as Node)) scheduleHide(listHideDelay);
        };
        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
    }, [menuVisible]);

    // scroll (delay) / resize (immediate)
    React.useEffect(() => {
        if (!menuVisible) return;
        const onScroll = () => scheduleHide(listHideDelay);
        const onResize = () => {
            cancelHide();
            setMenuOpen(false);
            setTimeout(() => setMenuVisible(false), 160);
            setHoverIdx(null);
            setFocusIdx(currentIdx);
            triggerRef.current?.blur();
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [menuVisible, currentIdx]);

    // placement from header
    const decidePlacement = () => {
        if (!wrapperRef.current) return setOpenUp(false);
        const headerEl = wrapperRef.current.closest('[data-header-dock]') as HTMLElement | null;
        const dock = headerEl?.getAttribute('data-header-dock');
        setOpenUp(dock === 'bottom'); // header bottom -> open up
    };

    const openMenu = () => {
        decidePlacement();
        setFocusIdx(currentIdx);
        cancelHide();
        setMenuVisible(true);
        requestAnimationFrame(() => setMenuOpen(true));
    };
    const closeMenu = () => {
        cancelHide();
        setMenuOpen(false);
        setTimeout(() => setMenuVisible(false), 160);
        triggerRef.current?.blur();
    };

    const toggleOpen = () => (menuVisible ? closeMenu() : openMenu());

    const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        cancelHide();
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => (i + 1) % LOCALES.length); setHoverIdx(null); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(i => (i - 1 + LOCALES.length) % LOCALES.length); setHoverIdx(null); }
        else if (e.key === 'Home') { e.preventDefault(); setFocusIdx(0); setHoverIdx(null); }
        else if (e.key === 'End') { e.preventDefault(); setFocusIdx(LOCALES.length - 1); setHoverIdx(null); }
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const sel = LOCALES[focusIdx];
            if (sel && sel.code !== current) router.push(buildTargetHref(sel.code));
            closeMenu();
        }
    };

    const theme = useThemeName();
    const isDark = theme === 'dark';
    const colors = {
        bg: isDark ? 'rgba(12,12,13,0.96)' : 'rgba(255,255,255,0.96)',
        border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
        hover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        focus: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        active: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
        shadow: isDark
            ? '0 6px 16px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.35)'
            : '0 10px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
    };

    const cur = LOCALES.find(l => l.code === current)!;

    return (
        <div
            ref={wrapperRef}
            style={{position: 'relative'}}
            onMouseEnter={cancelHide}
            onMouseLeave={() => scheduleHide(listHideDelay)} // wyjazd z wrappera → hide po 1s
        >
            <ToggleButton
                ref={triggerRef as any}
                aria-haspopup="listbox"
                aria-expanded={menuVisible && menuOpen}
                aria-label="Change language"
                onClick={toggleOpen}
                onMouseEnter={cancelHide}
                onMouseLeave={() => menuVisible && scheduleHide(listHideDelay)} // wyjazd z triggera
                onFocus={cancelHide}
            >
        <span
            className={`fi fi-${cur.flag}`}
            aria-hidden="true"
            //style={{ display: 'inline-block', width: 18, height: 13, borderRadius: 2 }}
            style={{ display: 'inline-block', fontSize: 18, borderRadius: 2 }}

        />
            </ToggleButton>

            {menuVisible && (
                <div
                    ref={listRef}
                    role="listbox"
                    aria-label="Select language"
                    tabIndex={-1}
                    onKeyDown={onListKeyDown}
                    onMouseEnter={cancelHide}
                    onMouseLeave={() => { setHoverIdx(null); scheduleHide(listHideDelay); }} // ⬅ ważne
                    style={{
                        position: 'absolute',
                        right: 0,
                        ...(openUp ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
                        minWidth: 180,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 10,
                        padding: 6,
                        boxShadow: colors.shadow,
                        zIndex: 1000,
                        // ANIMACJA
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen
                            ? 'translateY(0)'
                            : openUp ? 'translateY(4px)' : 'translateY(-4px)',
                        pointerEvents: menuOpen ? 'auto' : 'none',
                        transition: 'opacity .16s ease, transform .16s ease',
                    }}
                >
                    {LOCALES.map((l, i) => {
                        const isActive = current === l.code;
                        const isHovered = hoverIdx === i;
                        const isFocused = hoverIdx == null && focusIdx === i;
                        const bg = isActive ? colors.active : isHovered ? colors.hover : isFocused ? colors.focus : 'transparent';

                        return (
                            <button
                                key={l.code}
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setHoverIdx(i)}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    if (l.code !== current) router.push(buildTargetHref(l.code));
                                    closeMenu();
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    gap: 8,
                                    padding: 8,
                                    border: 'none',
                                    background: bg,
                                    color: 'inherit',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    transition: 'background .12s ease',
                                }}
                            >
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
                  <span className={`fi fi-${l.flag}`} aria-hidden="true" style={{display: 'inline-block', width: 18, height: 13, borderRadius: 2}} />
                  <span>{l.label}</span>
                </span>
                                <span style={{opacity: isActive ? 1 : 0, transition: 'opacity .12s ease'}}>✓</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
