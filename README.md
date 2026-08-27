# IntentFlow

IntentFlow is a statically generated Next.js rebuild of the public Osinoff Group website. It preserves the source site's published page hierarchy and wording inside a new editorial interface adapted from the supplied licensed template.

## What is included

- All 20 routes published in the source sitemap
- Product, service, industry, case-study, company, contact, legal, assessment, and booking pages
- A consolidated desktop and mobile navigation
- Light and dark themes using the IntentFlow burnt-orange brand system
- Original IntentFlow logo, favicon, app icons, and social-sharing artwork
- Route-specific metadata plus generated `sitemap.xml` and `robots.txt`
- Static local form confirmations; no visitor data is transmitted by this codebase

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Project structure

```text
app/                    Next.js routes, metadata, icons, and global theme
components/             Navigation, footer, page shell, theme, and visuals
content/pages.json      Sanitized page content for every published route
lib/content.ts          Route/content registry
lib/metadata.ts         SEO and social metadata
public/brand/           IntentFlow identity assets
```

The catch-all route in `app/[...slug]/page.tsx` is statically generated from `content/pages.json`; the homepage uses the same renderer through `app/page.tsx`.

## Content provenance

The page snapshot was derived from the public pages listed in the Osinoff Group sitemap on August 27, 2026. Source scripts, inline event handlers, embeds, form actions, styles, navigation, and footer markup were excluded before rendering. The template's application shell supplies the new navigation, footer, interaction behavior, and color system.

## License

The supplied UI template remains governed by its commercial license. See [LICENSE](./LICENSE).
