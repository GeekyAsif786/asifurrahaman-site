/**
 * Build-time Open Graph image generation.
 *
 * astro-og-canvas renders one 1200×630 PNG per entry in the `pages` map at
 * build time (no runtime, no headless browser). Each social preview (WhatsApp,
 * X, LinkedIn, …) then shows an image specific to the page/post being shared
 * rather than a single shared default.
 *
 * Routes produced (see the keys of `pages`):
 *   /og/home.png, /og/blog.png, /og/projects.png, /og/contact.png,
 *   /og/tags.png, /og/about.png
 *   /og/blog/<slug>.png   (one per published post)
 *   /og/projects/<slug>.png (one per project)
 *
 * BaseLayout points each page's og:image at its matching route. The static
 * /og-default.png stays as the ultimate fallback.
 */
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { SITE } from '../../utils/site';
import { collectTags } from '../../utils/tags';

const posts = await getCollection('blog', ({ data }) =>
  import.meta.env.PROD ? data.draft !== true : true
);
const projects = await getCollection('projects');
const tags = collectTags(posts);

// Map of OG route key → the metadata used to render that image.
const pages: Record<string, { title: string; description?: string }> = {
  home: { title: SITE.name, description: SITE.description },
  blog: {
    title: 'Blog',
    description: 'Technical writing and notes by Asifur Rahaman.',
  },
  projects: {
    title: 'Projects',
    description: 'Engineering projects by Asifur Rahaman.',
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Asifur Rahaman.',
  },
  tags: { title: 'Tags', description: 'Browse blog posts by tag.' },
  about: {
    title: 'About',
    description: 'About Asifur Rahaman — engineer and developer.',
  },
};

for (const post of posts) {
  pages[`blog/${post.id}`] = {
    title: post.data.title,
    description: post.data.description,
  };
}
for (const project of projects) {
  pages[`projects/${project.id}`] = {
    title: project.data.title,
    description: project.data.description,
  };
}
for (const t of tags) {
  pages[`tags/${t.slug}`] = {
    title: `Tagged: ${t.tag}`,
    description: `Blog posts tagged ${t.tag}.`,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description ?? '',
    bgGradient: [
      [11, 14, 19],
      [18, 22, 30],
    ],
    border: { color: [251, 146, 60], width: 12, side: 'inline-start' },
    padding: 80,
    font: {
      title: {
        color: [231, 234, 240],
        size: 72,
        lineHeight: 1.1,
        weight: 'Normal',
        families: ['Instrument Serif', 'Georgia', 'serif'],
      },
      description: {
        color: [152, 162, 179],
        size: 30,
        lineHeight: 1.4,
        families: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
    // Load the site's display serif from the bundled font file so images
    // render deterministically at build time (no network fetch).
    fonts: ['./public/fonts/instrumentserif-regular.ttf'],
  }),
});
