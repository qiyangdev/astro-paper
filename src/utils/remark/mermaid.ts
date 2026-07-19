type MarkdownNode = {
  type: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  children?: MarkdownNode[];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

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
          value: `<figure id="${previewId}" class="mermaid-diagram"><div class="mermaid-diagram-scroll"><div class="mermaid">${escapeHtml(source)}</div></div></figure>`,
        },
      ];
    }

    transformMermaidBlocks(child, createPreviewId);
    return child;
  });
}

export function remarkMermaid() {
  return (tree: MarkdownNode) => {
    let previewIndex = 0;
    transformMermaidBlocks(tree, () => `mermaid-preview-${previewIndex++}`);
  };
}
