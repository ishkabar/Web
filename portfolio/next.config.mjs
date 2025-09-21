import createNextIntlPlugin from 'next-intl/plugin';

const withIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withIntl({
    experimental: { forceSwcTransforms: true },
});
