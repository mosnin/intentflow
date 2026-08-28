import structuredPages from "@/content/published-pages.json";
import type { PageKind } from "@/lib/content";

export type ContentBlock = {
  type:
    | "heading"
    | "paragraph"
    | "list-item"
    | "action"
    | "label"
    | "field"
    | "select"
    | "table"
    | "text";
  text: string;
  level?: number;
  href?: string;
  htmlFor?: string;
  fieldType?: string;
  name?: string;
  options?: string[];
  rows?: string[][];
};

export type StructuredSection = {
  heading: string;
  blocks: ContentBlock[];
};

export type StructuredPage = {
  title: string;
  description: string;
  kind: PageKind;
  source: string;
  hero: ContentBlock[];
  sections: StructuredSection[];
};

export const structured = structuredPages as Record<string, StructuredPage>;
