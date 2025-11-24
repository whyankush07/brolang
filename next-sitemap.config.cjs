/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://brolang.whyankush.wtf',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/bugs', '/bugs/*'],
    additionalPaths: async (config) => {
        const result = [];
        result.push({
            loc: '/',
            changefreq: 'daily',
            priority: 1.0,
            lastmod: new Date().toISOString(),
        });
        result.push({
            loc: '/login',
            changefreq: 'monthly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
        });
        result.push({
            loc: '/playground',
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
        });
        result.push({
            loc: '/docs',
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
        });
        return result;
    },
};