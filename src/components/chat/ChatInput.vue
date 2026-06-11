<script setup lang="ts">
/**
 * ================================================================
 * 聊天输入框组件
 * 基于 Ant Design Vue，支持 placeholder 轮播与彩蛋检测
 * ================================================================
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEasterEggStore } from '@/stores/easterEgg'
import { PLACEHOLDER_LINES, TARGET_NAME } from '@/utils/constants'
import { showToast } from '@/composables/useToast'

const emit = defineEmits<{
  send: [text: string]
  'pig-rain': []
}>()

const appStore = useAppStore()
const easterEggStore = useEasterEggStore()

const inputText = ref('')
const placeholderIdx = ref(0)
let placeholderTimer: ReturnType<typeof setInterval> | null = null

/**
 * 发送消息
 */
function onSend() {
  const text = inputText.value.trim()
  if (!text || appStore.isStreaming) return

  // 检测输入暗号
  if (text === TARGET_NAME) {
    showToast(`🐷 ${TARGET_NAME} 猪猪雨！`)
    emit('pig-rain')
    inputText.value = ''
    return
  }

  // 发送按钮彩蛋
  easterEggStore.incrementSendBtnClick()
  if (easterEggStore.sendBtnClickCount % 7 === 0) {
    showToast('😘 抛个媚眼～')
  }

  emit('send', text)
  console.log('ewqe ');
  nextTick(() => {
    inputText.value = ''
  })  
}

/**
 * 键盘事件：Enter 发送，Shift+Enter 换行
 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
  }
}

/**
 * 键盘暗号检测
 */
function onKeyup(e: KeyboardEvent) {
  easterEggStore.recordKey(e.key)
  if (easterEggStore.checkSecret('pigpig') || easterEggStore.checkSecret(TARGET_NAME)) {
    easterEggStore.clearSecret()
    showToast('🐷 猪猪雨！')
    emit('pig-rain')
  }
}

onMounted(() => {
  placeholderTimer = setInterval(() => {
    placeholderIdx.value = (placeholderIdx.value + 1) % PLACEHOLDER_LINES.length
  }, 4000)
})

onUnmounted(() => {
  if (placeholderTimer) clearInterval(placeholderTimer)
})
</script>

<template>
  <div class="flex items-end gap-2.5">
    <div class="flex-1 overflow-hidden rounded-2xl border border-night/15 bg-night/5 shadow-inner backdrop-blur-md">
      <a-textarea
        v-model:value="inputText"
        :placeholder="PLACEHOLDER_LINES[placeholderIdx]"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        :disabled="appStore.isStreaming"
        :bordered="false"
        class="bg-transparent"
        @keydown="onKeydown"
        @keyup="onKeyup"
      />
    </div>
    <a-button
      type="primary"
      shape="circle"
      size="large"
      class="shrink-0 shadow-md"
      :disabled="!inputText.trim() || appStore.isStreaming"
      :loading="appStore.isStreaming"
      @click="onSend"
    >
      💌
    </a-button>
  </div>
</template>
