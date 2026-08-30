/**
 * Shared content types.
 *
 * These describe the *card-facing* shape of projects and blog posts. They are
 * defined to match the content-collection schemas that Phase 3 (projects) and
 * Phase 4 (blog) will introduce, so the ProjectCard/BlogCard components built
 * now accept the exact data they'll receive from `getCollection()` later.
 *
 * Only the fields needed to render summary cards live here. Full entries carry
 * more (longDescription, body, screenshots, etc.).
 */

export type ProjectStatus =
  | 'in-progress'
  | 'completed'
  | 'maintained'
  | 'archived'
  | 'planned';

/** Summary fields for a project, used by ProjectCard and the projects list. */
export interface ProjectSummary {
  /** URL slug → /projects/[slug] */
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  status?: ProjectStatus;
  featured?: boolean;
  github?: string;
  demo?: string;
  /** Public path to a representative image, optional. */
  image?: string;
}

/** Summary fields for a blog post, used by BlogCard and listings. */
export interface PostSummary {
  /** URL slug → /blog/[slug] */
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  /** Estimated reading time in minutes. */
  readingTime?: number;
  heroImage?: string;
  draft?: boolean;
}
