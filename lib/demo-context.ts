export type DemoContext = {
  categorySearch: string;
  searchSuggestions: [string, string, string];
  businessDescriptor: string;
  buyerIntent: string;
};

export type DemoContextResponse = {
  context: DemoContext;
  source: "openai" | "fallback";
};

const MAX_OUTPUT_LENGTH = 160;

function cleanGeneratedText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length === 0 || cleaned.length > maxLength) return null;

  return cleaned;
}

export function parseDemoContext(value: unknown): DemoContext | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;
  const categorySearch = cleanGeneratedText(candidate.categorySearch, 90);
  const businessDescriptor = cleanGeneratedText(
    candidate.businessDescriptor,
    100
  );
  const buyerIntent = cleanGeneratedText(
    candidate.buyerIntent,
    MAX_OUTPUT_LENGTH
  );
  const rawSuggestions = candidate.searchSuggestions;

  if (
    categorySearch === null ||
    businessDescriptor === null ||
    buyerIntent === null ||
    !Array.isArray(rawSuggestions) ||
    rawSuggestions.length !== 3
  ) {
    return null;
  }

  const suggestions = rawSuggestions.map((suggestion) =>
    cleanGeneratedText(suggestion, 100)
  );

  if (suggestions.some((suggestion) => suggestion === null)) return null;

  return {
    categorySearch,
    searchSuggestions: suggestions as [string, string, string],
    businessDescriptor,
    buyerIntent,
  };
}

export function createFallbackContext({
  industry,
  city,
}: {
  industry: string;
  city: string;
}): DemoContext {
  const normalizedIndustry = industry.replace(/\s+/g, " ").trim();
  const normalizedCity = city.replace(/\s+/g, " ").trim();
  const shortCity = normalizedCity.split(",")[0]?.trim() || normalizedCity;
  const categorySearch = `${normalizedIndustry} in ${shortCity}`;

  return {
    categorySearch,
    searchSuggestions: [
      categorySearch,
      `best ${normalizedIndustry.toLocaleLowerCase()} in ${shortCity}`,
      `${normalizedIndustry.toLocaleLowerCase()} near me`,
    ],
    businessDescriptor: `${normalizedIndustry} in ${normalizedCity}`,
    buyerIntent: `A local buyer is actively comparing ${normalizedIndustry.toLocaleLowerCase()} options in ${normalizedCity}.`,
  };
}
