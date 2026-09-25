<template>
  <div class="carousel">
    <div v-if="images.length > 0" class="carousel-viewport">
      <div class="carousel-track" ref="trackRef" :style="trackStyle">
        <img :src="images[images.length - 1]" class="carousel-slide clone" loading="eager" />
        <img
          v-for="(img, i) in images"
          :key="i"
          :src="img"
          :alt="`slide ${i + 1}`"
          class="carousel-slide"
          :loading="i < 2 ? 'eager' : 'lazy'"
        />
        <img :src="images[0]" class="carousel-slide clone" loading="eager" />
      </div>
    </div>
    <div v-else class="carousel-empty">暂无轮播图片</div>
    <div v-if="images.length > 1" class="carousel-dots">
      <span
        v-for="(_, i) in images"
        :key="i"
        class="carousel-dot"
        :class="{ active: i === currentIndex }"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import rawSlides from '@/content/carousel.json'

interface CarouselEntry {
  src: string
  alt?: string
}

const entries = rawSlides as Array<string | CarouselEntry>
const images = ref(entries.map((entry) => (typeof entry === 'string' ? entry : entry.src)))
const currentIndex = ref(0)
const autoPlayTimer = ref<number | null>(null)
const transitioning = ref(false)
const trackRef = ref<HTMLElement | null>(null)
const INTERVAL = 4000
const TRANSITION_DURATION = 500
const TRANSITION_FALLBACK_DELAY = TRANSITION_DURATION + 100
let transitionFallbackTimer: number | null = null
const OFFSET = 1

const trackStyle = computed(() => ({
  transform: `translateX(-${(currentIndex.value + OFFSET) * 100}%)`,
  transition: transitioning.value ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
}))

function goTo(index: number) {
  if (transitioning.value) return
  transitioning.value = true
  currentIndex.value = index
  scheduleTransitionFallback()
  resetAutoPlay()
}

function next() {
  if (transitioning.value) return
  transitioning.value = true
  currentIndex.value += 1
  scheduleTransitionFallback()
  resetAutoPlay()
}

function clearTransitionFallback() {
  if (transitionFallbackTimer !== null) {
    window.clearTimeout(transitionFallbackTimer)
    transitionFallbackTimer = null
  }
}

function scheduleTransitionFallback() {
  clearTransitionFallback()
  transitionFallbackTimer = window.setTimeout(finishTransition, TRANSITION_FALLBACK_DELAY)
}

function finishTransition() {
  clearTransitionFallback()
  if (currentIndex.value === images.value.length) {
    transitioning.value = false
    currentIndex.value = 0
    void trackRef.value?.offsetWidth
  } else {
    transitioning.value = false
  }
}

function onTransitionEnd(event: TransitionEvent) {
  if (event.propertyName === 'transform') finishTransition()
}

function onTransitionCancel(event: TransitionEvent) {
  if (event.propertyName === 'transform') finishTransition()
}

function resetAutoPlay() {
  if (autoPlayTimer.value) clearInterval(autoPlayTimer.value)
  if (images.value.length > 1) autoPlayTimer.value = window.setInterval(next, INTERVAL)
}

onMounted(() => {
  trackRef.value?.addEventListener('transitionend', onTransitionEnd)
  trackRef.value?.addEventListener('transitioncancel', onTransitionCancel)
  resetAutoPlay()
})

onUnmounted(() => {
  trackRef.value?.removeEventListener('transitionend', onTransitionEnd)
  trackRef.value?.removeEventListener('transitioncancel', onTransitionCancel)
  if (autoPlayTimer.value) clearInterval(autoPlayTimer.value)
  clearTransitionFallback()
})
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 14px;
  padding: 20px;
  box-sizing: border-box;
}

.carousel-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-empty {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.carousel-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-dot {
  cursor: pointer;
}
</style>
