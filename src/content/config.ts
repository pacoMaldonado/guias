import { z, defineCollection } from 'astro:content';

const cheatSheetCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    category: z.enum([
      'Terminal',
      'Frontend',
      'Backend',
      'DevOps',
      'Tools',
      'Architecture',
    ]),
    icon: z.string().default('mdi:file-document-outline'),
    tags: z.array(z.string()).default([]),
    lastUpdated: z.date().optional(),
    isDraft: z.boolean().default(false),
  }),
});

export const collections = {
  cheatsheets: cheatSheetCollection,
};
