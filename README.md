# Qiyang's Blog

The source for [qiyang.dev](https://qiyang.dev), a personal blog about software development, programming, and technology.

The site is built with [Astro](https://astro.build/) and based on [AstroPaper](https://github.com/satnaing/astro-paper). It supports Markdown and MDX posts, syntax highlighting, Mermaid diagrams, math notation, Pagefind search, RSS, and generated Open Graph images.

## Development

Requires Node.js 22.12 or later and [pnpm](https://pnpm.io/).

```sh
pnpm install
pnpm dev
```

The local site is available at `http://localhost:4321`.

## Commands

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | Start the development server                       |
| `pnpm build`        | Type-check, build, and generate the Pagefind index |
| `pnpm preview`      | Preview the production build                       |
| `pnpm lint`         | Run ESLint                                         |
| `pnpm format:check` | Check formatting                                   |
| `pnpm format`       | Format the project                                 |

## Content

- Blog posts: `src/content/posts/`
- About page: `src/content/pages/about.md`
- Site settings: `astro-paper.config.ts`
- Static assets: `public/`

## License

The underlying AstroPaper code is available under the [MIT License](LICENSE).
