<template>
  <div class="moment-carousel" @mouseenter="pause" @mouseleave="resume" @click="handleClick">
    <!-- 所有 slide 绝对定位叠放 -->
    <div v-for="(moment, i) in slides" :key="moment.id" class="slide" :class="slideClass(i)">
      <div class="slide-header">
        <span v-if="moment.mood || moment.moodText" class="slide-mood-label">
          <span v-if="moment.mood">{{ moment.mood }}</span>
          <span v-if="moment.moodText">{{ moment.moodText }}</span>
        </span>
        <span class="slide-time">{{ relativeTime(moment.date) }}</span>
      </div>
      <p class="slide-text">{{ moment.content }}</p>
      <div v-if="moment.tags.length > 0" class="slide-tags">
        <span v-for="tag in moment.tags" :key="tag" class="slide-tag">#{{ tag }}</span>
      </div>
    </div>

    <!-- 圆点指示器 -->
    <div class="carousel-dots">
      <span
        v-for="(_, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === current }"
        @click.stop="goTo(i)"
      />
    </div>
    <div v-if="slides.length === 0" class="carousel-empty">暂无说说</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMoments } from '@/data/moments'
import type { Moment } from '@/types'

const router = useRouter()
const slides = ref<Moment[]>(getAllMoments().slice(0, 5))
const current = ref(0)
const paused = ref(false)
let timer: number | null = null
const INTERVAL = 6000

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  return Number.isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('zh-CN')
}

function slideClass(index: number): string {
  if (index === current.value) return 'slide--active'
  const previous = (current.value - 1 + slides.value.length) % slides.value.length
  return index === previous ? 'slide--prev' : 'slide--next'
}

function next() {
  if (paused.value || slides.value.length === 0) return
  current.value = (current.value + 1) % slides.value.length
}

function goTo(index: number) {
  current.value = index
  resetTimer()
}

function handleClick() {
  if (slides.value[current.value]) void router.push(`/moments#moment-${slides.value[current.value].id}`)
}

function resetTimer() {
  if (timer !== null) window.clearInterval(timer)
  if (slides.value.length > 1) timer = window.setInterval(next, INTERVAL)
}

function pause() {
  paused.value = true
}

function resume() {
  paused.value = false
}

onMounted(resetTimer)
onUnmounted(() => {
  if (timer !== null) window.clearInterval(timer)
})

</script>

<style scoped>
.moment-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

/* 所有 slide 绝对定位叠放 */
.slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem 1.4rem;
  box-sizing: border-box;
  opacity: 0;
  transform: translateX(40%);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  pointer-events: none;
}

.slide--active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.slide--prev {
  opacity: 0;
  transform: translateX(-40%);
}

.slide--next {
  opacity: 0;
  transform: translateX(40%);
}

/* 内容样式 */
.slide-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
}

.slide-mood {
  font-size: 1.05rem;
}

.slide-mood-label {
  font-weight: 600;
  color: var(--text-secondary, rgba(255, 255, 255, 0.55));
}

.slide-time {
  margin-left: auto;
  color: var(--text-muted, rgba(255, 255, 255, 0.4));
  font-size: 0.78rem;
}

.slide-text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-primary, rgba(255, 255, 255, 0.94));
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.3rem;
}

.slide-tag {
  font-size: 0.78rem;
  color: rgba(140, 218, 214, 0.7);
  font-weight: 500;
}

/* 圆点 */
.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 2;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: rgba(255, 255, 255, 0.9);
  width: 14px;
  border-radius: 3px;
}
</style>
