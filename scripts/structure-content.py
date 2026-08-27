from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "pages.json"
OUTPUT = ROOT / "content" / "structured-pages.json"


class Node:
    def __init__(self, tag: str = "root", attrs: dict[str, str] | None = None):
        self.tag = tag
        self.attrs = attrs or {}
        self.children: list[Node | str] = []


class TreeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = Node(tag, {key: value or "" for key, value in attrs})
        self.stack[-1].children.append(node)
        if tag not in {"br", "hr", "img", "input", "meta", "link", "source"}:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        self.stack[-1].children.append(data)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def text_content(node: Node) -> str:
    pieces: list[str] = []
    for child in node.children:
        pieces.append(child if isinstance(child, str) else text_content(child))
    return clean(" ".join(pieces))


def descendants(node: Node, tag: str) -> list[Node]:
    found: list[Node] = []
    for child in node.children:
        if not isinstance(child, Node):
            continue
        if child.tag == tag:
            found.append(child)
        found.extend(descendants(child, tag))
    return found


def token(kind: str, text: str, **extra: Any) -> dict[str, Any] | None:
    value = clean(text)
    if not value:
        return None
    return {"type": kind, "text": value, **extra}


def collect(node: Node) -> list[dict[str, Any]]:
    if node.tag in {"svg", "script", "style", "noscript", "video"}:
        return []

    if node.tag in {"h1", "h2", "h3", "h4"}:
        item = token("heading", text_content(node), level=int(node.tag[1]))
        return [item] if item else []

    if node.tag == "p":
        item = token("paragraph", text_content(node))
        return [item] if item else []

    if node.tag == "li":
        item = token("list-item", text_content(node))
        return [item] if item else []

    if node.tag in {"button", "a"}:
        item = token(
            "action",
            text_content(node),
            href=node.attrs.get("href", ""),
        )
        return [item] if item else []

    if node.tag == "label":
        item = token("label", text_content(node), htmlFor=node.attrs.get("for", ""))
        return [item] if item else []

    if node.tag in {"input", "textarea"}:
        return [
            {
                "type": "field",
                "text": node.attrs.get("placeholder", ""),
                "fieldType": node.attrs.get("type", "text"),
                "name": node.attrs.get("name", node.attrs.get("id", "")),
            }
        ]

    if node.tag == "select":
        return [
            {
                "type": "select",
                "text": "",
                "name": node.attrs.get("name", node.attrs.get("id", "")),
                "options": [text_content(option) for option in descendants(node, "option")],
            }
        ]

    if node.tag == "table":
        rows = []
        for row in descendants(node, "tr"):
            cells = [
                text_content(child)
                for child in row.children
                if isinstance(child, Node) and child.tag in {"th", "td"}
            ]
            if cells:
                rows.append(cells)
        return [{"type": "table", "text": " ".join(sum(rows, [])), "rows": rows}]

    items: list[dict[str, Any]] = []
    for child in node.children:
        if isinstance(child, str):
            item = token("text", child)
            if item:
                items.append(item)
        else:
            items.extend(collect(child))
    return items


def split_page(page: dict[str, Any]) -> dict[str, Any]:
    parser = TreeParser()
    parser.feed(page["html"])
    tokens = collect(parser.root)

    first_h2 = next(
        (
            index
            for index, item in enumerate(tokens)
            if item["type"] == "heading" and item.get("level") == 2
        ),
        len(tokens),
    )
    hero = tokens[:first_h2]
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    for item in tokens[first_h2:]:
        if item["type"] == "heading" and item.get("level") == 2:
            current = {"heading": item["text"], "blocks": []}
            sections.append(current)
        elif current is not None:
            current["blocks"].append(item)

    return {
        "title": page["title"],
        "description": page["description"],
        "kind": page["kind"],
        "source": page["source"],
        "hero": hero,
        "sections": sections,
    }


pages = json.loads(SOURCE.read_text(encoding="utf-8"))
structured = {route: split_page(page) for route, page in pages.items()}
OUTPUT.write_text(
    json.dumps(structured, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Wrote {len(structured)} structured routes to {OUTPUT}")
