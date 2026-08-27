# IntentFlow template-fidelity ledger

Accepted visual source: the purchased `security (2).zip` template.  
Content source: the live `www.osinoffgrp.com` sitemap and page copy.

| Comparison point | Purchased template | IntentFlow implementation | Result |
| --- | --- | --- | --- |
| Desktop navigation | 64px fixed header, left lockup, compact links, two cut-corner CTAs | Same geometry and interaction model; Products contains only the three product offerings, Industries exposes all nine verticals, and Case Studies remains top-level | Match with clarified information architecture |
| Hero hierarchy | Centered serif/sans headline, muted lead, paired CTAs | Same type scale, width, spacing, alignment, and CTA treatment with exact IntentFlow copy | Match |
| Atmospheric field | Full-bleed animated ASCII video field behind hero | Same shader/canvas treatment; video color is intentionally neutralized to grey to remove the template blue | Match with requested palette adaptation |
| Product window | Framed desktop window, traffic lights, sidebar, KPI cards, chart, and activity panel | Same shell and proportions with IntentFlow visibility data; obsolete in-window logo row removed and sidebar pulled up | Match with requested content adaptation |
| Type system | Geist plus Source Serif, small mono labels, high-contrast editorial headings | Same font pairing and hierarchy on every sitemap page | Match |
| Surface language | True white/near-black, fine grey borders, dotted rules, restrained shadows, clipped corners | Same surface system; burnt orange `#B8500C` is limited to brand and signal accents | Match with requested palette adaptation |
| Inner-page composition | Bordered editorial rails, split content, ASCII cards, accordions, framed forms | All 19 non-home routes use these template-native compositions rather than the source site's DOM or styling | Match |
| Responsive behavior | Condensed mobile header and stacked content | Mobile header, nested Products menu, stacked CTAs, responsive mockup, cards, forms, and legal content verified at 390×844 | Match |
| Light/dark identity | Theme-aware neutral surfaces | Transparent burnt-orange mark and foreground wordmark verified on both white and near-black backgrounds | Match |
| Copy and sitemap | N/A | All 20 live source sitemap routes represented; every extracted heading, paragraph, label, action, list item, and table retained, with success/FAQ copy exposed in its correct interaction state | Verified |
| Industry OSA education | N/A | Every industry route now includes a template-native, interactive example showing an unbranded query, an OSA-branded autocomplete suggestion, the branded results page, and the resulting organic site visit | Verified intentional extension |

## Visual evidence

- Purchased template reference: `../qa/reference-template.png`
- Final homepage: `../qa/implementation-home.png`
- Desktop Products menu: `../qa/implementation-menu.png`
- Desktop Industries menu: `../qa/implementation-industries-menu.png`
- Insurance OSA example: `../qa/implementation-insurance-osa.png`
- Mobile Industries menu: `../qa/implementation-mobile-industries.png`
- Mobile OSA example: `../qa/implementation-mobile-osa.png`
- OSA service page: `../qa/implementation-osa.png`
- Assessment form: `../qa/implementation-assessment.png`
- Mobile homepage: `../qa/implementation-mobile.png`
- Dark mode: `../qa/implementation-dark.png`

## Verification gates

- TypeScript typecheck: passed
- ESLint: passed
- Next.js production build: passed; 26 static pages generated
- Route and metadata asset sweep: 25/25 returned HTTP 200
- Clean-browser runtime error check: zero errors
- Assessment form: input, selection, and exact success state passed
- Discovery-call form: step forward, step back availability, final handoff, and exact success state passed
- Products menu: exactly three product destinations; Case Studies remains top-level
- Industries menu: all nine vertical routes exposed on desktop and mobile
- Industry OSA example: keyword selector updates the branded autocomplete suggestion; desktop and 390×844 layouts passed
