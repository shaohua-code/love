<script setup lang="ts">
/**
 * ================================================================
 * 心情签组件
 * 单击切换文案，双击发疯
 * ================================================================ */
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEasterEggStore } from '@/stores/easterEgg'
import { buildMoodLines, MOOD_FREAK_LINES } from '@/utils/constants'
import { showToast } from '@/composables/useToast'

const appStore = useAppStore()
const easterEggStore = useEasterEggStore()
const moodLines = buildMoodLines()

const currentMood = ref(moodLines[0])
const isFreaking = ref(false)
const lastClickTime = ref(0)

function switchMood() {
  currentMood.value = moodLines[Math.floor(Math.random() * moodLines.length)]
  easterEggStore.incrementMoodSwitch()

  // 检查每日任务
  const reward = easterEggStore.checkDaily('mood3')
  if (reward > 0) {
    appStore.addHeartScore(reward)
    showToast('每日任务完成：换3次心情签')
  }
}

function onMoodClick() {
  const now = Date.now()
  if (now - lastClickTime.value < 350) {
    // 双击发疯
    isFreaking.value = true
    const line = MOOD_FREAK_LINES[Math.floor(Math.random() * MOOD_FREAK_LINES.length)]
    currentMood.value = line
    showToast('心情签已发疯 😂')
    setTimeout(() => {
      isFreaking.value = false
      switchMood()
    }, 2000)
  } else {
    switchMood()
  }
  lastClickTime.value = now
}

onMounted(() => {
  // 每 8 秒自动切换
  setInterval(() => {
    if (!isFreaking.value) {
      switchMood()
    }
  }, 8000)
})
</script>

<template>
  <div
    class="w-full max-w-sm cursor-pointer rounded-2xl border border-rose/20 bg-white/60 p-4 text-center shadow-sm backdrop-blur-sm transition-all active:scale-[0.98]"
    :class="isFreaking ? 'wobble-anim' : ''"
    @click="onMoodClick"
  >
    <p class="text-[10px] tracking-widest text-dusk/50">今日心情签</p>
    <p class="mt-1 font-serif text-sm leading-relaxed text-night/70">
      {{ currentMood }}
    </p>
    <p class="mt-1 text-[10px] text-night/30">双击切换 / 双击发疯</p>
  </div>
</template>
