import { CutButton } from "@/components/cut-button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const COLUMNS = [
  {
    title: "Products",
    links: [
      ["IntentFlow OSA", "/osa"],
      ["IntentFlow Authority", "/authority"],
      ["Intelligent Traffic", "/intelligent-traffic"],
    ],
  },
  {
    title: "Industries",
    links: [
      ["Healthcare & Wellness", "/verticals/healthcare-wellness"],
      ["Home Services", "/verticals/home-services"],
      ["Hospitality", "/verticals/hospitality"],
      ["Insurance", "/verticals/insurance"],
      ["Legal", "/verticals/personal-injury-law"],
      ["Medical Devices", "/verticals/medical-devices"],
      ["Medical Services", "/verticals/medical-services"],
      ["Professional Services", "/verticals/professional-services"],
      ["SaaS", "/verticals/saas"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About IntentFlow", "/about/intentflow"],
      ["Case Studies", "/case-studies"],
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
] as const;

const PANEL_CLIP =
  "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)";

export function Footer(): ReactNode {
  const clip = { clipPath: PANEL_CLIP } as CSSProperties;

  return (
    <footer className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
      <div className="bg-border p-px" style={clip}>
        <div className="bg-background p-8 sm:p-10 lg:p-14" style={clip}>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
            <div>
              <Logo />
              <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-6">
                A search dominance company. We engineer brand presence at the
                moments that decide outcomes across every place buyers search.
              </p>
              <p className="text-muted-foreground mt-3 text-xs">
                IntentFlow is a brand of The Osinoff Group, LLC.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <CutButton variant="solid" href="/discovery-call">
                  Book a call
                </CutButton>
                <CutButton variant="outline" href="/assessment">
                  Free assessment
                </CutButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h2 className="text-sm font-semibold">{column.title}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map(([label, href]) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="text-muted-foreground hover:text-foreground focus-ring text-sm transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border mt-12 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
              © 2026 The Osinoff Group, LLC. All rights reserved.
            </p>
            <p className="text-muted-foreground">
              <a href="tel:+16462797307" className="hover:text-foreground">
                +1 646-279-7307
              </a>{" "}
              ·{" "}
              <a
                href="mailto:greg@osinoffgrp.com"
                className="hover:text-foreground"
              >
                greg@osinoffgrp.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
