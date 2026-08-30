/**
 * JSON-LD schema builders.
 *
 * These produce schema.org objects from data we actually have. No fields are
 * fabricated: optional properties are only included when real values exist
 * (e.g. `sameAs` is added only if social profile URLs are configured).
 */
import { SITE, SOCIALS } from './site';

type Schema = Record<string, unknown>;

/** Absolute URL from a root-relative path, using the production origin. */
function abs(path: string): string {
  return new URL(path, SITE.url).toString();
}

/**
 * Person schema for Asifur Rahman. `sameAs` links to configured social
 * profiles (only real ones), which search engines use for entity linking.
 */
export function personSchema(): Schema {
  const sameAs = SOCIALS.map((s) => s.href).filter(Boolean);
  const schema: Schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
  };
  if (sameAs.length > 0) schema.sameAs = sameAs;
  return schema;
}

/**
 * BlogPosting schema for an article. Only real frontmatter is used:
 * headline, description, publish/modified dates, author, and tags→keywords.
 * `image` is included only when the post actually has a hero image.
 */
export function blogPostingSchema(input: {
  title: string;
  description: string;
  url: string; // root-relative, e.g. /blog/understanding-dns/
  datePublished: string; // ISO
  dateModified?: string; // ISO
  tags?: string[];
  image?: string; // root-relative
}): Schema {
  const schema: Schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { '@type': 'Person', name: SITE.author, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(input.url) },
    url: abs(input.url),
  };
  if (input.tags && input.tags.length > 0) {
    schema.keywords = input.tags.join(', ');
  }
  if (input.image) {
    schema.image = abs(input.image);
  }
  return schema;
}

/**
 * BreadcrumbList schema from an ordered list of { name, url? } crumbs.
 * The final crumb (current page) may omit `url`.
 */
export function breadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const el: Schema = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
      };
      if (item.url) el.item = abs(item.url);
      return el;
    }),
  };
}
