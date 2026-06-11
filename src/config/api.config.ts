/**
 * ================================================================
 * DeepSeek API 配置
 * 所有接口相关参数集中在此，修改前请阅读每项注释
 * ================================================================
 */

/** DeepSeek API 密钥，从环境变量读取，打包后写入构建产物 */
export const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || ''

/**
 * 对话模型名称（同一 API Key 通用）
 * - deepseek-chat    → V3 通用对话，响应快，适合日常聊天
 * - deepseek-reasoner → R1 推理模型，能力更强，响应稍慢
 */
export const MODEL_NAME = 'deepseek-chat'

/**
 * 创造性参数，范围 0~2
 * 越高回复越随机浪漫，越低越稳定克制
 */
export const TEMPERATURE = 0.9

/** 单次回复最大 token 数，超出会被截断 */
export const MAX_TOKENS = 2048

/** 单次请求超时时间（毫秒），超时后尝试下一个端点 */
export const REQUEST_TIMEOUT_MS = 60000

/** 端点探测超时（毫秒），启动时静默检测可用线路 */
export const PROBE_TIMEOUT_MS = 8000

/** DeepSeek 官方 API 根地址 */
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

/**
 * 用户自建的 Cloudflare Worker 代理地址
 * 生产静态 HTML 部署时优先使用，SSE 流式最稳定
 */
export const PROXY_URL = import.meta.env.VITE_PROXY_URL || ''

/** 是否为开发环境（Vite dev server 可走本地代理） */
export const IS_DEV = import.meta.env.DEV

/**
 * API 端点定义
 * name: 端点标识，用于日志和状态提示
 * url:  请求地址
 * buildHeaders: 构建请求头（含 Authorization）
 */
export interface ApiEndpoint {
  name: string
  url: string
  buildHeaders: () => Record<string, string>
}

/**
 * 构建 Authorization 请求头
 */
function buildAuthHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  }
}

/**
 * 按优先级返回可用端点列表
 * 1. 开发环境 Vite 代理（无跨域）
 * 2. 用户自建 Worker 代理（生产推荐）
 * 3. 公共 CORS 代理兜底
 * 4. 直连官方 API（浏览器通常被 CORS 拦截，作最后尝试）
 */
export function getApiEndpoints(): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = []

  // 开发环境：走 Vite dev server 代理，解决本地跨域
  if (IS_DEV) {
    endpoints.push({
      name: 'vite-proxy',
      url: '/api/deepseek/chat/completions',
      buildHeaders: buildAuthHeaders,
    })
  }

  // 生产环境：用户自建的 Cloudflare Worker
  if (PROXY_URL) {
    // Worker 根路径即代理入口，内部转发至 DeepSeek API
    endpoints.push({
      name: 'worker-proxy',
      url: PROXY_URL.replace(/\/$/, ''),
      buildHeaders: buildAuthHeaders,
    })
  }

  // 公共 CORS 代理兜底（SSE 稳定性一般，仅作备选）
  endpoints.push({
    name: 'cors-proxy',
    url: 'https://corsproxy.io/?' + encodeURIComponent(DEEPSEEK_API_URL),
    buildHeaders: buildAuthHeaders,
  })

  // 直连官方 API（纯静态 HTML 通常被浏览器 CORS 策略拦截）
  endpoints.push({
    name: 'direct',
    url: DEEPSEEK_API_URL,
    buildHeaders: buildAuthHeaders,
  })

  return endpoints
}
