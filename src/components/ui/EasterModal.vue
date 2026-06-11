<script setup lang="ts">
/**
 * ================================================================
 * 沙雕彩蛋弹窗组件
 * 长按标题等触发的特殊弹窗
 * ================================================================ */
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  text: string
}>()

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)

watch(() => props.visible, (v) => {
  show.value = v
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
      <p class="text-2xl">💓</p>
      <p class="mt-3 font-serif text-sm leading-relaxed text-night/80">
        {{ text }}
      </p>
      <button
        type="button"
        class="mt-5 rounded-full bg-gradient-to-r from-rose to-dusk px-8 py-2 text-xs text-white shadow-md active:scale-95"
        @click="onClose"
      >
        好吧好吧
      </button>
    </div>
  </div>
</template>
