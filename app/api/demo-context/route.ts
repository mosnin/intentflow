import {
  createFallbackContext,
  parseDemoContext,
  type DemoContextResponse,
} from "@/lib/demo-context";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const INPUT_LIMITS = {
  businessName: 80,
  industry: 80,
  city: 80,
} as const;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 8;
const requestLog = new Map<string, number[]>();

type DemoRequest = {
  businessName: string;
  industry: string;
  city: string;
};

type OpenAIResponse = {
  categorySearch: string;
  searchSuggestions: [string, string, string];
  businessDescriptor: string;
  buyerIntent: string;
};

function cleanInput(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length < 2 || cleaned.length > maxLength) return null;

  return cleaned;
}

function parseRequest(value: unknown): DemoRequest | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;
  const businessName = cleanInput(
    candidate.businessName,
    INPUT_LIMITS.businessName
  );
  const industry = cleanInput(candidate.industry, INPUT_LIMITS.industry);
  const city = cleanInput(candidate.city, INPUT_LIMITS.city);

  if (businessName === null || industry === null || city === null) return null;

  return { businessName, industry, city };
}

function clientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "anonymous";
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const recentRequests = (requestLog.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentRequests.length >= RATE_LIMIT_REQUESTS) {
    requestLog.set(identifier, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(identifier, recentRequests);
  return false;
}

async function createOpenAIContext(
  request: DemoRequest,
  apiKey: string
): Promise<OpenAIResponse | null> {
  const openai = new OpenAI({
    apiKey,
    maxRetries: 1,
    timeout: 12_000,
  });

  const response = await openai.responses.create({
    model: process.env.OPENAI_DEMO_MODEL || "gpt-5.6-luna",
    store: false,
    max_output_tokens: 300,
    reasoning: { effort: "none" },
    instructions:
      "Create compact copy for an illustrative local-search preview. Use only the business name, industry, and city provided by the user. Normalize the industry into natural high-intent search phrasing. Never claim that the company, its services, ratings, revenue, location, credentials, availability, or market position were verified. Do not add facts, superlatives, prices, reviews, statistics, or guarantees. The buyer-intent sentence must describe the generic intent behind the search, not the business itself.",
    input: `Business name: ${request.businessName}\nIndustry: ${request.industry}\nCity: ${request.city}`,
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "intentflow_search_preview",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            categorySearch: {
              type: "string",
              description:
                "A natural unbranded high-intent local search phrase, under 90 characters.",
            },
            searchSuggestions: {
              type: "array",
              description:
                "Exactly three concise unbranded search suggestion variants.",
              minItems: 3,
              maxItems: 3,
              items: { type: "string" },
            },
            businessDescriptor: {
              type: "string",
              description:
                "A neutral descriptor made only from the supplied industry and city, under 100 characters.",
            },
            buyerIntent: {
              type: "string",
              description:
                "One generic sentence explaining the searcher's likely category intent, under 160 characters.",
            },
          },
          required: [
            "categorySearch",
            "searchSuggestions",
            "businessDescriptor",
            "buyerIntent",
          ],
        },
      },
    },
  });

  if (!response.output_text) return null;

  try {
    return parseDemoContext(JSON.parse(response.output_text));
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (isRateLimited(clientIdentifier(request))) {
    return NextResponse.json(
      { error: "Too many previews. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please provide valid business details." },
      { status: 400 }
    );
  }

  const demoRequest = parseRequest(body);
  if (demoRequest === null) {
    return NextResponse.json(
      {
        error:
          "Business name, industry, and city must each be between 2 and 80 characters.",
      },
      { status: 400 }
    );
  }

  const fallback = createFallbackContext(demoRequest);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const payload: DemoContextResponse = {
      context: fallback,
      source: "fallback",
    };
    return NextResponse.json(payload);
  }

  try {
    const context = await createOpenAIContext(demoRequest, apiKey);
    const payload: DemoContextResponse = context
      ? { context, source: "openai" }
      : { context: fallback, source: "fallback" };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(
      "OpenAI demo context generation failed:",
      error instanceof Error ? error.name : "UnknownError"
    );

    const payload: DemoContextResponse = {
      context: fallback,
      source: "fallback",
    };
    return NextResponse.json(payload);
  }
}
