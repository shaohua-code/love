/**
 * ================================================================
 * 全局应用状态管理 (Pinia)
 * 管理心动值、对话历史、流式状态等核心数据
 * ================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage } from '@/utils/api'
import { createInitialMessages } from '@/utils/api'

export const useAppStore = defineStore('app', () => {
  // ==================== 状态 ====================

  /** 是否处于开场界面 */
  const isIntroActive = ref(true)

  /** 心动值 0-100 */
  const heartScore = ref(0)

  /** 心动值是否已达满值 */
  const heartMaxed = ref(false)

  /** 对话消息历史 */
  const messages = ref<ChatMessage[]>(createInitialMessages())

  /** 是否正在流式输出中 */
  const isStreaming = ref(false)

  /** 当前活跃的 API 端点索引 */
  const activeEndpointIndex = ref(0)

  /** 状态提示文字 */
  const statusTip = ref('')

  // ==================== 计算属性 ====================

  /** 心动值百分比 */
  const heartPercent = computed(() => `${heartScore.value}%`)

  /** 心动值显示文本 */
  const heartScoreText = computed(() => `${heartScore.value} / 100`)

  // ==================== 方法 ====================

  /**
   * 增加心动值
   * @param points - 增加的分数
   */
  function addHeartScore(points: number): void {
    if (heartMaxed.value) return
    heartScore.value = Math.min(100, heartScore.value + points)
    if (heartScore.value >= 100 && !heartMaxed.value) {
      heartMaxed.value = true
    }
  }

  /**
   * 设置开场状态
   */
  function setIntroActive(active: boolean): void {
    isIntroActive.value = active
  }

  /**
   * 添加用户消息
   */
  function addUserMessage(content: string): void {
    messages.value.push({ role: 'user', content })
  }

  /**
   * 添加 AI 消息
   */
  function addAiMessage(content: string): void {
    messages.value.push({ role: 'assistant', content })
  }

  /**
   * 移除最后一条消息（用于出错时回滚）
   */
  function removeLastMessage(): void {
    messages.value.pop()
  }

  /**
   * 设置流式状态
   */
  function setStreaming(streaming: boolean): void {
    isStreaming.value = streaming
  }

  /**
   * 设置 API 端点索引
   */
  function setEndpointIndex(index: number): void {
    activeEndpointIndex.value = index
  }

  /**
   * 设置状态提示
   */
  function setStatusTip(tip: string): void {
    statusTip.value = tip
  }

  return {
    // 状态
    isIntroActive,
    heartScore,
    heartMaxed,
    messages,
    isStreaming,
    activeEndpointIndex,
    statusTip,
    // 计算属性
    heartPercent,
    heartScoreText,
    // 方法
    addHeartScore,
    setIntroActive,
    addUserMessage,
    addAiMessage,
    removeLastMessage,
    setStreaming,
    setEndpointIndex,
    setStatusTip,
  }
})
