<script setup lang="ts">
/**
 * ================================================================
 * 单条聊天消息组件
 * 用户消息纯文本，AI 消息通过 RenderMD 渲染 Markdown
 * ================================================================
 */
import { computed } from 'vue'
import { AI_DISPLAY_NAME } from '@/utils/constants'
import type { DisplayMessage } from '@/composables/useChat'
import RenderMD from '@/components/chat/RenderMD.vue'

const props = defineProps<{
  msg: DisplayMessage
}>()

const isUser = computed(() => props.msg.role === 'user')
const isError = computed(() => props.msg.role === 'error')
</script>

<template>
  <!-- 用户消息 -->
  <div v-if="isUser" class="flex justify-end">
    <div class="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-br from-rose to-dusk px-4 py-3 text-sm text-white shadow-sm">
      {{ msg.content }}
    </div>
  </div>

  <!-- 错误消息 -->
  <div v-else-if="isError" class="flex justify-center">
    <div class="max-w-[80%] rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-center text-xs text-red-400">
      {{ msg.content }}
    </div>
  </div>

  <!-- AI 消息 -->
  <div v-else class="flex gap-3">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-dusk text-sm text-white shadow-sm">
      乐
    </div>
    <div class="max-w-[80%]">
      <p class="mb-1 text-[10px] text-dusk/50">{{ AI_DISPLAY_NAME }}</p>
      <div class="rounded-2xl rounded-tl-md border border-rose/10 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
        <!-- 流式加载中 -->
        <div v-if="msg.loading" class="flex items-center gap-2 text-sm text-night/40">
          <a-spin size="small" />
          <span>思考中...</span>
        </div>
        <!-- Markdown 内容渲染 -->
        <RenderMD v-else :content="msg.content" />
      </div>
    </div>
  </div>
</template>
