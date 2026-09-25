# 本地程序资源与媒体说明

站点内容位于 `src/content/`，由 GitHub 仓库和 Decap CMS 管理。`src/assets/` 只保留程序资源、字体和可选的本地预览文件。

- `backgrounds/`：可选的本地默认背景；正式背景也可以在 `src/content/backgrounds.json` 中使用完整外链。
- `carousel/`：可选的本地轮播预览资源。
- `post-covers/`：可选的本地文章封面资源。
- `post-images/`：可选的本地文章正文图片。
- `icons/`：站点图标。
- `front/`：站点字体。

文章、说说、友链、相册、展览、背景和轮播配置不再由后端 API 提供。图片和视频可以提交到 `public/assets/`，也可以填写 R2/CDN 等完整 URL。
