import { AsciiIcon } from "@/components/ascii-icon";
import { CornerPlus } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { Footer } from "@/components/footer";
import { HeroWaves } from "@/components/hero-waves";
import { IndustrySearchExamples } from "@/components/industry-search-examples";
import { InteractiveForm } from "@/components/interactive-form";
import { Nav } from "@/components/nav";
import {
  StructuredBlockList,
  wordsInBlocks,
} from "@/components/structured-blocks";
import { TemplateAccordion } from "@/components/template-accordion";
import type {
  ContentBlock,
  StructuredPage,
  StructuredSection,
} from "@/lib/structured-content";
import { industryProfilesByRoute } from "@/lib/industries";
import type { CSSProperties, ReactNode } from "react";

type BlockGroup = {
  title: string;
  blocks: ContentBlock[];
};

const CARD_CLIP =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";

function groupsFromBlocks(blocks: ContentBlock[]): {
  lead: ContentBlock[];
  groups: BlockGroup[];
} {
  const lead: ContentBlock[] = [];
  const groups: BlockGroup[] = [];
  let current: BlockGroup | null = null;
  const groupLevel = blocks.some(
    (block) => block.type === "heading" && block.level === 3
  )
    ? 3
    : 4;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === groupLevel) {
      current = { title: block.text, blocks: [] };
      groups.push(current);
    } else if (current) {
      current.blocks.push(block);
    } else {
      lead.push(block);
    }
  }
  return { lead, groups };
}

type HeroStat = {
  label: string;
  value: string;
  detail: string;
};

const HERO_NUMBER =
  /^(?:[$€£]?\d[\d,.]*(?:[KMBkmb]|d|s)?(?:%|\+|x)?|\.?\d+%|\d+(?:–|-)\d+|%\+|\+)$/;

function isHeroNumber(text: string): boolean {
  const trimmed = text.trim();
  return !trimmed.endsWith(".") && HERO_NUMBER.test(trimmed);
}

function isHeroFragment(text: string): boolean {
  return /^(?:\.\d+%|%\+|\+|[KMBkmb])$/.test(text.trim());
}

function isHeroLabel(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length <= 64 && trimmed.split(/\s+/).length <= 8;
}

function heroActionHref(block: ContentBlock): string {
  if (block.href?.startsWith("/")) return block.href;
  const lower = block.text.toLowerCase();
  if (lower.includes("assessment")) return "/assessment";
  if (lower.includes("case stud")) return "/case-studies";
  if (lower.includes("book") || lower.includes("strategy")) {
    return "/discovery-call";
  }
  return "/contact";
}

function extractHeroStats(blocks: ContentBlock[]): {
  stats: HeroStat[];
  remaining: ContentBlock[];
} {
  const textBlocks = blocks.filter((block) => block.type === "text");
  const consumed = new Set<ContentBlock>();
  const stats: HeroStat[] = [];
  let index = 0;

  while (index < textBlocks.length && stats.length < 4) {
    const current = textBlocks[index];
    if (!current) break;
    const next = textBlocks[index + 1];
    const previous = textBlocks[index - 1];
    const followsRankedList = /^\d+\.$/.test(previous?.text.trim() ?? "");

    if (
      !followsRankedList &&
      !isHeroNumber(current.text) &&
      isHeroLabel(current.text) &&
      next &&
      isHeroNumber(next.text)
    ) {
      const label = current.text;
      let value = next.text;
      consumed.add(current);
      consumed.add(next);
      index += 2;
      while (
        textBlocks[index] &&
        isHeroFragment(textBlocks[index]?.text ?? "")
      ) {
        value += textBlocks[index]?.text ?? "";
        consumed.add(textBlocks[index]!);
        index += 1;
      }
      let detail = "";
      const detailBlock = textBlocks[index];
      if (
        detailBlock &&
        !isHeroNumber(detailBlock.text) &&
        !(
          textBlocks[index + 1] &&
          isHeroNumber(textBlocks[index + 1]?.text ?? "")
        )
      ) {
        detail = detailBlock.text;
        consumed.add(detailBlock);
        index += 1;
      }
      stats.push({ label, value, detail });
      continue;
    }

    if (isHeroNumber(current.text) && !isHeroFragment(current.text)) {
      let value = current.text;
      consumed.add(current);
      index += 1;
      while (
        textBlocks[index] &&
        isHeroFragment(textBlocks[index]?.text ?? "")
      ) {
        value += textBlocks[index]?.text ?? "";
        consumed.add(textBlocks[index]!);
        index += 1;
      }
      const labelBlock = textBlocks[index];
      if (labelBlock && !isHeroNumber(labelBlock.text)) {
        consumed.add(labelBlock);
        stats.push({ value, label: labelBlock.text, detail: "" });
        index += 1;
        continue;
      }
    }

    index += 1;
  }

  return {
    stats,
    remaining: blocks.filter((block) => !consumed.has(block)),
  };
}

function PageHero({ page }: { page: StructuredPage }): ReactNode {
  const heading = page.hero.find(
    (block) => block.type === "heading" && block.level === 1
  );
  const headingIndex = heading ? page.hero.indexOf(heading) : -1;
  const prelude = page.hero
    .slice(0, Math.max(headingIndex, 0))
    .filter((block) => block.text !== "·");
  const after = page.hero.slice(headingIndex + 1);
  const evidenceStart = after.findIndex((block) =>
    ["text", "table", "list-item"].includes(block.type)
  );
  const introZone = after.slice(
    0,
    evidenceStart >= 0 ? evidenceStart : after.length
  );
  const leads = introZone
    .filter((block) => block.type === "paragraph")
    .slice(0, 2);
  const actions = after.filter((block) => block.type === "action").slice(0, 2);
  const facts = after.filter(
    (block) =>
      !leads.includes(block) &&
      !["action", "heading", "field", "select", "label"].includes(block.type) &&
      block.text !== "·"
  );
  const { stats, remaining } = extractHeroStats(facts);
  let contextIndex = -1;
  for (let index = remaining.length - 1; index >= 0; index -= 1) {
    const block = remaining[index];
    if (
      block &&
      ["paragraph", "text"].includes(block.type) &&
      block.text.split(/\s+/).length <= 8 &&
      !/[.!?]$/.test(block.text)
    ) {
      contextIndex = index;
      break;
    }
  }
  const context = contextIndex >= 0 ? remaining[contextIndex] : undefined;
  const supporting = remaining.filter(
    (_block, index) => index !== contextIndex
  );

  return (
    <div className="relative overflow-hidden">
      <HeroWaves />
      <section className="relative mx-auto max-w-[1440px] px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-20 lg:px-10">
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-[1] h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 45%, transparent 72%)",
            }}
          />
          {prelude.length ? (
            <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.14em] text-[#b8500c] uppercase">
              {prelude.map((block) => block.text).join(" · ")}
            </p>
          ) : null}
          <h1 className="max-w-[18ch] font-serif text-[2.5rem] leading-[1.04] font-normal tracking-[-0.025em] text-balance sm:text-5xl lg:text-[4rem]">
            {heading?.text ?? page.title}
          </h1>
          {leads.map((lead, index) => (
            <p
              key={`${lead.text}-${index}`}
              className={`text-muted-foreground max-w-2xl text-base leading-7 text-balance sm:text-[1.05rem] sm:leading-8 ${
                index === 0 ? "mt-6" : "mt-3"
              }`}
            >
              {lead.text}
            </p>
          ))}
          {actions.length ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {actions.map((action, index) => (
                <CutButton
                  key={`${action.text}-${index}`}
                  href={heroActionHref(action)}
                  variant={index === 0 ? "solid" : "outline"}
                >
                  {action.text}
                </CutButton>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {stats.length || supporting.length ? (
        <section className="relative mx-auto max-w-[1180px] px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">
          {stats.length ? (
            <div className="border-border bg-border relative grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-4">
              <CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
              <CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
              <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
              <CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${stat.value}-${index}`}
                  className="bg-background min-w-0 p-5 sm:p-6"
                >
                  <p className="text-muted-foreground text-xs leading-5 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-foreground mt-3 font-serif text-4xl leading-none tracking-[-0.025em]">
                    {stat.value}
                  </p>
                  {stat.detail ? (
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {stat.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {supporting.length ? (
            context ? (
              <details className="group border-border bg-background mt-3 border">
                <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-5 text-sm font-semibold sm:px-6">
                  <span>{context.text}</span>
                  <span className="text-muted-foreground text-lg font-normal transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-border border-t px-5 py-6 sm:px-6 sm:py-8">
                  <StructuredBlockList blocks={supporting} />
                </div>
              </details>
            ) : (
              <div className="mt-6">
                <StructuredBlockList blocks={supporting} />
              </div>
            )
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function CardSection({
  section,
  index,
  success,
}: {
  section: StructuredSection;
  index: number;
  success: StructuredSection | undefined;
}): ReactNode {
  const { lead, groups } = groupsFromBlocks(section.blocks);
  const hasFields = section.blocks.some(
    (block) => block.type === "field" || block.type === "select"
  );
  const isFaq =
    groups.length >= 2 &&
    groups.filter((group) => group.title.includes("?")).length >=
      Math.ceil(groups.length / 2);
  const sectionWords = wordsInBlocks(section.blocks);
  const isDense =
    sectionWords > 560 ||
    groups.some((group) => wordsInBlocks(group.blocks) > 180);
  const isMany = groups.length > 6;
  const clip = { clipPath: CARD_CLIP } as CSSProperties;
  const sectionShell = `${index % 2 ? "bg-muted/35" : "bg-background"} py-16 sm:py-24`;

  if (isFaq) {
    return (
      <section className={sectionShell}>
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-10">
          <div>
            <h2 className="max-w-[16ch] font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem]">
              {section.heading}
            </h2>
            <div className="mt-6 max-w-md">
              <StructuredBlockList blocks={lead} />
            </div>
          </div>
          <TemplateAccordion
            items={groups.map((group) => ({
              title: group.title,
              body: group.blocks.map((block) => block.text).filter(Boolean),
            }))}
          />
        </div>
      </section>
    );
  }

  if (hasFields) {
    const introIndex = section.blocks.findIndex(
      (block) => block.type === "paragraph"
    );
    const formBlocks = section.blocks.filter(
      (_block, blockIndex) => blockIndex !== introIndex
    );
    const copyBlocks = introIndex >= 0 ? [section.blocks[introIndex]!] : [];
    return (
      <section className="bg-muted/35 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <h2 className="max-w-[17ch] font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem]">
              {section.heading}
            </h2>
            <div className="mt-6 max-w-md">
              <StructuredBlockList blocks={copyBlocks} />
            </div>
          </div>
          <InteractiveForm blocks={formBlocks} success={success} />
        </div>
      </section>
    );
  }

  if (groups.length > 0 && !isDense && !isMany) {
    const shapes = ["scan", "shield", "key"] as const;
    return (
      <section className={sectionShell}>
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem]">
              {section.heading}
            </h2>
            <div className="mt-6 max-w-2xl">
              <StructuredBlockList blocks={lead} />
            </div>
          </div>
          <div
            className={`mt-10 grid gap-5 ${
              groups.length === 3 ? "lg:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {groups.map((group, groupIndex) => (
              <div
                key={`${group.title}-${groupIndex}`}
                className="bg-border p-px"
                style={clip}
              >
                <article
                  className="bg-background flex h-full min-w-0 flex-col p-6 sm:p-7"
                  style={clip}
                >
                  <h3 className="text-xl leading-snug font-semibold tracking-[-0.015em]">
                    {group.title}
                  </h3>
                  <div className="border-border my-5 border-t border-dotted" />
                  {groups.length === 3 && wordsInBlocks(group.blocks) < 130 ? (
                    <>
                      <div className="flex justify-center py-5">
                        <AsciiIcon
                          shape={shapes[groupIndex % shapes.length]!}
                        />
                      </div>
                      <div className="border-border mb-5 border-t border-dotted" />
                    </>
                  ) : null}
                  <StructuredBlockList blocks={group.blocks} compact />
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (groups.length > 0) {
    return (
      <section className={sectionShell}>
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <h2 className="max-w-[18ch] font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem] lg:text-5xl">
            {section.heading}
          </h2>
          <div className="mt-6 max-w-2xl">
            <StructuredBlockList blocks={lead} />
          </div>
          <div
            className={
              isMany
                ? "mt-12 grid gap-5 md:grid-cols-2"
                : "border-border relative mt-12 border-y"
            }
          >
            {!isMany ? (
              <>
                <CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
                <CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
              </>
            ) : null}
            {groups.map((group, groupIndex) => (
              <article
                key={`${group.title}-${groupIndex}`}
                className={
                  isMany
                    ? "border-border bg-background min-w-0 border p-6 sm:p-7"
                    : `grid min-w-0 gap-5 py-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-14 ${
                        groupIndex ? "border-border border-t" : ""
                      }`
                }
              >
                <h3
                  className={
                    isMany
                      ? "text-xl leading-snug font-semibold tracking-[-0.015em]"
                      : "max-w-[17ch] font-serif text-2xl leading-[1.12] tracking-[-0.02em] text-balance sm:text-3xl"
                  }
                >
                  {group.title}
                </h3>
                <div
                  className={isMany ? "border-border mt-5 border-t pt-5" : ""}
                >
                  <StructuredBlockList blocks={group.blocks} compact />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const firstStructured = section.blocks.findIndex(
    (block) => block.type !== "paragraph"
  );
  const intro =
    firstStructured > 0
      ? section.blocks.slice(0, firstStructured)
      : section.blocks
          .filter((block) => block.type === "paragraph")
          .slice(0, 2);
  const remainder =
    firstStructured > 0
      ? section.blocks.slice(firstStructured)
      : section.blocks.filter((block) => !intro.includes(block));

  return (
    <section className={sectionShell}>
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <h2 className="max-w-[18ch] font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem] lg:text-5xl">
          {section.heading}
        </h2>
        {remainder.length ? (
          <div className="border-border mt-10 grid gap-10 border-t pt-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="max-w-lg">
              <StructuredBlockList blocks={intro} />
            </div>
            <div className="min-w-0">
              <StructuredBlockList blocks={remainder} />
            </div>
          </div>
        ) : (
          <div className="border-border mt-8 max-w-[72ch] border-t pt-8">
            <StructuredBlockList blocks={section.blocks} />
          </div>
        )}
      </div>
    </section>
  );
}

export function TemplateSections({
  sections,
  success,
}: {
  sections: StructuredSection[];
  success: StructuredSection | undefined;
}): ReactNode {
  return sections.map((section, index) => (
    <CardSection
      key={`${section.heading}-${index}`}
      section={section}
      index={index}
      success={success}
    />
  ));
}

export function TemplateContentPage({
  page,
  route,
}: {
  page: StructuredPage;
  route: string;
}): ReactNode {
  const success = page.sections.find((section) =>
    ["Your assessment is being prepared.", "You're all set."].includes(
      section.heading
    )
  );
  const visibleSections = success
    ? page.sections.filter((section) => section !== success)
    : page.sections;
  const industryProfile = industryProfilesByRoute[route];

  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHero page={page} />
        {industryProfile ? (
          <IndustrySearchExamples profile={industryProfile} />
        ) : null}
        <TemplateSections sections={visibleSections} success={success} />
      </main>
      <Footer />
    </>
  );
}
