import rawMoments from '@/content/moments.json'
import type { Moment, MomentPage } from '@/types'

interface StaticMoment {
  id?: number | string
  date: string
  content: string
  mood?: string
  moodText?: string
  tags?: string[]
  images?: string[]
  likes?: number
}

const moments: Moment[] = (rawMoments as StaticMoment[])
  .map((moment, index) => ({
    id: typeof moment.id === 'number' ? moment.id : index + 1,
    date: moment.date,
    content: moment.content,
    mood: moment.mood,
    moodText: moment.moodText,
    tags: moment.tags ?? [],
    images: moment.images ?? [],
    likes: moment.likes ?? 0,
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

/** 获取指定页的静态说说。 */
export function getMoments(page = 1, pageSize = 10): MomentPage {
  const start = Math.max(0, page - 1) * pageSize
  return { items: moments.slice(start, start + pageSize), total: moments.length }
}

/** 获取全部静态说说。 */
export function getAllMoments(): Moment[] {
  return moments
}
