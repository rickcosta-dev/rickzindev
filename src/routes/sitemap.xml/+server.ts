import type { RequestHandler } from './$types';

const SITE = 'https://rickzin.dev';

const staticRoutes = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/projetos', priority: '0.9', changefreq: 'weekly' },
	{ path: '/contato', priority: '0.7', changefreq: 'monthly' },
	{ path: '/docs', priority: '0.6', changefreq: 'monthly' }
];

export const GET: RequestHandler = () => {
	const urls = staticRoutes
		.map(
			(r) => `
  <url>
    <loc>${SITE}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
