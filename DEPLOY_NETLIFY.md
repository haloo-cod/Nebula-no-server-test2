# Netlify 部署与 Decap CMS 登录

本模板推荐使用 Netlify 部署，因为 Netlify 可以为 Decap CMS 提供 GitHub OAuth，不需要单独部署 Cloudflare Worker。

## 1. 导入仓库

在 Netlify 控制台选择：

```text
Add new project -> Import an existing project -> GitHub
```

选择：

```text
haloo-cod/Nebula-no-server-test2
```

构建配置会自动读取 `netlify.toml`：

```text
Build command: pnpm build
Publish directory: dist
```

Netlify 会自动识别仓库根目录中的 `package.json` 和 `pnpm-lock.yaml`。

## 2. 配置自定义域名

Netlify 分配域名后，例如：

```text
https://my-nebula-blog.netlify.app
```

修改 `public/admin/config.yml`：

```yaml
backend:
  name: github
  repo: haloo-cod/Nebula-no-server-test2
  branch: main
  site_domain: my-nebula-blog.netlify.app
  base_url: https://my-nebula-blog.netlify.app
  auth_endpoint: oauth
```

提交后等待 Netlify 重新部署。

## 3. 配置 GitHub OAuth Provider

在 Netlify Site 设置中找到：

```text
Site configuration -> Identity -> Enable Identity
```

然后：

```text
Identity -> Services -> GitHub
```

启用 GitHub Provider。

如果控制台要求 GitHub OAuth App，创建地址：

```text
https://github.com/settings/developers
```

GitHub OAuth App 配置：

```text
Homepage URL:
https://my-nebula-blog.netlify.app

Authorization callback URL:
https://api.netlify.com/auth/done
```

将 GitHub OAuth App 的：

```text
Client ID
Client Secret
```

填入 Netlify 的 GitHub Provider 配置中。不要把 Secret 写进仓库、Vite 环境变量或 `config.yml`。

## 4. 访问 CMS

```text
https://my-nebula-blog.netlify.app/admin/
```

点击 GitHub 登录。Netlify 会处理 OAuth，Decap CMS 通过 GitHub backend 将内容提交到：

```text
haloo-cod/Nebula-no-server-test2:main
```

登录账号必须对该仓库具有写权限。

## 5. 图片上传

CMS 上传的小图片进入：

```text
public/assets/images/
```

大图片、视频仍然可以在文章和 JSON 中直接填写 R2/CDN URL。
