import { Hero } from "@/components/hero";
import { HeroWaves } from "@/components/hero-waves";
import { InteractiveDemo } from "@/components/interactive-demo";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { TemplateSections } from "@/components/template-content-page";
import { TrustedBy } from "@/components/trusted-by";
import { structured } from "@/lib/structured-content";
import { InView, MotionSection } from "@/lib/motion";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Home",
    description: `Welcome to ${siteConfig.name}. ${siteConfig.description}`,
    path: "/",
  }),
  title: { absolute: "IntentFlow — Engineer the search. Own the answer." },
};

// Plain literals (built server-side) passed as props to the client motion
// wrappers — kept inline to avoid importing values from a "use client" module.
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const RISE_IN = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function HomePage(): ReactNode {
  const homePage = structured["/"]!;

  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <div className="relative">
          <HeroWaves />
          <Hero />
          <MotionSection
            variants={RISE_IN}
            transition={{ duration: 0.85, delay: 0.55, ease: SOFT_EASE }}
            className="relative px-5 pb-24 sm:px-8 lg:px-10"
          >
            <InteractiveDemo bookingUrl={process.env.CALENDLY_URL ?? null} />
          </MotionSection>
        </div>
        <InView>
          <TrustedBy />
        </InView>
        <p className="mx-auto max-w-[1180px] px-5 font-mono text-[10px] tracking-[0.16em] text-[#b8500c] uppercase sm:px-8 lg:px-10">
          The strategic context
        </p>
        <TemplateSections sections={homePage.sections} success={undefined} />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
