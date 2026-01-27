import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    experimental: {
        nextScriptWorkers: false,
    },
    turbopack: {},
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});

export default withMDX(nextConfig);