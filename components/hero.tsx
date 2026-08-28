"use client";

import { CutButton } from "@/components/cut-button";
import {
  fadeInUp,
  reducedMotionVariants,
  softEase,
  useReducedMotion,
} from "@/lib/motion";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

export function Hero(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp;
  const itemTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.7, ease: softEase };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% -5%, color-mix(in srgb, var(--foreground) 5%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex max-w-2xl flex-col items-center pt-32 pb-12 text-center sm:pt-40"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-[1] h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 45%, transparent 72%)",
            }}
          />

          <motion.p
            variants={item}
            transition={itemTransition}
            className="mb-5 font-mono text-[11px] font-medium tracking-[0.14em] text-[#b8500c] uppercase"
          >
            A Search Dominance Company
          </motion.p>

          <motion.h1
            variants={item}
            transition={itemTransition}
            className="font-serif text-[2.6rem] leading-[1.04] font-normal tracking-[-0.025em] text-balance sm:text-5xl lg:text-[3.75rem]"
          >
            Engineer the search.{" "}
            <span className="font-sans font-medium tracking-tight">
              Own the answer.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            transition={itemTransition}
            className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 text-balance sm:text-[1.05rem] sm:leading-8"
          >
            Buyers no longer search in one place. They discover, evaluate, and
            decide across Google, Bing, and AI answer engines — ChatGPT, Gemini,
            Perplexity, Claude, Grok, Copilot. IntentFlow focuses on the moments
            when a search begins and when an AI-generated answer is formed.
          </motion.p>

          <motion.div
            variants={item}
            transition={itemTransition}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <CutButton variant="solid" href="/discovery-call">
              Book a Discovery Call
            </CutButton>
            <CutButton variant="outline" href="/assessment">
              Get a free AI visibility assessment
            </CutButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
