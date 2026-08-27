import type { Metadata } from "next";

const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.osinoffgrp.com";

export const siteConfig = {
  name: "IntentFlow",
  description:
    "IntentFlow is a search dominance company. We engineer brand presence at the moments that decide outcomes across Google, Bing, and AI answer engines.",
  url: deploymentUrl,
  ogImage: "/brand/intentflow-social.png",
  creator: "The Osinoff Group, LLC",
  authors: [
    {
      name: "The Osinoff Group, LLC",
      url: "https://www.osinoffgrp.com/about/intentflow",
    },
  ],
  keywords: [
    "IntentFlow",
    "search dominance",
    "organic search amplification",
    "AI visibility",
    "generative engine optimization",
    "answer engine optimization",
    "autocomplete marketing",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "IntentFlow — Engineer the search. Own the answer.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

export function createMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      url: `${siteConfig.url}${path}`,
      images: [siteConfig.ogImage],
    },
    twitter: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      images: [siteConfig.ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
