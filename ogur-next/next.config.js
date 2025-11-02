const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        nextScriptWorkers: false,
    },
};

module.exports = withContentlayer(nextConfig);