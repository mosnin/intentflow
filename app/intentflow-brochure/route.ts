import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";

export const runtime = "nodejs";
export const revalidate = 86_400;

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BRAND = rgb(184 / 255, 80 / 255, 12 / 255);
const INK = rgb(13 / 255, 13 / 255, 13 / 255);
const MUTED = rgb(91 / 255, 91 / 255, 91 / 255);
const FAINT = rgb(248 / 255, 246 / 255, 244 / 255);
const RULE = rgb(222 / 255, 219 / 255, 216 / 255);
const WHITE = rgb(1, 1, 1);

const COPY = {
  cover: {
    eyebrow: "IntentFlow OSA",
    title: ["See the search", "moment clearly."],
    description:
      "A concise guide to the interactive website preview: what a visitor enters, what the interface demonstrates, and what the preview does not claim.",
    panelLabel: "THE PRODUCT PREVIEW",
    panelBody:
      "The IntentFlow website demonstrates a category-and-location search experience using a business name, industry, and city supplied by the visitor.",
    panelNote: "No account or sign-up is required to use the preview.",
  },
  workflow: {
    eyebrow: "Interactive preview",
    title: "From business details to a search example.",
    description:
      "The preview is a front-facing product demonstration. It turns the visitor's inputs into an animated search query and an illustrative suggestion list.",
    steps: [
      {
        label: "ENTER",
        title: "Add the business context",
        body: "Enter a business name, industry, and city. The preview uses only those details to construct the example.",
      },
      {
        label: "WATCH",
        title: "See the query take shape",
        body: "The interface types an industry-and-city query and reveals a list of search-style suggestions.",
      },
      {
        label: "REVIEW",
        title: "View the branded example",
        body: "One row combines the industry, city, and business name in the same visual style as the surrounding suggestions.",
      },
    ],
    exampleLabel: "ILLUSTRATIVE INTERFACE EXAMPLE — NOT A LIVE SEARCH RESULT",
  },
  integrity: {
    eyebrow: "Fact-first by design",
    title: "Know what to verify.",
    description:
      "The preview explains the product interface. It does not substitute for live search evidence, approved campaign records, or written commercial terms.",
    excludedLabel: "ASK FOR THIS DURING THE DEMO",
    excluded: [
      "Live query examples for the relevant industry and city",
      "A clear distinction between previews and live placements",
      "Source records for any result or performance statement",
      "Written commercial terms approved for the engagement",
      "The scope and success criteria for the proposed work",
    ],
    calloutTitle: "Evaluate the product with evidence.",
    calloutBody:
      "Use the interactive preview to understand the intended search experience. Base any decision on approved records and terms provided directly by IntentFlow.",
    cta: "Book a demo call",
    note: "This guide makes no pricing, traffic, conversion, revenue, savings, or guaranteed-outcome claims. The search interface is illustrative and is not evidence of a live result.",
  },
} as const;

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

  const sectionLabel = section.toUpperCase();
  page.drawText(sectionLabel, {
    x: PAGE_WIDTH - MARGIN - fonts.medium.widthOfTextAtSize(sectionLabel, 8),
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
  pdf.setTitle("IntentFlow OSA — Product Preview Guide");
  pdf.setAuthor("The Osinoff Group, LLC");
  pdf.setSubject("IntentFlow OSA interactive product preview guide");
  pdf.setCreator("The Osinoff Group, LLC");

  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    medium: await pdf.embedFont(StandardFonts.HelveticaBold),
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
  };
  const logo = await embedLogo(pdf);

  const cover = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(cover, fonts, 1, "Product preview guide", logo);
  drawEyebrow(cover, COPY.cover.eyebrow, 653, fonts);
  cover.drawText(COPY.cover.title[0], {
    x: MARGIN,
    y: 594,
    size: 37,
    font: fonts.serifBold,
    color: INK,
  });
  cover.drawText(COPY.cover.title[1], {
    x: MARGIN,
    y: 551,
    size: 37,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(cover, COPY.cover.description, {
    x: MARGIN,
    y: 501,
    width: 460,
    font: fonts.regular,
    size: 13,
    lineHeight: 19,
  });

  cover.drawRectangle({
    x: MARGIN,
    y: 232,
    width: CONTENT_WIDTH,
    height: 190,
    color: FAINT,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  cover.drawText(COPY.cover.panelLabel, {
    x: MARGIN + 24,
    y: 382,
    size: 8.5,
    font: fonts.medium,
    color: BRAND,
  });
  drawParagraph(cover, COPY.cover.panelBody, {
    x: MARGIN + 24,
    y: 348,
    width: CONTENT_WIDTH - 48,
    font: fonts.regular,
    size: 11.5,
    lineHeight: 17,
    color: INK,
  });
  cover.drawLine({
    start: { x: MARGIN + 24, y: 282 },
    end: { x: PAGE_WIDTH - MARGIN - 24, y: 282 },
    thickness: 0.8,
    color: RULE,
  });
  cover.drawText(COPY.cover.panelNote, {
    x: MARGIN + 24,
    y: 258,
    size: 9.5,
    font: fonts.medium,
    color: MUTED,
  });

  const workflow = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(workflow, fonts, 2, "Interactive preview", logo);
  drawEyebrow(workflow, COPY.workflow.eyebrow, 653, fonts);
  workflow.drawText("From business details", {
    x: MARGIN,
    y: 606,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  workflow.drawText("to a search example.", {
    x: MARGIN,
    y: 569,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(workflow, COPY.workflow.description, {
    x: MARGIN,
    y: 526,
    width: 480,
    font: fonts.regular,
    size: 11.5,
    lineHeight: 17,
  });

  COPY.workflow.steps.forEach((step, index) => {
    const y = 438 - index * 91;
    workflow.drawText(step.label, {
      x: MARGIN,
      y,
      size: 8.5,
      font: fonts.medium,
      color: BRAND,
    });
    workflow.drawText(step.title, {
      x: MARGIN + 68,
      y,
      size: 12.5,
      font: fonts.medium,
      color: INK,
    });
    drawParagraph(workflow, step.body, {
      x: MARGIN + 68,
      y: y - 20,
      width: CONTENT_WIDTH - 68,
      font: fonts.regular,
      size: 10,
      lineHeight: 14,
    });
    if (index < COPY.workflow.steps.length - 1) {
      workflow.drawLine({
        start: { x: MARGIN + 68, y: y - 62 },
        end: { x: PAGE_WIDTH - MARGIN, y: y - 62 },
        thickness: 0.6,
        color: RULE,
      });
    }
  });

  workflow.drawRectangle({
    x: MARGIN,
    y: 72,
    width: CONTENT_WIDTH,
    height: 122,
    color: FAINT,
    borderColor: RULE,
    borderWidth: 0.8,
  });
  workflow.drawText("[industry] [city]", {
    x: MARGIN + 24,
    y: 159,
    size: 11.5,
    font: fonts.regular,
    color: INK,
  });
  workflow.drawLine({
    start: { x: MARGIN + 22, y: 143 },
    end: { x: PAGE_WIDTH - MARGIN - 22, y: 143 },
    thickness: 0.7,
    color: RULE,
  });
  ["[industry] [city]", "[industry] [city] [business name]"].forEach(
    (suggestion, index) => {
      workflow.drawCircle({
        x: MARGIN + 27,
        y: 117 - index * 25,
        size: 3,
        borderColor: index === 1 ? BRAND : MUTED,
        borderWidth: 0.8,
      });
      workflow.drawText(suggestion, {
        x: MARGIN + 42,
        y: 113 - index * 25,
        size: 9.5,
        font: index === 1 ? fonts.medium : fonts.regular,
        color: INK,
      });
    }
  );
  workflow.drawText(COPY.workflow.exampleLabel, {
    x: MARGIN,
    y: 53,
    size: 7.5,
    font: fonts.medium,
    color: MUTED,
  });

  const integrity = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawChrome(integrity, fonts, 3, "Content integrity", logo);
  drawEyebrow(integrity, COPY.integrity.eyebrow, 653, fonts);
  integrity.drawText(COPY.integrity.title, {
    x: MARGIN,
    y: 606,
    size: 31,
    font: fonts.serifBold,
    color: INK,
  });
  drawParagraph(integrity, COPY.integrity.description, {
    x: MARGIN,
    y: 566,
    width: 482,
    font: fonts.regular,
    size: 11.5,
    lineHeight: 17,
  });

  integrity.drawText(COPY.integrity.excludedLabel, {
    x: MARGIN,
    y: 486,
    size: 8.5,
    font: fonts.medium,
    color: BRAND,
  });
  COPY.integrity.excluded.forEach((item, index) => {
    const y = 450 - index * 35;
    integrity.drawCircle({
      x: MARGIN + 4,
      y: y + 3,
      size: 2.6,
      color: BRAND,
    });
    integrity.drawText(item, {
      x: MARGIN + 18,
      y,
      size: 10.5,
      font: fonts.regular,
      color: MUTED,
    });
  });

  integrity.drawRectangle({
    x: MARGIN,
    y: 151,
    width: CONTENT_WIDTH,
    height: 126,
    color: BRAND,
  });
  integrity.drawText(COPY.integrity.calloutTitle, {
    x: MARGIN + 24,
    y: 238,
    size: 20,
    font: fonts.serifBold,
    color: WHITE,
  });
  drawParagraph(integrity, COPY.integrity.calloutBody, {
    x: MARGIN + 24,
    y: 209,
    width: CONTENT_WIDTH - 48,
    font: fonts.regular,
    size: 10,
    lineHeight: 14,
    color: WHITE,
  });
  integrity.drawText(COPY.integrity.cta, {
    x: MARGIN + 24,
    y: 170,
    size: 9.5,
    font: fonts.medium,
    color: WHITE,
  });
  drawParagraph(integrity, COPY.integrity.note, {
    x: MARGIN,
    y: 112,
    width: CONTENT_WIDTH,
    font: fonts.regular,
    size: 8,
    lineHeight: 11,
  });

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
