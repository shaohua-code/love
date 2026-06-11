<script setup lang="ts">
/**
 * ================================================================
 * Markdown 渲染组件
 * 使用 markdown-it + highlight.js 渲染 AI 回复内容
 * ================================================================
 */
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

defineOptions({
  name: 'RenderMD',
})

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  breaks: true,
  // markdown-it 要求 highlight 为函数，不能传 true
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        return ''
      }
    }
    return ''
  },
})

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '',
  }
)

// 将 Markdown 文本转为 HTML
const renderedContent = computed(() =>
  props.content ? md.render(props.content) : ''
)

const contentRef = ref<HTMLElement | null>(null)

const getContentRef = () => contentRef.value
const getContentCtx = () => props.content

defineExpose({
  getContentRef,
  getContentCtx,
})
</script>

<template>
  <div
    ref="contentRef"
    v-html="renderedContent"
    class="p-0 text-sm leading-relaxed text-night/80"
  ></div>
</template>
