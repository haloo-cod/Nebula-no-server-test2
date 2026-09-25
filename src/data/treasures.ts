import rawTreasures from '@/content/treasures.json'
import type { Treasure, TreasureCategory } from '@/types'

const treasures = rawTreasures as Treasure[]

/** 获取 GitHub 内容目录中的全部藏宝条目。 */
export function getTreasures(): Treasure[] {
  return treasures
}

/** 获取去重后的藏宝阁分类。 */
export function getTreasureCategories(): TreasureCategory[] {
  return [...new Set(treasures.map((treasure) => treasure.category))]
}
