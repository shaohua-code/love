<script setup lang="ts">
/**
 * ================================================================
 * 飘落花瓣背景组件
 * 生成随机飘落的花瓣，可点击戳爆
 * ================================================================ */
import { ref, onMounted } from 'vue'
import { showToast } from '@/composables/useToast'

const container = ref<HTMLElement | null>(null)
const petalChars = ['🌸', '✿', '❀', '🌷']

onMounted(() => {
  if (!container.value) return
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div')
    petal.textContent = petalChars[i % petalChars.length]
    petal.className = 'petal-item absolute cursor-pointer text-sm opacity-60 transition-transform hover:scale-125'
    const duration = 8 + Math.random() * 12
    const delay = Math.random() * 10
    const size = 0.6 + Math.random() * 0.8
    petal.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      font-size:${size}rem;
      animation: fall ${duration}s linear ${delay}s infinite;
    `
    petal.addEventListener('click', (e) => {
      const el = e.target as HTMLElement
      el.style.transform = 'scale(2)'
      el.style.opacity = '0'
      showToast('戳爆花瓣 ✿')
      setTimeout(() => {
        el.style.transform = ''
        el.style.opacity = '0.6'
      }, 800)
    })
    container.value.appendChild(petal)
  }
})
</script>

<template>
  <div ref="container" class="pointer-events-none fixed inset-0 z-[1]"></div>
</template>
