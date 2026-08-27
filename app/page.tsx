import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/content";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const page = getPage("/");

if (!page) {
  throw new Error("Home page content is missing");
}

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/" },
};

export default function HomePage(): ReactNode {
  return <ContentPage page={page!} />;
}
