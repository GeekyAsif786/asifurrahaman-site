/**
 * Search index endpoint — /search.json
 *
 * Build-time equivalent of the reference site's `createSearchIndex`
 * (Pliny kbar). It emits a JSON array of "search documents" that the
 * client-side command palette (see components/Search.astro) fetches once and
 * turns into actions.
 *
 * Document shape mirrors the reference model's mapped action fields:
 *   { id, name (title), keywords (summary), section, subtitle (date), path }
 * The client maps `perform` → navigate to `/path`, exactly like kbar's
 * `mapPosts`. Both published blog posts and projects are indexed.
 */
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/blog';
import { getAllProjects } from '../utils/projects';
import { formatDate } from '../utils/format';

export interface SearchDoc {
  id: string;
  /** Displayed as the result title (kbar action.name). */
  name: string;
  /** Matched against, not shown (kbar action.keywords = post summary). */
  keywords: string;
  /** Result group heading (kbar action.section). */
  section: string;
  /** Small line shown above the title (kbar action.subtitle = date). */
  subtitle: string;
  /** Navigation target; client does router.push('/' + path). */
  path: string;
}

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([
    getPublishedPosts(),
    getAllProjects(),
  ]);

  const docs: SearchDoc[] = [];

  for (const post of posts) {
    docs.push({
      id: `blog/${post.id}`,
      name: post.data.title,
      keywords: post.data.description ?? '',
      section: 'Content',
      subtitle: formatDate(post.data.pubDate),
      path: `blog/${post.id}`,
    });
  }

  for (const project of projects) {
    docs.push({
      id: `projects/${project.id}`,
      name: project.data.title,
      keywords: project.data.description ?? '',
      section: 'Projects',
      subtitle: project.data.pubDate ? formatDate(project.data.pubDate) : '',
      path: `projects/${project.id}`,
    });
  }

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json' },
  });
};
