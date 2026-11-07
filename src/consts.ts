/**
 * Static site metadata and the category taxonomy.
 *
 * Note on language policy: identifiers and technical values stay in English.
 * The category ids below must match the Zod enum in `src/content/config.ts`.
 * Visible labels reuse those names because they are standard industry terms.
 */

export const SITE = {
  title: 'Guías',
  tagline: 'Hojas de trucos para desarrolladores',
  description:
    'Colección personal de hojas de trucos para terminal, frontend, backend, DevOps y más.',
  repoUrl: 'https://github.com/pacoMaldonado/guias',
} as const;

export type CategoryId =
  | 'Terminal'
  | 'Frontend'
  | 'Backend'
  | 'DevOps'
  | 'Tools'
  | 'Architecture';

export interface CategoryMeta {
  id: CategoryId;
  /** Visible label in the UI. */
  label: string;
  /** Iconify (mdi) icon name. */
  icon: string;
}

/**
 * Ordered list of categories. The order here drives the sidebar and the
 * landing page sections.
 */
export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'Terminal', label: 'Terminal', icon: 'mdi:console' },
  { id: 'Frontend', label: 'Frontend', icon: 'mdi:language-html5' },
  { id: 'Backend', label: 'Backend', icon: 'mdi:server-outline' },
  { id: 'DevOps', label: 'DevOps', icon: 'mdi:cloud-cog-outline' },
  { id: 'Tools', label: 'Tools', icon: 'mdi:tools' },
  { id: 'Architecture', label: 'Architecture', icon: 'mdi:sitemap-outline' },
] as const;
