/**
 * RSS feed — /rss.xml
 *
 * Uses @astrojs/rss (Astro's recommended approach). Includes only published
 * posts (getPublishedPosts already excludes drafts in production), newest
 * first, with title/description/pubDate and a canonical link per item.
 *
 * `context.site` comes from the `site` option in astro.config.mjs, so links
 * are absolute and point at the production domain.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/blog';
import { SITE } from '../utils/site';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${SITE.name} — Blog`,
    description: SITE.description,
    // Fallback to the configured URL if context.site is undefined.
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
