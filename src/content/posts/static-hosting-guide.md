---
title: 将 Nebula 博客部署到 Netlify、Cloudflare Pages 与 GitHub Pages
published: 2026-09-26
description: 介绍 Vercel 以外的静态托管方式、SPA 路由回退、构建设置和 Decap CMS 登录差异。
category: 教程
tags: [静态部署, Netlify, Cloudflare Pages, GitHub Pages]
cover: ''
draft: false
pinned: false
---

## 静态站点的共同设置

Nebula 使用 Vue Router 的 HTML5 History 模式。部署平台需要把未知路径回退到 `index.html`，否则直接刷新 `/moments` 或 `/post/example` 会返回 404。构建命令为 `pnpm build`，发布目录为 `dist`，Node.js 使用 20.19+ 或 22.12+。在 GitHub 仓库中，项目根目录就是前端根目录。

文章、说说及站点 JSON 由 Vite 在构建时打包；更新内容后需要重新构建。CMS 还需要能够向 GitHub 提交文件，因此“静态站点部署成功”不等同于“CMS OAuth 已配置”。

## Netlify

在 Netlify 选择 **Add new project → Import an existing project**，连接 GitHub 仓库并选择部署分支。仓库的 `netlify.toml` 提供 pnpm 构建和 SPA 路由回退设置；检查 Build command 是 `pnpm build`、Publish directory 是 `dist`、Base directory 留空或设为仓库根目录。

为 Decap CMS 登录启用 Netlify Identity 和 GitHub OAuth Provider。按 Netlify 控制台的提示配置 OAuth App，回调地址使用 Netlify 官方提供的授权完成 URL。然后把 `public/admin/config.yml` 的 backend 设置为 Netlify Identity 流程，例如：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
  site_domain: your-blog.netlify.app
  base_url: https://your-blog.netlify.app
  auth_endpoint: oauth
```

替换实际域名和仓库信息。部署完成后访问 `/admin/`，登录并确认 CMS 创建的 commit 进入预期分支。

## Cloudflare Pages

创建 Pages 项目并连接 GitHub 仓库，Framework preset 选择 Vite，Build command 设为 `pnpm build`，Build output directory 设为 `dist`，Root directory 使用 `/`（仓库根目录）。Node.js 版本按项目支持范围配置。确保部署启用 SPA fallback；Pages 对没有匹配静态文件的路径会回退到单页入口，部署后仍要实际测试深层路由刷新。

若需要 CMS，可选一种 OAuth 服务端方案：使用 Netlify Identity 或受信任的 OAuth proxy / Worker。Cloudflare Pages 本身不会自动提供 GitHub OAuth code exchange。OAuth 服务端必须保护 Client Secret，并按该服务的约定调整 `public/admin/config.yml`；不能把 Secret 写入 `VITE_*` 环境变量。若不配置 OAuth，网站静态页面仍可用，但 `/admin/` 不能完成 GitHub 写入登录。

## GitHub Pages

GitHub Pages 可托管构建后的静态文件，但本项目的 `base: '/'` 与自定义域名/根路径部署相匹配。若发布在 `username.github.io/repository/` 子路径，必须另行配置 Vite base 和路由 history base，并验证所有资源 URL；推荐使用自定义域名的站点根路径以减少路径差异。

GitHub Pages 没有后端函数，Decap GitHub backend 的 OAuth 登录不能只靠静态页面完成。要启用 CMS，必须单独提供安全的 OAuth proxy，或把 CMS 登录迁移到具备托管 Identity 的平台。不要把 GitHub PAT 或 OAuth Client Secret 嵌入网页、仓库或构建产物。

## 发布检查清单

1. 确认平台构建命令为 `pnpm build`，输出目录为 `dist`。
2. 打开首页和至少一个深层路径，刷新后确认 SPA 回退正常。
3. 检查资源文件、Markdown 正文图片和自定义域名 HTTPS。
4. 若使用 CMS，单独验证 OAuth callback、GitHub 仓库写权限和目标 branch。
5. 保存一条测试内容，检查 GitHub commit、平台重新部署和最终网页内容。

不同托管平台的 CDN 缓存策略不同；看到 GitHub commit 后，先确认最新部署成功，再判断是否需要清理缓存。
