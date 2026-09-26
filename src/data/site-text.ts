/**
 * 站点页面文案集中管理
 * 各页面的 kicker / title / subtitle 统一在此定义，避免散落在各 .vue 模板中。
 * 后续可对接后端 SiteConfig API，管理员后台修改后优先使用 API 值。
 */

/** 单个页面的文案结构 */
export interface PageText {
  kicker: string // 英文小标题（如 "Images"）
  title: string // 中文主标题（如 "图片"）
  subtitle: string // 副标题/描述（如 "定格时间，封存每一次心跳。"）
}

/** 全站页面文案配置，同时作为静态站点的页面 SEO 默认来源。 */
export const siteText: Record<string, PageText> = {
  index: { kicker: 'Home', title: "Starlitn'blog", subtitle: '分享技术、生活和思考的个人博客' },
  archive: { kicker: 'Archive', title: '归档', subtitle: "按时间浏览 Starlitn'blog 的文章归档" },
  about: { kicker: 'About', title: '关于', subtitle: "关于 Starlitn'blog 和站点作者" },
  studyRoom: { kicker: 'Study Room', title: '自习室', subtitle: '专注当下，记录每一次努力。' },
  midnightTavern: { kicker: 'Midnight Tavern', title: '深夜酒馆', subtitle: '把想说的话留在深夜里。' },
  images: { kicker: 'Images', title: '图片', subtitle: '分享好看的图片' },
  friends: { kicker: 'Friends', title: '友链', subtitle: '想做海洋馆的样子，收集互联网茫茫大海里有趣的朋友们。' },
  treasure: { kicker: 'Treasure', title: '藏宝阁', subtitle: '收集有趣的开源项目和实用工具，也会提供一些资源链接。' },
  books: { kicker: 'Library', title: '书单', subtitle: '记录阅读和收藏的书籍，不提供 EPUB 在线阅读。' },
  gallery: { kicker: 'Projects', title: '项目', subtitle: '记录下自己做的一些项目' },
  moments: { kicker: 'Moments', title: '说说', subtitle: '记录生活中的片刻、心情与想法。' },
  blog: { kicker: 'Blog', title: '博文', subtitle: '记录下自己的一些想法和生活' },
}
