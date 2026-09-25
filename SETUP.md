# 部署配置

仓库根目录就是当前目录，仓库地址为 `https://github.com/haloo-cod/Nebula-no-server-test2`。

## 推荐部署：Netlify

1. 将仓库导入 Netlify。
2. 使用仓库根目录配置，Netlify 会读取 `netlify.toml`。
3. 构建命令为 `pnpm build`，发布目录为 `dist`。
4. 在 Netlify 开启 Identity，并在 `Identity -> Services -> GitHub` 配置 GitHub OAuth Provider。
5. GitHub OAuth App 的回调地址使用：

```text
https://api.netlify.com/auth/done
```

6. 修改 `public/admin/config.yml` 中的站点域名：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
  site_domain: YOUR_NETLIFY_SITE.netlify.app
  base_url: https://YOUR_NETLIFY_SITE.netlify.app
  auth_endpoint: oauth
```

7. 访问：

```text
https://YOUR_NETLIFY_SITE.netlify.app/admin/
```

完整步骤见 `DEPLOY_NETLIFY.md`。

## GitHub Pages（可选）

GitHub Pages 只适合公开静态网站，不提供 Decap GitHub OAuth 服务端点。若使用 GitHub Pages，需要另行部署 OAuth Proxy；面向普通模板用户推荐优先使用 Netlify。

## Decap CMS

图片默认提交到：

```text
public/assets/images/
```

OAuth Client Secret 和 GitHub Token 只能配置在 Netlify，不要写入 `config.yml`、Vue 源码或公开环境变量。

## 媒体资源

小型图片可以通过 CMS 上传到 GitHub：

```text
public/assets/images/
```

内容中引用：

```text
/assets/images/example.webp
```

大图、视频可以使用 R2/CDN 完整 URL：

```text
https://cdn.example.com/video/night.webm
```

## 本地开发

```bash
pnpm install
pnpm dev
```

验证：

```bash
pnpm type-check
pnpm build
```
