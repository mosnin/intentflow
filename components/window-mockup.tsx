import {
  ArrowRight,
  Bell,
  Bot,
  FileText,
  Gauge,
  Globe2,
  MonitorSmartphone,
  Radar,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type NavItem = { label: string; icon: LucideIcon; active?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: Gauge, active: true },
  { label: "IntentFlow OSA", icon: Radar },
  { label: "Authority", icon: MonitorSmartphone },
  { label: "Search paths", icon: Search },
  { label: "Reports", icon: FileText },
];

const SURFACES = [
  {
    icon: Search,
    title: "Autocomplete",
    detail: "Google and Bing search formation",
  },
  {
    icon: Bot,
    title: "AI answers",
    detail: "Citation and recommendation surfaces",
  },
  {
    icon: Globe2,
    title: "Owned results",
    detail: "The brand's website and profiles",
  },
] as const;

function Sidebar(): ReactNode {
  return (
    <aside className="bg-muted/20 border-border/60 hidden w-[212px] shrink-0 flex-col border-r lg:flex">
      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-4 pb-3">
        <p className="text-muted-foreground/70 px-2 pb-1.5 text-[10px] font-medium tracking-wider uppercase">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => (
          <span
            key={item.label}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
              item.active
                ? "bg-foreground/[0.06] text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            <item.icon
              className="h-[15px] w-[15px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </nav>

      <div className="border-border/60 border-t p-3">
        <div className="border-border/60 bg-background flex items-center gap-2 rounded-md border px-2.5 py-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#b8500c]" />
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium">
              Illustrative preview
            </span>
            <span className="text-muted-foreground text-[10px]">
              No campaign data shown
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}

function Topbar(): ReactNode {
  return (
    <div className="border-border/60 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          Search Journey Preview
        </h2>
        <p className="text-muted-foreground hidden text-[11px] sm:block">
          Conceptual product flow
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="border-border/60 text-muted-foreground flex h-8 items-center rounded-md border px-2.5 font-mono text-[9px] tracking-[0.12em] uppercase">
          Example only
        </span>
        <span className="border-border/60 text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md border">
          <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function JourneyStep({
  label,
  title,
  detail,
  accent = false,
}: {
  label: string;
  title: string;
  detail: string;
  accent?: boolean;
}): ReactNode {
  return (
    <div
      className={`border-border/60 min-w-0 rounded-lg border p-3.5 ${
        accent ? "bg-[#b8500c]/[0.07]" : "bg-background"
      }`}
    >
      <p className="text-muted-foreground font-mono text-[9px] tracking-[0.13em] uppercase">
        {label}
      </p>
      <p className="mt-2 truncate text-[13px] font-semibold tracking-tight">
        {title}
      </p>
      <p className="text-muted-foreground mt-1 text-[11px] leading-4">
        {detail}
      </p>
    </div>
  );
}

function JourneyPanel(): ReactNode {
  return (
    <section className="border-border/60 bg-background flex min-h-0 flex-col rounded-lg border p-4 lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight">
            Illustrative search path
          </h3>
          <p className="text-muted-foreground text-[11px]">
            A conceptual view of the OSA journey
          </p>
        </div>
        <span className="text-muted-foreground font-mono text-[9px] tracking-[0.12em] uppercase">
          Not live data
        </span>
      </div>

      <div className="border-border/60 bg-muted/25 mt-4 flex min-h-11 items-center gap-2.5 rounded-md border px-3">
        <Search
          className="text-muted-foreground h-3.5 w-3.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="text-muted-foreground text-xs">[service] near me</span>
      </div>

      <div className="mt-4 grid min-h-0 flex-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <JourneyStep
          label="Search begins"
          title="Category query"
          detail="A buyer starts with an unbranded need."
        />
        <ArrowRight
          className="text-muted-foreground hidden h-4 w-4 sm:block"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <JourneyStep
          label="OSA moment"
          title="Your Brand"
          detail="A branded suggestion appears in the example flow."
          accent
        />
        <ArrowRight
          className="text-muted-foreground hidden h-4 w-4 sm:block"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <JourneyStep
          label="Owned destination"
          title="Official website"
          detail="The branded search leads toward owned results."
        />
      </div>
    </section>
  );
}

function SurfacesPanel(): ReactNode {
  return (
    <section className="border-border/60 bg-background flex min-h-0 flex-col rounded-lg border p-4">
      <h3 className="text-[13px] font-semibold tracking-tight">
        Search surfaces
      </h3>
      <p className="text-muted-foreground text-[11px]">
        Where the strategy is designed to operate
      </p>

      <ul className="border-border/50 mt-3 flex flex-1 flex-col divide-y overflow-hidden">
        {SURFACES.map((surface) => (
          <li key={surface.title} className="flex items-start gap-3 py-3">
            <span className="border-border/60 text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-md border">
              <surface.icon
                className="h-3.5 w-3.5"
                strokeWidth={1.65}
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium">{surface.title}</span>
              <span className="text-muted-foreground mt-0.5 block text-[11px] leading-4">
                {surface.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WindowMockup(): ReactNode {
  return (
    <div className="border-border/60 bg-background mx-auto max-w-[1100px] overflow-hidden rounded-2xl border shadow-2xl shadow-black/[0.08]">
      <div className="border-border/60 relative flex h-7 items-center border-b px-2.5">
        <div className="flex items-center gap-1.5">
          <span className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
          <span className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b8500c]" />
        </div>
        <span className="text-muted-foreground pointer-events-none absolute inset-x-0 text-center text-xs font-normal">
          IntentFlow
        </span>
      </div>

      <div className="flex h-[520px]">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-3">
            <JourneyPanel />
            <SurfacesPanel />
          </main>
        </section>
      </div>
    </div>
  );
}
