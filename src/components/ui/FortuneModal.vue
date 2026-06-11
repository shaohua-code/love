<script setup lang="ts">
/**
 * ================================================================
 * 今日运势弹窗组件
 * 随机显示运势文案，带旋转动画
 * ================================================================ */
import { ref, watch } from 'vue'
import { FORTUNE_LINES } from '@/utils/constants'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)
const fortuneText = ref('正在翻牌…')
const fortuneEmoji = ref('🎱')
const isSpinning = ref(false)

watch(() => props.visible, (v) => {
  if (v) {
    show.value = true
    isSpinning.value = true
    fortuneText.value = '正在翻牌…'
    const emojis = ['🎱', '🔮', '✨', '🌙', '⭐']
    fortuneEmoji.value = emojis[Math.floor(Math.random() * emojis.length)]
    setTimeout(() => {
      isSpinning.value = false
      fortuneText.value = FORTUNE_LINES[Math.floor(Math.random() * FORTUNE_LINES.length)]
    }, 800)
  } else {
    show.value = false
  }
})

function onClose() {
  show.value = false
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[65] flex items-center justify-center bg-night/40 px-6 backdrop-blur-sm"
    @click="onClose"
  >
    <div
      class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl"
      @click.stop
    >
      <p
        class="text-3xl"
        :class="isSpinning ? 'animate-[spinFortune_0.8s_ease-out]' : ''"
      >
        {{ fortuneEmoji }}
      </p>
      <p class="mt-2 text-xs tracking-widest text-dusk/70">今日运势</p>
      <p class="mt-3 font-serif text-sm leading-relaxed text-night/80">
        {{ fortuneText }}
      </p>
      <button
        type="button"
        class="mt-5 rounded-full border border-rose/30 px-8 py-2 text-xs text-night/60 active:scale-95"
        @click="onClose"
      >
        信则有不信…也则有
      </button>
    </div>
  </div>
</template>
