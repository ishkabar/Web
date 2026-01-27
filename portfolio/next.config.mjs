import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const withMDX = mdx({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const config = {
    output: 'standalone',
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    transpilePackages: ['next-mdx-remote'],
    images: {
        unoptimized: true,
        remotePatterns: [
            { 
                protocol: 'https', 
                hostname: 'www.google.com', 
                pathname: '**',
                port: ''
            }
        ]
    },
    sassOptions: { 
        compiler: 'modern', 
        silenceDeprecations: ['legacy-js-api'] 
    },
};

export default withNextIntl(withMDX(config));
