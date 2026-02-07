'use client';

import * as React from 'react';
import { ToggleButton } from '@once-ui-system/core';
import { useTranslations } from 'next-intl';

type SponsorOption = {
    key: 'github' | 'patreon';
    label: string;
    url: string;
    icon: string;
};

const listHideDelay = 300;

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

interface SponsorSwitcherProps {
    showLabel?: boolean;
}

export default function SponsorSwitcher({ showLabel = false }: SponsorSwitcherProps) {
    const t = useTranslations('common.header.sponsor');

    const OPTIONS: SponsorOption[] = [
        {
            key: 'github',
            label: t('github'),
            url: 'https://github.com/sponsors/yourusername',
            icon: '💜'
        },
        {
            key: 'patreon',
            label: t('patreon'),
            url: 'https://patreon.com/yourusername',
            icon: '❤️'
        }
    ];

    const [openUp, setOpenUp] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const [menuVisible, setMenuVisible] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const [focusIdx, setFocusIdx] = React.useState<number>(0);
    const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

    const [listMaxH, setListMaxH] = React.useState(320);

    const hideTimerRef = React.useRef<number | null>(null);
    const scheduleHide = (delay = listHideDelay) => {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
            setMenuOpen(false);
            window.setTimeout(() => setMenuVisible(false), 160);
            setHoverIdx(null);
            setFocusIdx(0);
            triggerRef.current?.blur();
        }, delay);
    };
    const cancelHide = () => {
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const computeListMaxHeight = () => {
        if (!wrapperRef.current) return setListMaxH(320);
        const r = wrapperRef.current.getBoundingClientRect();
        const gap = 12;
        const avail = openUp ? (r.top - gap) : (window.innerHeight - r.bottom - gap);
        const h = Math.max(160, Math.min(avail, 3600));
        setListMaxH(h);
    };

    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                cancelHide();
                setMenuOpen(false);
                setTimeout(() => setMenuVisible(false), 160);
                setHoverIdx(null);
                setFocusIdx(0);
            }
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                cancelHide();
                setMenuOpen(false);
                setTimeout(() => setMenuVisible(false), 160);
                setHoverIdx(null);
                setFocusIdx(0);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    React.useEffect(() => {
        if (!menuVisible) return;
        const onMove = (e: MouseEvent) => {
            const w = wrapperRef.current;
            if (!w) return;
            if (!w.contains(e.target as Node)) scheduleHide(listHideDelay);
        };
        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
    }, [menuVisible]);

    React.useEffect(() => {
        if (!menuVisible) return;
        const onScroll = () => { scheduleHide(listHideDelay); if (menuVisible) computeListMaxHeight(); };
        const onResize = () => {
            cancelHide();
            setMenuOpen(false);
            setTimeout(() => setMenuVisible(false), 160);
            setHoverIdx(null);
            setFocusIdx(0);
            triggerRef.current?.blur();
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [menuVisible]);

    const decidePlacement = () => {
        if (!wrapperRef.current) return setOpenUp(false);
        const headerEl = wrapperRef.current.closest('[data-header-dock]') as HTMLElement | null;
        const dock = headerEl?.getAttribute('data-header-dock');
        setOpenUp(dock === 'bottom');
    };

    const openMenu = () => {
        decidePlacement();
        computeListMaxHeight();
        setFocusIdx(0);
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
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => (i + 1) % OPTIONS.length); setHoverIdx(null); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(i => (i - 1 + OPTIONS.length) % OPTIONS.length); setHoverIdx(null); }
        else if (e.key === 'Home') { e.preventDefault(); setFocusIdx(0); setHoverIdx(null); }
        else if (e.key === 'End') { e.preventDefault(); setFocusIdx(OPTIONS.length - 1); setHoverIdx(null); }
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const sel = OPTIONS[focusIdx];
            if (sel) window.open(sel.url, '_blank', 'noopener,noreferrer');
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
        shadow: isDark
            ? '0 6px 16px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.35)'
            : '0 10px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
    };

    return (
        <div
            ref={wrapperRef}
            style={{ position: 'relative' }}
            onMouseEnter={cancelHide}
            onMouseLeave={() => scheduleHide(listHideDelay)}
        >
            <ToggleButton
                ref={triggerRef as any}
                prefixIcon="heart4"
                label={showLabel ? t('title') : undefined}
                aria-haspopup="listbox"
                aria-expanded={menuVisible && menuOpen}
                aria-label={t('title')}
                title={t('title')}
                onClick={toggleOpen}
                onMouseEnter={cancelHide}
                onMouseLeave={() => menuVisible && scheduleHide(listHideDelay)}
                onFocus={cancelHide}
            />

            {menuVisible && (
                <div
                    ref={listRef}
                    role="listbox"
                    aria-label={t('title')}
                    tabIndex={-1}
                    onKeyDown={onListKeyDown}
                    onMouseEnter={cancelHide}
                    onMouseLeave={() => { setHoverIdx(null); scheduleHide(listHideDelay); }}
                    style={{
                        position: 'absolute',
                        right: 0,
                        ...(openUp ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
                        minWidth: 200,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 10,
                        padding: 6,
                        boxShadow: colors.shadow,
                        zIndex: 1000,
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? 'translateY(0)' : openUp ? 'translateY(4px)' : 'translateY(-4px)',
                        pointerEvents: menuOpen ? 'auto' : 'none',
                        transition: 'opacity .16s ease, transform .16s ease',
                        maxHeight: listMaxH,
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {OPTIONS.map((opt, i) => {
                        const isHovered = hoverIdx === i;
                        const isFocused = hoverIdx == null && focusIdx === i;
                        const bg = isHovered ? colors.hover : isFocused ? colors.focus : 'transparent';

                        return (
                            <button
                                key={opt.key}
                                role="option"
                                aria-selected={false}
                                onMouseEnter={() => setHoverIdx(i)}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    window.open(opt.url, '_blank', 'noopener,noreferrer');
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
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    <span aria-hidden="true" style={{ fontSize: 16 }}>{opt.icon}</span>
                                    <span>{opt.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}