<template>
  <div class="treasure-page">
    <!-- 页面头部 -->
    <header class="treasure-header">
      <span class="treasure-kicker">{{ siteText.treasure.kicker }}</span>
      <h1 class="treasure-title">{{ siteText.treasure.title }}</h1>
      <p class="treasure-desc">{{ siteText.treasure.subtitle }}</p>
    </header>

    <!-- 分类筛选标签 -->
    <nav class="treasure-tabs" aria-label="分类筛选">
      <button
        class="tab-btn"
        :class="{ 'tab-btn-active': activeCategory === null }"
        type="button"
        @click="activeCategory = null"
      >
        全部
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="tab-btn"
        :class="{ 'tab-btn-active': activeCategory === cat }"
        type="button"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </nav>

    <!-- 宝物网格 -->
    <TransitionGroup name="grid-item" tag="div" class="treasure-grid">
      <a
        v-for="item in pagedTreasures"
        :key="item.slug"
        :href="item.downloadUrl || item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="treasure-link"
      >
        <LiquidGlass
          v-if="ui.liquidGlassEnabled"
          class="treasure-glass"
          :theme="ui.theme"
          :corner-radius="22"
          :blur-radius="ui.liquidGlassBlur"
          :glass-thickness="36"
          :highlight-width="3"
          ripple-trail
        >
          <TreasureCardContent :item="item" />
        </LiquidGlass>

        <PanelFallbackGlass v-else tag="div" class="treasure-glass treasure-glass--fallback">
          <TreasureCardContent :item="item" />
        </PanelFallbackGlass>
      </a>
    </TransitionGroup>

    <div v-if="filteredTreasures.length === 0" class="treasure-empty">
      <p>该分类暂无内容</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="treasure-pagination">
      <button class="page-btn" type="button" :disabled="currentPage === 1" @click="goPrevPage">
        上一页
      </button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        class="page-btn"
        :class="{ 'page-btn-active': page === currentPage }"
        type="button"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button
        class="page-btn"
        type="button"
        :disabled="currentPage === totalPages"
        @click="goNextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import LiquidGlass from '@/components/liquid-glass/LiquidGlass.vue'
import PanelFallbackGlass from '@/components/panels/PanelFallbackGlass.vue'
import TreasureCardContent from './TreasureCardContent.vue'
import { getTreasures, getTreasureCategories } from '@/data/treasures'
import { siteText } from '@/data/site-text'
import type { TreasureCategory } from '@/types'
import { useUIStore } from '@/stores/ui'
const ui = useUIStore()
const treasures = ref(getTreasures())
const categories = ref<TreasureCategory[]>(getTreasureCategories())
const PAGE_SIZE = 12
const currentPage = ref(1)
const activeCategory = ref<TreasureCategory | null>(null)

const filteredTreasures = computed(() => activeCategory.value === null ? treasures.value : treasures.value.filter((item) => item.category === activeCategory.value))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTreasures.value.length / PAGE_SIZE)))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))
const pagedTreasures = computed(() => filteredTreasures.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE))

function goPrevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function goNextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

watch(activeCategory, () => { currentPage.value = 1 })
watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value
})
</script>

<style scoped>
.treasure-page {
  position: relative;
  z-index: 10;
  width: min(100%, 76rem);
  margin: 0 auto;
  padding: 7rem 1rem 5rem;
}

/* ===== 页面头部 ===== */
.treasure-header {
  margin-bottom: 1.8rem;
}

.treasure-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 200, 100, 0.78);
}

.treasure-title {
  margin-top: 0.4rem;
  color: var(--text-primary);
  font-size: clamp(1.7rem, 3vw, 2.6rem);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.treasure-desc {
  margin-top: 0.5rem;
  max-width: 42rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

/* ===== 分类标签 ===== */
.treasure-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.6rem;
}

.tab-btn {
  padding: 0.5rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-primary);
}

.tab-btn-active {
  border-color: rgba(255, 200, 100, 0.5);
  background: rgba(255, 200, 100, 0.22);
  color: var(--text-primary);
}

/* ===== 宝物网格 ===== */
.treasure-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.treasure-link {
  display: block;
  min-height: 12rem;
  color: inherit;
  text-decoration: none;
}

.treasure-glass {
  width: 100%;
  height: 100%;
  min-height: inherit;
  border-radius: 1.25rem;
  transition:
    transform 0.24s ease,
    filter 0.24s ease;
}

.treasure-glass--fallback {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    transform 0.24s ease,
    filter 0.24s ease;
}

@media (hover: hover) and (pointer: fine) {
  .treasure-link:hover .treasure-glass {
    transform: translateY(-4px);
    filter: drop-shadow(0 14px 32px rgba(255, 200, 100, 0.12));
  }

  .treasure-link:hover .treasure-glass--fallback {
    transform: translateY(-3px);
    filter: drop-shadow(0 8px 24px rgba(80, 140, 255, 0.14));
  }
}

/* 触摸设备上的 hover 可能会粘滞，保持藏宝卡片稳定的基础表面。 */
@media (hover: none), (pointer: coarse) {
  .treasure-link:hover .treasure-glass,
  .treasure-link:active .treasure-glass,
  .treasure-link:focus .treasure-glass {
    transform: none;
    filter: none;
  }

  .treasure-link:hover .treasure-glass--fallback,
  .treasure-link:active .treasure-glass--fallback,
  .treasure-link:focus .treasure-glass--fallback {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: none;
  }
}

.download-notice {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 30;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 200, 100, 0.35);
  border-radius: 999px;
  background: rgba(18, 20, 24, 0.88);
  color: rgba(255, 235, 190, 0.95);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
}

.download-notice-enter-active,
.download-notice-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.download-notice-enter-from,
.download-notice-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.download-progress {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 31;
  width: min(280px, calc(100vw - 2.5rem));
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 200, 100, 0.35);
  border-radius: 0.8rem;
  background: rgba(18, 20, 24, 0.92);
  color: rgba(255, 235, 190, 0.95);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
  font-size: 0.8rem;
}
.download-progress-track {
  height: 5px;
  margin-top: 0.55rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
}
.download-progress-bar {
  height: 100%;
  border-radius: inherit;
  background: #f4b860;
  transition: width 0.15s ease;
}

/* ===== 空状态 ===== */
.treasure-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* ===== 分页 ===== */
.treasure-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1.8rem;
}

.page-btn {
  min-width: 2.7rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.82rem;
  padding: 0.52rem 0.9rem;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
  color: var(--text-primary);
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.page-btn-active {
  border-color: rgba(255, 200, 100, 0.5);
  background: rgba(255, 200, 100, 0.18);
  color: var(--text-primary);
}

/* ===== TransitionGroup 动画 ===== */
.grid-item-enter-active {
  transition: transform 0.3s ease;
}

.grid-item-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  position: absolute;
}

.grid-item-enter-from {
  transform: translateY(16px);
}

.grid-item-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.grid-item-move {
  transition: transform 0.3s ease;
}

/* ===== 响应式 ===== */
@media (max-width: 1023px) {
  .treasure-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .treasure-page {
    padding-top: 6rem;
  }

  .treasure-grid {
    grid-template-columns: 1fr;
  }
}
</style>
