"use client";

import { CutButton } from "@/components/cut-button";
import { CornerPlus } from "@/components/corner-plus";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type QA = { question: string; answer: string };

const FAQS: QA[] = [
  {
    question: "What is a search dominance company?",
    answer:
      "A search dominance company engineers brand presence at the moments that decide buying outcomes across every place buyers search — including Google and Bing autocomplete, and AI answer engines like ChatGPT, Gemini, Perplexity, Claude, and Grok. The discipline operates upstream of traditional SEO, optimizing the search formation moment itself rather than competing for blue-link rankings after queries are formed.",
  },
  {
    question: "What is generative engine optimization (GEO)?",
    answer:
      "Generative Engine Optimization (GEO) is the discipline of engineering content to be cited by AI answer engines like ChatGPT, Gemini, Perplexity, Claude, and Grok. The term was coined in peer-reviewed research led from Princeton University and IIT Delhi, published at ACM KDD 2024. The study identified the three content signals that most drive AI citations: external citations, expert quotations, and verifiable statistics.",
  },
  {
    question: "How is IntentFlow different from SEO agencies and tools like SEMrush?",
    answer:
      "Traditional SEO operates downstream of search queries, competing for rankings in blue-link results. IntentFlow operates upstream, engineering presence in Google and Bing autocomplete (IntentFlow OSA) and in AI answer citations (IntentFlow Authority). Where SEMrush and similar tools diagnose problems and hand customers a to-do list, IntentFlow Authority closes the loop — generating fixes, fact-checking them across multiple AI models, and deploying them to the live site automatically.",
  },
  {
    question: "What does it mean that AI visibility is decoupled from Google rank?",
    answer:
      "In the peer-reviewed GEO study (ACM KDD 2024), the top optimization method increased AI citation visibility by 115.1% for websites ranked fifth in traditional search results — while the average top-ranked site's visibility declined 30.3% when lower-ranked competitors optimized. AI engines select citations on different signals than Google's ranking algorithm, so a smaller, smarter competitor can become the most-cited brand in AI search even while losing the traditional SEO battle.",
  },
  {
    question: "Who is IntentFlow built for?",
    answer:
      "IntentFlow is built for companies in high-AOV verticals already spending on paid search — law firms, home services contractors, wealth management practices, insurance agencies, medical devices and medical services companies, B2B SaaS in competitive markets, professional services firms, and high-end hospitality. The economics work for any business where the lifetime value of a customer justifies high-intent traffic acquisition and where the buying decision now happens partially through AI research.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function FaqItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}): ReactNode {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-dotted border-border [&:not(:first-child)]:border-t">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="focus-ring flex w-full items-center justify-between gap-6 py-5 pr-1 text-left lg:py-6 lg:pl-12"
        >
          <span className="text-base font-medium tracking-tight sm:text-lg">
            {item.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="shrink-0 text-muted-foreground"
          >
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-6 pr-6 text-sm leading-relaxed text-muted-foreground lg:pl-12">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = accordionRef.current;
    if (node === null) return;

    let peak = 0;
    let width = node.offsetWidth;

    const observer = new ResizeObserver(() => {
      if (node.offsetWidth !== width) {
        width = node.offsetWidth;
        peak = 0;
        setMinHeight(undefined);
        return;
      }
      const next = node.offsetHeight;
      if (next > peak) {
        peak = next;
        setMinHeight(next);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="relative grid border-y border-border lg:grid-cols-[0.85fr_1.15fr]">
        {/* Outer frame corners */}
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        {/* Left: heading */}
        <div className="border-b border-border py-10 lg:border-b-0 lg:border-r lg:py-16 lg:pr-12">
          <h2 className="text-balance font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]">
            Questions worth answering directly.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            Frequently asked questions
          </p>
          <div className="mt-8">
            <CutButton href="/discovery-call" variant="outline">
              Book a Discovery Call
            </CutButton>
          </div>
        </div>

        {/* Right: accordion */}
        <div
          ref={accordionRef}
          className="relative"
          style={minHeight !== undefined ? { minHeight } : undefined}
        >
          {/* Plus marks where the divider meets the frame */}
          <CornerPlus className="left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
          <CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.question}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
