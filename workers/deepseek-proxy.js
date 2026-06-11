/**
 * ================================================================
 * Cloudflare Worker - DeepSeek API 代理
 *
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard → Workers & Pages → 创建 Worker
 * 2. 将此文件内容粘贴到 Worker 编辑器并部署
 * 3. 在 .env 中设置 VITE_PROXY_URL=https://your-worker.workers.dev
 * 4. 重新打包前端：npm run build
 *
 * 作用：解决纯静态 HTML 部署时浏览器直连 DeepSeek 的 CORS 限制，
 *       同时完整透传 SSE 流式响应。
 * ================================================================
 */

const DEEPSEEK_API = 'https://api.deepseek.com/chat/completions'

// 允许的前端来源，部署后请改为你的实际域名
const ALLOWED_ORIGINS = ['*']

export default {
  async fetch(request) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) })
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      const body = await request.text()
      const authHeader = request.headers.get('Authorization') || ''

      const upstream = await fetch(DEEPSEEK_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body,
      })

      // 透传 SSE 流式响应
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          ...corsHeaders(request),
          'Content-Type': upstream.headers.get('Content-Type') || 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      })
    }
  },
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*'
  const allowed = ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}
