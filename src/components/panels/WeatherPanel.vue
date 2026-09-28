<template>
  <section class="weather-panel" aria-label="天气">
    <header class="weather-header">
      <div class="weather-location">
        <span class="weather-eyebrow">天气</span>
        <h2>{{ location || '实时天气' }}</h2>
      </div>
      <button
        class="weather-refresh"
        type="button"
        :disabled="loading"
        :title="loading ? '正在更新天气' : '刷新天气'"
        :aria-label="loading ? '正在更新天气' : '刷新天气'"
        @click="loadWeather"
      >
        <el-icon :class="{ spinning: loading }"><Refresh /></el-icon>
      </button>
    </header>

    <div v-if="loading && !weather" class="weather-state" role="status">正在获取天气…</div>
    <div v-else-if="error && !weather" class="weather-state weather-error" role="alert">
      <span>{{ error }}</span>
      <button type="button" class="weather-retry" @click="loadWeather">重试</button>
    </div>
    <template v-else-if="weather">
      <div class="weather-current">
        <div class="weather-temperature">
          <strong>{{ temperature }}</strong><span>°</span>
          <p>{{ weather.weather || '天气状况未知' }}</p>
        </div>
        <span
          class="weather-symbol"
          :class="`weather-symbol--${weatherKind}`"
          aria-hidden="true"
        >
          {{ weatherSymbol }}
        </span>
      </div>

      <div class="weather-details">
        <div class="weather-detail">
          <span>风向风力</span>
          <strong>{{ [weather.wind_direction, weather.wind_power].filter(Boolean).join(' ') || '--' }}</strong>
        </div>
        <div class="weather-detail">
          <span>相对湿度</span>
          <strong>{{ weather.humidity ?? '--' }}{{ weather.humidity == null ? '' : '%' }}</strong>
        </div>
      </div>

      <footer class="weather-footer">
        <span>{{ weather.report_time ? `更新于 ${weather.report_time}` : '实时天气' }}</span>
        <span v-if="error" class="weather-stale" :title="error">使用上次数据</span>
      </footer>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

interface WeatherResponse {
  province?: string
  city?: string
  district?: string
  weather?: string
  weather_icon?: string | number
  temperature?: string | number
  wind_direction?: string
  wind_power?: string
  humidity?: string | number
  report_time?: string
}

const weather = ref<WeatherResponse | null>(null)
const loading = ref(false)
const error = ref('')
let controller: AbortController | null = null

const location = computed(() =>
  [weather.value?.city, weather.value?.district].filter(Boolean).join(' · '),
)

const temperature = computed(() => {
  const value = Number(weather.value?.temperature)
  return Number.isFinite(value) ? String(Number(value.toFixed(1))) : '--'
})

const weatherKind = computed(() => {
  const code = Number(weather.value?.weather_icon)
  if (code === 100) return 'sunny'
  if (code >= 101 && code <= 104) return 'cloudy'
  if (code >= 200 && code <= 213) return 'windy'
  if (code >= 300 && code <= 399) return 'rainy'
  if (code >= 400 && code <= 499) return 'snowy'
  if (code >= 500 && code <= 599) return 'foggy'
  return 'cloudy'
})

const weatherSymbol = computed(() => {
  const symbols: Record<string, string> = {
    sunny: '☀',
    cloudy: '☁',
    windy: '≋',
    rainy: '☂',
    snowy: '❄',
    foggy: '≋',
  }
  return symbols[weatherKind.value]
})

async function loadWeather() {
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('https://uapis.cn/api/v1/misc/weather?lang=zh', {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    weather.value = (await response.json()) as WeatherResponse
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'AbortError') return
    error.value = '暂时无法获取天气'
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}

onMounted(() => void loadWeather())
onUnmounted(() => controller?.abort())
</script>

<style scoped>
.weather-panel {
  display: flex;
  min-height: 23rem;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1.3rem;
  padding: 1.5rem 1.75rem;
  color: var(--text-primary);
}

.weather-header,
.weather-current,
.weather-details,
.weather-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather-header {
  gap: 1rem;
}

.weather-location {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
}

.weather-eyebrow {
  color: var(--text-secondary);
  flex: 0 0 auto;
  font-size: 1.15rem;
  font-weight: 600;
}

.weather-location h2 {
  overflow: hidden;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.weather-refresh {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--glass-border-subtle);
  border-radius: 50%;
  background: var(--glass-bg-subtle);
  color: var(--text-secondary);
  cursor: pointer;
}

.weather-refresh:disabled {
  cursor: wait;
  opacity: 0.7;
}

.weather-refresh .spinning {
  animation: spin 0.9s linear infinite;
}

.weather-state {
  display: grid;
  min-height: 8rem;
  place-content: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

.weather-retry {
  justify-self: center;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.weather-current {
  gap: 1rem;
}

.weather-temperature {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.weather-temperature strong {
  font-size: 4.75rem;
  font-weight: 350;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.weather-temperature > span {
  margin-top: 0.15rem;
  font-size: 1.6rem;
  line-height: 1;
}

.weather-temperature p {
  align-self: flex-end;
  flex-shrink: 0;
  max-width: 8rem;
  margin: 0 0 0.6rem 0.7rem;
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 1.05rem;
  font-weight: 550;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.weather-symbol {
  display: grid;
  width: 4.5rem;
  height: 4.5rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: rgba(128, 190, 215, 0.14);
  color: #bfe8f2;
  font-size: 2.8rem;
  line-height: 1;
}

.weather-symbol--sunny {
  background: rgba(255, 202, 103, 0.15);
  color: #ffd27e;
}

.weather-symbol--rainy,
.weather-symbol--snowy {
  color: #a9d9f0;
}

.weather-details {
  gap: 0.75rem;
}

.weather-detail {
  display: grid;
  flex: 1 1 0;
  min-width: 0;
  gap: 0.4rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--glass-border-subtle);
  border-radius: 0.5rem;
  background: var(--glass-bg-subtle);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.weather-detail span {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.weather-footer {
  color: var(--text-secondary);
  font-size: 1rem;
}

.weather-detail strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.weather-footer {
  min-height: 1rem;
  gap: 0.6rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .weather-panel {
    justify-content: space-between;
    padding: 1.5rem 1.25rem;
    gap: 1rem;
  }

  .weather-location h2 {
    font-size: 1.2rem;
  }

  .weather-refresh {
    width: 1.8rem;
    height: 1.8rem;
  }

  .weather-symbol {
    width: 4rem;
    height: 4rem;
    font-size: 2.5rem;
  }

  .weather-temperature strong {
    font-size: 4.1rem;
  }

  .weather-temperature p {
    flex: 1 0 100%;
    max-width: none;
    align-self: flex-start;
    margin: 0;
    font-size: 1.05rem;
  }

  .weather-footer {
    font-size: 1rem;
  }

  .weather-detail {
    gap: 0.45rem;
    padding: 0.7rem 0.75rem;
  }

  .weather-detail span {
    font-size: 0.95rem;
  }

  .weather-detail strong {
    font-size: 1.05rem;
  }

  .weather-state {
    font-size: 1rem;
  }

  .weather-retry {
    font-size: 0.95rem;
  }
}

@media (min-width: 769px) and (min-height: 996px) {
  .weather-panel {
    justify-content: space-between;
  }
}

.weather-stale,
.weather-error {
  color: #ffc68d;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .weather-refresh .spinning {
    animation-duration: 2s;
  }
}
</style>
