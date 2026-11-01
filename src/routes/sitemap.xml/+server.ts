import type { RequestHandler } from './$types';
import { flameborns } from '../../lib/characters';
import { SITE_URL } from '../../lib/site';

export const GET: RequestHandler = () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
  </url>
${flameborns.map((friend) => `  <url>\n    <loc>${SITE_URL}/${friend.slug}</loc>\n  </url>`).join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
