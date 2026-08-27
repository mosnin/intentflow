import { AsciiIcon } from "@/components/ascii-icon";
import { CutButton } from "@/components/cut-button";
import { ArrowRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

type Shape = "scan" | "shield" | "key";

type Feature = {
  shape: Shape;
  title: string;
  body: string;
  meta: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    shape: "scan",
    title: "Search Engine Optimization",
    body: "The traditional discipline. Optimizing websites and content to rank in Google and Bing blue-link results. Still foundational. Ranking is no longer the destination — it's the down payment that earns the right to compete for everything else.",
    meta: "SEO · The traditional discipline",
    href: "/osa",
  },
  {
    shape: "shield",
    title: "Answer Engine Optimization",
    body: "The newer discipline addressing a hard truth: 69% of Google searches now end without a click. Buyers form opinions inside featured snippets, AI Overviews, voice responses, and \"People Also Ask\" boxes. AEO is the practice of being the answer wherever buyers are looking.",
    meta: "AEO · The newer discipline",
    href: "/authority",
  },
  {
    shape: "key",
    title: "Generative Engine Optimization",
    body: "The frontier discipline. When buyers ask ChatGPT, Gemini, Perplexity, Claude, or Grok to recommend vendors, the AI cites three to five sources. GEO is the practice of engineering content to be one of those sources — where the next generation of buying decisions is being shaped.",
    meta: "GEO · The frontier discipline",
    href: "/authority",
  },
];

const CARD_CLIP =
  "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)";

export function Features(): ReactNode {
  const clip = { clipPath: CARD_CLIP } as CSSProperties;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="max-w-2xl">
        <h2 className="text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Three search disciplines. {" "}
          <span className="font-sans font-semibold tracking-tight">
            One stack.
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Search no longer happens in one place. It happens across three
          distinct disciplines, each reaching the buyer at a different moment.
          Most companies treat them as alternatives. They&apos;re not alternatives
          — they&apos;re three layers of one stack. Winning requires presence across
          all three.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="bg-border p-px" style={clip}>
            <article
              className="flex h-full flex-col bg-background p-6 sm:p-7"
              style={clip}
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {feature.title}
              </h3>

              <div className="my-5 border-t border-dotted border-border" />
              <div className="flex justify-center py-6 sm:py-8">
                <AsciiIcon shape={feature.shape} />
              </div>
              <div className="mb-6 border-t border-dotted border-border" />

              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <span className="text-xs font-medium text-muted-foreground">
                  {feature.meta}
                </span>
                <CutButton
                  href={feature.href}
                  variant="outline"
                  iconOnly
                  aria-label={`Learn more about ${feature.title}`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CutButton>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
