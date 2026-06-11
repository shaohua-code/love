<script setup lang="ts">
/**
 * ================================================================
 * 搞怪工具栏组件
 * 扔鸡腿、今日运势、戳脸玩、随机夸夸、猪猪雨
 * ================================================================ */
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEasterEggStore } from '@/stores/easterEgg'
import { PRAISE_LINES } from '@/utils/constants'
import { showToast } from '@/composables/useToast'

const emit = defineEmits<{
  'throw-chicken': []
  'pig-rain': []
  'show-fortune': []
}>()

const appStore = useAppStore()
const easterEggStore = useEasterEggStore()

const showPokeFace = ref(false)
const pokePos = ref({ x: 0, y: 0 })

/**
 * 扔鸡腿
 */
function throwChicken() {
  emit('throw-chicken')
  showToast('🍗 鸡腿飞出！')
  const reward = easterEggStore.checkDaily('mischief1')
  if (reward > 0) {
    appStore.addHeartScore(reward)
    showToast('每日任务完成：扔一次鸡腿')
  }
}

/**
 * 今日运势
 */
function showFortune() {
  emit('show-fortune')
}

/**
 * 戳脸玩 - 显示逃跑脸
 */
function startPokeFace() {
  showPokeFace.value = true
  pokePos.value = {
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
  }
  setTimeout(() => {
    showPokeFace.value = false
  }, 3000)
}

/**
 * 随机夸夸
 */
function randomPraise() {
  const line = PRAISE_LINES[Math.floor(Math.random() * PRAISE_LINES.length)]
  showToast(line)
  appStore.addHeartScore(3)
}

/**
 * 猪猪雨
 */
function pigRain() {
  emit('pig-rain')
  showToast('🐷 猪猪雨来袭！')
}

/**
 * 戳脸逃跑
 */
function pokeFace() {
  pokePos.value = {
    x: 10 + Math.random() * 70,
    y: 10 + Math.random() * 70,
  }
  showToast('别戳我脸！… 好吧再戳一下 😳')
}
</script>

<template>
  <div class="relative">
    <!-- 搞怪按钮栏 -->
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        class="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-xs text-night/60 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        @click="throwChicken"
      >
        🍗 扔鸡腿
      </button>
      <button
        type="button"
        class="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-xs text-night/60 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        @click="showFortune"
      >
        🔮 今日运势
      </button>
      <button
        type="button"
        class="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-xs text-night/60 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        @click="startPokeFace"
      >
        👉 戳脸玩
      </button>
      <button
        type="button"
        class="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-xs text-night/60 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        @click="randomPraise"
      >
        💖 随机夸夸
      </button>
      <button
        type="button"
        class="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-xs text-night/60 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
        @click="pigRain"
      >
        🐷 猪猪雨
      </button>
    </div>

    <!-- 戳脸玩逃跑层 -->
    <div
      v-if="showPokeFace"
      class="fixed inset-0 z-[55]"
      @click="showPokeFace = false"
    >
      <div
        class="absolute cursor-pointer select-none text-4xl transition-all"
        :style="{ left: pokePos.x + '%', top: pokePos.y + '%' }"
        @click.stop="pokeFace"
      >
        🐷
      </div>
    </div>
  </div>
</template>
