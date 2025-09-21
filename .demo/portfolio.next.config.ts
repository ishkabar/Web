import type {NextConfig} from 'next';
import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: {}
});

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    transpilePackages: ['next-mdx-remote'],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'www.google.com', pathname: '**' }
        ]
    },
    sassOptions: {
        compiler: 'modern',
        silenceDeprecations: ['legacy-js-api']
    }
};

export default withNextIntl(withMDX(config));
