import { CornerPlus, Kicker } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { ArrowRight, Building2, Handshake, Network } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const PANEL_CLIP =
  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)";

const paths = [
  {
    title: "Work with us directly.",
    label: "Direct",
    body: "You're the business that wants the traffic and the AI citations. We engineer your search presence and bill on performance — straight line, no middle layer.",
    href: "/discovery-call",
    action: "Book a Discovery Call",
    icon: Building2,
  },
  {
    title: "Bring us to your clients.",
    label: "Partners & channel",
    body: "You're an agency or an expert with relationships in a vertical. White-label our engine under your brand, or refer accounts and earn ongoing fees. We make the relationship simple.",
    href: "/contact",
    action: "Talk to the people who built it",
    icon: Handshake,
  },
  {
    title: "Built for agencies and referral networks.",
    label: "Channels & Partners",
    body: "Alongside our direct clients, IntentFlow scales through partnerships. Agencies white-label our capability under their own brand. Industry experts and referral networks earn ongoing finder's fees for every introduction that closes.",
    href: "/contact",
    action: "Contact IntentFlow",
    icon: Network,
  },
] as const;

export function WorkWith(): ReactNode {
  const clip = { clipPath: PANEL_CLIP } as CSSProperties;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="relative border-y border-border py-12 sm:py-16">
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <Kicker>Who we work with</Kicker>
        <h2 className="mt-5 max-w-3xl text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          If buyers search for it, {" "}
          <span className="font-sans font-semibold tracking-tight">
            we can engineer it.
          </span>
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {paths.map((path) => (
            <div key={path.title} className="bg-border p-px" style={clip}>
              <article
                className="flex h-full flex-col bg-background p-6 sm:p-7"
                style={clip}
              >
                <div className="flex items-center justify-between gap-5">
                  <path.icon
                    className="h-5 w-5 text-[#b8500c]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {path.label}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">
                  {path.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {path.body}
                </p>
                <div className="mt-auto pt-8">
                  <CutButton href={path.href} variant="outline">
                    {path.action}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CutButton>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
