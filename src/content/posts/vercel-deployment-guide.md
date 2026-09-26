---
title: 使用 Vercel 部署 Nebula 博客并启用 Decap CMS
published: 2026-09-26
description: 从导入 GitHub 仓库到配置 Vercel Functions、GitHub OAuth 和 Decap CMS，完成博客自动部署。
category: 教程
tags: [Vercel, 部署, Decap CMS, GitHub OAuth]
cover: ''
draft: false
pinned: false
---

## 为什么选择 Vercel

Nebula 是 Vue 3 + Vite 静态博客。Vercel 负责构建和托管前端，仓库内的 `api/auth.ts` 提供 Decap CMS 所需的 GitHub OAuth code exchange。文章、说说和站点 JSON 仍然保存在 GitHub 仓库；CMS 保存后产生 Git commit，Vercel 检测到分支更新再重新构建。

## 部署前准备

准备 GitHub 仓库写权限、Vercel 账号和一个 GitHub OAuth App。项目要求 Node.js 20.19+ 或 22.12+，本地开发使用 pnpm。不要把 Client Secret 提交到仓库。

## 导入项目

在 Vercel 选择 **Add New → Project**，导入 `haloo-cod/Nebula-no-server-test2`。仓库根目录就是部署根目录，保持 Root Directory 为 `.`，不要设置成 `blog-frontend`。

构建设置：

- Framework Preset：Vite
- Install Command：`pnpm install`
- Build Command：`pnpm build`
- Output Directory：`dist`

仓库中的 `vercel.json` 已包含站点路径配置。首次导入后部署一次，确认首页可以打开，再继续设置 OAuth。

## 创建 GitHub OAuth App

打开 GitHub **Settings → Developer settings → OAuth Apps → New OAuth App**。Homepage URL 填写 Vercel 实际站点域名，例如 `https://your-blog.vercel.app`；Authorization callback URL 必须填写同域的 `https://your-blog.vercel.app/api/auth`，不能添加 `?action=authorize` 等查询参数。

创建后复制 Client ID，并生成 Client Secret。两个值中，只有 Client ID 非敏感；Secret 不能放进前端变量或配置文件。

## 配置 Vercel 环境变量

进入 **Project → Settings → Environment Variables**，为 Production 至少添加：

```text
GITHUB_OAUTH_CLIENT_ID=OAuth App 的 Client ID
GITHUB_OAUTH_CLIENT_SECRET=OAuth App 的 Client Secret
PUBLIC_SITE_URL=https://your-blog.vercel.app
```

`PUBLIC_SITE_URL` 使用站点的规范 HTTPS 域名，末尾不要加斜杠。Preview 环境若要测试 CMS 登录，也需要配置对应环境变量，并确保 OAuth App 的回调域名与实际请求来源相符。保存变量后重新部署，使 Function 加载新配置。

## 检查 CMS 配置并登录

检查 `public/admin/config.yml` 中的 GitHub 仓库、目标分支、域名和授权端点：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
  site_domain: your-blog.vercel.app
  base_url: https://your-blog.vercel.app
  auth_endpoint: /api/auth?action=authorize
```

将示例域名替换成实际域名，提交后等部署完成，再访问 `https://your-blog.vercel.app/admin/` 并点击 GitHub 登录。登录用户必须拥有目标仓库的写入权限。可以先保存一条低风险的内容修改，确认 GitHub 上出现 commit，再检查 Vercel 的部署记录和线上页面。

## 图片与内容更新

Decap CMS 上传的小图片存入 `public/assets/images/`，正文和 JSON 使用 `/assets/images/文件名.webp` 引用。大型图片和视频建议放在对象存储或 CDN，再在内容中填写完整 HTTPS URL。

CMS 写入的是 GitHub 文件，不是在线数据库。内容 commit 触发新的 Vercel 构建；部署完成后，静态站点才会加载更新。构建失败时先查看 Vercel Build Logs，确认 JSON 格式、Markdown frontmatter 和资源路径。

## 常见问题

- **登录按钮无响应或 OAuth 报错**：检查 `/api/auth` 是否部署成功、三个环境变量是否填写，以及 OAuth callback URL 是否逐字符匹配。
- **GitHub 登录成功但不能保存**：确认 CMS `repo` 与 `branch` 正确，登录账号有写权限。
- **保存后网页未更新**：检查 GitHub commit 和 Vercel 部署状态；静态页面不会绕过构建即时更新。
- **图片无法显示**：确认媒体路径相对于站点根目录，且文件已提交到仓库。

## 安全检查

Client Secret 只保存在 Vercel 环境变量中；公开仓库里的 Markdown、JSON 和图片会对访问者公开。不要将私密信息、访问令牌或密码放进 CMS 内容。
