from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "structured-pages.json"
OUTPUT = ROOT / "content" / "published-pages.json"


def block(kind: str, text: str, **extra: Any) -> dict[str, Any]:
    return {"type": kind, "text": text, **extra}


def heading(text: str, level: int = 3) -> dict[str, Any]:
    return block("heading", text, level=level)


def paragraph(text: str) -> dict[str, Any]:
    return block("paragraph", text)


def item(text: str) -> dict[str, Any]:
    return block("list-item", text)


def action(text: str, href: str) -> dict[str, Any]:
    return block("action", text, href=href)


def section(title: str, *blocks: dict[str, Any]) -> dict[str, Any]:
    return {"heading": title, "blocks": list(blocks)}


def hero(
    eyebrow: str,
    title: str,
    lead: str,
    *actions: tuple[str, str],
) -> list[dict[str, Any]]:
    blocks = [paragraph(eyebrow), heading(title, level=1), paragraph(lead)]
    blocks.extend(action(label, href) for label, href in actions)
    return blocks


HEROES: dict[str, list[dict[str, Any]]] = {
    "/": hero(
        "A Search Dominance Company",
        "Engineer the search. Own the answer.",
        "Buyers no longer search in one place. They discover, evaluate, and decide across Google, Bing, and AI answer engines. IntentFlow focuses on the moments when a search begins and when an AI-generated answer is formed.",
        ("Book a Discovery Call", "/discovery-call"),
        ("Get a free AI visibility assessment", "/assessment"),
    ),
    "/osa": hero(
        "IntentFlow OSA · Organic Search Amplification",
        "Own the most valuable position in search.",
        "IntentFlow OSA focuses on the autocomplete moment, helping turn relevant category searches into branded searches that lead to a company's owned results.",
        ("Book a Discovery Call", "/discovery-call"),
        ("Get a free AI visibility assessment", "/assessment"),
    ),
    "/authority": hero(
        "IntentFlow Authority · AI Visibility Platform",
        "Get found in AI search.",
        "IntentFlow Authority focuses on how brands appear in AI-generated answers across ChatGPT, Gemini, Perplexity, Claude, Grok, Copilot, and other answer engines.",
        ("Schedule a Strategy Call", "/discovery-call"),
        ("Get a free AI visibility assessment", "/assessment"),
    ),
    "/intelligent-traffic": hero(
        "Intelligent Traffic · OSA + Authority",
        "Two engines. One compounding loop.",
        "IntentFlow Intelligent Traffic brings autocomplete visibility and AI-answer visibility into one coordinated search strategy.",
        ("Discuss your search strategy", "/discovery-call"),
    ),
    "/case-studies": hero(
        "IntentFlow evidence library",
        "Case studies are being reviewed before publication.",
        "Quantitative campaign claims and customer quotations have been removed until their underlying evidence and publication approval are confirmed.",
        ("Talk with IntentFlow", "/contact"),
    ),
    "/discovery-call": hero(
        "Discovery Call",
        "Straight answers about whether IntentFlow fits your business.",
        "Use this conversation to discuss your market, current search strategy, and the questions you need answered before deciding whether to proceed.",
    ),
    "/assessment": hero(
        "AI Visibility Assessment",
        "See where your brand appears in search.",
        "Review how your brand appears across AI engines, traditional search, and autocomplete.",
    ),
    "/about/intentflow": hero(
        "About · The Osinoff Group",
        "Win high-intent demand without outspending incumbents.",
        "IntentFlow focuses on branded search demand and visibility across traditional search and AI-generated answers.",
    ),
    "/contact": hero(
        "Contact",
        "Talk to the people who built it.",
        "Choose the conversation that best fits your question.",
    ),
}


SAFE_TITLES = {
    "/": "IntentFlow — Engineer the search. Own the answer.",
    "/osa": "IntentFlow OSA — Organic Search Amplification",
    "/authority": "IntentFlow Authority — AI Visibility Platform",
    "/intelligent-traffic": "IntentFlow Intelligent Traffic",
    "/case-studies": "IntentFlow Evidence Library",
    "/discovery-call": "Schedule a Discovery Call — IntentFlow",
    "/assessment": "AI Visibility Assessment — IntentFlow",
    "/about/intentflow": "About IntentFlow — The Osinoff Group",
    "/contact": "Contact IntentFlow — The Osinoff Group",
}


SAFE_DESCRIPTIONS = {
    "/": "IntentFlow focuses on brand presence across Google, Bing, and AI answer engines.",
    "/osa": "IntentFlow OSA focuses on brand visibility in Google and Bing autocomplete.",
    "/authority": "IntentFlow Authority focuses on brand visibility in AI-generated answers.",
    "/intelligent-traffic": "IntentFlow Intelligent Traffic coordinates autocomplete and AI-answer visibility.",
    "/case-studies": "IntentFlow case-study evidence is being reviewed before publication.",
    "/discovery-call": "Talk with IntentFlow about your market and search visibility goals.",
    "/assessment": "Review how your brand appears across AI engines, traditional search, and autocomplete.",
    "/about/intentflow": "Learn about IntentFlow and its search-visibility services.",
    "/contact": "Contact IntentFlow and The Osinoff Group.",
}


HOME_SECTIONS = [
    section(
        "Search behavior no longer follows one path.",
        paragraph(
            "Buyers move between traditional search, recommendation platforms, and AI answer engines while they research a category and compare providers. IntentFlow treats those surfaces as parts of one search journey."
        ),
    ),
    section(
        "Two search moments.",
        heading("The autocomplete moment"),
        paragraph(
            "IntentFlow OSA focuses on how a brand appears while a search query is still being formed in Google and Bing."
        ),
        heading("The AI answer moment"),
        paragraph(
            "IntentFlow Authority focuses on how a brand is represented and cited when buyers use AI answer engines to research a category."
        ),
    ),
    section(
        "Three search disciplines. One coordinated strategy.",
        heading("Search Engine Optimization"),
        paragraph(
            "SEO addresses the pages and owned properties that appear in traditional search results."
        ),
        heading("Answer Engine Optimization"),
        paragraph(
            "AEO addresses the structured answers, snippets, and response surfaces buyers can read without following a conventional result."
        ),
        heading("Generative Engine Optimization"),
        paragraph(
            "GEO addresses how content and entities are represented in AI-generated answers and their cited sources."
        ),
    ),
    section(
        "Built around the buyer's search journey.",
        paragraph(
            "IntentFlow OSA, Authority, and Intelligent Traffic are presented as related services for autocomplete, AI-answer visibility, and coordinated search strategy."
        ),
        action("Explore IntentFlow OSA", "/osa"),
        action("Explore IntentFlow Authority", "/authority"),
    ),
    section(
        "Questions worth answering directly.",
        heading("What is IntentFlow OSA?"),
        paragraph(
            "OSA is the IntentFlow service focused on brand visibility during the autocomplete stage of a Google or Bing search."
        ),
        heading("What is IntentFlow Authority?"),
        paragraph(
            "Authority is the IntentFlow service focused on how a brand appears in AI-generated answers and citations."
        ),
        heading("What is Intelligent Traffic?"),
        paragraph(
            "Intelligent Traffic brings those search surfaces into one coordinated strategy."
        ),
    ),
]


OSA_SECTIONS = [
    section(
        "The autocomplete moment.",
        paragraph(
            "A buyer often begins with an unbranded category, service, or location query. IntentFlow OSA is designed around that early search-formation moment."
        ),
    ),
    section(
        "From a category query to an owned result.",
        heading("Discover"),
        paragraph(
            "Identify relevant ways buyers describe a need before they have chosen a provider."
        ),
        heading("Position"),
        paragraph(
            "Develop a search strategy around the autocomplete suggestions associated with those needs."
        ),
        heading("Connect"),
        paragraph(
            "Use the branded search journey to lead buyers toward the company's owned website and profiles."
        ),
    ),
    section(
        "Designed for high-intent categories.",
        paragraph(
            "OSA is presented for businesses whose customers actively search by service, category, specialty, or location. The industry pages show illustrative keyword patterns for those contexts."
        ),
        action("View industry examples", "/verticals/home-services"),
    ),
    section(
        "What the examples mean.",
        paragraph(
            "Autocomplete diagrams on this website are conceptual examples. They do not represent live placements, customer accounts, campaign totals, or guaranteed outcomes."
        ),
    ),
    section(
        "Questions buyers ask.",
        heading("Does OSA replace SEO?"),
        paragraph(
            "No. OSA focuses on the formation of a search query, while SEO focuses on the owned pages and properties that appear in traditional results."
        ),
        heading("Are the keyword examples campaign data?"),
        paragraph(
            "No. They are labeled examples showing how a category query, branded suggestion, and owned result relate to one another."
        ),
        heading("How are actual terms selected?"),
        paragraph(
            "Actual planning should begin with the business category, service area, and available search-demand evidence."
        ),
    ),
]


AUTHORITY_SECTIONS = [
    section(
        "AI answers are a separate search surface.",
        paragraph(
            "Buyers increasingly use AI assistants to research categories, compare approaches, and identify providers. Authority is the IntentFlow service focused on that answer layer."
        ),
    ),
    section(
        "A closed-loop workflow.",
        heading("Find"),
        paragraph("Review how the brand currently appears across relevant AI answers."),
        heading("Fix"),
        paragraph("Identify content, entity, and source gaps that affect that representation."),
        heading("Deploy"),
        paragraph("Apply approved changes through the brand's owned publishing workflow."),
        heading("Review"),
        paragraph("Recheck the relevant answer surfaces and document what changed."),
    ),
    section(
        "Grounded in GEO research.",
        paragraph(
            "The Authority service is informed by published Generative Engine Optimization research and by ongoing observation of answer-engine behavior."
        ),
        action("Read the GEO research", "https://arxiv.org/abs/2311.09735"),
    ),
    section(
        "What Authority examines.",
        item("Content clarity, sourcing, and answer readiness."),
        item("Entity consistency across owned and external sources."),
        item("Technical delivery and the pages available to answer engines."),
        item("How the brand appears in relevant AI-generated answers."),
    ),
    section(
        "Questions strategic buyers ask.",
        heading("Is Authority the same as traditional SEO?"),
        paragraph(
            "No. Traditional SEO focuses on ranked search results. Authority focuses on representation inside AI-generated answers and citations."
        ),
        heading("Does the site show live AI recommendations?"),
        paragraph(
            "No. Product diagrams are labeled conceptual previews and do not represent a customer's live account or a guaranteed recommendation."
        ),
        heading("Where does the research come from?"),
        paragraph(
            "The research section links directly to the published GEO paper rather than presenting uncited performance claims."
        ),
    ),
]


INTELLIGENT_SECTIONS = [
    section(
        "Why the combination matters.",
        paragraph(
            "Autocomplete and AI-generated answers appear at different points in the buyer journey. Intelligent Traffic treats them as related search surfaces rather than isolated channels."
        ),
    ),
    section(
        "Three parts, run as one.",
        heading("IntentFlow OSA"),
        paragraph("Focuses on the moment a search query is formed."),
        heading("IntentFlow Authority"),
        paragraph("Focuses on representation in AI-generated answers."),
        heading("Intelligent Traffic"),
        paragraph("Coordinates the strategy and measurement across both surfaces."),
    ),
    section(
        "Map the search journey to your market.",
        paragraph(
            "The starting point is a clear view of the category, the buyer's search language, the owned destinations, and the AI answers that shape evaluation."
        ),
        action("Discuss your market", "/discovery-call"),
    ),
]


CASE_STUDY_SECTIONS = [
    section(
        "Evidence before claims.",
        paragraph(
            "This page will publish only case studies supported by reviewable source material and approved customer permission."
        ),
        paragraph(
            "Until that review is complete, campaign totals, performance tables, and customer quotations are intentionally withheld."
        ),
        action("Discuss your market", "/discovery-call"),
    )
]


INDUSTRIES = {
    "/verticals/medical-devices": (
        "Medical Devices",
        "specifiers and buyers",
        "a manufacturer's owned website",
    ),
    "/verticals/medical-services": (
        "Medical Services",
        "patients",
        "a provider's owned website",
    ),
    "/verticals/healthcare-wellness": (
        "Healthcare & Wellness",
        "patients",
        "a practice's owned website",
    ),
    "/verticals/hospitality": (
        "Hospitality",
        "guests",
        "the property's owned website and booking experience",
    ),
    "/verticals/personal-injury-law": (
        "Personal Injury Law",
        "prospective clients",
        "the firm's owned website",
    ),
    "/verticals/insurance": (
        "Insurance",
        "people researching coverage",
        "the agency or carrier's owned website",
    ),
    "/verticals/professional-services": (
        "Professional Services",
        "prospective clients",
        "the firm's owned website",
    ),
    "/verticals/home-services": (
        "Home Services & Trades",
        "homeowners",
        "the contractor's owned website",
    ),
    "/verticals/saas": (
        "SaaS",
        "software buyers",
        "the company's owned website",
    ),
}


INDUSTRY_TITLES = {
    "/verticals/medical-devices": "Help specifiers find your brand during a long buying cycle.",
    "/verticals/medical-services": "Help patients find your practice directly.",
    "/verticals/healthcare-wellness": "Help patients find your practice directly.",
    "/verticals/hospitality": "Help guests find your property directly.",
    "/verticals/personal-injury-law": "Build visibility before a prospective client chooses a firm.",
    "/verticals/insurance": "Reach people searching for coverage.",
    "/verticals/professional-services": "Help prospective clients find your firm directly.",
    "/verticals/home-services": "Help homeowners find your business directly.",
    "/verticals/saas": "Build visibility while buyers evaluate your category.",
}


def industry_hero(route: str) -> list[dict[str, Any]]:
    label, audience, destination = INDUSTRIES[route]
    return hero(
        f"IntentFlow OSA · {label}",
        INDUSTRY_TITLES[route],
        f"Explore how an autocomplete-led search journey can connect relevant category searches from {audience} with {destination}.",
        ("Book a Discovery Call", "/discovery-call"),
    )


def industry_sections(route: str) -> list[dict[str, Any]]:
    label, audience, destination = INDUSTRIES[route]
    return [
        section(
            f"Search intent in {label}.",
            paragraph(
                f"The examples on this page show how {audience} may begin with an unbranded category or location query and move toward {destination}."
            ),
        ),
        section(
            "From category search to an owned destination.",
            heading("The buyer starts with a need"),
            paragraph("The first query describes a category, service, specialty, or location."),
            heading("The example introduces the brand"),
            paragraph(
                "The autocomplete illustration shows how a branded suggestion relates to that query."
            ),
            heading("The branded search leads to owned results"),
            paragraph(
                "The final step points toward the business's own website and profiles."
            ),
        ),
        section(
            "How to read the examples.",
            paragraph(
                "The keyword patterns are illustrative. They are not customer data, live placements, or guaranteed outcomes. Actual planning begins with the market, service area, and available search-demand evidence."
            ),
        ),
    ]


DISCOVERY_SECTIONS = [
    section(
        "What the conversation covers.",
        item("Your market and the way buyers currently search for the category."),
        item("The distinction between autocomplete visibility and AI-answer visibility."),
        item("Whether either IntentFlow service is relevant to the question you are trying to solve."),
    ),
    section(
        "Contact IntentFlow directly.",
        paragraph(
            "Use the published email address or phone number to request a conversation. No website submission is presented as complete until a real delivery system is connected."
        ),
        action(
            "Email greg@osinoffgrp.com",
            "mailto:greg@osinoffgrp.com?subject=IntentFlow%20discovery%20call",
        ),
        action("Call +1 646-279-7307", "tel:+16462797307"),
    ),
]


ASSESSMENT_SECTIONS = [
    section(
        "What the assessment reviews.",
        item("How the brand appears in relevant AI-generated answers."),
        item("The consistency of the brand and category across visible sources."),
        item("The relationship between owned pages, autocomplete, and answer-engine visibility."),
    ),
    section(
        "Request an assessment directly.",
        paragraph(
            "Email the published IntentFlow contact address with your company name and website. The website does not display a false submission confirmation."
        ),
        action(
            "Email greg@osinoffgrp.com",
            "mailto:greg@osinoffgrp.com?subject=IntentFlow%20AI%20visibility%20assessment",
        ),
    ),
]


ABOUT_SECTIONS = [
    section(
        "Why IntentFlow exists.",
        paragraph(
            "IntentFlow is built around a simple search problem: buyers now form decisions across autocomplete, traditional results, and AI-generated answers rather than through one channel alone."
        ),
    ),
    section(
        "What IntentFlow does.",
        paragraph(
            "IntentFlow OSA focuses on autocomplete visibility. IntentFlow Authority focuses on representation in AI-generated answers. Intelligent Traffic coordinates both surfaces as one search strategy."
        ),
    ),
    section(
        "Who it is designed for.",
        paragraph(
            "The services are presented for businesses in high-intent categories where buyers actively search by service, specialty, category, or location."
        ),
    ),
    section(
        "Start with the question you need answered.",
        action("Book a Discovery Call", "/discovery-call"),
        action("Request an AI Visibility Assessment", "/assessment"),
    ),
]


CONTACT_SECTIONS = [
    section(
        "Choose how to connect.",
        heading("Discuss your market"),
        paragraph(
            "Use the discovery-call page to share your category and current search priorities."
        ),
        action("Book a Discovery Call", "/discovery-call"),
        heading("Ask about AI visibility"),
        paragraph(
            "Use the assessment page to provide the brand details needed for an AI-visibility review."
        ),
        action("Request an Assessment", "/assessment"),
    )
]


PAGE_SECTIONS = {
    "/": HOME_SECTIONS,
    "/osa": OSA_SECTIONS,
    "/authority": AUTHORITY_SECTIONS,
    "/intelligent-traffic": INTELLIGENT_SECTIONS,
    "/case-studies": CASE_STUDY_SECTIONS,
    "/discovery-call": DISCOVERY_SECTIONS,
    "/assessment": ASSESSMENT_SECTIONS,
    "/about/intentflow": ABOUT_SECTIONS,
    "/contact": CONTACT_SECTIONS,
}


def publish(route: str, source_page: dict[str, Any]) -> dict[str, Any]:
    page = deepcopy(source_page)

    if route == "/privacy":
        return page

    if route == "/terms":
        for legal_section in page["sections"]:
            if legal_section["heading"].startswith("4. "):
                legal_section["blocks"] = [
                    paragraph(
                        "Content on the Site is provided for general informational purposes and does not constitute professional, legal, or financial advice. Search and AI-visibility outcomes depend on factors outside our control, including the policies and algorithms of third-party platforms such as Google, Bing, and AI answer engines. The Site does not promise or guarantee results."
                    )
                ]
                break
        return page

    if route in INDUSTRIES:
        label = INDUSTRIES[route][0]
        page["title"] = f"IntentFlow OSA for {label}"
        page["description"] = f"Explore IntentFlow OSA search examples for {label}."
        page["hero"] = industry_hero(route)
        page["sections"] = industry_sections(route)
        return page

    page["title"] = SAFE_TITLES[route]
    page["description"] = SAFE_DESCRIPTIONS[route]
    page["hero"] = HEROES[route]
    page["sections"] = PAGE_SECTIONS[route]
    return page


source = json.loads(SOURCE.read_text(encoding="utf-8"))
published = {route: publish(route, page) for route, page in source.items()}
OUTPUT.write_text(
    json.dumps(published, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Wrote {len(published)} approved routes to {OUTPUT}")
