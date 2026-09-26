import rawAlbums from '@/content/albums.json'
import type { Album } from '@/types'

interface StaticAlbumPhoto {
  url: string
  caption?: string
}

interface StaticAlbum {
  id?: string
  slug?: string
  title: string
  description?: string
  cover?: string
  date?: string
  orientation?: 'landscape' | 'portrait'
  photos?: StaticAlbumPhoto[]
}

interface AlbumsContent {
  items: StaticAlbum[]
}

const albums: Album[] = (rawAlbums as AlbumsContent).items.map((album, index) => {
  const photos = album.photos ?? []
  return {
    id: album.id ?? album.slug ?? `album-${index + 1}`,
    title: album.title,
    description: album.description ?? '',
    cover: album.cover ?? photos[0]?.url ?? '',
    date: album.date ?? '',
    orientation: album.orientation ?? 'landscape',
    photos,
  }
})

/** 获取 GitHub 内容目录中的全部相册。 */
export function getAlbums(): Album[] {
  return albums
}

/** 按标识获取单个相册。 */
export function getAlbum(id: string): Album | null {
  return albums.find((album) => album.id === id) ?? null
}
