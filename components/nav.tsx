"use client";

import { CutButton } from "@/components/cut-button";
import { Logo } from "@/components/logo";
import { NavVisual } from "@/components/nav-visual";
import { industryProfiles } from "@/lib/industries";
import { softEase, useReducedMotion } from "@/lib/motion";
import {
  ArrowUpRight,
  ChevronDown,
  Cloud,
  Menu,
  MonitorSmartphone,
  Radar,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type PlatformItem = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  featureTitle: string;
  featureDesc: string;
};

const PLATFORM_ITEMS: PlatformItem[] = [
  {
    title: "IntentFlow OSA",
    desc: "Own the most valuable position in search.",
    href: "/osa",
    icon: Radar,
    featureTitle: "Own the most valuable position in search.",
    featureDesc:
      "Position your brand where customer intent forms — inside Google and Bing's autocomplete suggestions.",
  },
  {
    title: "IntentFlow Authority",
    desc: "Get found in AI search.",
    href: "/authority",
    icon: MonitorSmartphone,
    featureTitle: "Get found in AI search.",
    featureDesc:
      "Get your clients found in AI search — ChatGPT, Claude, Perplexity, Gemini, Copilot, Grok, and more.",
  },
  {
    title: "Intelligent Traffic",
    desc: "Two engines. One compounding loop.",
    href: "/intelligent-traffic",
    icon: Cloud,
    featureTitle: "Two engines. One compounding loop.",
    featureDesc:
      "IntentFlow OSA and Authority engineer presence across all three layers simultaneously. One operational engine.",
  },
];

const SIMPLE_LINKS = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about/intentflow" },
];

function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function Nav(): ReactNode {
  const scrolled = useScrolled();
  const prefersReducedMotion = useReducedMotion();
  const [productsOpen, setProductsOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProducts = (): void => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIndustriesOpen(false);
    setProductsOpen(true);
  };
  const openIndustries = (): void => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(false);
    setIndustriesOpen(true);
  };
  const scheduleClose = (): void => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setProductsOpen(false);
      setIndustriesOpen(false);
    }, 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        setIndustriesOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = PLATFORM_ITEMS[activeItem] ?? PLATFORM_ITEMS[0];
  if (!active) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { duration: 0.6, ease: softEase }
      }
      className={`site-material fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || mobileOpen
          ? "border-border/70 bg-background/82 supports-[backdrop-filter]:bg-background/74 border-b shadow-[0_1px_14px_rgba(0,0,0,0.035)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Left: logo + desktop links */}
        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {/* Expandable */}
            <div
              className="relative"
              onMouseEnter={openProducts}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => {
                  setIndustriesOpen(false);
                  setProductsOpen((value) => !value);
                }}
                aria-expanded={productsOpen}
                className={`focus-ring active:bg-muted inline-flex min-h-11 items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  productsOpen
                    ? "text-accent"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-full left-3 pt-3"
                  >
                    <div className="border-border bg-background flex w-[600px] overflow-hidden rounded-md border shadow-2xl shadow-black/10">
                      <div className="flex w-[268px] flex-col gap-0.5 p-2">
                        {PLATFORM_ITEMS.map((item, i) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onMouseEnter={() => setActiveItem(i)}
                            onFocus={() => setActiveItem(i)}
                            className="focus-ring group hover:bg-muted flex items-center gap-2.5 rounded p-2 transition-colors"
                          >
                            <span className="border-border bg-background text-muted-foreground group-hover:text-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border transition-colors">
                              <item.icon
                                className="h-4 w-4"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="flex flex-col">
                              <span className="text-[13px] font-medium tracking-tight">
                                {item.title}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {item.desc}
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>

                      <div className="bg-border w-px self-stretch" />

                      <div className="flex flex-1 flex-col p-3">
                        <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded">
                          <NavVisual />
                        </div>
                        <div className="mt-3 h-16">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={active.title}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="text-[13px] font-semibold tracking-tight">
                                {active.featureTitle}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                {active.featureDesc}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={openIndustries}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => {
                  setProductsOpen(false);
                  setIndustriesOpen((value) => !value);
                }}
                aria-expanded={industriesOpen}
                className={`focus-ring active:bg-muted inline-flex min-h-11 items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  industriesOpen
                    ? "text-accent"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                Industries
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    industriesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {industriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-full left-3 pt-3"
                  >
                    <div className="border-border bg-border grid max-h-[calc(100vh-92px)] w-[660px] grid-cols-2 gap-px overflow-y-auto rounded-md border shadow-2xl shadow-black/10">
                      {industryProfiles.map((industry, index) => (
                        <a
                          key={industry.route}
                          href={industry.route}
                          className={`focus-ring group bg-background hover:bg-muted flex min-h-[74px] items-start justify-between gap-4 p-4 transition-colors ${
                            index === industryProfiles.length - 1 &&
                            industryProfiles.length % 2 === 1
                              ? "col-span-2"
                              : ""
                          }`}
                        >
                          <span className="flex min-w-0 flex-col">
                            <span className="text-[13px] font-medium tracking-tight">
                              {industry.name}
                            </span>
                            <span className="text-muted-foreground mt-1 text-xs leading-snug">
                              {industry.description}
                            </span>
                          </span>
                          <ArrowUpRight
                            className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0 transition-colors group-hover:text-[#b8500c]"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {SIMPLE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring text-foreground/80 hover:text-foreground rounded-md px-3 py-2 text-[13px] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <CutButton variant="outline" href="/assessment">
            Free assessment
          </CutButton>
          <CutButton variant="solid" href="/discovery-call">
            Book a call
          </CutButton>
        </div>

        <div className="flex items-center gap-2.5 lg:hidden">
          <CutButton variant="solid" href="/discovery-call">
            Book a call
          </CutButton>
          <CutButton
            variant="outline"
            iconOnly
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </CutButton>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="border-border/50 overflow-hidden border-t lg:hidden"
          >
            <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  setMobileIndustriesOpen(false);
                  setMobilePlatformOpen((v) => !v);
                }}
                aria-expanded={mobilePlatformOpen}
                className="focus-ring flex w-full items-center justify-between rounded-md px-2 py-3 text-sm font-medium"
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    mobilePlatformOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {mobilePlatformOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pb-2 pl-2">
                      {PLATFORM_ITEMS.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="focus-ring hover:bg-muted flex items-center gap-3 rounded-md p-2.5"
                        >
                          <span className="border-border text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
                            <item.icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {item.desc}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => {
                  setMobilePlatformOpen(false);
                  setMobileIndustriesOpen((v) => !v);
                }}
                aria-expanded={mobileIndustriesOpen}
                className="focus-ring flex w-full items-center justify-between rounded-md px-2 py-3 text-sm font-medium"
              >
                Industries
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    mobileIndustriesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {mobileIndustriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-1 pb-2 pl-2 sm:grid-cols-2">
                      {industryProfiles.map((industry) => (
                        <a
                          key={industry.route}
                          href={industry.route}
                          onClick={() => setMobileOpen(false)}
                          className="focus-ring hover:bg-muted flex items-start justify-between gap-3 rounded-md p-2.5"
                        >
                          <span className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium">
                              {industry.name}
                            </span>
                            <span className="text-muted-foreground text-xs leading-snug">
                              {industry.description}
                            </span>
                          </span>
                          <ArrowUpRight
                            className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {SIMPLE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring block rounded-md px-2 py-3 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}

              <div className="border-border/50 mt-3 border-t pt-4">
                <CutButton variant="outline" href="/assessment" fullWidth>
                  Free assessment
                </CutButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
