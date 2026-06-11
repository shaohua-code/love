<script setup lang="ts">
/**
 * ================================================================
 * 打字指示器组件
 * AI 正在思考时的动画指示
 * ================================================================ */
</script>

<template>
  <div class="flex gap-3">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-dusk text-sm text-white shadow-sm">
      🤖
    </div>
    <div class="flex items-center gap-1 rounded-2xl rounded-tl-md border border-rose/10 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div class="h-2 w-2 animate-bounce rounded-full bg-dusk/40" style="animation-delay: 0s"></div>
      <div class="h-2 w-2 animate-bounce rounded-full bg-dusk/40" style="animation-delay: 0.15s"></div>
      <div class="h-2 w-2 animate-bounce rounded-full bg-dusk/40" style="animation-delay: 0.3s"></div>
    </div>
  </div>
</template>
