import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategoryMeta } from '../consts';

export type CheatSheet = CollectionEntry<'cheatsheets'>;

/** A single entry in the client-side search index. */
export interface SearchRecord {
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
}

/** A category together with its published cheat sheets. */
export interface CategoryGroup extends CategoryMeta {
  sheets: CheatSheet[];
}

/** Build the public URL for a cheat sheet entry. */
export function sheetUrl(sheet: CheatSheet): string {
  return `/${sheet.slug}`;
}

/**
 * Return every published (non-draft) cheat sheet, sorted alphabetically by
 * title. Drafts are always excluded so they never ship to production.
 */
export async function getPublishedCheatSheets(): Promise<CheatSheet[]> {
  const sheets = await getCollection('cheatsheets', ({ data }) => !data.isDraft);
  return sheets.sort((a, b) => a.data.title.localeCompare(b.data.title, 'es'));
}

/**
 * Group published cheat sheets by category, preserving the canonical order
 * defined in `CATEGORIES`. Empty categories are omitted.
 */
export async function getCheatSheetsByCategory(): Promise<CategoryGroup[]> {
  const sheets = await getPublishedCheatSheets();
  return CATEGORIES.map((category) => ({
    ...category,
    sheets: sheets.filter((sheet) => sheet.data.category === category.id),
  })).filter((group) => group.sheets.length > 0);
}

/** Build the lightweight index consumed by the search component. */
export async function getSearchIndex(): Promise<SearchRecord[]> {
  const sheets = await getPublishedCheatSheets();
  return sheets.map((sheet) => ({
    title: sheet.data.title,
    description: sheet.data.description,
    category: sheet.data.category,
    tags: sheet.data.tags,
    url: sheetUrl(sheet),
  }));
}
