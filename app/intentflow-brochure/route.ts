import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont,
  type PDFImage,
} from "pdf-lib";

export const runtime = "nodejs";
export const revalidate = 86_400;

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BRAND = rgb(184 / 255, 80 / 255, 12 / 255);
const BRAND_DARK = rgb(130 / 255, 52 / 255, 5 / 255);
const INK = rgb(13 / 255, 13 / 255, 13 / 255);
const MUTED = rgb(91 / 255, 91 / 255, 91 / 255);
const FAINT = rgb(248 / 255, 246 / 255, 244 / 255);
const WARM = rgb(244 / 255, 235 / 255, 229 / 255);
const RULE = rgb(222 / 255, 219 / 255, 216 / 255);
const WHITE = rgb(1, 1, 1);

type Fonts = {
  regular: PDFFont;
  medium: PDFFont;
  serif: PDFFont;
  serifBold: PDFFont;
};

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(nextLine, fontSize) <= maxWidth) {
      line = nextLine;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawParagraph(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    width: number;
    font: PDFFont;
    size?: number;
    lineHeight?: number;
    color?: ReturnType<typeof rgb>;
  }
): number {
  const size = options.size ?? 11;
  const lineHeight = options.lineHeight ?? 16;
  const lines = wrapText(text, options.font, size, options.width);

  lines.forEach((line, index) => {
    page.drawText(line, {
      x: options.x,
      y: options.y - index * lineHeight,
      size,
      font: options.font,
      color: options.color ?? MUTED,
    });
  });

  return options.y - lines.length * lineHeight;
}

function drawChrome(
  page: PDFPage,
  fonts: Fonts,
  pageNumber: number,
  section: string,
  logo?: PDFImage
): void {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: WHITE,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 7,
    height: PAGE_HEIGHT,
    color: BRAND,
  });

  if (logo) {
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE_HEIGHT - 73,
      width: 25,
      height: 25,
    });
  }
  page.drawText("IntentFlow", {
    x: logo ? MARGIN + 34 : MARGIN,
    y: PAGE_HEIGHT - 62,
    size: 12,
    font: fonts.medium,
    color: INK,
  });
  page.drawText(section.toUpperCase(), {
    x:
      PAGE_WIDTH -
      MARGIN -
      fonts.medium.widthOfTextAtSize(section.toUpperCase(), 8),
    y: PAGE_HEIGHT - 61,
    size: 8,
    font: fonts.medium,
    color: BRAND,
  });
  page.drawLine({
    start: { x: MARGIN, y: PAGE_HEIGHT - 86 },
    end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 86 },
    thickness: 0.8,
    color: RULE,
  });

  page.drawLine({
    start: { x: MARGIN, y: 38 },
    end: { x: PAGE_WIDTH - MARGIN, y: 38 },
    thickness: 0.8,
    color: RULE,
  });
  page.drawText("THE OSINOFF GROUP, LLC", {
    x: MARGIN,
    y: 22,
    size: 7.5,
    font: fonts.medium,
    color: MUTED,
  });
  const pageLabel = String(pageNumber).padStart(2, "0");
  page.drawText(pageLabel, {
    x: PAGE_WIDTH - MARGIN - fonts.medium.widthOfTextAtSize(pageLabel, 7.5),
    y: 22,
    size: 7.5,
    font: fonts.medium,
    color: BRAND,
  });
}

function drawEyebrow(
  page: PDFPage,
  text: string,
  y: number,
  fonts: Fonts
): void {
  page.drawText(text.toUpperCase(), {
    x: MARGIN,
    y,
    size: 8.5,
    font: fonts.medium,
    color: BRAND,
  });
}

function drawBullet(
  page: PDFPage,
  text: string,
  y: number,
  fonts: Fonts,
  width = CONTENT_WIDTH - 24
): number {
  page.drawCircle({ x: MARGIN + 4, y: y + 3, size: 2.6, color: BRAND });
  return drawParagraph(page, text, {
    x: MARGIN + 18,
    y,
    width,
    font: fonts.regular,
    size: 10.5,
    lineHeight: 15,
  });
}

async function embedLogo(pdf: PDFDocument): Promise<PDFImage | undefined> {
  try {
    const bytes = await readFile(
      join(process.cwd(), "public/brand/intentflow-mark-256.png")
    );
    return await pdf.embedPng(bytes);
  } catch {
    return undefined;
  }
}

export async function GET(): Promise<Response> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("IntentFlow OSA — Service Guide");
  pdf.setAuthor("The Osinoff Group, LLC");
  pdf.setSubject("IntentFlow Organic Search Amplification service guide");
  pdf.setKeywords([
    "IntentFlow",
    "Organic Search Amplification",
    "Google autocomplete",
    "Bing autocomplete",
  ]);
  pdf.setCreator("The Osinoff Group, LLC");

  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    medium: await pdf.embedFont(StandardFonts.HelveticaBold),
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
  };
  const logo = await embedLogo(pdf);

  // 01 — Cover
  const cover = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(cover, fonts, 1, "Service guide", logo);
  drawEyebrow(cover, "Organic Search Amplification", 653, fonts);
  cover.drawText("Own the most valuable", {
    x: MARGIN,
    y: 594,
    size: 35,
    font: fonts.serifBold,
    color: INK,
  });
  cover.drawText("position in search.", {
    x: MARGIN,
    y: 553,
    size: 35,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(
    cover,
    "Position your brand where customer intent forms — inside Google and Bing's autocomplete suggestions.",
    {
      x: MARGIN,
      y: 505,
      width: 455,
      font: fonts.regular,
      size: 13,
      lineHeight: 19,
    }
  );

  cover.drawRectangle({
    x: MARGIN,
    y: 218,
    width: CONTENT_WIDTH,
    height: 190,
    color: FAINT,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  cover.drawText("WHAT IT IS", {
    x: MARGIN + 24,
    y: 370,
    size: 8.5,
    font: fonts.medium,
    color: BRAND,
  });
  drawParagraph(
    cover,
    "IntentFlow OSA is a branded-demand and entity-signal engine for AI-era search. It engineers a company's brand into the Google and Bing autocomplete suggestions buyers form as they type — turning generic searches into branded ones the company's owned results lead.",
    {
      x: MARGIN + 24,
      y: 338,
      width: CONTENT_WIDTH - 48,
      font: fonts.regular,
      size: 11.5,
      lineHeight: 17,
      color: INK,
    }
  );
  cover.drawLine({
    start: { x: MARGIN + 24, y: 250 },
    end: { x: PAGE_WIDTH - MARGIN - 24, y: 250 },
    thickness: 0.8,
    color: RULE,
  });
  cover.drawText("A GUIDE TO THE AUTOCOMPLETE MOMENT", {
    x: MARGIN + 24,
    y: 232,
    size: 8,
    font: fonts.medium,
    color: MUTED,
  });

  // 02 — How it works
  const mechanism = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(mechanism, fonts, 2, "How it works", logo);
  drawEyebrow(mechanism, "The search path", 653, fonts);
  mechanism.drawText("Three steps. One outcome.", {
    x: MARGIN,
    y: 606,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(
    mechanism,
    "OSA engineers the search moment upstream — before the results page renders, before ads load, and before a competitor appears in the results.",
    {
      x: MARGIN,
      y: 568,
      width: 478,
      font: fonts.regular,
      size: 11.5,
      lineHeight: 17,
    }
  );

  const steps = [
    {
      number: "01",
      title: "Your brand enters the autocomplete dropdown",
      body: "When a high-intent buyer types a category query into Google or Bing, the brand appears as a suggested option before the results page loads.",
    },
    {
      number: "02",
      title: "The search becomes branded",
      body: "Selecting the suggestion transforms a generic search into a branded one. The buyer reaches a results page led by the business's owned and earned properties.",
    },
    {
      number: "03",
      title: "You pay when they reach your website",
      body: "The published model bills only for verified website clicks actually delivered, confirmed through the client's Google Search Console and Bing Webmaster Tools.",
    },
  ] as const;

  steps.forEach((step, index) => {
    const y = 486 - index * 96;
    mechanism.drawText(step.number, {
      x: MARGIN,
      y,
      size: 10,
      font: fonts.medium,
      color: BRAND,
    });
    mechanism.drawText(step.title, {
      x: MARGIN + 42,
      y,
      size: 12.5,
      font: fonts.medium,
      color: INK,
    });
    drawParagraph(mechanism, step.body, {
      x: MARGIN + 42,
      y: y - 20,
      width: CONTENT_WIDTH - 42,
      font: fonts.regular,
      size: 10,
      lineHeight: 14,
    });
    if (index < steps.length - 1) {
      mechanism.drawLine({
        start: { x: MARGIN + 42, y: y - 66 },
        end: { x: PAGE_WIDTH - MARGIN, y: y - 66 },
        thickness: 0.6,
        color: RULE,
      });
    }
  });

  mechanism.drawRectangle({
    x: MARGIN,
    y: 76,
    width: CONTENT_WIDTH,
    height: 145,
    color: FAINT,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  mechanism.drawText("[service] in [city]", {
    x: MARGIN + 22,
    y: 186,
    size: 12,
    font: fonts.regular,
    color: INK,
  });
  mechanism.drawLine({
    start: { x: MARGIN + 20, y: 171 },
    end: { x: PAGE_WIDTH - MARGIN - 20, y: 171 },
    thickness: 0.7,
    color: RULE,
  });
  [
    "[service] in [city]",
    "[service] in [city] [your business]",
    "best [service] near me",
  ].forEach((suggestion, index) => {
    mechanism.drawCircle({
      x: MARGIN + 25,
      y: 147 - index * 25,
      size: 3,
      borderColor: index === 1 ? BRAND : MUTED,
      borderWidth: 0.8,
    });
    mechanism.drawText(suggestion, {
      x: MARGIN + 39,
      y: 143 - index * 25,
      size: 9.5,
      font: index === 1 ? fonts.medium : fonts.regular,
      color: INK,
    });
  });
  mechanism.drawText("ILLUSTRATIVE AUTOCOMPLETE EXAMPLE — LIVE QUERIES VARY", {
    x: MARGIN,
    y: 57,
    size: 7.5,
    font: fonts.medium,
    color: MUTED,
  });

  // 03 — Economics
  const economics = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(economics, fonts, 3, "Commercial model", logo);
  drawEyebrow(economics, "Performance only", 653, fonts);
  economics.drawText("A different risk structure.", {
    x: MARGIN,
    y: 606,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(
    economics,
    "You pay for verified clicks delivered to your website. The published OSA offer places the performance risk with IntentFlow rather than billing for impressions or suggestion appearances.",
    {
      x: MARGIN,
      y: 568,
      width: 480,
      font: fonts.regular,
      size: 11.5,
      lineHeight: 17,
    }
  );

  const cardY = 378;
  const cardWidth = 244;
  [
    { x: MARGIN, amount: "$4.50", label: "LOCAL CAMPAIGNS" },
    {
      x: MARGIN + cardWidth + 20,
      amount: "$5.75",
      label: "NATIONAL CAMPAIGNS",
    },
  ].forEach((card) => {
    economics.drawRectangle({
      x: card.x,
      y: cardY,
      width: cardWidth,
      height: 126,
      color: FAINT,
      borderColor: RULE,
      borderWidth: 0.8,
    });
    economics.drawText(card.amount, {
      x: card.x + 20,
      y: cardY + 63,
      size: 39,
      font: fonts.serif,
      color: INK,
    });
    economics.drawText(card.label, {
      x: card.x + 20,
      y: cardY + 94,
      size: 8,
      font: fonts.medium,
      color: BRAND,
    });
    economics.drawText("PER VERIFIED CLICK", {
      x: card.x + 20,
      y: cardY + 35,
      size: 8,
      font: fonts.medium,
      color: MUTED,
    });
  });

  economics.drawRectangle({
    x: MARGIN,
    y: 308,
    width: CONTENT_WIDTH,
    height: 48,
    color: WARM,
  });
  economics.drawText("PUBLISHED COMPARISON", {
    x: MARGIN + 18,
    y: 337,
    size: 7.5,
    font: fonts.medium,
    color: BRAND_DARK,
  });
  economics.drawText(
    "At least 50% below Google PPC — actual savings vary by market.",
    {
      x: MARGIN + 18,
      y: 319,
      size: 10,
      font: fonts.medium,
      color: INK,
    }
  );

  economics.drawText("PUBLISHED OFFER TERMS", {
    x: MARGIN,
    y: 270,
    size: 8.5,
    font: fonts.medium,
    color: BRAND,
  });
  let termsY = 238;
  [
    "$1,500 monthly floor, then unlimited scaling to any volume.",
    "No setup fees, retainers, platform fees, or annual contracts.",
    "Clients may cancel with 30 days' notice, for any reason.",
    "Clicks are confirmed in the client's own Google Search Console and Bing Webmaster Tools.",
  ].forEach((item) => {
    termsY = drawBullet(economics, item, termsY, fonts) - 13;
  });
  economics.drawText(
    "Terms reflect the published OSA service page and should be confirmed before engagement.",
    {
      x: MARGIN,
      y: 55,
      size: 7.8,
      font: fonts.regular,
      color: MUTED,
    }
  );

  // 04 — Fit and next step
  const fit = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(fit, fonts, 4, "Fit and next step", logo);
  drawEyebrow(fit, "Before you book", 653, fonts);
  fit.drawText("Is OSA a fit?", {
    x: MARGIN,
    y: 606,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(
    fit,
    "The OSA page describes the strongest fit as a high-intent business already investing in paid search, with enough customer value and conversion capacity to support performance traffic.",
    {
      x: MARGIN,
      y: 568,
      width: 480,
      font: fonts.regular,
      size: 11.5,
      lineHeight: 17,
    }
  );

  const columnWidth = 242;
  fit.drawRectangle({
    x: MARGIN,
    y: 333,
    width: columnWidth,
    height: 175,
    color: FAINT,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  fit.drawRectangle({
    x: MARGIN + columnWidth + 24,
    y: 333,
    width: columnWidth,
    height: 175,
    color: WHITE,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  fit.drawText("STRONG FIT", {
    x: MARGIN + 18,
    y: 480,
    size: 8,
    font: fonts.medium,
    color: BRAND,
  });
  fit.drawText("NOT YET A FIT", {
    x: MARGIN + columnWidth + 42,
    y: 480,
    size: 8,
    font: fonts.medium,
    color: MUTED,
  });

  [
    "Already spending on paid search",
    "Customer value typically $1,000+",
    "Website and intake can convert demand",
    "At least $1,500 monthly capacity",
  ].forEach((item, index) => {
    fit.drawCircle({
      x: MARGIN + 22,
      y: 451 - index * 31,
      size: 2.5,
      color: BRAND,
    });
    drawParagraph(fit, item, {
      x: MARGIN + 34,
      y: 447 - index * 31,
      width: columnWidth - 48,
      font: fonts.regular,
      size: 9.2,
      lineHeight: 12,
      color: INK,
    });
  });
  [
    "Below the monthly minimum",
    "Choosing only by the cheapest click",
    "Website or sales process cannot yet handle inbound demand",
  ].forEach((item, index) => {
    fit.drawCircle({
      x: MARGIN + columnWidth + 46,
      y: 451 - index * 39,
      size: 2.5,
      color: MUTED,
    });
    drawParagraph(fit, item, {
      x: MARGIN + columnWidth + 58,
      y: 447 - index * 39,
      width: columnWidth - 52,
      font: fonts.regular,
      size: 9.2,
      lineHeight: 12,
      color: INK,
    });
  });

  fit.drawRectangle({
    x: MARGIN,
    y: 164,
    width: CONTENT_WIDTH,
    height: 134,
    color: BRAND,
  });
  fit.drawText("THE NEXT STEP", {
    x: MARGIN + 24,
    y: 265,
    size: 8,
    font: fonts.medium,
    color: WHITE,
  });
  fit.drawText("Book a focused 20-minute call.", {
    x: MARGIN + 24,
    y: 230,
    size: 22,
    font: fonts.serifBold,
    color: WHITE,
  });
  fit.drawText("osinoffgrp.com/discovery-call", {
    x: MARGIN + 24,
    y: 198,
    size: 10.5,
    font: fonts.medium,
    color: WHITE,
  });

  drawParagraph(
    fit,
    "Content integrity note: Service descriptions, pricing, and terms in this guide are drawn from osinoffgrp.com/osa and the site's contact page. The search example is illustrative, not a guaranteed placement or result. Pricing, eligibility, and performance vary by market and campaign; confirm current terms during discovery.",
    {
      x: MARGIN,
      y: 126,
      width: CONTENT_WIDTH,
      font: fonts.regular,
      size: 7.8,
      lineHeight: 11,
    }
  );

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="IntentFlow-brochure.pdf"',
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
