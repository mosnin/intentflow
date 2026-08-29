import { CutButton } from "@/components/cut-button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "IntentFlow OSA", href: "/osa" },
      { label: "IntentFlow Authority", href: "/authority" },
      { label: "Intelligent Traffic", href: "/intelligent-traffic" },
    ],
  },
  {
    title: "Industries",
    links: [
      {
        label: "Healthcare & Wellness",
        href: "/verticals/healthcare-wellness",
      },
      { label: "Home Services", href: "/verticals/home-services" },
      { label: "Hospitality", href: "/verticals/hospitality" },
      { label: "SaaS", href: "/verticals/saas" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About IntentFlow", href: "/about/intentflow" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const PANEL_CLIP =
  "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)";

function Plus({ className }: { className: string }): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute z-10 h-3.5 w-3.5 text-[#b8500c] ${className}`}
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

function FooterColumn({
  index,
  title,
  links,
  children,
}: {
  index: number;
  title: string;
  links: FooterLink[];
  children?: ReactNode;
}): ReactNode {
  const divided = index > 0;
  return (
    <div
      className={`relative md:px-8 ${divided ? "md:border-border md:border-l" : "md:pl-0"} ${
        index === 3 ? "md:pr-0" : ""
      }`}
    >
      {divided && (
        <>
          <Plus className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
          <Plus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 md:block" />
        </>
      )}

      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("/") ? (
              <Link
                href={link.href}
                className="focus-ring text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="focus-ring text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

export function Footer(): ReactNode {
  const clip = { clipPath: PANEL_CLIP } as CSSProperties;

  return (
    <footer className="mx-auto max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-10">
      <div className="bg-border p-px" style={clip}>
        <div className="bg-background p-8 sm:p-10 lg:p-14" style={clip}>
          <Logo />

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-0">
            {COLUMNS.map((col, i) => (
              <FooterColumn
                key={col.title}
                index={i}
                title={col.title}
                links={col.links}
              />
            ))}

            <FooterColumn
              index={3}
              title="Connect"
              links={[
                { label: "+1 646-279-7307", href: "tel:+16462797307" },
                {
                  label: "greg@osinoffgrp.com",
                  href: "mailto:greg@osinoffgrp.com",
                },
              ]}
            >
              <div className="mt-6 flex flex-col items-start gap-2.5">
                <CutButton variant="solid" href="/discovery-call">
                  Book a call
                </CutButton>
                <CutButton variant="outline" href="/assessment">
                  Free assessment
                </CutButton>
                <CutButton
                  variant="outline"
                  href="/intentflow-brochure"
                  download="IntentFlow-brochure.pdf"
                >
                  Download brochure
                </CutButton>
              </div>
            </FooterColumn>
          </div>

          <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 pt-6 sm:flex-row sm:items-center md:mt-14">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} The Osinoff Group, LLC. All rights
              reserved.
            </p>

            <Link
              href="/contact"
              className="focus-ring text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Talk to the people who built it.
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
