const selector = ".mermaid-diagram .mermaid";
const sources = new WeakMap<HTMLElement, string>();
let renderQueue = Promise.resolve();
let mermaidPromise: Promise<(typeof import("mermaid"))["default"]> | undefined;

function loadMermaid() {
  return (mermaidPromise ??= import("mermaid").then(module => module.default));
}

function isDarkTheme(): boolean {
  return document.documentElement.dataset.theme === "dark";
}

async function renderDiagrams(force = false): Promise<void> {
  await document.fonts.ready;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const pendingNodes = nodes.filter(node => {
    if (!sources.has(node)) sources.set(node, node.textContent ?? "");
    if (!force && node.dataset.processed) return false;

    if (force) {
      node.textContent = sources.get(node) ?? "";
      node.removeAttribute("data-processed");
    }
    node.classList.remove("mermaid-render-error");
    return true;
  });

  if (pendingNodes.length === 0) return;

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: isDarkTheme() ? "neo-dark" : "neo",
    fontFamily: "Noto Serif SC, serif",
  });

  await mermaid.run({ nodes: pendingNodes });

  for (const node of pendingNodes) {
    const svg = node.querySelector("svg");
    svg?.setAttribute("role", "img");
    svg?.setAttribute("aria-label", "Mermaid 图表");
    svg?.setAttribute("focusable", "false");
  }
}

function queueRender(force = false): void {
  renderQueue = renderQueue
    .catch(() => undefined)
    .then(() => renderDiagrams(force))
    .catch(() => {
      document
        .querySelectorAll<HTMLElement>(`${selector}:not([data-processed])`)
        .forEach(node => node.classList.add("mermaid-render-error"));
    });
}

const themeObserver = new MutationObserver(() => queueRender(true));
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

queueRender();
document.addEventListener("astro:page-load", () => queueRender());
