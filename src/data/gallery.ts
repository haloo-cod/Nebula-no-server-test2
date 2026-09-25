import type { GalleryProject } from '@/types'

const rawProjectFiles = import.meta.glob<string>('../content/gallery/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

interface GalleryFrontmatter {
  title?: string
  description?: string
  tags?: string[]
  status?: string
  year?: string | number
  featured?: boolean
  [key: string]: string | number | boolean | string[] | undefined
}

function parseProject(raw: string, path: string): GalleryProject {
  const slug = path.split('/').pop()!.replace(/\.md$/, '').replace(/\s+/g, '-').toLowerCase()
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const data: GalleryFrontmatter = {}
  const content = match?.[2] ?? raw
  for (const line of (match?.[1] ?? '').split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (value === 'true' || value === 'false') data[key] = value === 'true'
    else if (value.startsWith('[') && value.endsWith(']')) data[key] = value.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean)
    else data[key] = value.replace(/^['"]|['"]$/g, '')
  }
  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    description: typeof data.description === 'string' ? data.description : '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: typeof data.status === 'string' ? data.status : '',
    year: String(data.year ?? ''),
    featured: data.featured === true,
    content,
  }
}

const galleryProjects = Object.entries(rawProjectFiles).map(([path, raw]) => parseProject(raw, path))

/** 获取 GitHub 内容目录中的展览项目。 */
export function getGalleryProjects(): GalleryProject[] {
  return galleryProjects
}

/** 按 slug 查找展览项目。 */
export function getGalleryProject(slug: string): GalleryProject | null {
  return galleryProjects.find((project) => project.slug === slug) ?? null
}

let markedPromise: Promise<typeof import('marked').marked> | null = null
const htmlCache = new Map<string, string>()

/** 渲染展览项目 Markdown。 */
export async function renderGalleryProject(slug: string): Promise<string | null> {
  const project = getGalleryProject(slug)
  if (!project) return null
  if (htmlCache.has(slug)) return htmlCache.get(slug)!
  markedPromise ??= import('marked').then((module) => module.marked)
  const html = await (await markedPromise).parse(project.content)
  htmlCache.set(slug, html)
  return html
}
