/**
 * Tag helpers.
 *
 * A single canonical slugify so that a tag rendered in a card, in a tag list,
 * and the generated /tags/[tag] route all agree on the same URL. Phase 4's tag
 * pages will import `tagToSlug` here rather than re-implementing it.
 */

/** Convert a human tag ("Computer Networks") to a URL slug ("computer-networks"). */
export function tagToSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

import type { PostEntry } from './blog';

export interface TagCount {
  /** Original tag label (first-seen casing). */
  tag: string;
  slug: string;
  count: number;
}

/**
 * Aggregate all tags across the given posts into a sorted list with counts.
 * Sorted by count descending, then alphabetically. De-duplicates by slug so
 * differently-cased variants of the same tag collapse together.
 */
export function collectTags(posts: PostEntry[]): TagCount[] {
  const map = new Map<string, TagCount>();
  for (const post of posts) {
    for (const raw of post.data.tags) {
      const slug = tagToSlug(raw);
      if (!slug) continue;
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { tag: raw, slug, count: 1 });
      }
    }
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag)
  );
}

/** Filter posts that carry a given tag slug. */
export function postsForTagSlug(
  posts: PostEntry[],
  slug: string
): PostEntry[] {
  return posts.filter((p) => p.data.tags.some((t) => tagToSlug(t) === slug));
}
