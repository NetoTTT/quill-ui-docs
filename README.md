# Quill UI documentation

Documentation site for **Quill UI**, a client-side UI framework for Fabric mods.

The mod lives in a separate repository: **https://github.com/NetoTTT/quill-ui**.

- Live site: **https://netottt.github.io/quill-ui-docs/**
- Built with React, Vite and Tailwind CSS
- Single-file production build, deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # typecheck + dist/index.html
npm run preview    # serve the production build locally
```

## Deploy

Pushes to `main` trigger `.github/workflows/pages.yml`. The site is published at
https://netottt.github.io/quill-ui-docs/.

Repository setup (one time): **Settings → Pages → Source: GitHub Actions**.

## Editing content

Articles live in `src/docs/content/*.tsx` and are composed from helpers in
`src/components/prose.tsx` (`H2`, `H3`, `P`, `CodeBlock`, `Example`, `DocTable`, `Callout`,
`DocLink`). Register a page in the exported list at the bottom of the file (slug, title,
description, component). Navigation, search, breadcrumbs, the table of contents and previous/next
links update automatically.

Site-wide values (repository URLs, version, licences) live in `src/docs/site.ts`. Java examples must
be checked against the mod source at https://github.com/NetoTTT/quill-ui before they are documented.

## Structure

```
src/
  App.tsx                 route switch + global shortcuts (Ctrl/Cmd+K, "/")
  pages/Home.tsx          homepage
  components/             layout, sidebar, TOC, search dialog, prose helpers, previews
  docs/                   site config, navigation model, article content
  lib/                    hash router, syntax highlighter, search index
```

Hash routing (`#/components/buttons`) keeps nested URLs working on GitHub Pages without server
rewrite rules, and the single-file build works under any repository sub-path.

## Licence

The site code and content are **GPL-3.0**. Quill UI itself is **LGPL-3.0-or-later**, and Java
examples quoted from the mod remain under the mod's licence. See `LICENSE` and the
[mod repository](https://github.com/NetoTTT/quill-ui).
