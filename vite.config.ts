import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // 相对路径，支持纯静态 HTML 部署（GitHub Pages 等）
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 开发环境代理：解决浏览器直连 DeepSeek 的跨域限制
  server: {
    host:'0.0.0.0',
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      },
    },
    
  },
  build: {
    // 静态资源使用相对路径，支持纯 HTML 部署
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'pinia'],
          'antd': ['ant-design-vue'],
          'markdown': ['markdown-it', 'highlight.js'],
        },
      },
    },
  },
})
