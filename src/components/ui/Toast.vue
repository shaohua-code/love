<script setup lang="ts">
/**
 * ================================================================
 * Toast 提示组件
 * 全局轻量消息提示，从顶部滑入滑出
 * ================================================================ */
import { useToast } from '@/composables/useToast'

const { toastText, toastVisible } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed left-1/2 top-6 z-[70] -translate-x-1/2 rounded-full border border-rose/30 bg-white/90 px-5 py-2 text-xs text-night/70 shadow-lg backdrop-blur-md transition-transform duration-500"
    :class="toastVisible ? 'translate-y-0' : 'translate-y-[-180%]'"
  >
    {{ toastText }}
  </div>
</template>
