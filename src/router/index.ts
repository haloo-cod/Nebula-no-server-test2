import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { siteText } from '@/data/site-text'
declare module 'vue-router' {
  interface RouteMeta {
    hideBackground?: boolean
    backgroundOverlay?: number
    hideChrome?: boolean
    hideRain?: boolean
    title?: string
    description?: string
  }
}

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: () => import('../views/index/index.vue') },
  { path: '/archive', name: 'archive', component: () => import('../views/archive/archive.vue') },
  { path: '/archive/tree', name: 'archive-tree', meta: { backgroundOverlay: 0.14 }, component: () => import('../views/archive/ArchiveTreePoster.vue') },
  { path: '/archive/post/:slug', name: 'archive-post', component: () => import('../views/post/post.vue') },
  { path: '/blog', name: 'blog', component: () => import('../views/blog/blog.vue') },
  { path: '/post/:slug', name: 'post', component: () => import('../views/post/post.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('../views/gallery/gallery.vue') },
  { path: '/gallery/project/:slug', name: 'gallery-project', component: () => import('../views/gallery/project.vue') },
  { path: '/friends', name: 'friends', component: () => import('../views/friends/friends.vue') },
  { path: '/treasure', name: 'treasure', component: () => import('../views/treasure/treasure.vue') },
  { path: '/moments', name: 'moments', component: () => import('../views/moments/moments.vue') },
  { path: '/about', name: 'about', component: () => import('../views/about/about.vue') },
  { path: '/study-room', name: 'study-room', component: () => import('../views/study-room/study-room.vue') },
]
const seoPageKeys: Record<string, string> = {
  index: 'index', archive: 'archive', images: 'images', gallery: 'gallery',
  friends: 'friends', treasure: 'treasure', moments: 'moments', about: 'about', studyRoom: 'studyRoom',
}
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })
router.afterEach((to) => {
  const key = typeof to.name === 'string' ? seoPageKeys[to.name] : undefined
  const page = key ? siteText[key] : undefined
  document.title = `${page?.title ?? siteText.index.title} | ${siteText.index.title}`
  if (page?.subtitle) {
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', page.subtitle)
  }
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = `${window.location.origin}${to.path}`
})

export default router
