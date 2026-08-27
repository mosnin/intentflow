"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

export type AccordionItem = {
  title: string;
  body: string[];
};

export function TemplateAccordion({
  items,
}: {
  items: AccordionItem[];
}): ReactNode {
  const [open, setOpen] = useState(0);

  return (
    <div className="relative border-y border-border">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div
            key={`${item.title}-${index}`}
            className={index > 0 ? "border-t border-dotted border-border" : ""}
          >
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
              className="focus-ring flex w-full items-center justify-between gap-8 py-5 text-left sm:py-6"
            >
              <span className="text-base font-medium tracking-tight sm:text-lg">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                className="shrink-0 text-muted-foreground"
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl space-y-3 pb-6 text-sm leading-relaxed text-muted-foreground">
                    {item.body.map((paragraph, paragraphIndex) => (
                      <p key={`${paragraph}-${paragraphIndex}`}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
