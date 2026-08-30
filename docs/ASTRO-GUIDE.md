# Astro Guide for a React Developer

This explains the Astro concepts used in **this project** by mapping them to
React equivalents. It is scoped to what this site actually does — not a general
Astro tutorial.

---

## `.astro` files = function components

A `.astro` file has two sections separated by a code fence (`---`):

```astro
---
// Frontmatter (JS/TS that runs at build time — like a server-side function)
const message = 'hello';
---

<!-- Template (HTML + expressions, like JSX but with minor syntax differences) -->
<p>{message}</p>
```

**React equivalent:**

```tsx
export default function Greeting() {
  const message = 'hello';
  return <p>{message}</p>;
}
```

Key differences:

| Concept         | React                        | Astro                            |
| --------------- | ---------------------------- | -------------------------------- |
| When it runs    | In the browser (or SSR)      | Once at build time               |
| Output          | Virtual DOM → real DOM       | Static HTML string               |
| State / hooks   | `useState`, `useEffect`, … | None — no client runtime         |
| Re-renders      | On state change              | Never — it's HTML once built     |

---

## Props

In React you destructure props from the function parameter. In Astro you
destructure from `Astro.props`:

```astro
---
interface Props {
  title: string;
  count?: number;
}

const { title, count = 0 } = Astro.props;
---

<h2>{title} ({count})</h2>
```

Astro reads the `Props` interface in scope and uses it to type-check callers.

---

## Slot = `children`

React passes nested content as `children`. Astro uses `<slot />`:

```astro
<!-- Layout.astro -->
<html>
  <body>
    <slot />   <!-- equivalent to {children} -->
  </body>
</html>
```

```astro
<!-- Page.astro -->
<Layout>
  <p>This paragraph fills the slot.</p>
</Layout>
```

---

## Scoped styles

Every `<style>` block in an `.astro` file is **scoped** to that component by
default — Astro adds a unique attribute to the component's HTML and rewrites
the selectors. This is similar to CSS Modules but automatic.

```astro
<p class="intro">Hello</p>

<style>
  .intro { color: blue; }  /* only affects THIS component's .intro */
</style>
```

Global styles live in `src/styles/global.css` and are imported once in
`BaseLayout`.

---

## File-based routing (replaces React Router)

Every file in `src/pages/` becomes a URL:

| File                            | URL              | React equivalent                   |
| ------------------------------- | ---------------- | ---------------------------------- |
| `pages/index.astro`             | `/`              | `<Route path="/" element={…} />`   |
| `pages/about.astro`             | `/about`         | `<Route path="/about" …>`          |
| `pages/blog/[slug].astro`       | `/blog/:slug`    | `<Route path="/blog/:slug" …>`     |
| `pages/tags/[tag].astro`        | `/tags/:tag`     | `<Route path="/tags/:tag" …>`      |

Dynamic routes like `[slug].astro` export `getStaticPaths()`, which returns the
list of valid params at build time. Astro generates one HTML page per entry.
This is like Next.js `getStaticPaths` / `getStaticProps`, not like a runtime
router.

---

## Content collections (replaces fetching + manual typing)

Content collections define structured, typed data from local files. In this
project, `src/content.config.ts` declares two collections:

```ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // ...
  }),
});
```

**React equivalent (roughly):**
- Instead of `fetch('/api/posts')` → `await res.json()` → unknown shape,
  Astro reads local files, validates them against the Zod schema at build
  time, and returns fully typed objects.
- `getCollection('blog')` returns `CollectionEntry<'blog'>[]`.
- `render(entry)` returns `{ Content, headings }` — Content is a component
  that renders the parsed Markdown/MDX body.

The `id` of each entry comes from the filename (e.g. `understanding-dns.mdx`
→ `id: 'understanding-dns'`), and this is what `[slug].astro` uses in
`getStaticPaths`.

---

## MDX

MDX = Markdown + JSX components. A `.mdx` file is standard Markdown, but you
can also import and use Astro/React components inline:

```mdx
---
title: "My Post"
---

import Callout from '../../components/mdx/Callout.astro';

Regular markdown **works here**.

<Callout type="tip">
  This is a component rendered at build time.
</Callout>
```

In this project, Callout and Figure are also auto-injected by the article page
via `<Content components={{ Callout, Figure }} />`, so the import is optional.

Code blocks are syntax-highlighted by Shiki at build time — no client JS, no
Prism. The theme config is in `astro.config.mjs`:

```js
shikiConfig: {
  themes: { light: 'github-light', dark: 'github-dark' },
},
```

---

## Static generation (the default)

Every page in this project is **pre-rendered** at build time. The output is a
folder of `.html` files (`dist/`) with CSS. No server runs in production.

This is equivalent to running `next build && next export` in Next.js — except
Astro is designed this way from the start, and server mode is opt-in per page
or per route.

---

## Astro islands + client directives (not used yet)

An **island** is an interactive UI component (React, Svelte, Vue, etc.)
embedded in an otherwise static Astro page. Astro hydrates only that component,
not the whole page.

```astro
---
import NetworkGraph from '../components/NetworkGraph.tsx';
---

<p>Static content around the island.</p>
<NetworkGraph client:visible />
```

The `client:*` directive tells Astro **when** to hydrate:

| Directive          | When it hydrates                             |
| ------------------ | -------------------------------------------- |
| `client:load`      | Immediately on page load                     |
| `client:idle`      | After the page is idle (requestIdleCallback) |
| `client:visible`   | When the component scrolls into view         |
| `client:media="…"` | When a media query matches                   |
| `client:only="…"`  | Client-only — not rendered on the server     |

**This project uses no islands today.** Everything is static Astro components.
If you add an interactive feature later (algorithm visualizer, network
topology graph), you would:

1. Install the React integration: `npx astro add react`
2. Write a React component (`.tsx`)
3. Import it in an `.astro` page and add `client:visible` (or another directive)

The rest of the site stays static. That's the island architecture.

---

## When to use React in this project

**Use React (or another framework) only when you need client-side
interactivity** that can't be done with plain HTML/CSS:

- An interactive network topology visualizer
- An algorithm stepper with state
- An engineering calculator with dynamic inputs
- A complex form with real-time validation

**Do not use React for:**

- Blog post rendering → MDX handles this
- Cards, headers, footers → Astro components
- Theme toggle → a small inline script
- Navigation → HTML `<nav>` + CSS + a tiny script for mobile

Adding React installs a runtime that ships JavaScript to the browser. Astro
components ship zero JavaScript. Use the simpler tool unless interactivity
demands the heavier one.

---

## Quick concept map

| React concept                | This project's equivalent                      |
| ---------------------------- | ---------------------------------------------- |
| Function component           | `.astro` component                             |
| `props`                      | `Astro.props`                                  |
| `children`                   | `<slot />`                                     |
| CSS Modules                  | Scoped `<style>` (automatic)                   |
| React Router / Next.js pages | `src/pages/` file-based routing                |
| `getStaticPaths` (Next.js)   | `getStaticPaths()` in `[slug].astro`           |
| `fetch()` + types            | Content collections + Zod schemas              |
| MDX                          | Same — `.mdx` files in content collections     |
| Context / state management   | CSS custom properties (for theme tokens)       |
| Client-side hydration        | `client:visible` etc. (not used yet)           |
| `useEffect` for JS behavior  | `<script>` tag in `.astro` (runs in browser)   |
| `dangerouslySetInnerHTML`    | `set:html={…}` directive                       |
