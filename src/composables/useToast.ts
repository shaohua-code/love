/**
 * ================================================================
 * Toast 提示 Composable
 * 全局轻量消息提示
 * ================================================================ */

import { ref } from 'vue'

/** 当前显示的 Toast 文本 */
const toastText = ref('')

/** Toast 是否可见 */
const toastVisible = ref(false)

/** 定时器引用 */
let toastTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 显示 Toast 提示
 * @param text - 提示内容
 * @param duration - 显示时长(ms)
 */
export function showToast(text: string, duration = 2800): void {
  toastText.value = text
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, duration)
}

/**
 * 在组合式函数中使用 Toast
 */
export function useToast() {
  return {
    toastText,
    toastVisible,
    showToast,
  }
}
