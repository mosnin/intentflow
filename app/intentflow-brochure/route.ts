import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export const runtime = "nodejs";
export const revalidate = 86_400;

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const BRAND = rgb(184 / 255, 80 / 255, 12 / 255);
const INK = rgb(10 / 255, 10 / 255, 10 / 255);
const MUTED = rgb(92 / 255, 92 / 255, 92 / 255);
const RULE = rgb(225 / 255, 225 / 255, 225 / 255);

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

export async function GET(): Promise<Response> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("IntentFlow OSA — Overview");
  pdf.setAuthor("The Osinoff Group, LLC");
  pdf.setSubject("IntentFlow Organic Search Amplification overview");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const medium = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(1, 1, 1),
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 8,
    height: PAGE_HEIGHT,
    color: BRAND,
  });
  page.drawText("INTENTFLOW OSA", {
    x: MARGIN,
    y: PAGE_HEIGHT - 66,
    size: 10,
    font: medium,
    color: BRAND,
  });
  page.drawText("Engineer the search.", {
    x: MARGIN,
    y: PAGE_HEIGHT - 132,
    size: 37,
    font: serifBold,
    color: INK,
  });
  page.drawText("Own the answer.", {
    x: MARGIN,
    y: PAGE_HEIGHT - 175,
    size: 37,
    font: serifBold,
    color: INK,
  });

  const intro =
    "IntentFlow OSA is designed to move a business into the Google and Bing autocomplete moment—before the results page loads and while a high-intent buyer is still deciding what to search.";
  wrapText(intro, regular, 12, 475).forEach((line, index) => {
    page.drawText(line, {
      x: MARGIN,
      y: PAGE_HEIGHT - 220 - index * 18,
      size: 12,
      font: regular,
      color: MUTED,
    });
  });

  const processTop = PAGE_HEIGHT - 310;
  page.drawLine({
    start: { x: MARGIN, y: processTop },
    end: { x: PAGE_WIDTH - MARGIN, y: processTop },
    thickness: 1,
    color: RULE,
  });
  page.drawText("HOW THE SEARCH PATH WORKS", {
    x: MARGIN,
    y: processTop - 31,
    size: 9,
    font: medium,
    color: BRAND,
  });

  const steps = [
    {
      number: "01",
      title: "A high-intent search begins",
      body: "A buyer starts with an unbranded category need in a specific market.",
    },
    {
      number: "02",
      title: "Your brand enters the choice",
      body: "The autocomplete path is engineered to introduce your name while intent is forming.",
    },
    {
      number: "03",
      title: "The search becomes branded",
      body: "The buyer reaches owned results by searching for the business directly.",
    },
  ] as const;

  steps.forEach((step, index) => {
    const y = processTop - 82 - index * 90;
    page.drawText(step.number, {
      x: MARGIN,
      y,
      size: 11,
      font: medium,
      color: BRAND,
    });
    page.drawText(step.title, {
      x: MARGIN + 42,
      y,
      size: 13,
      font: medium,
      color: INK,
    });
    wrapText(step.body, regular, 10.5, 415).forEach((line, lineIndex) => {
      page.drawText(line, {
        x: MARGIN + 42,
        y: y - 19 - lineIndex * 14,
        size: 10.5,
        font: regular,
        color: MUTED,
      });
    });
  });

  page.drawRectangle({
    x: MARGIN,
    y: 52,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 104,
    color: rgb(248 / 255, 244 / 255, 241 / 255),
    borderColor: rgb(230 / 255, 213 / 255, 202 / 255),
    borderWidth: 1,
  });
  page.drawText("Only pay for verified clicks delivered.", {
    x: MARGIN + 22,
    y: 121,
    size: 19,
    font: serifBold,
    color: INK,
  });
  page.drawText(
    "Performance-only pricing · No payment for impressions or placements",
    {
      x: MARGIN + 22,
      y: 95,
      size: 10.5,
      font: regular,
      color: MUTED,
    }
  );
  page.drawText(
    "Book a focused 20-minute discovery call at osinoffgrp.com/discovery-call",
    {
      x: MARGIN + 22,
      y: 73,
      size: 9.5,
      font: medium,
      color: BRAND,
    }
  );

  const economics = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  economics.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(1, 1, 1),
  });
  economics.drawRectangle({
    x: 0,
    y: 0,
    width: 8,
    height: PAGE_HEIGHT,
    color: BRAND,
  });
  economics.drawText("THE ECONOMICS", {
    x: MARGIN,
    y: PAGE_HEIGHT - 66,
    size: 10,
    font: medium,
    color: BRAND,
  });
  economics.drawText("A different risk structure.", {
    x: MARGIN,
    y: PAGE_HEIGHT - 126,
    size: 32,
    font: serifBold,
    color: INK,
  });
  wrapText(
    "You set the budget and traffic goal. IntentFlow invoices for verified website clicks actually delivered, visible in your own search reporting tools.",
    regular,
    12,
    470
  ).forEach((line, index) => {
    economics.drawText(line, {
      x: MARGIN,
      y: PAGE_HEIGHT - 168 - index * 18,
      size: 12,
      font: regular,
      color: MUTED,
    });
  });

  economics.drawLine({
    start: { x: MARGIN, y: 520 },
    end: { x: PAGE_WIDTH - MARGIN, y: 520 },
    thickness: 1,
    color: RULE,
  });
  economics.drawText("$5–$6", {
    x: MARGIN,
    y: 436,
    size: 56,
    font: serif,
    color: INK,
  });
  economics.drawText("AVERAGE COST PER VERIFIED CLICK", {
    x: MARGIN,
    y: 408,
    size: 9,
    font: medium,
    color: MUTED,
  });
  economics.drawText("60–70%", {
    x: 332,
    y: 436,
    size: 56,
    font: serif,
    color: INK,
  });
  economics.drawText("LESS THAN GOOGLE ADS ON AVERAGE*", {
    x: 332,
    y: 408,
    size: 9,
    font: medium,
    color: MUTED,
  });
  economics.drawLine({
    start: { x: MARGIN, y: 366 },
    end: { x: PAGE_WIDTH - MARGIN, y: 366 },
    thickness: 1,
    color: RULE,
  });

  const verification = [
    "Google Search Console and Bing Webmaster Tools provide the client-side delivery record.",
    "The model is performance-only: verified clicks, not impressions, suggestion appearances, or a platform fee.",
    "Autocomplete and search examples are illustrative until a live campaign is measured in the client’s own accounts.",
  ];
  economics.drawText("WHAT YOU CAN VERIFY", {
    x: MARGIN,
    y: 326,
    size: 9,
    font: medium,
    color: BRAND,
  });
  verification.forEach((item, index) => {
    const y = 278 - index * 68;
    economics.drawCircle({ x: MARGIN + 4, y: y + 3, size: 3, color: BRAND });
    wrapText(item, regular, 11, 455).forEach((line, lineIndex) => {
      economics.drawText(line, {
        x: MARGIN + 20,
        y: y - lineIndex * 16,
        size: 11,
        font: regular,
        color: MUTED,
      });
    });
  });
  economics.drawText(
    "* Client-stated averages for high-ticket businesses. Actual pricing and savings vary by market, query competition, and campaign.",
    {
      x: MARGIN,
      y: 55,
      size: 8.5,
      font: regular,
      color: MUTED,
      maxWidth: PAGE_WIDTH - MARGIN * 2,
      lineHeight: 12,
    }
  );

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="IntentFlow-brochure.pdf"',
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
