# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: recruiters, hiring managers, and technical people evaluating
Asifur Rahaman for internships and projects. They arrive to assess capability
and judgment — scanning who he is, what he has built, and how he thinks — often
in a short evaluation window. A secondary audience is fellow engineers and
readers who reach individual posts through search and want a worthwhile read.

## Product Purpose

A personal engineering site for Asifur Rahaman that presents his projects,
technical writing, and learning notes in one place. Success is a visitor
leaving with a credible, concrete sense of his ability and range — enough to
reach out about an internship or project, or to keep reading.

## Positioning

An engineering student and developer (backend developer and ML enthusiast) who
builds real working systems and documents the full journey — projects and
hands-on technical notes written from actual experimentation, not restated
tutorials. The framing is honest and grounded: interests stated as interests,
not overstated expertise. This voice is confirmed and must be preserved.

## Operating Context

Static site built with Astro + MDX, generated to plain HTML/CSS and deployed to
Netlify at asifurrahaman.com. Content is authored as `.mdx` files in two
collections (projects, blog); tags are derived from post frontmatter rather than
maintained separately. Visitors browse on desktop and mobile web. No server,
database, or client framework at runtime.

## Capabilities and Constraints

- Routes: home, About, Projects (index + detail), Blog (index + detail), Tags
  (index + per-tag), Contact, 404; RSS feed at `/rss.xml`; sitemap.
- Content is validated at build time by Zod schemas in `src/content.config.ts`;
  a missing/invalid frontmatter field fails the build.
- Blog and project topics are deliberately open-ended. The subject matter is
  free to change over time (e.g. AI, ML, networking, cybersecurity today;
  psychology, human minds, or anything else tomorrow). Future work must not lock
  the site into a fixed topic taxonomy, hard-code a subject list, or narrow the
  positioning to one domain. Tags must stay content-derived.
- Static hosting only: no runtime backend, database, or server-side logic.
- The site builds with no secrets required.

## Brand Commitments

- Name/identity: Asifur Rahaman (real person). Use exactly.
- Voice: honest and grounded. No invented achievements, testimonials, metrics,
  customers, or credentials. Interests are framed as interests, not expertise.
- Real, confirmed assets in code:
  - GitHub: https://github.com/GeekyAsif786/
  - X (Twitter): https://x.com/Asif64077466
  - Instagram: https://www.instagram.com/xshredz/
  - LinkedIn: https://www.linkedin.com/in/asifur-rahaman-dev
  - Email: asif@asifurrahaman.com
- Domain: asifurrahaman.com, registered with Hostinger. Hostinger email must
  keep working — future work must not change nameservers or MX/email records.

## Evidence on Hand

- Projects (real, in `src/content/projects/`): AI Network Mapper, Road Traffic
  Manager.
- Published blog posts (in `src/content/blog/`): building an AI network mapper,
  understanding DNS, searching for files in Linux using bash. (One draft:
  draft-notes.)
- Project/architecture images under `src/content/blog/images/` (SentinelAI
  architecture, attack path, Neo4j graph, scan ingestion).
- Profile photo is currently a placeholder at `public/profile.png` (an abstract
  black-ink portrait) to be replaced with a real photograph — future work must
  not present the placeholder as a final asset or fabricate a likeness.
- No testimonials, employers, benchmarks, pricing, or press exist. Do not invent
  any.

## Product Principles

- Show, don't claim: concrete built work and honest write-ups carry the
  credibility; no inflated language.
- Respect the evaluator's time: make ability and range legible fast, since the
  primary audience is assessing for internships and projects.
- Keep writing subject-agnostic: the platform serves whatever the author is
  learning now, so structure must not assume a fixed set of topics.
- Preserve the real identity and real assets; never fabricate proof.
- Stay static and dependency-light: add runtime complexity only for a real need.

## Accessibility & Inclusion

No formal standard was set by the user. The existing code shows a working
accessibility baseline (required image alt text enforced by schema, visually
hidden labels, `aria-label`/`aria-labelledby` usage, new-tab announcements).
Future work should preserve this baseline; treat WCAG AA as the working target
unless the user specifies otherwise.
