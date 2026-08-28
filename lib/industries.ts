export type IndustryProfile = {
  route: string;
  name: string;
  description: string;
  buyer: string;
  keywords: [string, string, string];
};

export const industryProfiles: IndustryProfile[] = [
  {
    route: "/verticals/home-services",
    name: "Home Services",
    description: "Direct jobs instead of shared marketplace leads.",
    buyer: "homeowner",
    keywords: [
      "HVAC repair near me",
      "roofing contractor in [city]",
      "emergency plumber near me",
    ],
  },
  {
    route: "/verticals/hospitality",
    name: "Hospitality",
    description: "Help guests reach your booking experience directly.",
    buyer: "guest",
    keywords: [
      "boutique hotel in [city]",
      "winery near me",
      "wedding venue in [city]",
    ],
  },
  {
    route: "/verticals/personal-injury-law",
    name: "Personal Injury Law",
    description: "The client searching for counsel finds your firm first.",
    buyer: "prospective client",
    keywords: [
      "personal injury lawyer near me",
      "car accident attorney in [city]",
      "injury law firm near me",
    ],
  },
  {
    route: "/verticals/healthcare-wellness",
    name: "Healthcare & Wellness",
    description: "Patients reach your practice instead of a directory.",
    buyer: "patient",
    keywords: [
      "med spa near me",
      "cosmetic dentist in [city]",
      "dermatologist near me",
    ],
  },
  {
    route: "/verticals/insurance",
    name: "Insurance",
    description: "Reach shoppers before comparison sites resell the lead.",
    buyer: "insurance shopper",
    keywords: [
      "car insurance quote near me",
      "business insurance near me",
      "commercial insurance in [city]",
    ],
  },
  {
    route: "/verticals/medical-devices",
    name: "Medical Devices",
    description: "Own category searches across long buying cycles.",
    buyer: "specifier",
    keywords: [
      "surgical device manufacturer",
      "diagnostic equipment supplier",
      "orthopedic implant company",
    ],
  },
  {
    route: "/verticals/medical-services",
    name: "Medical Services",
    description: "Patients searching for care reach your practice directly.",
    buyer: "patient",
    keywords: [
      "urgent care near me",
      "cardiologist in [city]",
      "diagnostic imaging center near me",
    ],
  },
  {
    route: "/verticals/professional-services",
    name: "Professional Services",
    description: "Owned demand in a referral-driven market.",
    buyer: "prospective client",
    keywords: [
      "accountant near me",
      "wealth manager in [city]",
      "management consultant in [city]",
    ],
  },
  {
    route: "/verticals/saas",
    name: "SaaS",
    description: "Win the category search before review sites do.",
    buyer: "software buyer",
    keywords: [
      "best [category] software",
      "[category] platform for [use case]",
      "[category] software comparison",
    ],
  },
];

export const industryProfilesByRoute = Object.fromEntries(
  industryProfiles.map((profile) => [profile.route, profile])
) as Record<string, IndustryProfile>;
