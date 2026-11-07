# Guías

Personal cheat sheets site. A fast, searchable, static collection of command
and code references for terminal, frontend, backend, DevOps, tools and
architecture topics.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com)
and Astro Content Collections. The site is generated as 100% static output
(`output: 'static'`) for deployment to an AWS S3 bucket served through AWS
CloudFront.

> Language policy: source code, identifiers, comments, docs and commit messages
> are in **English**; all user-facing UI text is in **Spanish**.

## Features

- Fully responsive, mobile-first layout.
- Collapsible off-canvas sidebar on mobile, sticky sidebar on desktop, with
  cheat sheets grouped by category.
- Client-side search across titles, descriptions, categories and tags (no
  backend required).
- Native dark / light mode with no flash on load and persisted preference.
- Syntax highlighting (Shiki, dual theme) and a copy-to-clipboard button on
  every code block.
- Self-hosted Inter variable font (no external font requests).

## Tech stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Astro 5 (SSG, `output: 'static'`)        |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)    |
| Content        | Astro Content Collections (Markdown/MDX) |
| Icons          | `astro-icon` + `@iconify-json/mdi`       |
| Highlighting   | Shiki (built into Astro)                 |

## Getting started

```bash
# Install dependencies
pnpm install

# Start the dev server at http://localhost:4321
pnpm run dev

# Type-check and build the static site into dist/
pnpm run build

# Preview the production build locally
pnpm run preview
```

## Project structure

```text
src/
├── components/
│   ├── CodeBlock.astro     # Reusable highlighted block with copy button (MDX)
│   ├── Header.astro        # Top bar: menu, logo, search, theme toggle
│   ├── Search.astro        # Client-side search over the content index
│   ├── Sidebar.astro       # Category navigation (off-canvas on mobile)
│   └── ThemeToggle.astro   # Dark / light mode switch
├── content/
│   ├── config.ts           # Content Collections schema (Zod)
│   └── cheatsheets/        # The .md / .mdx cheat sheets
├── layouts/
│   ├── BaseLayout.astro    # HTML shell, header, sidebar, clipboard logic
│   └── CheatSheetLayout.astro
├── lib/
│   └── content.ts          # Content queries, grouping and search index
├── pages/
│   ├── index.astro         # Landing page with category cards
│   └── [...slug].astro     # One static page per cheat sheet
├── styles/
│   └── global.css          # Tailwind entry, theme, dark mode, code styles
└── consts.ts               # Site metadata and category taxonomy
```

## Adding a cheat sheet

Create a new `.md` or `.mdx` file in `src/content/cheatsheets/`. The file name
becomes the URL slug (e.g. `git.md` → `/git`). Frontmatter must match the schema
in `src/content/config.ts`:

```yaml
---
title: 'Git esencial'
description: 'Comandos de Git más usados en el día a día.' # max 160 chars
category: 'Tools' # Terminal | Frontend | Backend | DevOps | Tools | Architecture
icon: 'mdi:git' # any Iconify mdi icon, optional
tags: ['git', 'vcs'] # optional
lastUpdated: 2026-10-28 # optional
isDraft: false # drafts are excluded from the build
---
```

Set `isDraft: true` to keep a sheet out of the published site and search index.

> Note: this project uses the legacy content collection config location
> (`src/content/config.ts` with `type: 'content'`), which is supported in
> Astro 5. When upgrading to Astro 6, migrate it to `src/content.config.ts`
> with a loader.

## Deployment (AWS S3 + CloudFront)

`pnpm run build` emits a static site to `dist/`. The DevOps team syncs that
directory to the S3 bucket and invalidates the CloudFront cache, for example:

```bash
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
```
