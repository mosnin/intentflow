# IntentFlow

IntentFlow is a statically generated Next.js site using the supplied licensed UI template, the requested burnt-orange brand system, and a reviewed publication layer informed by the public Osinoff Group sitemap.

## What is included

- All 20 routes represented in the source sitemap
- Product, industry, case-study, company, contact, legal, assessment, and booking pages
- Consolidated desktop and mobile navigation
- Light and dark themes
- IntentFlow logo, favicon, app icons, and social-sharing artwork
- Route-specific metadata, `sitemap.xml`, and `robots.txt`
- An integrity gate that prevents unsupported metrics, commissions, pricing, placeholder testimonials, and campaign-result claims from reaching rendered pages

## Local development

```bash
npm ci
npm run content:publish
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run content:check
npm run typecheck
npm run lint
npm run build
```

## Project structure

```text
app/                                Next.js routes, metadata, icons, and global theme
components/                         Navigation, footer, page shell, theme, and visuals
content/pages.json                  Archival sanitized crawl
content/structured-pages.json       Archival structured crawl
content/published-pages.json        Reviewed content allowed to render
scripts/publish_content.py          Deterministic publication-layer generator
scripts/check-content-integrity.mjs Publication safety checks
lib/content.ts                      Sitemap route registry
lib/structured-content.ts           Published-content registry
public/brand/                       IntentFlow identity assets
```

The catch-all route in `app/[...slug]/page.tsx` and the homepage render only `content/published-pages.json`. The archival crawl remains available for provenance and future editorial review but is not a source of displayed copy.

## Content provenance

The archival snapshot was derived from public pages in the Osinoff Group sitemap on August 27, 2026. Public website copy is not, by itself, evidence that a business claim is current or approved. The publication layer therefore excludes unverified quantitative results, pricing or commission language, performance guarantees, placeholder testimonials, and simulated form outcomes.

See [CONTENT_PROVENANCE.md](./CONTENT_PROVENANCE.md) for the approval workflow and [FIDELITY_LEDGER.md](./FIDELITY_LEDGER.md) for the visual acceptance record.

## License

The supplied UI template remains governed by its commercial license. See [LICENSE](./LICENSE).
