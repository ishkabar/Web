'use client';

import { Button } from '@once-ui-system/core';

interface StaticDownloadButtonProps {
    href: string;
    label: string;
    size?: 's' | 'm' | 'l';
    variant?: 'primary' | 'secondary' | 'tertiary';
    prefixIcon?: string;
}

export function StaticDownloadButton({
                                         href,
                                         label,
                                         size = 'm',
                                         variant = 'secondary',
                                         prefixIcon = 'download'
                                     }: StaticDownloadButtonProps) {
    return (
        <Button
            href={href}
            prefixIcon={prefixIcon}
            label={label}
            size={size}
            variant={variant}
            download
        />
    );
}