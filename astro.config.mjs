// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// The production canonical URL. Used for sitemap, RSS, and canonical/OG tags.
// The site is statically generated (default output) and deployed to Netlify.
export default defineConfig({
  site: 'https://asifurrahaman.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Shiki powers build-time syntax highlighting with zero client JS.
    // Two themes lets us swap highlighting for light/dark via CSS variables.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
});
