/**
 * ================================================================
 * 应用入口
 * 初始化 Vue3 + Pinia + Ant Design Vue
 * ================================================================
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'

import 'ant-design-vue/dist/reset.css'
import './assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Antd)
app.mount('#app')
