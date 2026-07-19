import { fromHtml } from "hast-util-from-html";
import { sanitize } from "hast-util-sanitize";
import { marked } from "marked";

type RootContent = ReturnType<typeof fromHtml>["children"][number];
type ElementContent = Exclude<RootContent, { type: "comment" | "doctype" }>;

function normalizeCodeBlocks(nodes: RootContent[]): ElementContent[] {
  return nodes.flatMap((node): ElementContent[] => {
    if (node.type === "text") return [node];
    if (node.type !== "element") return [];

    if (node.tagName === "pre") {
      const code =
        node.children.length === 1 &&
        node.children[0].type === "element" &&
        node.children[0].tagName === "code"
          ? node.children[0]
          : undefined;

      return [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["twoslash-docs-code-block"] },
          children: normalizeCodeBlocks(code?.children ?? node.children),
        },
      ];
    }

    const children = normalizeCodeBlocks(node.children);

    if (node.tagName === "code" || node.tagName === "p") {
      return [
        {
          type: "element",
          tagName: "span",
          properties: {
            className: [
              node.tagName === "code"
                ? "twoslash-docs-inline-code"
                : "twoslash-docs-paragraph",
            ],
          },
          children,
        },
      ];
    }

    return [{ ...node, children }];
  });
}

function parseMarkdown(markdown: string, inline = false) {
  const html = inline
    ? marked.parseInline(markdown, { async: false })
    : marked.parse(markdown, { async: false });
  const tree = sanitize(fromHtml(html, { fragment: true }));

  return tree.type === "root" ? normalizeCodeBlocks(tree.children) : [];
}

export function renderTwoslashMarkdown(markdown: string) {
  return parseMarkdown(markdown);
}

export function renderTwoslashMarkdownInline(markdown: string) {
  return parseMarkdown(markdown, !/^\s*(?:```|~~~)/m.test(markdown));
}
