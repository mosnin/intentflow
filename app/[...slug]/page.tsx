import { TemplateContentPage } from "@/components/template-content-page";
import { getPage, routeFromSlug, routes } from "@/lib/content";
import { structured } from "@/lib/structured-content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams(): { slug: string[] }[] {
  return routes
    .filter((route) => route !== "/")
    .map((route) => ({ slug: route.slice(1).split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const route = routeFromSlug((await params).slug);
  const page = getPage(route);
  if (!page) return {};

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: route },
  };
}

export default async function StaticPage({
  params,
}: PageProps): Promise<ReactNode> {
  const route = routeFromSlug((await params).slug);
  const page = structured[route];
  if (!page) notFound();

  return <TemplateContentPage page={page} />;
}
