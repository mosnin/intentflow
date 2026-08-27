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
    <div className="border-border relative border-y">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div
            key={`${item.title}-${index}`}
            className={index > 0 ? "border-border border-t border-dotted" : ""}
          >
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
              className="focus-ring active:bg-muted flex min-h-14 w-full items-center justify-between gap-8 py-5 text-left sm:py-6"
            >
              <span className="text-base font-medium tracking-tight sm:text-lg">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                className="text-muted-foreground shrink-0"
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
                  <div className="text-muted-foreground max-w-2xl space-y-4 pb-7 text-base leading-8">
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
