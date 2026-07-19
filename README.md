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

## Analytics

The site uses Umami for privacy-friendly traffic and content analytics. The
tracker script defaults to the public Umami Cloud instance in
`astro.config.ts`; deployments configure it with:

- `UMAMI_URL`
- `UMAMI_WEBSITE_ID`

The production deployment sets `UMAMI_URL` to `https://umami.qiyang.dev` and
`UMAMI_WEBSITE_ID` to
`3c71eee3-8bac-4ddc-9186-d63009bb7ea7`. The website ID has no code-level
default and is shared by the tracker and online visitor counter.

The footer can also show the number of visitors active in the last five
minutes. Add a self-hosted Umami bearer token as the server-only Vercel
environment variable `UMAMI_API_TOKEN` to enable it. The `/api/online`
function derives its API endpoint from `UMAMI_URL`. The token must never use a
`PUBLIC_` prefix.

Development mode and hostnames other than the canonical site domain are not
tracked.

## License

The underlying AstroPaper code is available under the [MIT License](LICENSE).
