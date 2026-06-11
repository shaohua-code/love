/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** DeepSeek API 密钥 */
  readonly VITE_DEEPSEEK_API_KEY: string
  /** 生产环境 Cloudflare Worker 代理地址 */
  readonly VITE_PROXY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.m4a' {
  const src: string
  export default src
}
