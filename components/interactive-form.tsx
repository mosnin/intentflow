"use client";

import { CutButton } from "@/components/cut-button";
import type { ContentBlock, StructuredSection } from "@/lib/structured-content";
import { useState, type ReactNode } from "react";

function fieldInput(block: ContentBlock): ReactNode {
  if (block.type === "select") {
    return (
      <select
        id={block.name}
        name={block.name}
        className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
      >
        {block.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={block.name}
      name={block.name}
      type={block.fieldType ?? "text"}
      placeholder={block.text}
      className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/20"
    />
  );
}

function FormFields({
  blocks,
  onContinue,
  onBack,
}: {
  blocks: ContentBlock[];
  onContinue: () => void;
  onBack: () => void;
}): ReactNode {
  const rendered: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (!block) continue;
    const key = `${block.type}-${block.text}-${index}`;

    if (block.type === "paragraph") {
      rendered.push(
        <p key={key} className="text-sm leading-relaxed text-muted-foreground sm:col-span-2">
          {block.text}
        </p>,
      );
      continue;
    }

    if (block.type === "text") {
      const isStep = /^Step\s|^\d+%$/.test(block.text);
      rendered.push(
        <p
          key={key}
          className={
            isStep
              ? "font-mono text-[10px] uppercase tracking-[0.16em] text-[#b8500c] sm:col-span-2"
              : "-mt-2 text-xs text-muted-foreground sm:col-span-2"
          }
        >
          {block.text}
        </p>,
      );
      continue;
    }

    if (block.type === "label" && block.htmlFor) {
      const next = blocks[index + 1];
      if (next?.type === "field" || next?.type === "select") {
        rendered.push(
          <div key={key} className="sm:col-span-2">
            <label htmlFor={block.htmlFor} className="text-xs font-semibold">
              {block.text}
            </label>
            {fieldInput(next)}
          </div>,
        );
        index += 1;
        continue;
      }
    }

    if (block.type === "label" && !block.htmlFor) {
      const labels = [block];
      let cursor = index + 1;
      while (blocks[cursor]?.type === "label" && !blocks[cursor]?.htmlFor) {
        labels.push(blocks[cursor]!);
        cursor += 1;
      }

      if (labels.length > 1) {
        const groupName = `choice-${index}`;
        rendered.push(
          <fieldset key={key} className="border-t border-dotted border-border pt-4 sm:col-span-2">
            <legend className="mb-3 text-xs font-semibold">{labels[0]?.text}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {labels.slice(1).map((option, optionIndex) => (
                <label
                  key={`${option.text}-${optionIndex}`}
                  className="flex min-h-10 cursor-pointer items-center gap-2.5 border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <input type="radio" name={groupName} value={option.text} className="accent-[#b8500c]" />
                  {option.text}
                </label>
              ))}
            </div>
          </fieldset>,
        );
        index = cursor - 1;
      } else {
        rendered.push(
          <label key={key} className="flex cursor-pointer gap-3 border-t border-dotted border-border pt-4 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#b8500c]" />
            {block.text}
          </label>,
        );
      }
      continue;
    }

    if (block.type === "field" || block.type === "select") {
      rendered.push(
        <div key={key} className="sm:col-span-2">
          {fieldInput(block)}
        </div>,
      );
      continue;
    }

    if (block.type === "action") {
      if (block.text.includes("Continue")) {
        rendered.push(
          <div key={key} className="sm:col-span-2">
            <CutButton variant="solid" type="button" onClick={onContinue}>
              {block.text}
            </CutButton>
          </div>,
        );
      } else if (block.text.includes("Back")) {
        rendered.push(
          <CutButton key={key} variant="outline" type="button" onClick={onBack}>
            {block.text}
          </CutButton>,
        );
      } else {
        rendered.push(
          <CutButton key={key} variant="solid" type="submit">
            {block.text}
          </CutButton>,
        );
      }
    }
  }

  return rendered;
}

export function InteractiveForm({
  blocks,
  success,
}: {
  blocks: ContentBlock[];
  success: StructuredSection | undefined;
}): ReactNode {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const continueIndex = blocks.findIndex(
    (block) => block.type === "action" && block.text.includes("Continue"),
  );
  const isMultiStep = continueIndex >= 0;
  const visibleBlocks = isMultiStep
    ? step === 1
      ? blocks.slice(0, continueIndex + 1)
      : blocks.slice(continueIndex + 1)
    : blocks;

  if (submitted) {
    return (
      <div className="border border-border bg-background p-7 sm:p-10 [clip-path:polygon(18px_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%,0_18px)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b8500c]">
          IntentFlow
        </span>
        <h3 className="mt-5 font-serif text-3xl leading-tight">
          {success?.heading ?? "Your submission is being prepared."}
        </h3>
        <div className="mt-5 space-y-3">
          {success?.blocks.map((block, index) => {
            const key = `${block.type}-${block.text}-${index}`;
            if (block.type === "paragraph") {
              return <p key={key} className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>;
            }
            if (block.type === "list-item") {
              return <p key={key} className="border-t border-dotted border-border pt-2 text-sm text-muted-foreground">{block.text}</p>;
            }
            if (block.type === "text") {
              return <p key={key} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{block.text}</p>;
            }
            if (block.type === "action") {
              return (
                <div key={key} className="pt-2">
                  <CutButton href={block.href || "/discovery-call"} variant="solid">
                    {block.text}
                  </CutButton>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="grid gap-4 border border-border bg-background p-6 shadow-2xl shadow-black/[0.04] sm:grid-cols-2 sm:p-8 [clip-path:polygon(18px_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%,0_18px)]"
    >
      <FormFields
        blocks={visibleBlocks}
        onContinue={() => setStep(2)}
        onBack={() => setStep(1)}
      />
    </form>
  );
}
