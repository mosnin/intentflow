import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishedPath = path.join(root, "content", "published-pages.json");
const published = JSON.parse(fs.readFileSync(publishedPath, "utf8"));

const nonLegalPages = Object.fromEntries(
  Object.entries(published).filter(
    ([route]) => route !== "/privacy" && route !== "/terms"
  )
);

const renderedSources = [
  path.join(root, "components", "hero.tsx"),
  path.join(root, "components", "nav.tsx"),
  path.join(root, "components", "footer.tsx"),
  path.join(root, "components", "trusted-by.tsx"),
  path.join(root, "components", "window-mockup.tsx"),
  path.join(root, "components", "industry-search-examples.tsx"),
  path.join(root, "lib", "industries.ts"),
];

const contentCorpus = JSON.stringify(published);
const quantitativeCorpus = JSON.stringify(nonLegalPages);
const componentCorpus = renderedSources
  .map((filename) => fs.readFileSync(filename, "utf8"))
  .join("\n");
const corpus = `${contentCorpus}\n${componentCorpus}`;

const forbidden = [
  ["placeholder testimonial", /illustrative placeholder|client attribution/i],
  ["commission claim", /\bcommissions?\b/i],
  [
    "unverified proof label",
    /verified campaigns?|verified results?|verified clicks?/i,
  ],
  [
    "unapproved analytics proof",
    /google search console|bing webmaster tools|native analytics/i,
  ],
  [
    "unapproved commercial terms",
    /performance-only|no retainer|setup fees?|platform fees?/i,
  ],
  ["unapproved evidence claim", /verified past performance/i],
  ["removed campaign total", /8,432|2,185|179 placements|79\.69/i],
];

const failures = forbidden
  .filter(([, pattern]) => pattern.test(corpus))
  .map(([label]) => label);

if (/[$€£]\s*\d/.test(quantitativeCorpus)) failures.push("currency claim");
if (/\d+(?:\.\d+)?\s*%/.test(quantitativeCorpus)) {
  failures.push("percentage claim");
}

for (const [route, page] of Object.entries(published)) {
  const h1s = page.hero.filter(
    (item) => item.type === "heading" && item.level === 1
  );
  if (h1s.length !== 1) failures.push(`${route}: expected exactly one H1`);
  if (!page.description?.trim()) failures.push(`${route}: missing description`);
}

if (failures.length) {
  console.error("Content integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Content integrity check passed for ${Object.keys(published).length} routes.`
);
