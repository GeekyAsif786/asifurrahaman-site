/**
 * Blog data access.
 *
 * Central place for querying the `blog` collection so pages don't repeat the
 * draft-filtering, sorting, reading-time, and relationship logic.
 *
 * Draft handling (spec §9): drafts are hidden in production builds but visible
 * during local development, so you can preview unpublished posts.
 *
 * Reading time: computed from the raw post body with the `reading-time`
 * package. Doing it here (rather than via a Markdown-processor plugin) keeps
 * the default Sätteri processor and adds no build-pipeline complexity.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';
import type { PostSummary } from './content-types';

export type PostEntry = CollectionEntry<'blog'>;

/** Reading time in whole minutes for a post, from its raw body. */
export function readingMinutes(entry: PostEntry): number {
  const text = entry.body ?? '';
  return Math.max(1, Math.round(getReadingTime(text).minutes));
}

/** Newest-first comparison by pubDate, tie-broken by title for determinism. */
function byNewest(a: PostEntry, b: PostEntry): number {
  const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  return diff !== 0 ? diff : a.data.title.localeCompare(b.data.title);
}

/**
 * All publishable posts, newest first.
 * In production, drafts are excluded; in dev they're kept for previewing.
 */
export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts.sort(byNewest);
}

/** Convert a post entry to the card-facing summary shape (with reading time). */
export function toSummary(entry: PostEntry): PostSummary {
  const d = entry.data;
  return {
    slug: entry.id,
    title: d.title,
    description: d.description,
    pubDate: d.pubDate,
    updatedDate: d.updatedDate,
    tags: d.tags,
    readingTime: readingMinutes(entry),
    heroImage: d.heroImage,
    draft: d.draft,
  };
}

/**
 * Previous/next posts relative to a given slug, based on the published,
 * newest-first ordering. `prev` is the newer post, `next` is the older one.
 * Returns null at the ends of the list.
 */
export async function getAdjacentPosts(slug: string): Promise<{
  prev: PostEntry | null;
  next: PostEntry | null;
}> {
  const posts = await getPublishedPosts();
  const i = posts.findIndex((p) => p.id === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? posts[i - 1]! : null,
    next: i < posts.length - 1 ? posts[i + 1]! : null,
  };
}

/**
 * Related posts: other published posts sharing the most tags with the given
 * post, newest first as a tie-breaker. Returns up to `limit`.
 */
export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<PostEntry[]> {
  const posts = await getPublishedPosts();
  const current = posts.find((p) => p.id === slug);
  if (!current) return [];

  const currentTags = new Set(current.data.tags);
  if (currentTags.size === 0) return [];

  return posts
    .filter((p) => p.id !== slug)
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter((x) => x.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf()
    )
    .slice(0, limit)
    .map((x) => x.post);
}
