/**
 * ================================================================
 * AI 对话逻辑 Composable
 * 封装消息管理、发送入口，API 调用委托 chatApi 服务层
 * ================================================================
 */

import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEasterEggStore } from '@/stores/easterEgg'
import { TARGET_NAME, QUICK_CHIPS } from '@/utils/constants'
import { streamChat, formatError, probeEndpoint } from '@/services/chatApi'

/**
 * 单条对话消息的显示结构
 */
export interface DisplayMessage {
  id: number
  role: 'user' | 'assistant' | 'error'
  content: string
  /** 流式输出中显示加载动画 */
  loading?: boolean
}

let msgIdCounter = 0

export function useChat() {
  const appStore = useAppStore()
  const easterEggStore = useEasterEggStore()

  /** 显示在界面上的消息列表 */
  const displayMessages = ref<DisplayMessage[]>([
    {
      id: msgIdCounter++,
      role: 'assistant',
      content: `你好，${TARGET_NAME}。\n\n今晚的风很温柔。有什么想聊的，或者说不出口的心事，都可以告诉我。我会慢慢听，轻轻说。`,
    },
  ])

  /**
   * 添加用户消息到显示列表
   */
  function appendUserMessage(text: string): void {
    displayMessages.value.push({
      id: msgIdCounter++,
      role: 'user',
      content: text,
    })
  }

  /**
   * 添加 AI 消息占位，返回消息在数组中的索引（用于响应式更新）
   */
  function appendAiPlaceholder(): number {
    displayMessages.value.push({
      id: msgIdCounter++,
      role: 'assistant',
      content: '',
      loading: true,
    })
    return displayMessages.value.length - 1
  }

  /**
   * 通过索引更新 AI 消息（确保触发 Vue 响应式）
   */
  function updateAiMessage(index: number, content: string, loading = false): void {
    const msg = displayMessages.value[index]
    if (!msg) return
    displayMessages.value[index] = {
      ...msg,
      content,
      loading,
    }
  }

  /**
   * 添加错误消息
   */
  function appendErrorMessage(text: string): void {
    displayMessages.value.push({
      id: msgIdCounter++,
      role: 'error',
      content: text,
    })
  }

  /**
   * 发起流式聊天请求
   */
  async function doStreamChat(userText: string): Promise<void> {
    appStore.addUserMessage(userText)

    const aiMsgIndex = appendAiPlaceholder()
    let lastError: unknown = null

    try {
      const result = await streamChat({
        messages: appStore.messages,
        activeEndpointIndex: appStore.activeEndpointIndex,
        onDelta: (content) => {
          // 首 token 到达后关闭 loading，实时更新内容
          updateAiMessage(aiMsgIndex, content, false)
        },
        onEndpointSwitch: (tip) => {
          appStore.setStatusTip(tip)
        },
      })

      appStore.setEndpointIndex(result.endpointIndex)
      appStore.setStatusTip('')

      if (!result.content?.trim()) {
        updateAiMessage(aiMsgIndex, '未获取到有效内容，请尝试重新提问', false)
      } else {
        updateAiMessage(aiMsgIndex, result.content, false)
        appStore.addAiMessage(result.content)
      }

      appStore.addHeartScore(8)
    } catch (err) {
      lastError = err
      updateAiMessage(aiMsgIndex, `连接失败: ${formatError(err)}`, false)
      appendErrorMessage('连接不太顺畅，稍后再试试？')
      appStore.removeLastMessage()
      appStore.setStatusTip(formatError(lastError))
    }
  }

  /**
   * 统一发送入口
   */
  async function sendMessage(text: string, displayText?: string): Promise<void> {
    if (!text || appStore.isStreaming) return

    appStore.setStreaming(true)
    appendUserMessage(displayText || text)

    try {
      await doStreamChat(text)
      const reward = easterEggStore.checkDaily('chat1')
      if (reward > 0) appStore.addHeartScore(reward)
    } finally {
      appStore.setStreaming(false)
    }
  }

  /**
   * 发送快捷按钮预设消息
   */
  async function sendQuickChip(chipIndex: number): Promise<void> {
    const chip = QUICK_CHIPS[chipIndex]
    if (!chip) return
    await sendMessage(chip.prompt, chip.label)
    const reward = easterEggStore.checkDaily('chip1')
    if (reward > 0) appStore.addHeartScore(reward)
  }

  /**
   * 探测 API 端点
   */
  async function checkEndpoint(): Promise<void> {
    const idx = await probeEndpoint()
    appStore.setEndpointIndex(idx)
  }

  return {
    displayMessages,
    sendMessage,
    sendQuickChip,
    checkEndpoint,
  }
}
