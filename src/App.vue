<script setup lang="ts">
/**
 * ================================================================
 * 根组件
 * 管理开场/主界面切换、全局背景图与特效层
 * ================================================================
 */
import { computed, defineAsyncComponent } from 'vue'
import { useAppStore } from '@/stores/app'
import { useBackground } from '@/composables/useBackground'
import Toast from '@/components/ui/Toast.vue'

// 懒加载视图，减少首屏加载体积
const IntroView = defineAsyncComponent(() => import('@/views/IntroView.vue'))
const MainView = defineAsyncComponent(() => import('@/views/MainView.vue'))

// 懒加载背景特效
const StarsBg = defineAsyncComponent(() => import('@/components/background/StarsBg.vue'))
const PetalsBg = defineAsyncComponent(() => import('@/components/background/PetalsBg.vue'))

const appStore = useAppStore()
const { currentBgUrl } = useBackground()

const showIntro = computed(() => appStore.isIntroActive)
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#e8a0b4',
        borderRadius: 12,
        fontFamily: 'Noto Sans SC, sans-serif',
      },
    }"
  >
    <div class="relative min-h-screen">
      <!-- 全屏背景图层 -->
      <div
        class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        :style="{ backgroundImage: currentBgUrl ? `url(${currentBgUrl})` : undefined }"
      >
        <!-- 半透明遮罩，保证前景文字可读 -->
        <div class="absolute inset-0 bg-gradient-to-br from-blush/80 via-cream/70 to-petal/80"></div>
      </div>

      <!-- 叠加星空与花瓣特效（降低透明度） -->
      <div class="pointer-events-none fixed inset-0 z-[1] opacity-40">
        <StarsBg />
        <PetalsBg />
      </div>

      <!-- 开场层 -->
      <Transition name="fade">
        <IntroView v-if="showIntro" />
      </Transition>

      <!-- 主界面 -->
      <Transition name="fade">
        <MainView v-if="!showIntro" />
      </Transition>

      <!-- 全局 Toast -->
      <Toast />
    </div>
  </a-config-provider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
