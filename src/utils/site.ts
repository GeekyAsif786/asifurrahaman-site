/**
 * Central site metadata & navigation.
 *
 * Keeping this in one typed module means layouts, SEO, header, and footer all
 * read from a single source of truth instead of duplicating strings.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Short handle shown in the footer, optional. */
  handle?: string;
  /** Icon key for rendering a recognizable glyph (see SocialIcon.astro). */
  icon?: SocialIconName;
  /** True for mailto:/tel: links that should NOT open in a new tab. */
  sameTab?: boolean;
}

export type SocialIconName =
  | 'github'
  | 'email'
  | 'twitter'
  | 'instagram'
  | 'linkedin';

export interface SiteConfig {
  /** Person / brand name. */
  name: string;
  /** Production canonical origin (no trailing slash). */
  url: string;
  /** Short tagline used as the default meta description fallback. */
  title: string;
  description: string;
  /** Default social-share image path (relative to site root). Placeholder. */
  ogImage: string;
  /** Author info used for JSON-LD and RSS later. */
  author: string;
  locale: string;
}

export const SITE: SiteConfig = {
  name: 'Asifur Rahaman',
  url: 'https://asifurrahaman.com',
  title: 'Asifur Rahaman',
  // Concise, honest description. No invented achievements.
  description:
    'Personal engineering site of Asifur Rahaman — projects, technical writing, and learning notes on software, networks, and systems.',
  ogImage: '/og-default.png',
  author: 'Asifur Rahaman',
  locale: 'en',
};

/** Primary navigation, rendered in the header. */
export const NAV: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Tags', href: '/tags' },
  { label: 'Contact', href: '/contact' },
];

/**
 * SINGLE SOURCE OF TRUTH for social links.
 *
 * ⚠️ PLACEHOLDERS — replace the empty strings with your real profile URLs and
 * email. Any entry left blank is automatically hidden from the UI (see
 * `getSocials()` below), so partial configuration is fine.
 *
 * `email` is a bare address; it is turned into a `mailto:` link in the UI so
 * clicking it opens the visitor's mail client. Do not use a webmail URL here.
 */
export const SOCIAL_LINKS = {
  github: 'https://github.com/asifurrahaman-site', // TODO: confirm exact GitHub username/URL
  email: '', // TODO: e.g. 'you@example.com' (becomes mailto:)
  twitter: '', // TODO: e.g. 'https://x.com/yourhandle'
  instagram: '', // TODO: e.g. 'https://instagram.com/yourhandle'
  linkedin: '', // TODO: e.g. 'https://www.linkedin.com/in/yourhandle'
} as const;

/**
 * Build the ordered, display-ready list of social links from SOCIAL_LINKS,
 * skipping any that are blank. Email is converted to a mailto: link and marked
 * to open in the same tab; others open in a new tab.
 */
export function getSocials(): SocialLink[] {
  const items: SocialLink[] = [];

  if (SOCIAL_LINKS.github) {
    items.push({
      label: 'GitHub',
      href: SOCIAL_LINKS.github,
      icon: 'github',
    });
  }
  if (SOCIAL_LINKS.email) {
    items.push({
      label: `Email ${SITE.name}`,
      href: `mailto:${SOCIAL_LINKS.email}`,
      icon: 'email',
      sameTab: true,
    });
  }
  if (SOCIAL_LINKS.twitter) {
    items.push({
      label: 'Twitter/X',
      href: SOCIAL_LINKS.twitter,
      icon: 'twitter',
    });
  }
  if (SOCIAL_LINKS.instagram) {
    items.push({
      label: 'Instagram',
      href: SOCIAL_LINKS.instagram,
      icon: 'instagram',
    });
  }
  if (SOCIAL_LINKS.linkedin) {
    items.push({
      label: 'LinkedIn',
      href: SOCIAL_LINKS.linkedin,
      icon: 'linkedin',
    });
  }

  return items;
}

/**
 * Backward-compatible export used by existing pages/components (contact page,
 * structured data `sameAs`). Derived from the single source above.
 */
export const SOCIALS: SocialLink[] = getSocials();

/**
 * Areas of interest (spec §4). Phrased as interests, NOT professional
 * expertise, per the spec's constraint. Shown on the homepage.
 */
export const AREAS_OF_INTEREST: string[] = [
  'Software development',
  'Computer networks',
  'Artificial intelligence',
  'Algorithms',
  'Linux',
  'Systems',
  'Web development',
];
