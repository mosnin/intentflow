import pageContent from "@/content/pages.json";

export type PageKind =
  | "home"
  | "product"
  | "vertical"
  | "proof"
  | "conversion"
  | "company"
  | "legal";

export type PageContent = {
  title: string;
  description: string;
  kind: PageKind;
  source: string;
  html: string;
};

export const pages = pageContent as Record<string, PageContent>;
export const routes = Object.keys(pages);

export function routeFromSlug(slug: string[] | undefined): string {
  return slug?.length ? `/${slug.join("/")}` : "/";
}

export function getPage(route: string): PageContent | undefined {
  return pages[route];
}
