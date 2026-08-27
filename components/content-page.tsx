"use client";

import { Footer } from "@/components/footer";
import { HeroWaves } from "@/components/hero-waves";
import { Nav } from "@/components/nav";
import type { PageContent } from "@/lib/content";
import { useEffect, useRef, type ReactNode } from "react";

function revealSuccess(control: HTMLElement): void {
  const section = control.closest("section") ?? control.parentElement;
  if (!section) return;

  const success = section.querySelector<HTMLElement>(
    ".success-state, .success-panel, .form-success, #successState, #successPanel"
  );
  if (!success) return;

  const formSurface = section.querySelector<HTMLElement>(
    "form, .form-card, .booking-card, #formCard"
  );
  if (formSurface && !formSurface.contains(success)) {
    formSurface.hidden = true;
  }
  success.hidden = false;
  success.dataset.visible = "true";
  success.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function ContentPage({ page }: { page: PageContent }): ReactNode {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const submit = (event: Event): void => {
      event.preventDefault();
      revealSuccess(event.currentTarget as HTMLElement);
    };

    const forms = Array.from(root.querySelectorAll("form"));
    const buttons = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".submit-btn, .form-submit, button[type='submit']"
      )
    );
    forms.forEach((form) => form.addEventListener("submit", submit));
    buttons.forEach((button) => button.addEventListener("click", submit));

    return () => {
      forms.forEach((form) => form.removeEventListener("submit", submit));
      buttons.forEach((button) => button.removeEventListener("click", submit));
    };
  }, []);

  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="site-main">
        <div className="site-hero-field" aria-hidden="true">
          <HeroWaves />
        </div>
        <div
          ref={contentRef}
          className="site-content"
          data-page-kind={page.kind}
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </main>
      <Footer />
    </>
  );
}
