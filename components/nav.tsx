"use client";

import { CutButton } from "@/components/cut-button";
import { Logo } from "@/components/logo";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const PRODUCTS = [
  { label: "IntentFlow OSA", href: "/osa", detail: "Own autocomplete" },
  {
    label: "IntentFlow Authority",
    href: "/authority",
    detail: "Earn AI citations",
  },
  {
    label: "Intelligent Traffic",
    href: "/intelligent-traffic",
    detail: "Run both as one engine",
  },
] as const;

const INDUSTRIES = [
  ["Healthcare & Wellness", "/verticals/healthcare-wellness"],
  ["Home Services", "/verticals/home-services"],
  ["Hospitality", "/verticals/hospitality"],
  ["Insurance", "/verticals/insurance"],
  ["Legal", "/verticals/personal-injury-law"],
  ["Medical Devices", "/verticals/medical-devices"],
  ["Medical Services", "/verticals/medical-services"],
  ["Professional Services", "/verticals/professional-services"],
  ["SaaS", "/verticals/saas"],
] as const;

function Dropdown({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): ReactNode {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring text-foreground/75 hover:text-foreground flex items-center gap-1 rounded px-3 py-2 text-[13px] font-medium transition-colors"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="absolute top-full left-0 pt-3">
          <div className="border-border bg-background grid min-w-64 gap-1 border p-2 shadow-2xl shadow-black/10 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = (): void => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const linkClass = (href: string): string =>
    `focus-ring rounded px-3 py-2 text-[13px] font-medium transition-colors ${
      pathname === href
        ? "text-foreground"
        : "text-foreground/75 hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "border-border/80 bg-background/95 backdrop-blur-xl"
          : "bg-background/70 border-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-7">
          <Logo />
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            <Dropdown label="Products">
              {PRODUCTS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring hover:bg-muted group grid rounded px-3 py-2.5 transition-colors"
                >
                  <span className="text-[13px] font-semibold">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {item.detail}
                  </span>
                </Link>
              ))}
            </Dropdown>
            <Dropdown label="Industries">
              <div className="grid w-[440px] grid-cols-2 gap-1">
                {INDUSTRIES.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="focus-ring hover:bg-muted rounded px-3 py-2.5 text-[13px] font-medium transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </Dropdown>
            <Link href="/case-studies" className={linkClass("/case-studies")}>
              Case studies
            </Link>
            <Link
              href="/about/intentflow"
              className={linkClass("/about/intentflow")}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <CutButton variant="outline" href="/assessment">
            Free assessment
          </CutButton>
          <CutButton variant="solid" href="/discovery-call">
            Book a call
          </CutButton>
        </div>

        <button
          type="button"
          className="focus-ring border-border flex h-10 w-10 items-center justify-center border lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="border-border bg-background h-[calc(100dvh-4rem)] overflow-y-auto border-t px-5 pt-5 pb-10 lg:hidden">
          <p className="text-muted-foreground px-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            Products
          </p>
          <div className="mt-2 grid">
            {PRODUCTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-border border-b px-2 py-3 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground mt-6 px-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            Industries
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-3">
            {INDUSTRIES.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="border-border border-b px-2 py-3 text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <Link
              href="/case-studies"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2 text-sm font-medium"
            >
              Case studies
            </Link>
            <Link
              href="/about/intentflow"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2 text-sm font-medium"
            >
              About IntentFlow
            </Link>
            <CutButton
              variant="solid"
              href="/discovery-call"
              onClick={() => setMobileOpen(false)}
              fullWidth
            >
              Book a discovery call
            </CutButton>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
