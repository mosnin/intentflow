"use client";

import { CutButton } from "@/components/cut-button";
import type { DemoContext, DemoContextResponse } from "@/lib/demo-context";
import { useReducedMotion } from "@/lib/motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  Download,
  Gauge,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type Stage = "search" | "economics" | "booking";
type SearchPhase = "idle" | "loading" | "typing" | "revealing" | "complete";

type BusinessDetails = {
  businessName: string;
  industry: string;
  city: string;
};

type InteractiveDemoProps = {
  bookingUrl: string | null;
};

const EMPTY_DETAILS: BusinessDetails = {
  businessName: "",
  industry: "",
  city: "",
};

const APP_NAV: Array<{
  label: string;
  icon: LucideIcon;
  stage: Stage;
}> = [
  { label: "Live search", icon: Search, stage: "search" },
  { label: "Traffic outcomes", icon: BarChart3, stage: "search" },
  { label: "Performance pricing", icon: Gauge, stage: "economics" },
  { label: "Book a demo", icon: CalendarDays, stage: "booking" },
];

const OUTCOMES = [
  {
    icon: MousePointerClick,
    eyebrow: "Organic traffic",
    label: "Get more organic, high-intent clicks",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Search trust",
    label: "Build trust with Google & Bing",
  },
  {
    icon: TrendingUp,
    eyebrow: "Business impact",
    label: "Drive more revenue",
  },
] as const;

const PANEL_TRANSITION = [0.22, 1, 0.36, 1] as const;

function buildSearchKeyword({
  industry,
  city,
}: Pick<BusinessDetails, "industry" | "city">): string {
  const normalizedIndustry = industry.replace(/\s+/g, " ").trim();
  const normalizedCity = city.split(",")[0]?.replace(/\s+/g, " ").trim();

  return [normalizedIndustry, normalizedCity].filter(Boolean).join(" ");
}

function buildCalendlyEmbedUrl(bookingUrl: string | null): string | null {
  if (!bookingUrl) return null;

  try {
    const url = new URL(bookingUrl);
    const host = url.hostname.toLocaleLowerCase();
    if (host !== "calendly.com" && !host.endsWith(".calendly.com")) return null;

    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "ffffff");
    url.searchParams.set("text_color", "0a0a0a");
    url.searchParams.set("primary_color", "b8500c");
    return url.toString();
  } catch {
    return null;
  }
}

function AppSidebar({
  stage,
  searchComplete,
}: {
  stage: Stage;
  searchComplete: boolean;
}): ReactNode {
  return (
    <aside className="border-border/60 bg-muted/20 hidden w-[212px] shrink-0 flex-col border-r lg:flex">
      <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-4">
        <p className="text-muted-foreground/70 px-2 pb-1.5 text-[10px] font-medium tracking-wider uppercase">
          Demo workspace
        </p>
        {APP_NAV.map((item, index) => {
          const active =
            item.stage === stage &&
            (stage !== "search" ||
              (index === 0 && !searchComplete) ||
              (index === 1 && searchComplete));

          return (
            <span
              key={item.label}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-foreground/[0.06] text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
              {item.label}
              {index === 1 && searchComplete ? (
                <Check
                  className="ml-auto h-3.5 w-3.5 text-[#b8500c]"
                  strokeWidth={2}
                />
              ) : null}
            </span>
          );
        })}
      </nav>

      <div className="border-border/60 border-t p-3">
        <div className="border-border/60 bg-background flex items-center gap-2 rounded-md border px-2.5 py-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8500c]/35" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8500c]" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium">Interactive preview</span>
            <span className="text-muted-foreground text-[10px]">
              No sign-up required
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}

function AppTopbar({
  stage,
  onReset,
}: {
  stage: Stage;
  onReset: () => void;
}): ReactNode {
  const title =
    stage === "search"
      ? "OSA Search Preview"
      : stage === "economics"
        ? "Performance Pricing"
        : "Schedule a Demo";
  const detail =
    stage === "search"
      ? "Live autocomplete simulation"
      : stage === "economics"
        ? "Pay only for verified clicks"
        : "20-minute discovery call";

  return (
    <div className="border-border/60 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground hidden text-[11px] sm:block">
          {detail}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="border-border/60 text-muted-foreground hidden h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b8500c]" />
          Live demo
        </span>
        <button
          type="button"
          onClick={onReset}
          aria-label="Restart interactive demo"
          className="focus-ring border-border/60 text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  name,
  value,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  name: keyof BusinessDetails;
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (field: keyof BusinessDetails, value: string) => void;
}): ReactNode {
  return (
    <label className="grid gap-1.5 text-[11px] font-medium">
      {label}
      <span className="border-border/60 bg-muted/25 focus-within:border-foreground/45 flex h-10 items-center gap-2.5 rounded-md border px-3 transition-colors">
        <Icon
          className="text-muted-foreground h-3.5 w-3.5 shrink-0"
          strokeWidth={1.7}
        />
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          maxLength={80}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className="placeholder:text-muted-foreground/60 min-w-0 flex-1 bg-transparent text-xs outline-none"
        />
      </span>
    </label>
  );
}

function SetupPanel({
  details,
  phase,
  error,
  onChange,
  onSubmit,
}: {
  details: BusinessDetails;
  phase: SearchPhase;
  error: string | null;
  onChange: (field: keyof BusinessDetails, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}): ReactNode {
  const busy =
    phase === "loading" || phase === "typing" || phase === "revealing";

  return (
    <form
      onSubmit={onSubmit}
      className="border-border/60 bg-background flex flex-col rounded-lg border p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight">
            Your business
          </h3>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            Configure the live search
          </p>
        </div>
        <span className="border-border/60 text-muted-foreground flex h-7 w-7 items-center justify-center rounded-md border">
          <Building2 className="h-3.5 w-3.5" strokeWidth={1.7} />
        </span>
      </div>

      <div className="border-border/50 my-3 border-t border-dotted" />

      <div className="grid gap-3">
        <Field
          label="Business name"
          icon={Building2}
          name="businessName"
          value={details.businessName}
          placeholder="Northstar Dental"
          autoComplete="organization"
          onChange={onChange}
        />
        <Field
          label="Industry"
          icon={Sparkles}
          name="industry"
          value={details.industry}
          placeholder="Cosmetic dentistry"
          autoComplete="organization-title"
          onChange={onChange}
        />
        <Field
          label="City"
          icon={MapPin}
          name="city"
          value={details.city}
          placeholder="Austin, TX"
          autoComplete="address-level2"
          onChange={onChange}
        />
      </div>

      <div className="mt-4">
        <CutButton
          type="submit"
          fullWidth
          disabled={busy}
          className="disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Running live search…" : "Run live search"}
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </CutButton>
      </div>

      <div aria-live="polite" className="min-h-7">
        {error ? (
          <p className="mt-2 text-[11px] leading-4 text-[#b8500c]">{error}</p>
        ) : null}
      </div>
      <p className="text-muted-foreground mt-auto text-[10px] leading-4">
        Illustrative preview only. Your entries are not published or treated as
        verified business facts.
      </p>
    </form>
  );
}

function PhaseStatus({ phase }: { phase: SearchPhase }): ReactNode {
  const label =
    phase === "idle"
      ? "Waiting for details"
      : phase === "loading"
        ? "Building query"
        : phase === "typing"
          ? "Typing live"
          : phase === "revealing"
            ? "Loading suggestions"
            : "Preview complete";

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          phase === "complete" ? "bg-[#b8500c]" : "bg-muted-foreground/45"
        }`}
      />
      {label}
    </span>
  );
}

function SuggestionRow({
  primary,
  emphasis,
  order,
}: {
  primary: string;
  emphasis?: string;
  order: number;
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{
        duration: 0.38,
        delay: order * 0.04,
        ease: PANEL_TRANSITION,
      }}
      className="border-border/55 bg-background overflow-hidden border-t"
    >
      <div className="flex min-h-[41px] items-center gap-3 px-3.5 py-1">
        <span className="border-border/60 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-md border">
          <Search className="h-3.5 w-3.5" strokeWidth={1.6} />
        </span>
        <span className="text-foreground min-w-0 flex-1 text-xs leading-4 break-words">
          {primary}
          {emphasis ? (
            <>
              {" "}
              <strong className="font-semibold">{emphasis}</strong>
            </>
          ) : null}
        </span>
      </div>
    </motion.div>
  );
}

function SearchSimulation({
  phase,
  context,
  business,
  typedQuery,
  visibleRows,
}: {
  phase: SearchPhase;
  context: DemoContext | null;
  business: BusinessDetails | null;
  typedQuery: string;
  visibleRows: number;
}): ReactNode {
  const isAnimating = phase === "typing" || phase === "revealing";

  return (
    <section className="border-border/60 bg-background flex min-h-0 flex-col rounded-lg border p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight">
            Autocomplete simulation
          </h3>
          <p className="text-muted-foreground text-[11px]">
            See the search happen in real time
          </p>
        </div>
        <PhaseStatus phase={phase} />
      </div>

      <div className="border-border/50 my-3 border-t border-dotted" />

      <div className="mx-auto flex min-h-0 w-full max-w-[570px] flex-1 flex-col justify-center">
        <div className="border-border/70 overflow-hidden rounded-xl border shadow-lg shadow-black/[0.05]">
          <div className="flex h-12 items-center gap-3 px-4">
            <Search
              className="text-muted-foreground h-4 w-4 shrink-0"
              strokeWidth={1.75}
            />
            <span
              className={`min-w-0 flex-1 truncate text-sm ${
                context ? "text-foreground" : "text-muted-foreground/65"
              }`}
            >
              {context
                ? typedQuery
                : phase === "loading"
                  ? "Preparing your category search…"
                  : "Your high-intent search will type here"}
              {isAnimating ? (
                <motion.span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-4 w-px translate-y-[3px] bg-[#b8500c]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              ) : null}
            </span>
            {phase === "loading" ? (
              <motion.span
                className="h-3.5 w-3.5 rounded-full border border-[#b8500c]/25 border-t-[#b8500c]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : null}
          </div>

          <AnimatePresence initial={false}>
            {context && business && visibleRows >= 1 ? (
              <SuggestionRow
                key="base-keyword"
                primary={buildSearchKeyword(business)}
                order={0}
              />
            ) : null}
            {context && business && visibleRows >= 2 ? (
              <SuggestionRow
                key="business-keyword"
                primary={buildSearchKeyword(business)}
                emphasis={business.businessName.replace(/\s+/g, " ").trim()}
                order={1}
              />
            ) : null}
            {context
              ? context.searchSuggestions
                  .slice(1)
                  .map((suggestion, index) =>
                    visibleRows >= index + 3 ? (
                      <SuggestionRow
                        key={`${index}-${suggestion}`}
                        primary={suggestion}
                        order={index + 2}
                      />
                    ) : null
                  )
              : null}
          </AnimatePresence>

          {!context ? (
            <div className="border-border/55 text-muted-foreground border-t px-4 py-7 text-center text-[11px] leading-5">
              Enter a business name, industry, and city—then run the live
              search.
            </div>
          ) : null}
        </div>

        <AnimatePresence>
          {phase === "complete" ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="mt-3 grid gap-2 sm:grid-cols-3"
            >
              {OUTCOMES.map((outcome) => (
                <motion.div
                  key={outcome.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="border-border/60 bg-muted/15 flex min-h-[68px] flex-col justify-between rounded-lg border p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-[9px] tracking-[0.08em] uppercase">
                      {outcome.eyebrow}
                    </span>
                    <outcome.icon
                      className="h-3.5 w-3.5 text-[#b8500c]"
                      strokeWidth={1.7}
                    />
                  </div>
                  <p className="mt-2 text-[11px] leading-4 font-medium">
                    {outcome.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function SearchStage({
  details,
  submittedBusiness,
  context,
  phase,
  typedQuery,
  visibleRows,
  error,
  onChange,
  onSubmit,
  onNext,
}: {
  details: BusinessDetails;
  submittedBusiness: BusinessDetails | null;
  context: DemoContext | null;
  phase: SearchPhase;
  typedQuery: string;
  visibleRows: number;
  error: string | null;
  onChange: (field: keyof BusinessDetails, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNext: () => void;
}): ReactNode {
  return (
    <main className="grid min-h-0 flex-1 gap-3 overflow-auto p-3 sm:p-4 lg:grid-cols-[255px_1fr] lg:overflow-hidden">
      <SetupPanel
        details={details}
        phase={phase}
        error={error}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <div className="flex min-h-[460px] min-w-0 flex-col gap-3 lg:min-h-0">
        <SearchSimulation
          phase={phase}
          context={context}
          business={submittedBusiness}
          typedQuery={typedQuery}
          visibleRows={visibleRows}
        />
        <AnimatePresence>
          {phase === "complete" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex shrink-0 items-center justify-between gap-3"
            >
              <p className="text-muted-foreground hidden text-[10px] sm:block">
                Preview complete · Continue to performance pricing
              </p>
              <CutButton type="button" onClick={onNext} className="ml-auto">
                Next
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </CutButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

function EconomicsStage({
  onBack,
  onBook,
}: {
  onBack: () => void;
  onBook: () => void;
}): ReactNode {
  return (
    <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
      <section className="border-border/60 bg-background mx-auto flex min-h-full max-w-[760px] flex-col rounded-lg border p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="font-mono text-[9px] tracking-[0.13em] text-[#b8500c] uppercase">
              Performance-only model
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Only pay for the clicks we get you.
            </h3>
            <p className="text-muted-foreground mt-2 max-w-xl text-xs leading-5 sm:text-sm">
              You pay for verified, high-intent website clicks delivered to your
              business—not impressions, placements, or software access.
            </p>
          </div>
          <span className="border-border/60 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-[#b8500c]">
            <MousePointerClick className="h-4 w-4" strokeWidth={1.7} />
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="border-border/60 bg-muted/15 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px]">
                Average verified click
              </span>
              <TrendingUp
                className="text-muted-foreground h-3.5 w-3.5"
                strokeWidth={1.7}
              />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] tabular-nums">
              $5–$6
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">
              Performance-only pricing
            </p>
          </div>
          <div className="border-border/60 bg-muted/15 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px]">
                Compared with Google Ads
              </span>
              <BarChart3
                className="text-muted-foreground h-3.5 w-3.5"
                strokeWidth={1.7}
              />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] tabular-nums">
              60–70%
            </p>
            <p className="text-muted-foreground mt-1 text-[10px]">
              Cheaper for high-ticket businesses, on average
            </p>
          </div>
        </div>

        <div className="border-border/60 mt-3 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#b8500c]/10 text-[#b8500c]">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-xs font-semibold">
                Every billed click is verifiable.
              </span>
              <span className="text-muted-foreground mt-1 block text-[11px] leading-5">
                Confirm delivery in your own Google Search Console or Bing
                Webmaster Tools—the same record the IntentFlow team sees.
              </span>
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mt-3 text-[10px] leading-4">
          Actual pricing and savings vary by market, query competition, and
          campaign. These are stated averages, not guaranteed results.
        </p>

        <div className="mt-auto flex flex-col-reverse items-stretch justify-between gap-3 pt-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className="focus-ring text-muted-foreground hover:text-foreground flex h-10 items-center justify-center gap-2 px-2 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.7} />
            Back to live search
          </button>
          <CutButton type="button" onClick={onBook}>
            Book a demo call
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </CutButton>
        </div>
      </section>
    </main>
  );
}

function BookingStage({
  embedUrl,
  onBack,
}: {
  embedUrl: string | null;
  onBack: () => void;
}): ReactNode {
  return (
    <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
      <section className="border-border/60 bg-background flex min-h-full flex-col overflow-hidden rounded-lg border">
        <div className="border-border/60 flex flex-col justify-between gap-3 border-b px-4 py-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[13px] font-semibold tracking-tight">
              Choose a time that works
            </h3>
            <p className="text-muted-foreground text-[11px]">
              A focused 20-minute conversation about your market and search
              costs.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="focus-ring text-muted-foreground hover:text-foreground flex h-8 w-fit items-center gap-2 text-[11px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.7} />
            Back to pricing
          </button>
        </div>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Book an IntentFlow discovery call"
            loading="lazy"
            className="min-h-[650px] flex-1 border-0 lg:min-h-0"
          />
        ) : (
          <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center px-6 py-10 text-center lg:min-h-0 lg:py-6">
            <span className="border-border/60 flex h-12 w-12 items-center justify-center rounded-lg border text-[#b8500c]">
              <CalendarDays className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <h4 className="mt-4 text-lg font-semibold tracking-tight">
              Live calendar connection pending
            </h4>
            <p className="text-muted-foreground mt-2 max-w-md text-xs leading-5">
              The current public Calendly event is not active. Contact the
              strategy team directly to arrange the 20-minute demo.
            </p>
            <div className="mt-5">
              <CutButton href="mailto:greg@osinoffgrp.com?subject=IntentFlow%20Demo%20Call">
                Email the strategy team
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </CutButton>
            </div>
          </div>
        )}

        <div className="border-border/60 flex flex-col items-start justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-[10px]">
            No commitment · 20 minutes · A direct read on fit
          </p>
          <a
            href="/intentflow-brochure"
            download="IntentFlow-brochure.pdf"
            className="focus-ring border-border/60 hover:bg-muted flex h-9 items-center gap-2 rounded-md border px-3 text-[11px] font-medium transition-colors"
          >
            <Download
              className="h-3.5 w-3.5 text-[#b8500c]"
              strokeWidth={1.7}
            />
            Download brochure
          </a>
        </div>
      </section>
    </main>
  );
}

export function InteractiveDemo({
  bookingUrl,
}: InteractiveDemoProps): ReactNode {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("search");
  const [phase, setPhase] = useState<SearchPhase>("idle");
  const [details, setDetails] = useState<BusinessDetails>(EMPTY_DETAILS);
  const [submittedBusiness, setSubmittedBusiness] =
    useState<BusinessDetails | null>(null);
  const [context, setContext] = useState<DemoContext | null>(null);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [visibleRows, setVisibleRows] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const demoRef = useRef<HTMLElement>(null);
  const previousStageRef = useRef<Stage>(stage);
  const embedUrl = useMemo(
    () => buildCalendlyEmbedUrl(bookingUrl),
    [bookingUrl]
  );
  const searchKeyword = submittedBusiness
    ? buildSearchKeyword(submittedBusiness)
    : "";
  const typedQuery = context
    ? Array.from(searchKeyword).slice(0, typedCharacters).join("")
    : "";

  useEffect(() => {
    if (!context || (phase !== "typing" && phase !== "revealing")) return;

    if (reduceMotion) return;

    if (phase === "typing") {
      const length = Array.from(searchKeyword).length;
      const timer = window.setTimeout(
        () => {
          if (typedCharacters < length) {
            setTypedCharacters((value) => value + 1);
          } else {
            setPhase("revealing");
          }
        },
        typedCharacters < length ? 42 : 180
      );
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(
      () => {
        if (visibleRows < 4) {
          setVisibleRows((value) => value + 1);
        } else {
          setPhase("complete");
        }
      },
      visibleRows < 4 ? 210 : 180
    );
    return () => window.clearTimeout(timer);
  }, [
    context,
    phase,
    reduceMotion,
    searchKeyword,
    typedCharacters,
    visibleRows,
  ]);

  useEffect(() => {
    if (previousStageRef.current === stage) return;
    previousStageRef.current = stage;
    const frame = window.requestAnimationFrame(() => {
      demoRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion, stage]);

  function resetDemo(): void {
    setStage("search");
    setPhase("idle");
    setDetails(EMPTY_DETAILS);
    setSubmittedBusiness(null);
    setContext(null);
    setTypedCharacters(0);
    setVisibleRows(0);
    setError(null);
  }

  function updateDetails(field: keyof BusinessDetails, value: string): void {
    setDetails((current) => ({ ...current, [field]: value }));
    setError(null);
  }

  async function runSearch(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPhase("loading");
    setTypedCharacters(0);
    setVisibleRows(0);
    setError(null);

    try {
      const response = await fetch("/api/demo-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const payload = (await response.json()) as
        DemoContextResponse | { error?: string };

      if (!response.ok || !("context" in payload)) {
        throw new Error(
          "error" in payload && payload.error
            ? payload.error
            : "The live search could not start. Please try again."
        );
      }

      setSubmittedBusiness({ ...details });
      setContext(payload.context);
      if (reduceMotion) {
        setTypedCharacters(Array.from(buildSearchKeyword(details)).length);
        setVisibleRows(4);
        setPhase("complete");
      } else {
        setPhase("typing");
      }
    } catch (caughtError) {
      setPhase("idle");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The live search could not start. Please try again."
      );
    }
  }

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.46, ease: PANEL_TRANSITION };

  return (
    <section
      ref={demoRef}
      aria-label="Interactive IntentFlow product demo"
      data-testid="interactive-demo"
      className="border-border/60 bg-background mx-auto max-w-[1100px] scroll-mt-20 overflow-hidden rounded-2xl border shadow-2xl shadow-black/[0.08]"
    >
      <div className="border-border/60 relative flex h-7 items-center border-b px-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-muted-foreground pointer-events-none absolute inset-x-0 text-center text-xs">
          IntentFlow OSA
        </span>
      </div>

      <div className="flex min-h-[760px] lg:h-[560px] lg:min-h-0">
        <AppSidebar stage={stage} searchComplete={phase === "complete"} />
        <section className="flex min-w-0 flex-1 flex-col">
          <AppTopbar stage={stage} onReset={resetDemo} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={transition}
              className="flex min-h-0 flex-1 flex-col"
            >
              {stage === "search" ? (
                <SearchStage
                  details={details}
                  submittedBusiness={submittedBusiness}
                  context={context}
                  phase={phase}
                  typedQuery={typedQuery}
                  visibleRows={visibleRows}
                  error={error}
                  onChange={updateDetails}
                  onSubmit={runSearch}
                  onNext={() => setStage("economics")}
                />
              ) : stage === "economics" ? (
                <EconomicsStage
                  onBack={() => setStage("search")}
                  onBook={() => setStage("booking")}
                />
              ) : (
                <BookingStage
                  embedUrl={embedUrl}
                  onBack={() => setStage("economics")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </section>
  );
}
