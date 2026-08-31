/**
 * Content collections configuration.
 *
 * Astro 7 build-time content collections. Each collection uses the glob()
 * loader (from `astro/loaders`) to read local files, plus a Zod schema (from
 * `astro/zod`) that validates frontmatter at build time and generates the
 * TypeScript types returned by getCollection()/getEntry().
 *
 * This file starts with the `projects` collection (Phase 3). The `blog`
 * collection is added in Phase 4.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Project status values. Kept in sync with ProjectStatus in utils/content-types.ts
 * (that file is the card-facing mirror of this schema).
 */
const projectStatus = z.enum([
  'in-progress',
  'completed',
  'Published',
  'maintained',
  'archived',
  'planned',
]);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  // Fields mirror spec §5. Only `title` and `description` are required; every
  // other field is optional so incomplete/unknown info never breaks the build.
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Optional longer summary shown near the top of the detail page. */
    longDescription: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    status: projectStatus.optional(),
    featured: z.boolean().default(false),
    github: z.url().optional(),
    demo: z.url().optional(),
    /** Representative image (public path or import). Optional. */
    image: z.string().optional(),
    /** Optional published date shown below the project heading. */
    pubDate: z.coerce.date().optional(),
    /** Screenshot list: image + descriptive alt (required for accessibility). */
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    /** Optional manual ordering for the listing (lower = earlier). */
    order: z.number().optional(),
  }),
});

/**
 * Blog collection — MDX/Markdown posts (spec §7).
 *
 * `pubDate`/`updatedDate` use z.coerce.date() so YAML dates like `2026-08-30`
 * parse into JS Dates. `draft` posts are filtered out in production by the
 * blog query helpers (see utils/blog.ts). Reading time is NOT stored here — it
 * is computed from the post body at query time, keeping the default (Sätteri)
 * Markdown processor and adding no processor plugin.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Optional hero image (public path). */
    heroImage: z.string().optional(),
    /** Optional alt text for the hero image (required if heroImage is set). */
    heroImageAlt: z.string().optional(),
  }),
});

export const collections = { projects, blog };
