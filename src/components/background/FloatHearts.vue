<script setup lang="ts">
/**
 * ================================================================
 * 可收集浮动物品组件
 * 心心/鸡腿/猫/猪 等可点击收集的浮动元素
 * ================================================================ */
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { showToast } from '@/composables/useToast'
import { HEART_QUIPS } from '@/utils/constants'

const appStore = useAppStore()
const container = ref<HTMLElement | null>(null)

/**
 * 生成浮动物品
 */
function spawn(): void {
  if (!container.value) return
  container.value.innerHTML = ''
  const items = ['💗', '💗', '🍗', '🐱', '🐷', '✨']
  const count = 4 + Math.floor(Math.random() * 3)

  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button')
    btn.type = 'button'
    const emoji = items[Math.floor(Math.random() * items.length)]
    btn.textContent = emoji
    btn.className = 'absolute text-lg opacity-80 pointer-events-auto transition-transform hover:scale-125 active:scale-150'
    const side = Math.random() > 0.5 ? 'left' : 'right'
    const offset = 8 + Math.random() * 20
    const top = 15 + Math.random() * 60
    btn.style.cssText = `
      ${side}:${offset}px;top:${top}%;
      animation: heartFloat ${2 + Math.random() * 2}s ease-in-out infinite;
      animation-delay:${Math.random() * 2}s;
    `
    btn.addEventListener('click', () => {
      btn.classList.add('animate-pop')
      btn.style.pointerEvents = 'none'
      appStore.addHeartScore(2)
      showToast(HEART_QUIPS[Math.floor(Math.random() * HEART_QUIPS.length)])
      setTimeout(() => btn.remove(), 400)
    })
    container.value.appendChild(btn)
  }
}

/**
 * 定时重新生成
 */
function startAutoSpawn(interval = 12000): () => void {
  spawn()
  const timer = setInterval(spawn, interval)
  return () => clearInterval(timer)
}

defineExpose({ spawn, startAutoSpawn })
</script>

<template>
  <div ref="container" class="pointer-events-none fixed inset-0 z-[5]"></div>
</template>
