"use client";

import { AsciiPortrait } from "@/components/ascii-portrait";
import { CornerPlus, Kicker } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "1,785 high-intent clicks in 27 days. 22 OSA placements. 1,548 Google clicks. 237 Bing clicks. 70.83% peak query CTR.",
    name: "Personal Injury & Criminal Defense Law",
    role: "Multi-location law firm · Louisiana / Mississippi",
    image: "/testimonials/person-1.jpg",
  },
  {
    quote:
      "1,025 high-intent clicks in 27 days. 14 OSA placements. 701 Google clicks. 324 Bing clicks. 70.33% peak query CTR.",
    name: "HVAC Services",
    role: "Regional contractor · Corpus Christi, TX",
    image: "/testimonials/person-2.jpg",
  },
  {
    quote:
      "553 high-intent clicks in 27 days. 11 OSA placements. 174 Google clicks. 379 Bing clicks. 79.69% peak query CTR.",
    name: "Concrete & Masonry",
    role: "Specialty trades · Sydney, Australia",
    image: "/testimonials/person-3.jpg",
  },
];

export function Testimonials(): ReactNode {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const active = TESTIMONIALS[index];
  if (!active) return null;

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => (i + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="grid items-stretch gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
        <div className="flex items-center">
          <div
            style={{ "--cut": "28px" } as CSSProperties}
            className="relative aspect-[4/5] w-full overflow-hidden [clip-path:polygon(var(--cut)_0,100%_0,100%_calc(100%-var(--cut)),calc(100%-var(--cut))_100%,0_100%,0_var(--cut))]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <AsciiPortrait
                  src={active.image}
                  className="block h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative flex flex-col lg:border-l lg:border-border lg:pl-12">
          <CornerPlus className="left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
          <CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
          <Kicker>Verified performance</Kicker>

          <div className="mt-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.quote}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance font-serif text-2xl font-normal leading-[1.28] tracking-[-0.01em] sm:text-3xl lg:text-[2.25rem] lg:leading-[1.3]"
              >
                {active.quote}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <CutButton
                  variant="outline"
                  iconOnly
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </CutButton>
                <CutButton
                  variant="outline"
                  iconOnly
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CutButton>
              </div>
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2 rounded-[2px] transition-all duration-300 focus-ring ${
                      i === index
                        ? "w-5 bg-[#b8500c]"
                        : "w-2 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold tracking-tight">
                {active.name}
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {active.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
