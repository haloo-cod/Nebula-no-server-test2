import profileContent from '@/content/profile.json'
import type { Profile, SocialLink } from '@/types'

interface ProfileContent extends Profile {
  avatar?: string
  cover?: string
  socialLinks?: SocialLink[]
}

const content = profileContent as ProfileContent

export const avatar = content.avatar ?? ''
export const coverImage = content.cover ?? ''
export const profile: Profile = {
  name: content.name,
  bio: content.bio,
}
export const socialLinks: SocialLink[] = content.socialLinks ?? []
