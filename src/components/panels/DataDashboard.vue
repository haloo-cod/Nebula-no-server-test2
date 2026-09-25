<template>
  <div class="data-dashboard">
    <div class="dashboard-stats">
      <div><strong>{{ formatNum(totalPosts) }}</strong><span>文章</span></div>
      <div><strong>{{ formatNum(totalMoments) }}</strong><span>说说</span></div>
      <div><strong>{{ formatNum(totalProjects) }}</strong><span>展览</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPosts } from '@/data/posts'
import { getAllMoments } from '@/data/moments'
import { getGalleryProjects } from '@/data/gallery'

const totalPosts = getPosts().filter((post) => !post.draft).length
const totalMoments = getAllMoments().length
const totalProjects = getGalleryProjects().length

function formatNum(value: number): string {
  return value.toLocaleString('zh-CN')
}
</script>
