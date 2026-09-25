# 部署配置

仓库根目录就是当前目录，仓库地址为 `https://github.com/haloo-cod/Nebula-no-server-test2`。

## GitHub Pages

1. 打开仓库 `Settings -> Pages`。
2. 在 `Build and deployment -> Source` 选择 `GitHub Actions`。
3. 打开 `Settings -> Actions -> General`，确认允许 GitHub Actions 运行。
4. 推送到 `main` 后，工作流 `.github/workflows/deploy.yml` 会执行 `pnpm install --frozen-lockfile` 和 `pnpm build`。

项目地址使用 GitHub Pages 子路径：

```text
https://haloo-cod.github.io/Nebula-no-server-test2/
```

因此 `vite.config.ts` 使用：

```ts
base: '/Nebula-no-server-test2/'
```

如果以后绑定自定义域名，需要将 `base` 改回 `/`，并在 CMS 配置中改用自定义域名。

## Decap CMS

CMS 页面地址：

```text
https://haloo-cod.github.io/Nebula-no-server-test2/admin/
```

`public/admin/config.yml` 已配置：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
```

图片默认提交到：

```text
public/assets/images/
```

## GitHub OAuth

Decap CMS 的 GitHub backend 不能在浏览器中保存 GitHub Token。`auth_endpoint: oauth` 需要一个单独的 OAuth 服务端点。

当前仓库只包含静态站点和 CMS 配置，不包含 OAuth 服务。部署 CMS 登录前需要选择并部署一个可信 OAuth 代理，例如：

- Cloudflare Worker；
- Netlify/Decap OAuth 集成；
- 自建 OAuth 服务。

OAuth 服务完成后，将其公开为：

```text
https://你的域名/oauth
```

然后保持 `config.yml` 中：

```yaml
auth_endpoint: oauth
```

OAuth Client Secret 和 GitHub Token 只能配置在 OAuth 服务端，不能放进 `config.yml`、Vue 源码或公开环境变量。

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
