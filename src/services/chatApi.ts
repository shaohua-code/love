/**
 * ================================================================
 * 聊天 API 服务层
 * 封装 DeepSeek 请求发送、SSE 流式解析、端点探测
 * ================================================================
 */

import {
  MODEL_NAME,
  TEMPERATURE,
  MAX_TOKENS,
  REQUEST_TIMEOUT_MS,
  PROBE_TIMEOUT_MS,
  getApiEndpoints,
  type ApiEndpoint,
} from '@/config/api.config'
import { buildSystemPrompt } from '@/utils/constants'

/** 聊天消息类型（与 DeepSeek API 格式一致） */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/** 流式聊天请求参数 */
export interface StreamChatOptions {
  messages: ChatMessage[]
  activeEndpointIndex: number
  onDelta: (content: string) => void
  onEndpointSwitch?: (tip: string) => void
}

/** 流式聊天结果 */
export interface StreamChatResult {
  content: string
  endpointIndex: number
}

/**
 * 创建初始消息列表（含系统提示词）
 */
export function createInitialMessages(): ChatMessage[] {
  return [{ role: 'system', content: buildSystemPrompt() }]
}

/**
 * 静默探测可用 API 端点，返回可用端点索引
 */
export async function probeEndpoint(): Promise<number> {
  const endpoints = getApiEndpoints()
  const payload = {
    model: MODEL_NAME,
    messages: [{ role: 'user', content: 'hi' }],
    stream: false,
    max_tokens: 1,
  }

  for (let i = 0; i < endpoints.length; i++) {
    const target = endpoints[i]
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
      const res = await fetch(target.url, {
        method: 'POST',
        headers: target.buildHeaders(),
        body: JSON.stringify(payload),
        mode: 'cors',
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (res.ok) return i
    } catch {
      // 尝试下一个端点
    }
  }

  return 0
}

/**
 * 解析 SSE 流式响应
 * 兼容 deepseek-chat 与 deepseek-reasoner（仅展示 content，忽略 reasoning_content）
 */
export async function parseSSEStream(
  response: Response,
  onDelta: (content: string) => void
): Promise<string> {
  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let fullContent = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line || !line.startsWith('data:')) continue

        const data = line.slice(5).trim()
        if (data === '[DONE]') continue

        try {
          const json = JSON.parse(data)
          const delta = json.choices?.[0]?.delta
          if (!delta) continue

          // reasoner 模型推理阶段在 reasoning_content，最终回复在 content
          const text = delta.content || ''
          if (text) {
            fullContent += text
            onDelta(fullContent)
          }
        } catch {
          // 跳过无法解析的行
        }
      }
    }
  } catch {
    // 流读取中断
  }

  return fullContent
}

/**
 * 格式化错误信息为用户友好提示
 */
export function formatError(err: unknown): string {
  const msg = (err as Error)?.message || ''
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return '网络或跨域受限，已尝试备用线路，请检查网络'
  }
  if (msg.includes('401')) {
    return 'API 密钥无效，请检查 .env 配置'
  }
  if (msg.includes('429')) {
    return '请求太频繁，稍后再试'
  }
  if (msg.includes('abort')) {
    return '请求超时，请稍后重试'
  }
  return '请求失败，请稍后重试'
}

/**
 * 向指定端点发起流式聊天请求
 */
async function fetchStreamFromEndpoint(
  target: ApiEndpoint,
  messages: ChatMessage[],
  onDelta: (content: string) => void
): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const payload = {
    model: MODEL_NAME,
    messages,
    stream: true,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
  }

  try {
    const response = await fetch(target.url, {
      method: 'POST',
      headers: target.buildHeaders(),
      body: JSON.stringify(payload),
      mode: 'cors',
      signal: controller.signal,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errText.slice(0, 120)}`)
    }

    return await parseSSEStream(response, onDelta)
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 流式聊天主入口，自动 failover 多端点
 */
export async function streamChat(options: StreamChatOptions): Promise<StreamChatResult> {
  const endpoints = getApiEndpoints()
  let lastError: unknown = null

  for (let attempt = 0; attempt < endpoints.length; attempt++) {
    const idx = (options.activeEndpointIndex + attempt) % endpoints.length
    const target = endpoints[idx]

    try {
      if (attempt > 0) {
        options.onEndpointSwitch?.('已切换备用线路...')
      } else {
        options.onEndpointSwitch?.('')
      }

      const content = await fetchStreamFromEndpoint(
        target,
        options.messages,
        options.onDelta
      )

      return { content, endpointIndex: idx }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('所有端点均不可用')
}
