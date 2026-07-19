import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkMermaid } from "./src/utils/remark/mermaid";
import { transformerMermaidPreview } from "./src/utils/transformers/mermaidPreview";
import { standaloneMermaidLanguage } from "./src/utils/shiki/standaloneMermaid";
import {
  renderTwoslashMarkdown,
  renderTwoslashMarkdownInline,
} from "./src/utils/shiki/renderTwoslashMarkdown";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMermaid,
        remarkMath,
        [remarkToc, { heading: "目录" }],
        [remarkCollapse, { test: "目录", summary: "展开目录" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeKatex],
      remarkRehype: {
        footnoteLabel: "参考资料",
        footnoteLabelTagName: "h2",
        footnoteLabelProperties: {},
        footnoteBackLabel(referenceIndex: number, rereferenceIndex: number) {
          const footnoteNumber = referenceIndex + 1;

          return rereferenceIndex > 1
            ? `返回正文中的第 ${footnoteNumber} 个脚注的第 ${rereferenceIndex} 处引用`
            : `返回正文中的第 ${footnoteNumber} 个脚注引用`;
        },
      },
    }),
    shikiConfig: {
      langs: [standaloneMermaidLanguage],
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerTwoslash({
          explicitTrigger: true,
          rendererRich: {
            renderMarkdown: renderTwoslashMarkdown,
            renderMarkdownInline: renderTwoslashMarkdownInline,
            hast: {
              popupTypes: {
                tagName: "span",
                children(children) {
                  const pre = children.length === 1 ? children[0] : undefined;
                  const code =
                    pre?.type === "element" && pre.tagName === "pre"
                      ? pre.children[0]
                      : undefined;

                  return code?.type === "element" && code.tagName === "code"
                    ? code.children
                    : children;
                },
              },
              hoverToken: { properties: { tabIndex: 0 } },
              hoverPopup: { properties: { role: "tooltip" } },
              queryToken: { properties: { tabIndex: 0 } },
              queryPopup: { properties: { role: "tooltip" } },
            },
          },
        }),
        transformerFileName({ style: "v2", hideDot: false }),
        transformerMermaidPreview(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Noto Serif SC",
      cssVariable: "--font-noto-serif-sc",
      provider: fontProviders.google(),
      fallbacks: ["serif"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      UMAMI_URL: envField.string({
        access: "public",
        context: "client",
        default: "https://cloud.umami.is",
        url: true,
      }),
      UMAMI_WEBSITE_ID: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
