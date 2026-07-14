import mermaidLanguages from "@shikijs/langs/mermaid";

const mermaidLanguage = mermaidLanguages[0];

export const standaloneMermaidLanguage = {
  ...mermaidLanguage,
  scopeName: "source.mermaid",
  patterns: [{ include: "#mermaid" }],
};
