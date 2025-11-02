const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        // Pozwól na build bez dostępu do Google Fonts
        nextScriptWorkers: false,
    },
};

module.exports = withContentlayer(nextConfig);