"use client";

import { CornerPlus } from "@/components/corner-plus";
import type { IndustryProfile } from "@/lib/industries";
import { ArrowRight, Globe2, MousePointerClick, Search } from "lucide-react";
import { useState, type ReactNode } from "react";

export function IndustrySearchExamples({
  profile,
}: {
  profile: IndustryProfile;
}): ReactNode {
  const [activeKeyword, setActiveKeyword] = useState(0);
  const keyword = profile.keywords[activeKeyword] ?? profile.keywords[0];

  return (
    <section className="bg-muted/35 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-10">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-[#b8500c] uppercase">
            OSA search examples · {profile.name}
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.06] tracking-[-0.025em] text-balance sm:text-[2.75rem]">
            From an unbranded keyword to direct organic traffic.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-8">
            OSA engineers the off-site signals that can place your brand inside
            the autocomplete suggestions the {profile.buyer} sees while
            searching. When the branded suggestion is selected, your owned
            result leads the search and the visit arrives organically—outside
            the paid-search auction.
          </p>

          <ol className="border-border relative mt-8 border-y">
            {[
              ["01", "Buyer begins with a high-intent, unbranded search."],
              ["02", "OSA positions your brand as a suggested completion."],
              ["03", "The branded search leads to your owned organic result."],
            ].map(([number, text], index) => (
              <li
                key={number}
                className={`grid grid-cols-[34px_1fr] gap-3 py-5 text-base leading-7 ${index ? "border-border border-t border-dotted" : ""}`}
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-[#b8500c]">
                  {number}
                </span>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0">
          <div className="border-border bg-background relative min-w-0 border p-5 shadow-2xl shadow-black/[0.04] sm:p-7">
            <CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
            <CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

            <div className="border-border flex min-w-0 flex-col items-start gap-1 border-b border-dotted pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-base font-semibold">
                Illustrative autocomplete flow
              </p>
              <span className="text-muted-foreground font-mono text-[9px] tracking-[0.14em] uppercase">
                Search → Brand → Organic
              </span>
            </div>

            <div className="border-border bg-background mt-5 border">
              <div className="border-border flex min-h-12 items-center gap-3 border-b px-4">
                <Search
                  className="text-muted-foreground h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="truncate text-base">{keyword}</span>
              </div>
              <div className="p-2">
                <div className="text-muted-foreground px-3 py-2.5 text-base">
                  {keyword}
                </div>
                <div className="bg-muted flex items-center justify-between gap-4 px-3 py-3">
                  <span className="min-w-0 truncate text-base font-medium">
                    {keyword} — Your Brand
                  </span>
                  <span className="shrink-0 font-mono text-[9px] tracking-[0.12em] text-[#b8500c] uppercase">
                    OSA suggestion
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-border mt-4 grid items-stretch gap-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <div className="bg-background flex min-h-24 flex-col justify-between p-3">
                <MousePointerClick
                  className="h-4 w-4 text-[#b8500c]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-muted-foreground mt-4 text-xs leading-snug">
                  Branded suggestion selected
                </p>
              </div>
              <div className="bg-background hidden items-center px-1 sm:flex">
                <ArrowRight
                  className="text-muted-foreground h-4 w-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="bg-background flex min-h-24 flex-col justify-between p-3">
                <Search
                  className="h-4 w-4 text-[#b8500c]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-muted-foreground mt-4 text-xs leading-snug">
                  Branded results page loads
                </p>
              </div>
              <div className="bg-background hidden items-center px-1 sm:flex">
                <ArrowRight
                  className="text-muted-foreground h-4 w-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="bg-background flex min-h-24 flex-col justify-between p-3">
                <Globe2
                  className="h-4 w-4 text-[#b8500c]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-muted-foreground mt-4 text-xs leading-snug">
                  Organic visit reaches your site
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {profile.keywords.map((example, index) => (
              <button
                key={example}
                type="button"
                aria-pressed={activeKeyword === index}
                onClick={() => setActiveKeyword(index)}
                className={`focus-ring min-h-14 border px-3 py-2 text-left text-sm leading-snug transition-colors active:scale-[0.98] ${
                  activeKeyword === index
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {example}
              </button>
            ))}
          </div>

          <p className="text-muted-foreground mt-4 text-sm leading-6">
            Illustrative keyword patterns, not campaign data or guaranteed
            placements. Actual terms are selected from the market, service area,
            and verified search demand.
          </p>
        </div>
      </div>
    </section>
  );
}
