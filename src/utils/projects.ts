/**
 * Projects data access.
 *
 * Wraps getCollection('projects') so pages don't repeat sorting/mapping logic.
 * `toSummary` converts a collection entry into the ProjectSummary shape the
 * ProjectCard component expects.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectSummary } from './content-types';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Convert a collection entry to the card-facing summary shape. */
export function toSummary(entry: ProjectEntry): ProjectSummary {
  const d = entry.data;
  return {
    slug: entry.id,
    title: d.title,
    description: d.description,
    technologies: d.technologies,
    status: d.status,
    featured: d.featured,
    github: d.github,
    demo: d.demo,
    image: d.image,
  };
}

/**
 * Sort order for listings: manual `order` first (ascending) when present,
 * then by startDate descending, then by title. Deterministic for builds.
 */
function compare(a: ProjectEntry, b: ProjectEntry): number {
  const ao = a.data.order ?? Number.POSITIVE_INFINITY;
  const bo = b.data.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;

  const ad = a.data.startDate?.valueOf() ?? 0;
  const bd = b.data.startDate?.valueOf() ?? 0;
  if (ad !== bd) return bd - ad;

  return a.data.title.localeCompare(b.data.title);
}

/** All projects, sorted for display. */
export async function getAllProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort(compare);
}

/** Only featured projects, sorted for display. */
export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', (p) => p.data.featured);
  return projects.sort(compare);
}
