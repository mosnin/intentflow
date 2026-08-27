import { routes } from "@/lib/content";
import { siteConfig } from "@/lib/metadata";
import type { MetadataRoute } from "next";

const routeDetails: Record<
  string,
  { changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }
> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/osa": { changeFrequency: "monthly", priority: 0.9 },
  "/authority": { changeFrequency: "monthly", priority: 0.9 },
  "/intelligent-traffic": { changeFrequency: "monthly", priority: 0.8 },
  "/case-studies": { changeFrequency: "monthly", priority: 0.8 },
  "/discovery-call": { changeFrequency: "monthly", priority: 0.6 },
  "/assessment": { changeFrequency: "monthly", priority: 0.6 },
  "/about/intentflow": { changeFrequency: "monthly", priority: 0.5 },
  "/contact": { changeFrequency: "yearly", priority: 0.5 },
  "/privacy": { changeFrequency: "yearly", priority: 0.3 },
  "/terms": { changeFrequency: "yearly", priority: 0.3 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const details = routeDetails[route] ?? {
      changeFrequency: "monthly" as const,
      priority: route.startsWith("/verticals/") ? 0.7 : 0.8,
    };

    return {
      url: `${siteConfig.url}${route === "/" ? "" : route}`,
      lastModified: new Date("2026-06-11"),
      ...details,
    };
  });
}
