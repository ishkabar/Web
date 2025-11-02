import type {NextConfig} from 'next';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withMDX = mdx({extension: /\.mdx?$/});

const config: NextConfig = {
    output: 'standalone',
    pageExtensions: ['ts','tsx','md','mdx'],
    transpilePackages: ['next-mdx-remote'],
    images: {
        unoptimized: true, 
        remotePatterns: [{protocol:'https', hostname:'www.google.com', pathname:'**'}]
    },
    sassOptions: { compiler:'modern', silenceDeprecations:['legacy-js-api'] },

    outputFileTracingRoot: path.join(__dirname, '..')
};

export default withNextIntl(withMDX(config));