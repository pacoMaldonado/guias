// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Static Site Generation only. DevOps deploys the `dist/` output to an
// AWS S3 bucket served through AWS CloudFront, so no server runtime is used.
// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://cheatsheets.example.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), icon()],
  markdown: {
    // Dual Shiki themes. The `.dark` CSS override in global.css switches
    // between them based on the active color scheme.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    // The cast avoids a spurious Vite type-duplication mismatch between the
    // Vite bundled with Astro and the one `@tailwindcss/vite` is typed against.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
