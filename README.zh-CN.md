# 启阳的博客

[English](README.md) | [**简体中文**](README.zh-CN.md)

[blog.qiyang.dev](https://blog.qiyang.dev/) 的源代码。这是一个记录软件开发、编程与技术的个人博客。

网站使用 [Astro](https://astro.build/) 构建，基于 [AstroPaper](https://github.com/satnaing/astro-paper) 开发。支持 Markdown 和 MDX 文章、代码语法高亮、Mermaid 图表、数学公式、Pagefind 搜索、RSS，以及自动生成 Open Graph 图片。

## 开发

需要 Node.js 22.12 或更高版本，以及 [pnpm](https://pnpm.io/)。

```sh
pnpm install
pnpm dev
```

本地网站地址为 `http://localhost:4321`。

## 命令

| 命令                | 说明                                  |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | 启动开发服务器                        |
| `pnpm build`        | 执行类型检查、构建并生成 Pagefind 索引 |
| `pnpm preview`      | 预览生产构建                          |
| `pnpm lint`         | 运行 ESLint                           |
| `pnpm format:check` | 检查代码格式                          |
| `pnpm format`       | 格式化项目                            |

## 内容

- 博客文章：`src/content/posts/`
- 关于页面：`src/content/pages/about.md`
- 网站设置：`astro-paper.config.ts`
- 静态资源：`public/`

## 数据分析

网站使用 Umami 进行注重隐私的流量与内容分析。跟踪脚本默认使用 `astro.config.ts` 中配置的 Umami Cloud 公共实例；部署时通过以下环境变量进行配置：

- `UMAMI_URL`
- `UMAMI_WEBSITE_ID`

生产环境通过环境变量提供这些值。网站 ID 在代码中没有默认值，由跟踪脚本和在线访客计数器共用。

页脚还可以显示最近五分钟内的在线访客数。若要启用此功能，请将自托管 Umami 的 Bearer Token 添加为仅服务端可用的 Vercel 环境变量 `UMAMI_API_TOKEN`。`/api/online` 函数会根据 `UMAMI_URL` 推导 API 端点。该 Token 的变量名绝不能带有 `PUBLIC_` 前缀。

开发模式以及非网站规范域名下的访问不会被跟踪。

## 许可证

底层 AstroPaper 代码采用 [MIT 许可证](LICENSE)。
