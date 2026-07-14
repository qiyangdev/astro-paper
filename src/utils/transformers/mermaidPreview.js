export const transformerMermaidPreview = () => ({
  name: "mermaid-preview",
  pre(node) {
    if (this.options.lang !== "mermaid") return;

    const meta = this.options.meta?.__raw;
    const previewId = meta?.match(/mermaid-preview="([^"]+)"/)?.[1];

    if (previewId) {
      node.properties.dataMermaidPreview = previewId;
      node.properties.hidden = true;
    }
  },
});
