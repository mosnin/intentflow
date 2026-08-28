import bingLogo from "@lobehub/icons-static-svg/icons/bing.svg";
import claudeLogo from "@lobehub/icons-static-svg/icons/claude.svg";
import copilotLogo from "@lobehub/icons-static-svg/icons/copilot.svg";
import geminiLogo from "@lobehub/icons-static-svg/icons/gemini.svg";
import googleLogo from "@lobehub/icons-static-svg/icons/google.svg";
import grokLogo from "@lobehub/icons-static-svg/icons/grok.svg";
import openAiLogo from "@lobehub/icons-static-svg/icons/openai.svg";
import perplexityLogo from "@lobehub/icons-static-svg/icons/perplexity.svg";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type Brand = {
  name: string;
  logo: StaticImageData;
};

const BRANDS: Brand[] = [
  { name: "Google", logo: googleLogo },
  { name: "Bing", logo: bingLogo },
  { name: "ChatGPT", logo: openAiLogo },
  { name: "Gemini", logo: geminiLogo },
  { name: "Perplexity", logo: perplexityLogo },
  { name: "Claude", logo: claudeLogo },
  { name: "Grok", logo: grokLogo },
  { name: "Copilot", logo: copilotLogo },
];

function CornerPlus({ className }: { className: string }): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute h-3.5 w-3.5 text-[#b8500c] ${className}`}
    >
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrandLogo({ brand }: { brand: Brand }): ReactNode {
  return (
    <li className="text-foreground/55 hover:text-foreground flex shrink-0 items-center gap-2.5 transition-colors duration-200">
      <Image
        src={brand.logo}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        loading="eager"
        className="h-5 w-5 shrink-0 opacity-75 dark:invert"
      />
      <span className="text-[15px] font-semibold tracking-[-0.025em] whitespace-nowrap">
        {brand.name}
      </span>
    </li>
  );
}

function BrandRun({ duplicate = false }: { duplicate?: boolean }): ReactNode {
  return (
    <ul
      aria-hidden={duplicate ? "true" : undefined}
      className={`brand-marquee-copy flex w-max shrink-0 items-center gap-8 px-4 sm:gap-16 sm:px-8 ${duplicate ? "brand-marquee-copy--duplicate" : ""}`}
    >
      {BRANDS.map((brand) => (
        <BrandLogo key={brand.name} brand={brand} />
      ))}
    </ul>
  );
}

export function TrustedBy(): ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-10">
      <div className="border-border relative border">
        <CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

        <div className="flex flex-col items-stretch md:flex-row">
          <div className="border-border flex shrink-0 items-center justify-center border-b px-6 py-5 md:border-r md:border-b-0 md:py-7">
            <span className="text-muted-foreground text-xs font-medium">
              Search no longer happens in one place.
            </span>
          </div>

          <div
            className="brand-marquee flex min-w-0 flex-1 items-center overflow-hidden py-6"
            aria-label="Search and AI platforms"
          >
            <div className="brand-marquee-track flex w-max">
              <BrandRun />
              <BrandRun duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
