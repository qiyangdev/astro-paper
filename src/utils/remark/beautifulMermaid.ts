import { renderMermaidSVG } from "beautiful-mermaid";

type MarkdownNode = {
  type: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  children?: MarkdownNode[];
};

const googleFontsImport =
  /\s*@import url\('[^']*fonts\.googleapis\.com[^']*'\);/;

function renderDiagram(source: string) {
  return renderMermaidSVG(source, {
    bg: "var(--background)",
    fg: "var(--foreground)",
    accent: "var(--accent)",
    font: "Google Sans Code",
    transparent: true,
  })
    .replace(googleFontsImport, "")
    .replace(
      "<svg ",
      '<svg role="img" aria-label="Mermaid diagram" focusable="false" '
    );
}

function transformMermaidBlocks(
  node: MarkdownNode,
  createPreviewId: () => string
) {
  if (!node.children) return;

  node.children = node.children.flatMap(child => {
    if (child.type === "code" && child.lang === "mermaid") {
      const source = child.value ?? "";
      const previewId = createPreviewId();
      child.meta = [child.meta, `mermaid-preview="${previewId}"`]
        .filter(Boolean)
        .join(" ");

      return [
        child,
        {
          type: "html",
          value: `<figure id="${previewId}" class="mermaid-diagram"><div class="mermaid-diagram-scroll">${renderDiagram(source)}</div></figure>`,
        },
      ];
    }

    transformMermaidBlocks(child, createPreviewId);
    return child;
  });
}

export function remarkBeautifulMermaid() {
  return (tree: MarkdownNode) => {
    let previewIndex = 0;
    transformMermaidBlocks(tree, () => `mermaid-preview-${previewIndex++}`);
  };
}
