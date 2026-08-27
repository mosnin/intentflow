import { CutButton } from "@/components/cut-button";
import type { ContentBlock } from "@/lib/structured-content";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const NUMBER_TOKEN =
  /^(?:[$€£]?\d[\d,.]*(?:[KMBkmb]|d|s)?(?:%|\+|x)?|\.?\d+%|\d+(?:–|-)\d+|%\+|\+)$/;

function isNumberToken(text: string): boolean {
  return NUMBER_TOKEN.test(text.trim());
}

function isNumberFragment(text: string): boolean {
  return /^(?:\.\d+%|%\+|\+|[KMBkmb])$/.test(text.trim());
}

function isStepToken(text: string): boolean {
  return /^0[1-9]$/.test(text.trim());
}

function isContextLabel(text: string): boolean {
  const trimmed = text.trim();
  return (
    trimmed.split(/\s+/).length <= 8 &&
    trimmed.length <= 64 &&
    !/[.!?]$/.test(trimmed)
  );
}

function hrefFor(block: ContentBlock): string {
  if (block.href?.startsWith("/")) return block.href;
  if (block.href?.startsWith("http")) return block.href;
  const label = block.text.toLowerCase();
  if (label.includes("assessment")) return "/assessment";
  if (label.includes("case stud")) return "/case-studies";
  if (label.includes("book") || label.includes("discovery")) {
    return "/discovery-call";
  }
  return "/contact";
}

function GenericTextItems({ texts }: { texts: string[] }): ReactNode {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {texts.map((text, index) => (
        <div
          key={`${text}-${index}`}
          className="border-border min-w-0 border-t pt-4"
        >
          <p
            className={
              text.length > 92
                ? "text-muted-foreground text-[0.95rem] leading-7"
                : "text-foreground text-sm leading-6 font-medium"
            }
          >
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}

function StepRun({ texts }: { texts: string[] }): ReactNode {
  const steps: { number: string; title: string; body: string }[] = [];
  let cursor = 0;

  while (cursor < texts.length) {
    if (!isStepToken(texts[cursor] ?? "")) {
      cursor += 1;
      continue;
    }
    const number = texts[cursor] ?? "";
    const title = texts[cursor + 1] ?? "";
    const bodyParts: string[] = [];
    cursor += 2;
    while (cursor < texts.length && !isStepToken(texts[cursor] ?? "")) {
      bodyParts.push(texts[cursor] ?? "");
      cursor += 1;
    }
    steps.push({ number, title, body: bodyParts.join(" ") });
  }

  return (
    <ol className="border-border bg-border grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step) => (
        <li key={step.number} className="bg-background min-w-0 p-6 sm:p-7">
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#b8500c]">
            {step.number}
          </span>
          <h4 className="mt-5 text-lg leading-snug font-semibold tracking-[-0.01em]">
            {step.title}
          </h4>
          {step.body ? (
            <p className="text-muted-foreground mt-3 text-[0.95rem] leading-7">
              {step.body}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function StatRun({ texts }: { texts: string[] }): ReactNode {
  const stats: { value: string; details: string[] }[] = [];
  const extras: string[] = [];
  let cursor = 0;

  while (cursor < texts.length) {
    const current = texts[cursor] ?? "";
    if (!isNumberToken(current) || isNumberFragment(current)) {
      extras.push(current);
      cursor += 1;
      continue;
    }

    let value = current;
    cursor += 1;
    while (cursor < texts.length && isNumberFragment(texts[cursor] ?? "")) {
      value += texts[cursor] ?? "";
      cursor += 1;
    }

    const details: string[] = [];
    while (
      cursor < texts.length &&
      !isNumberToken(texts[cursor] ?? "") &&
      details.length < 3
    ) {
      details.push(texts[cursor] ?? "");
      cursor += 1;
    }
    stats.push({ value, details });
  }

  return (
    <div className="space-y-4">
      <div className="border-border bg-border grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={`${stat.value}-${index}`}
            className="bg-background min-w-0 p-5 sm:p-6"
          >
            <p className="text-foreground font-serif text-4xl leading-none tracking-[-0.025em]">
              {stat.value}
            </p>
            {stat.details.map((detail, detailIndex) => (
              <p
                key={`${detail}-${detailIndex}`}
                className={
                  detailIndex === 0
                    ? "text-foreground mt-4 text-sm leading-6 font-medium"
                    : "text-muted-foreground mt-1 text-xs leading-5"
                }
              >
                {detail}
              </p>
            ))}
          </div>
        ))}
      </div>
      {extras.filter(Boolean).length ? (
        <GenericTextItems texts={extras.filter(Boolean)} />
      ) : null}
    </div>
  );
}

function FlowRun({ texts }: { texts: string[] }): ReactNode {
  const items = texts.filter((text) => text !== "→");
  return (
    <div className="border-border bg-border grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((text, index) => (
        <div
          key={`${text}-${index}`}
          className="bg-background relative min-w-0 p-5"
        >
          <p
            className={
              text.length > 92
                ? "text-muted-foreground text-[0.95rem] leading-7"
                : "text-foreground text-sm leading-6 font-semibold"
            }
          >
            {text}
          </p>
          {index < items.length - 1 ? (
            <ArrowRight
              className="bg-background absolute top-1/2 -right-2.5 z-10 hidden h-5 w-5 -translate-y-1/2 text-[#b8500c] lg:block"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TripletRun({ texts }: { texts: string[] }): ReactNode {
  const items: { title: string; subtitle: string; body: string }[] = [];
  for (let index = 0; index < texts.length; index += 3) {
    items.push({
      title: texts[index] ?? "",
      subtitle: texts[index + 1] ?? "",
      body: texts[index + 2] ?? "",
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <article
          key={`${item.title}-${index}`}
          className="border-border bg-background min-w-0 border p-6"
        >
          <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-[#b8500c] uppercase">
            {item.title}
          </p>
          <h4 className="mt-3 text-lg leading-snug font-semibold tracking-[-0.01em]">
            {item.subtitle}
          </h4>
          <p className="text-muted-foreground mt-3 text-[0.95rem] leading-7">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}

function PairRun({ texts }: { texts: string[] }): ReactNode {
  const pairs: { title: string; body: string }[] = [];
  for (let index = 0; index < texts.length; index += 2) {
    pairs.push({ title: texts[index] ?? "", body: texts[index + 1] ?? "" });
  }

  return (
    <div className="grid gap-x-8 gap-y-0 md:grid-cols-2">
      {pairs.map((pair, index) => (
        <article
          key={`${pair.title}-${index}`}
          className="border-border min-w-0 border-t py-5"
        >
          <h4 className="text-base leading-snug font-semibold tracking-[-0.01em]">
            {pair.title}
          </h4>
          <p className="text-muted-foreground mt-2 text-[0.95rem] leading-7">
            {pair.body}
          </p>
        </article>
      ))}
    </div>
  );
}

export function TextRun({ blocks }: { blocks: ContentBlock[] }): ReactNode {
  const texts = blocks.map((block) => block.text).filter(Boolean);
  if (!texts.length) return null;

  const stepCount = texts.filter(isStepToken).length;
  if (stepCount >= 2) return <StepRun texts={texts} />;

  const numberCount = texts.filter(
    (text) => isNumberToken(text) && !isNumberFragment(text)
  ).length;
  if (numberCount >= 2 && isNumberToken(texts[0] ?? "")) {
    return <StatRun texts={texts} />;
  }

  if (texts.filter((text) => text === "→").length >= 2) {
    return <FlowRun texts={texts} />;
  }

  const isTripletPattern =
    texts.length >= 6 &&
    texts.length % 3 === 0 &&
    Array.from({ length: texts.length / 3 }).every((_, index) => {
      const title = texts[index * 3] ?? "";
      const subtitle = texts[index * 3 + 1] ?? "";
      const body = texts[index * 3 + 2] ?? "";
      return title.length <= 72 && subtitle.length <= 96 && body.length > 72;
    });
  if (isTripletPattern) return <TripletRun texts={texts} />;

  const isPairPattern =
    texts.length >= 4 &&
    texts.length % 2 === 0 &&
    Array.from({ length: texts.length / 2 }).every((_, index) => {
      const title = texts[index * 2] ?? "";
      const body = texts[index * 2 + 1] ?? "";
      return title.length <= 110 && body.length > 68;
    });
  if (isPairPattern) return <PairRun texts={texts} />;

  return <GenericTextItems texts={texts} />;
}

function ActionRun({ blocks }: { blocks: ContentBlock[] }): ReactNode {
  if (blocks.length <= 2) {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {blocks.map((block, index) => (
          <CutButton
            key={`${block.text}-${index}`}
            href={hrefFor(block)}
            variant={index === 0 ? "solid" : "outline"}
          >
            {block.text}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CutButton>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, index) => (
        <a
          key={`${block.text}-${index}`}
          href={hrefFor(block)}
          className="focus-ring group border-border bg-background hover:bg-muted flex min-h-24 items-start justify-between gap-5 border p-5 text-sm leading-6 font-medium transition-[background-color,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{block.text}</span>
          <ArrowUpRight
            className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0 transition-colors group-hover:text-[#b8500c]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}

function ListRun({ blocks }: { blocks: ContentBlock[] }): ReactNode {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {blocks.map((block, index) => (
        <li
          key={`${block.text}-${index}`}
          className="border-border bg-background text-muted-foreground flex min-w-0 gap-3 border p-5 text-[0.95rem] leading-7"
        >
          <span className="mt-[0.68rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8500c]" />
          <span>{block.text}</span>
        </li>
      ))}
    </ul>
  );
}

function TableBlock({ block }: { block: ContentBlock }): ReactNode {
  return (
    <div className="border-border overflow-x-auto border">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <tbody>
          {block.rows?.map((row, rowIndex) => (
            <tr
              key={`${row.join("-")}-${rowIndex}`}
              className={rowIndex ? "border-border border-t" : ""}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className="text-muted-foreground first:text-foreground px-5 py-4 leading-6 first:font-medium"
                >
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

export function StructuredBlockList({
  blocks,
  compact = false,
}: {
  blocks: ContentBlock[];
  compact?: boolean;
}): ReactNode {
  const rendered: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    if (!block) {
      index += 1;
      continue;
    }

    if (block.type === "text") {
      const run: ContentBlock[] = [];
      while (blocks[index]?.type === "text") {
        run.push(blocks[index]!);
        index += 1;
      }
      rendered.push(<TextRun key={`text-${index}`} blocks={run} />);
      continue;
    }

    if (block.type === "action") {
      const run: ContentBlock[] = [];
      while (blocks[index]?.type === "action") {
        run.push(blocks[index]!);
        index += 1;
      }
      rendered.push(<ActionRun key={`action-${index}`} blocks={run} />);
      continue;
    }

    if (block.type === "list-item") {
      const run: ContentBlock[] = [];
      while (blocks[index]?.type === "list-item") {
        run.push(blocks[index]!);
        index += 1;
      }
      rendered.push(<ListRun key={`list-${index}`} blocks={run} />);
      continue;
    }

    const key = `${block.type}-${block.text}-${index}`;
    if (block.type === "paragraph") {
      if (isContextLabel(block.text)) {
        rendered.push(
          <p
            key={key}
            className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#b8500c] uppercase"
          >
            {block.text}
          </p>
        );
      } else if (/^[“\"]/.test(block.text)) {
        rendered.push(
          <blockquote
            key={key}
            className="text-foreground border-l-2 border-[#b8500c] pl-5 font-serif text-xl leading-relaxed sm:text-2xl"
          >
            {block.text}
          </blockquote>
        );
      } else {
        rendered.push(
          <p
            key={key}
            className="text-muted-foreground max-w-[72ch] text-[0.98rem] leading-7 sm:text-base sm:leading-8"
          >
            {block.text}
          </p>
        );
      }
    } else if (block.type === "heading") {
      rendered.push(
        <h4
          key={key}
          className="text-foreground pt-3 text-xl leading-snug font-semibold tracking-[-0.015em] sm:text-2xl"
        >
          {block.text}
        </h4>
      );
    } else if (block.type === "table" && block.rows) {
      rendered.push(<TableBlock key={key} block={block} />);
    }
    index += 1;
  }

  return <div className={compact ? "space-y-4" : "space-y-6"}>{rendered}</div>;
}

export function wordsInBlocks(blocks: ContentBlock[]): number {
  return blocks.reduce(
    (total, block) =>
      total + block.text.trim().split(/\s+/).filter(Boolean).length,
    0
  );
}
