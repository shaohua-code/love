<script setup lang="ts">
/**
 * ================================================================
 * Emoji 雨特效层
 * 触发各种 emoji 雨效果
 * ================================================================ */
import { ref } from 'vue'

const container = ref<HTMLElement | null>(null)

/**
 * 触发 emoji 雨
 * @param duration - 持续时间(ms)
 */
export function startEmojiRain(duration = 4000): void {
  if (!container.value) return
  const emojis = ['🍗', '💗', '✨', '⭐', '🌸', '💫', '🥰', '🐷', '🐱']
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div')
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    el.className = 'absolute text-xl'
    el.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
      animation-delay:${Math.random() * 0.8}s;
    `
    container.value.appendChild(el)
    setTimeout(() => el.remove(), duration)
  }
}

/**
 * 触发猪猪雨
 */
export function startPigRain(): void {
  if (!container.value) return
  const pigs = ['🐷', '🐽', '💗', '🐷', '✨']
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div')
    el.textContent = pigs[Math.floor(Math.random() * pigs.length)]
    el.className = 'absolute text-xl'
    el.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
      animation-delay:${Math.random() * 0.8}s;
    `
    container.value.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}

/**
 * 飞行道具（扔鸡腿等）
 * @param emoji - 要飞行的 emoji
 */
export function flyAcross(emoji: string): void {
  if (!container.value) return
  const el = document.createElement('div')
  el.textContent = emoji
  el.className = 'absolute'
  el.style.cssText = `
    top:${15 + Math.random() * 50}%;left:0;
    font-size:1.8rem;
    animation: flyAcross ${2 + Math.random()}s linear forwards;
  `
  container.value.appendChild(el)
  setTimeout(() => el.remove(), 3500)
}
</script>

<template>
  <div ref="container" class="pointer-events-none fixed inset-0 z-[60] overflow-hidden"></div>
</template>
