import { AsciiIcon } from "@/components/ascii-icon";
import { CornerPlus } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { Footer } from "@/components/footer";
import { HeroWaves } from "@/components/hero-waves";
import { InteractiveForm } from "@/components/interactive-form";
import { Nav } from "@/components/nav";
import { TemplateAccordion } from "@/components/template-accordion";
import type {
  ContentBlock,
  StructuredPage,
  StructuredSection,
} from "@/lib/structured-content";
import { ArrowRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

type BlockGroup = {
  title: string;
  blocks: ContentBlock[];
};

const CARD_CLIP =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";

function actionHref(block: ContentBlock): string {
  if (block.href?.startsWith("/")) return block.href;
  const label = block.text.toLowerCase();
  if (label.includes("assessment")) return "/assessment";
  if (label.includes("case stud")) return "/case-studies";
  if (label.includes("book") || label.includes("discovery")) {
    return "/discovery-call";
  }
  return "/contact";
}

function groupsFromBlocks(blocks: ContentBlock[]): {
  lead: ContentBlock[];
  groups: BlockGroup[];
} {
  const lead: ContentBlock[] = [];
  const groups: BlockGroup[] = [];
  let current: BlockGroup | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && (block.level === 3 || block.level === 4)) {
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

function BlockList({ blocks, compact = false }: { blocks: ContentBlock[]; compact?: boolean }): ReactNode {
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${block.text}-${index}`;
        if (block.type === "paragraph") {
          return (
            <p key={key} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {block.text}
            </p>
          );
        }
        if (block.type === "list-item") {
          return (
            <div key={key} className="flex gap-3 border-t border-dotted border-border pt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8500c]" />
              <span>{block.text}</span>
            </div>
          );
        }
        if (block.type === "action") {
          return (
            <div key={key} className="pt-2">
              <CutButton href={actionHref(block)} variant="outline">
                {block.text}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CutButton>
            </div>
          );
        }
        if (block.type === "table" && block.rows) {
          return (
            <div key={key} className="overflow-x-auto border border-border">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${row.join("-")}-${rowIndex}`} className={rowIndex ? "border-t border-border" : ""}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${cell}-${cellIndex}`} className="px-4 py-3 text-muted-foreground first:font-medium first:text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "text" && block.text !== "·") {
          return block.text.length < 84 ? (
            <p key={key} className="font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
              {block.text}
            </p>
          ) : (
            <p key={key} className="text-sm leading-relaxed text-muted-foreground">
              {block.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

function PageHero({ page }: { page: StructuredPage }): ReactNode {
  const heading = page.hero.find((block) => block.type === "heading" && block.level === 1);
  const headingIndex = heading ? page.hero.indexOf(heading) : -1;
  const prelude = page.hero.slice(0, Math.max(headingIndex, 0)).filter((block) => block.text !== "·");
  const after = page.hero.slice(headingIndex + 1);
  const lead = after.find((block) => block.type === "paragraph");
  const actions = after.filter((block) => block.type === "action").slice(0, 2);
  const facts = after.filter(
    (block) =>
      block !== lead &&
      !["action", "heading", "field", "select", "label"].includes(block.type) &&
      block.text !== "·",
  );

  return (
    <div className="relative overflow-hidden">
      <HeroWaves />
      <section className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-10">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 45%, transparent 72%)",
            }}
          />
          {prelude.length ? (
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b8500c]">
              {prelude.map((block) => block.text).join(" · ")}
            </p>
          ) : null}
          <h1 className="text-balance font-serif text-4xl font-normal leading-[1.06] tracking-[-0.015em] sm:text-5xl lg:text-[3.7rem]">
            {heading?.text ?? page.title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {lead.text}
            </p>
          ) : null}
          {actions.length ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {actions.map((action, index) => (
                <CutButton
                  key={`${action.text}-${index}`}
                  href={actionHref(action)}
                  variant={index === 0 ? "solid" : "outline"}
                >
                  {action.text}
                </CutButton>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {facts.length ? (
        <section className="relative mx-auto max-w-[1100px] px-5 pb-24 sm:px-8 lg:px-10">
          <div className="relative grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
            <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
            {facts.map((fact, index) => (
              <div
                key={`${fact.text}-${index}`}
                className={`flex items-center bg-background px-5 py-4 text-sm leading-relaxed text-muted-foreground ${
                  fact.type === "paragraph"
                    ? "min-h-0 sm:col-span-2 lg:col-span-4"
                    : "min-h-24"
                }`}
              >
                {fact.text}
              </div>
            ))}
          </div>
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
  const hasFields = section.blocks.some((block) => block.type === "field" || block.type === "select");
  const isFaq = groups.length >= 2 && groups.filter((group) => group.title.includes("?")).length >= Math.ceil(groups.length / 2);
  const clip = { clipPath: CARD_CLIP } as CSSProperties;

  if (isFaq) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="text-balance font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              {section.heading}
            </h2>
            <div className="mt-5 max-w-md">
              <BlockList blocks={lead} />
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
    const introIndex = section.blocks.findIndex((block) => block.type === "paragraph");
    const formBlocks = section.blocks.filter((_block, blockIndex) => blockIndex !== introIndex);
    const copyBlocks = introIndex >= 0 ? [section.blocks[introIndex]!] : [];
    return (
      <section className="bg-muted/35 py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <h2 className="text-balance font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              {section.heading}
            </h2>
            <div className="mt-5 max-w-md">
              <BlockList blocks={copyBlocks} />
            </div>
          </div>
          <InteractiveForm blocks={formBlocks} success={success} />
        </div>
      </section>
    );
  }

  if (groups.length > 0 && groups.length <= 4) {
    const shapes = ["scan", "shield", "key"] as const;
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="max-w-3xl">
          <h2 className="text-balance font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
            {section.heading}
          </h2>
          <div className="mt-5 max-w-2xl">
            <BlockList blocks={lead} />
          </div>
        </div>
        <div className={`mt-10 grid gap-5 ${groups.length === 3 ? "lg:grid-cols-3" : "sm:grid-cols-2"}`}>
          {groups.map((group, groupIndex) => (
            <div key={`${group.title}-${groupIndex}`} className="bg-border p-px" style={clip}>
              <article className="flex h-full flex-col bg-background p-6 sm:p-7" style={clip}>
                <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
                <div className="my-5 border-t border-dotted border-border" />
                <div className="flex justify-center py-5">
                  <AsciiIcon shape={shapes[groupIndex % shapes.length]!} />
                </div>
                <div className="mb-5 border-t border-dotted border-border" />
                <BlockList blocks={group.blocks} compact />
              </article>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (groups.length > 4) {
    return (
      <section className={index % 2 ? "bg-muted/35 py-20 sm:py-28" : "py-20 sm:py-28"}>
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <h2 className="max-w-4xl text-balance font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
            {section.heading}
          </h2>
          <div className="mt-5 max-w-2xl">
            <BlockList blocks={lead} />
          </div>
          <div className="relative mt-10 border-y border-border">
            <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
            {groups.map((group, groupIndex) => (
              <article
                key={`${group.title}-${groupIndex}`}
                className={`grid gap-4 py-6 sm:grid-cols-[0.72fr_1.28fr] sm:gap-10 ${groupIndex ? "border-t border-dotted border-border" : ""}`}
              >
                <h3 className="text-base font-semibold tracking-tight">{group.title}</h3>
                <BlockList blocks={group.blocks} compact />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={index % 2 ? "bg-muted/35 py-20 sm:py-28" : "py-20 sm:py-28"}>
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10">
        <h2 className="text-balance font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
          {section.heading}
        </h2>
        <div className="relative border-l border-border pl-6 sm:pl-10">
          <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <BlockList blocks={lead} />
        </div>
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

export function TemplateContentPage({ page }: { page: StructuredPage }): ReactNode {
  const success = page.sections.find((section) =>
    ["Your assessment is being prepared.", "You're all set."].includes(section.heading),
  );
  const visibleSections = success
    ? page.sections.filter((section) => section !== success)
    : page.sections;

  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHero page={page} />
        <TemplateSections sections={visibleSections} success={success} />
      </main>
      <Footer />
    </>
  );
}
