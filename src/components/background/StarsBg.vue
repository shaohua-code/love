<script setup lang="ts">
/**
 * ================================================================
 * 星空背景组件
 * 生成随机分布的闪烁星星，可点击摘星
 * ================================================================ */
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { showToast } from '@/composables/useToast'

const appStore = useAppStore()
const starsContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!starsContainer.value) return
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div')
    const size = Math.random() * 2 + 1
    star.className = 'star-item absolute cursor-pointer rounded-full bg-white animate-twinkle transition-transform'
    star.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 3}s;
      animation-duration:${2 + Math.random() * 2}s;
    `
    star.addEventListener('click', (e) => {
      const el = e.target as HTMLElement
      el.style.transform = 'scale(3)'
      el.style.opacity = '1'
      showToast('你摘了一颗星星 ⭐')
      appStore.addHeartScore(2)
      setTimeout(() => {
        el.style.transform = ''
        el.style.opacity = ''
      }, 600)
    })
    starsContainer.value.appendChild(star)
  }
})
</script>

<template>
  <div ref="starsContainer" class="fixed inset-0 z-0"></div>
</template>
