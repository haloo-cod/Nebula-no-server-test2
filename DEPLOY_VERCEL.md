# Vercel 部署与 Decap CMS 登录

当前模板使用 Vercel Functions 提供 OAuth，不需要单独部署 Worker。

## 1. 导入仓库

在 Vercel 导入：

```text
haloo-cod/Nebula-no-server-test2
```

使用仓库根目录，构建命令：

```text
pnpm build
```

输出目录：

```text
dist
```

## 2. 配置环境变量

在 Vercel Project Settings -> Environment Variables 配置：

```text
GITHUB_OAUTH_CLIENT_ID=GitHub OAuth App Client ID
GITHUB_OAUTH_CLIENT_SECRET=GitHub OAuth App Client Secret
PUBLIC_SITE_URL=https://nebula-no-server-test2.vercel.app
```

真实 Secret 只配置在 Vercel，不提交到 GitHub。

## 3. 创建 GitHub OAuth App

GitHub OAuth App 地址：

```text
https://github.com/settings/developers
```

填写：

```text
Homepage URL:
https://nebula-no-server-test2.vercel.app

Authorization callback URL:
https://nebula-no-server-test2.vercel.app/api/auth
```
注意：当前 Vercel Function 会使用授权请求的同源 `/api/auth` 回调地址。GitHub OAuth App 的 callback URL 必须精确填写 `https://nebula-no-server-test2.vercel.app/api/auth`，不要添加 query 参数。

## 4. CMS 配置

`public/admin/config.yml` 使用：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
  site_domain: nebula-no-server-test2.vercel.app
  base_url: https://nebula-no-server-test2.vercel.app
  auth_endpoint: /api/auth?action=authorize
```

CMS 地址：

```text
https://nebula-no-server-test2.vercel.app/admin/
```

登录账号必须对 GitHub 仓库具有写权限。
