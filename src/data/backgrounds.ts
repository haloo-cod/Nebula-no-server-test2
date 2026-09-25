import rawBackgrounds from '@/content/backgrounds.json'

/** 静态背景媒体条目，src 支持仓库路径或完整外链。 */
export interface BackgroundItem {
  src: string
  mediaType?: 'image' | 'video'
  posterUrl?: string
  mimeType?: string
}

interface BackgroundGroups {
  desktop: BackgroundItem[]
  mobile: BackgroundItem[]
}

interface BackgroundContent {
  dark: BackgroundGroups
  light: BackgroundGroups
}

export function isVideoBackground(item: {
  src?: string
  url?: string
  mediaType?: 'image' | 'video'
  media_type?: 'image' | 'video'
  mimeType?: string
  mime_type?: string
}): boolean {
  const src = item.src ?? item.url ?? ''
  const type = item.mediaType ?? item.media_type
  const mime = item.mimeType ?? item.mime_type
  return type === 'video' || mime?.startsWith('video/') === true || /\.(mp4|webm|mov)(?:\?|$)/i.test(src)
}

const content = rawBackgrounds as BackgroundContent

function getGroup(theme: 'dark' | 'light', device: 'desktop' | 'mobile'): BackgroundItem[] {
  return content[theme][device]
}

export const darkBackgrounds = getGroup('dark', 'desktop')
export const lightBackgrounds = getGroup('light', 'desktop')
export const mobileDarkBackgrounds = getGroup('dark', 'mobile')
export const mobileLightBackgrounds = getGroup('light', 'mobile')
