// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import rehypeCheatsheet from './src/lib/rehype-cheatsheet.mjs';

// Static Site Generation only. DevOps deploys the `dist/` output to an
// AWS S3 bucket served through AWS CloudFront, so no server runtime is used.
// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://guias.maldolabs.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), icon()],
  markdown: {
    // Wraps sections into panels and turns tables into tap-to-copy lists.
    rehypePlugins: [rehypeCheatsheet],
    // Dark terminal Shiki theme so code blocks always render as dark consoles.
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    // The cast avoids a spurious Vite type-duplication mismatch between the
    // Vite bundled with Astro and the one `@tailwindcss/vite` is typed against.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
