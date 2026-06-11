<script setup lang="ts">
/**
 * ================================================================
 * 心动值进度条组件
 * 使用 Ant Design Progress，点击有彩蛋提示
 * ================================================================
 */
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { METER_QUIPS } from '@/utils/constants'
import { showToast } from '@/composables/useToast'

const appStore = useAppStore()

const strokeColor = computed(() => {
  const s = appStore.heartScore
  if (s < 30) return '#e8a0b4'
  if (s < 60) return '#d4738f'
  if (s < 80) return '#9b6b8a'
  return { from: '#e8a0b4', to: '#4a3f55' }
})

function onMeterClick() {
  const quip = METER_QUIPS[Math.floor(Math.random() * METER_QUIPS.length)]
  showToast(quip)
}
</script>

<template>
  <div class="w-full max-w-xs cursor-pointer" @click="onMeterClick">
    <div class="mb-1 flex items-center justify-between text-[10px] text-night/40">
      <span>心动值</span>
      <span>{{ appStore.heartScoreText }}</span>
    </div>
    <a-progress
      :percent="appStore.heartScore"
      :show-info="false"
      :stroke-color="strokeColor"
      :stroke-width="8"
      :class="appStore.heartMaxed ? 'animate-pulse' : ''"
    />
  </div>
</template>
