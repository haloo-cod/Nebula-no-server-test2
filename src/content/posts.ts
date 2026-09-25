import type { Post, PostStat, Frontmatter } from '@/types'
import { postCoverAssignments } from '@/data/post-covers'


// 构建时读取 GitHub 仓库中的 Markdown 文章，CMS 修改文件后由静态构建发布。
const rawFiles = import.meta.glob<string>('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Frontmatter = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    let value: string | number | boolean | string[] = line.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    } else if (value === 'true' || value === 'false') {
      value = value === 'true'
    } else if (value === '[]') {
      value = []
    } else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    } else if (value !== '' && !Number.isNaN(Number(value))) {
      value = Number(value)
    }
    data[key] = value
  }
  return { data, content: match[2] }
}

function slugify(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '').replace(/\s+/g, '-').toLowerCase()
}

function resolveMediaUrl(value: unknown): string {
  if (typeof value !== 'string' || !value) return ''
  if (/^(https?:)?\/\//.test(value) || value.startsWith('/')) return value
  return `/${value}`
}

const posts: Post[] = Object.entries(rawFiles)
  .map(([path, raw]): Post => {
    const { data, content } = parseFrontmatter(raw)
    const slug = slugify(path)
    return {
      slug,
      title: typeof data.title === 'string' && data.title ? data.title : slug,
      description: typeof data.description === 'string' ? data.description : '',
      date: typeof data.published === 'string' ? data.published : '',
      cover: resolveMediaUrl(postCoverAssignments[slug] || data.image || data.cover),
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: typeof data.category === 'string' ? data.category : '',
      draft: data.draft === true,
      pinned: data.pinned === true,
      content,
    }
  })
  .sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

export function getPosts(): Post[] {
  return posts
}

export function getPostStats(): PostStat[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    if (post.draft || !post.date) continue
    const year = post.date.slice(0, 4)
    if (/^\d{4}$/.test(year)) counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => Number(a.label) - Number(b.label))
}

export function getPost(slug: string): Post | null {
  return posts.find((post) => post.slug === slug) ?? null
}

interface MarkdownRenderer {
  parse(source: string): string | Promise<string>
  use(...extensions: unknown[]): MarkdownRenderer
}

let markedInstance: MarkdownRenderer | null = null
const htmlCache = new Map<string, string>()

async function getMarked(): Promise<MarkdownRenderer> {
  if (markedInstance) return markedInstance
  const [{ marked }, { markedHighlight }, { hljs }] = await Promise.all([
    import('marked'),
    import('marked-highlight'),
    import('@/utils/highlight'),
  ])
  marked.use(
    markedHighlight({
      highlight(code: string, lang: string) {
        return lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : code
      },
    }),
  )
  markedInstance = marked as unknown as MarkdownRenderer
  return markedInstance
}
export async function renderPost(slug: string): Promise<string | null> {
  const post = getPost(slug)
  if (!post) return null
  if (htmlCache.has(slug)) return htmlCache.get(slug)!
  const marked = await getMarked()
  const html = (await marked.parse(post.content)).replace(
    /(<img\s+src=")((?:\.\.?\/)?(?:post-images\/|images\/)[^"]+)"/g,
    '$1/$2"',
  )
  htmlCache.set(slug, html)
  return html
}

export async function renderMarkdown(content: string): Promise<string> {
  const marked = await getMarked()
  return marked.parse(content)
}
