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
}

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
  name: 'Asifur Rahman',
  url: 'https://asifurrahaman.com',
  title: 'Asifur Rahman',
  // Concise, honest description. No invented achievements.
  description:
    'Personal engineering site of Asifur Rahman — projects, technical writing, and learning notes on software, networks, and systems.',
  ogImage: '/og-default.png',
  author: 'Asifur Rahman',
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
 * Social / external links.
 * TODO: confirm real profile URLs. GitHub is used across the site as the
 * primary code link, so keep it accurate.
 */
export const SOCIALS: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/asifurrahaman-site', // TODO: confirm exact GitHub username/URL
    handle: 'asifurrahaman-site',
  },
  // TODO: add other profiles (e.g. LinkedIn, email) when confirmed.
];

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
