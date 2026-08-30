# asifurrahaman-site

Personal engineering site for **Asifur Rahman** — projects, technical writing,
and learning notes. Built with [Astro](https://astro.build) + MDX, statically
generated, and deployed to Netlify at
[asifurrahaman.com](https://asifurrahaman.com).

This README is written for someone comfortable with React who is new to Astro.
For a deeper conceptual mapping (React → Astro), see
[`docs/ASTRO-GUIDE.md`](docs/ASTRO-GUIDE.md).

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
```

| Command           | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload (drafts are visible here)     |
| `npm run build`   | Production build → static files in `dist/`               |
| `npm run preview` | Serve the built `dist/` locally to check the real output |
| `npm run check`   | Type-check `.astro`/`.ts` and validate content schemas   |

Run `npm run check && npm run build` before deploying.

---

## What Astro is doing here

Astro renders your components to **static HTML at build time** and ships
**zero JavaScript by default**. This site is entirely static: every page is a
plain `.html` file with CSS and two tiny inline scripts (theme toggle + mobile
nav). There is no server, database, or client-side framework.

Where React renders in the browser, Astro renders on the server (at build
time). An `.astro` component is like a React function component, except its
"render" happens once during the build and produces HTML. See the Astro guide
for the full mapping.

---

## Project structure

```text
.
├── astro.config.mjs          # Astro config: site URL, MDX + sitemap, Shiki themes
├── netlify.toml              # Netlify build command, publish dir, Node version
├── tsconfig.json             # extends astro/tsconfigs/strict
├── public/                   # served as-is at the site root
│   ├── favicon.svg
│   ├── robots.txt
│   ├── og-default.svg        # editable source for the social-share image
│   └── og-default.png        # generated 1200×630 Open Graph image
├── docs/
│   └── ASTRO-GUIDE.md        # Astro concepts explained for a React developer
└── src/
    ├── content.config.ts     # content collection definitions + Zod schemas
    ├── content/
    │   ├── blog/             # blog posts (.mdx) — one file per post
    │   └── projects/         # projects (.mdx) — one file per project
    ├── pages/                # file-based routes (see "Routing" below)
    │   ├── index.astro       # /
    │   ├── about.astro       # /about
    │   ├── contact.astro     # /contact
    │   ├── 404.astro         # 404 page
    │   ├── rss.xml.ts        # /rss.xml feed endpoint
    │   ├── projects/
    │   │   ├── index.astro   # /projects
    │   │   └── [slug].astro  # /projects/:slug
    │   ├── blog/
    │   │   ├── index.astro   # /blog
    │   │   └── [slug].astro  # /blog/:slug
    │   └── tags/
    │       ├── index.astro   # /tags
    │       └── [tag].astro   # /tags/:tag
    ├── layouts/
    │   ├── BaseLayout.astro      # HTML shell: head, SEO, theme, header/footer
    │   └── BlogPostLayout.astro  # article shell: TOC, prev/next, related
    ├── components/
    │   ├── Header, Footer, Container, Button, Tag, Breadcrumbs
    │   ├── ProjectCard, BlogCard, TableOfContents
    │   ├── ThemeScript, ThemeToggle, JsonLd
    │   └── mdx/                   # components usable inside posts
    │       ├── Callout.astro
    │       └── Figure.astro
    ├── styles/
    │   └── global.css        # design tokens (CSS custom properties) + base CSS
    └── utils/
        ├── site.ts           # site metadata, nav, socials, areas of interest
        ├── content-types.ts  # shared TS types for card summaries
        ├── projects.ts       # project queries (getAllProjects, getFeatured…)
        ├── blog.ts           # blog queries (published, adjacent, related, RT)
        ├── tags.ts           # tag slugify + aggregation
        ├── format.ts         # date / reading-time formatting
        └── structured-data.ts# JSON-LD builders (Person, BlogPosting, …)
```

---

## How routing works

Astro uses **file-based routing** (like Next.js pages, not React Router).
A file in `src/pages/` becomes a route:

- `src/pages/about.astro` → `/about`
- `src/pages/blog/index.astro` → `/blog`
- `src/pages/blog/[slug].astro` → `/blog/:slug` (a dynamic route)

Dynamic routes are **pre-rendered at build time**. Each `[slug].astro` exports
a `getStaticPaths()` that returns the list of pages to generate. For example,
`blog/[slug].astro` asks the blog collection for every published post and
generates one HTML page per post.

`rss.xml.ts` is an **endpoint** (not a page): it exports a `GET()` that returns
the RSS XML.

---

## How layouts work

A layout is just an Astro component that renders a `<slot />` (equivalent to
React's `children`). Pages wrap their content in a layout so shared structure
isn't duplicated.

- **`BaseLayout`** owns the `<html>`/`<head>`/`<body>`, all SEO meta
  (title, description, canonical, Open Graph, Twitter, JSON-LD), the global
  stylesheet, the no-flash theme script, the header, and the footer. Every page
  uses it.
- **`BlogPostLayout`** wraps `BaseLayout` and adds the article chrome:
  breadcrumbs, the post header (dates, tags, reading time), the table of
  contents, related posts, and prev/next navigation. The rendered post body is
  passed through its `<slot />`.

---

## How components work

Components live in `src/components/` and are imported where needed. Props are
typed with a `Props` interface and read from `Astro.props`. Styles inside a
`<style>` block are **scoped to that component** automatically (like CSS
Modules). Global styles and design tokens live in `src/styles/global.css`.

Colors, spacing, and typography are CSS custom properties (design tokens).
Components reference `var(--token)` rather than hard-coded values, and the dark
theme simply overrides the tokens under `[data-theme='dark']`.

---

## How content collections work

Content collections are Astro's typed content layer. They are defined in
`src/content.config.ts`:

- The **`projects`** collection reads `src/content/projects/*.mdx`.
- The **`blog`** collection reads `src/content/blog/*.mdx`.

Each collection has a **Zod schema** that validates frontmatter at build time
and generates TypeScript types. If a post is missing a required field or uses a
wrong type, `npm run build` fails with a clear error. Pages query collections
with `getCollection()` and render bodies with `render()`.

The query/sorting/filtering logic is centralized in `src/utils/projects.ts` and
`src/utils/blog.ts` so pages stay thin.

---

## How MDX works

Posts are `.mdx`: Markdown plus the ability to use components. Standard Markdown
(headings, lists, tables, blockquotes, links, images, fenced code) works as
usual. Code blocks are syntax-highlighted at build time by Shiki (no client JS),
with separate light/dark themes.

Two custom components are available inside posts:

```mdx
import Callout from '../../components/mdx/Callout.astro';

<Callout type="tip" title="Optional title">
Body text with **markdown** inside.
</Callout>
```

- **`Callout`** — `type="note" | "tip" | "warning"`, optional `title`.
- **`Figure`** — `<Figure src="/img.png" alt="…" caption="…" />` (alt required).

These are also injected automatically on article pages, so `<Callout>` works
without the import if you prefer.

---

## How to create a blog post

1. Create `src/content/blog/my-post-slug.mdx`. The filename (minus `.mdx`) is
   the URL slug → `/blog/my-post-slug`.
2. Add frontmatter:

   ```yaml
   ---
   title: "My Post Title"
   description: "One-sentence summary used in listings and meta tags."
   pubDate: 2026-09-01
   updatedDate: 2026-09-05   # optional
   tags:
     - networking
     - dns
   draft: false             # true = visible in dev, hidden in production
   heroImage: /blog/hero.png    # optional (place the file in public/blog/)
   heroImageAlt: "Describe the image"  # required if heroImage is set
   ---
   ```

3. Write the body in Markdown/MDX. Reading time and the table of contents are
   generated automatically; tags become links to tag pages.

Set `draft: true` while writing — the post shows during `npm run dev` but is
excluded from `npm run build`, the blog listing, tag pages, and the RSS feed.

---

## How to create a project

1. Create `src/content/projects/my-project.mdx` → `/projects/my-project`.
2. Add frontmatter (only `title` and `description` are required):

   ```yaml
   ---
   title: "My Project"
   description: "Short summary."
   longDescription: "Optional longer summary shown at the top of the page."
   technologies: ["TypeScript", "Astro"]
   status: in-progress   # in-progress | completed | maintained | archived | planned
   featured: true        # featured projects appear on the homepage
   github: "https://github.com/USER/REPO"   # optional
   demo: "https://example.com"              # optional
   screenshots:
     - src: /projects/shot.png
       alt: "Describe the screenshot"
       caption: "Optional caption"
   startDate: 2026-01-01   # optional
   endDate: 2026-03-01     # optional
   order: 1                # optional manual sort order
   ---
   ```

3. Write the long-form sections in the body as `## ` headings (Overview,
   Problem, Solution, Architecture, Implementation, Challenges, Lessons
   learned, Future improvements). **Only sections you actually write appear** —
   delete the ones you don't need.

---

## How tags work

Tags are **not** maintained in a separate list. They are generated from the
`tags` frontmatter across all published posts:

- `/tags` lists every tag with a post count.
- `/tags/:tag` lists the posts for one tag.

Slugs are produced by `tagToSlug` in `src/utils/tags.ts`, so a tag rendered on a
card links to the exact page that gets generated.

---

## Deployment (Netlify)

The site builds to static files, so any static host works; these instructions
are for Netlify.

`netlify.toml` already declares the build:

```toml
[build]
  command = "npm run build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "22"
```

### GitHub → Netlify (continuous deployment)

1. Push this repo to GitHub (see below).
2. In Netlify: **Add new site → Import an existing project → GitHub**, and pick
   the `asifurrahaman-site` repository.
3. Netlify reads `netlify.toml`, so the build command (`npm run build`) and
   publish directory (`dist`) are filled in automatically. Deploy.
4. Every push to the default branch triggers a new build and deploy.

### Push to GitHub

```bash
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/USER/asifurrahaman-site.git
git push -u origin main
```

Inspect `git status` first and confirm no secrets or unrelated files are staged.

---

## Connecting the domain (do this last, manually)

The domain `asifurrahaman.com` is registered with **Hostinger**, and Hostinger
email must keep working. **Do not change nameservers or MX/email records.**

After the Netlify deploy is confirmed working:

1. In Netlify: **Domain settings → Add a custom domain** → `asifurrahaman.com`.
2. Netlify will show the DNS records to add (typically an `A`/`ALIAS` record for
   the apex and a `CNAME` for `www`).
3. In **Hostinger's DNS panel**, add only those records. Leave `MX` and other
   email records untouched.
4. Let Netlify provision the HTTPS certificate.

The production URL is already set to `https://asifurrahaman.com` in
`astro.config.mjs`, so canonical URLs, the sitemap, RSS, and Open Graph tags are
correct once DNS points here.

---

## Environment variables

The site needs **no secrets to build**. `.env.example` documents optional future
variables. Never commit a real `.env` (it is git-ignored). Anything exposed to
the browser must be prefixed `PUBLIC_`.

---

## Tech stack

Astro · TypeScript · MDX · Astro content collections · Shiki (build-time syntax
highlighting) · `@astrojs/sitemap` · `@astrojs/rss` · `reading-time`. No React,
no CSS framework, no runtime backend — added only if a real need appears.
