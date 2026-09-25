import friendContent from '@/content/friends.json'
import type { Friend } from '@/types'

interface FriendContent {
  items: Friend[]
  exchange: {
    enabled: boolean
    name: string
    url: string
    avatar: string
    bio: string
    requirements: string[]
    contact: string
  }
}

const content = friendContent as FriendContent

/** 获取 GitHub 内容目录中的全部友链。 */
export function getFriends(): Friend[] {
  return content.items
}

/** 获取友链交换页面展示信息。 */
export function getFriendExchangeInfo(): FriendContent['exchange'] {
  return content.exchange
}
