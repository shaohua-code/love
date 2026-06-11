<script setup lang="ts">
/**
 * ================================================================
 * 快捷按钮组件
 * 横向滚动的预设对话场景按钮
 * ================================================================
 */
import { QUICK_CHIPS } from '@/utils/constants'

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="flex gap-2 overflow-x-auto py-1">
    <button
      v-for="(chip, i) in QUICK_CHIPS"
      :key="i"
      type="button"
      class="shrink-0 rounded-full border border-night/20 bg-night/8 px-3 py-1 text-xs text-night/75 backdrop-blur-sm transition-colors hover:border-night/30 hover:bg-night/12 hover:text-night/90"
      @click="emit('select', i)"
    >
      {{ chip.label }}
    </button>
  </div>
</template>
