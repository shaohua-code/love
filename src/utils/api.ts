/**
 * ================================================================
 * API 工具（兼容层）
 * 实际逻辑已迁移至 services/chatApi.ts
 * ================================================================
 */

export {
  type ChatMessage,
  createInitialMessages,
  probeEndpoint,
  parseSSEStream,
  formatError,
} from '@/services/chatApi'
