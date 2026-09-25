# Starlit Blog Template

Vue 3 + Vite 静态博客模板。内容使用 GitHub 仓库中的 Markdown 和 JSON 管理，图片和视频既可以提交到 GitHub，也可以填写 R2、CDN 等完整外链。

## 特性

- Vue 3 + TypeScript + Vite 静态 SPA
- GitHub 内容驱动：Markdown 文章、JSON 说说、友链、相册、背景、轮播和藏宝阁
- Decap CMS 内容管理入口：`/admin/`
- 图片支持 GitHub 仓库上传，也支持外部 CDN/R2 URL
- WebGL 液态玻璃效果，CSS 毛玻璃 fallback
- 本地分页、文章归档、Markdown 代码高亮
- 自习室数据使用 localStorage
- 不依赖 Python、FastAPI、SQLite、JWT 或运行时后端
- 已移除 EPUB 阅读器和所有后端服务

## 仓库目录结构

当前目录就是新仓库根目录，不再保留外层 `blog-frontend/` 文件夹：

```text
Nebula-no-server-test2/
├── src/
├── public/
├── .github/workflows/deploy.yml
├── package.json
├── pnpm-lock.yaml
└── README.md
```

推荐部署：Netlify。详细步骤见 `DEPLOY_NETLIFY.md`；它可以为 Decap CMS 提供 GitHub OAuth，不需要单独部署 Worker。

内容目录位于 `src/content/`：

```text
src/content/
├── posts/*.md
├── gallery/*.md
├── moments.json
├── albums.json
├── friends.json
├── profile.json
├── backgrounds.json
├── carousel.json
├── treasures.json
├── books.json
└── about.md
```

文章示例：

```markdown
---
title: 示例文章
published: 2026-09-25
description: 文章摘要
category: 技术
tags: [Vue, TypeScript]
cover: /assets/images/cover.webp
draft: false
pinned: false
---

文章正文。
```

## 图片和视频

小型资源可以通过 Decap CMS 上传到：

```text
public/assets/images/
```

在内容中引用：

```text
/assets/images/example.webp
```

大图和视频可以存放在 R2、对象存储或 CDN，内容中直接填写完整 URL：

```text
https://cdn.example.com/backgrounds/night.webm
```

不要把 GitHub Token 放入前端。Decap CMS 的 GitHub OAuth 配置需要根据实际仓库和域名填写 `public/admin/config.yml`。

## 本地运行

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm type-check
pnpm build
pnpm test:unit
pnpm format
```

构建产物位于 `dist/`，可部署到 GitHub Pages、Cloudflare Pages、Netlify 或 Vercel。静态部署需要为 HTML5 History 路由配置 SPA fallback。

## CMS

访问：

```text
/admin/
```

首次使用前修改：

```text
public/admin/config.yml
```

访问：

```text
/admin/
```

首次使用前修改：

```text
public/admin/config.yml
```

需要替换：

- `repo`
- `branch`
- `site_domain`
- `base_url`
- `auth_endpoint`

管理员修改内容后，CMS 会向 GitHub 仓库提交 Commit，静态托管平台再触发构建和发布。

## 动态服务说明

当前模板不包含后端动态服务：

- 评论需要另行接入 Giscus、Waline 或 Twikoo；
- 访问统计需要另行接入 Umami、Plausible 或 Cloudflare Web Analytics；
- 深夜酒馆动态投稿已移除，静态内容可通过 GitHub CMS 管理；
- EPUB 上传、下载和在线阅读已移除。

## License

本项目使用 [MIT License](LICENSE)。
