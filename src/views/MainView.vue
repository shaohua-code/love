<script setup lang="ts">
/**
 * ================================================================
 * 主界面视图
 * 固定底部输入框，消息区可滚动，集成 Ant Design Vue
 * ================================================================
 */
import { ref, watch, nextTick, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useEasterEggStore } from "@/stores/easterEgg";
import { useChat } from "@/composables/useChat";
import { useBackground } from "@/composables/useBackground";
import { showToast } from "@/composables/useToast";

import HeartMeter from "@/components/main/HeartMeter.vue";
import MoodCard from "@/components/main/MoodCard.vue";
import MischiefBar from "@/components/main/MischiefBar.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import QuickChips from "@/components/chat/QuickChips.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import FortuneModal from "@/components/ui/FortuneModal.vue";
import FloatHearts from "@/components/background/FloatHearts.vue";

import { AVATAR_QUIPS } from "@/utils/constants";

const appStore = useAppStore();
const easterEggStore = useEasterEggStore();
const { displayMessages, sendMessage, sendQuickChip } = useChat();
const {
  backgroundList,
  currentBgIndex,
  isMusicPlaying,
  toggleMusic,
  setBackground,
  preloadAllBackgrounds,
} = useBackground();

const showFortune = ref(false);
const showSettings = ref(false);
const floatHeartsRef = ref<InstanceType<typeof FloatHearts> | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const emojiRainRef = ref<HTMLElement | null>(null);

/**
 * 消息列表变化时自动滚到底部
 */
watch(
  displayMessages,
  () => {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  },
  { deep: true },
);

/**
 * 扔鸡腿特效
 */
function onThrowChicken() {
  if (!emojiRainRef.value) return;
  const el = document.createElement("div");
  el.textContent = "🍗";
  el.className = "absolute";
  el.style.cssText = `
    top:${15 + Math.random() * 50}%;left:0;
    font-size:1.8rem;
    animation: flyAcross ${2 + Math.random()}s linear forwards;
  `;
  emojiRainRef.value.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/**
 * 猪猪雨特效
 */
function onPigRain() {
  if (!emojiRainRef.value) return;
  const pigs = ["🐷", "🐽", "💗", "🐷", "✨"];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement("div");
    el.textContent = pigs[Math.floor(Math.random() * pigs.length)];
    el.className = "absolute text-xl";
    el.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
      animation-delay:${Math.random() * 0.8}s;
    `;
    emojiRainRef.value.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

/**
 * 打开氛围设置时预加载所有背景缩略图
 */
async function onOpenSettings() {
  showSettings.value = true;
  await preloadAllBackgrounds();
}

/**
 * 返回开场首页
 */
function onGoHome() {
  showSettings.value = false;
  appStore.setIntroActive(true);
  showToast("回到心语亭门口～");
}

function onSend(text: string) {
  sendMessage(text);
}

function onQuickChip(index: number) {
  sendQuickChip(index);
}

function onAvatarClick() {
  const quip = AVATAR_QUIPS[Math.floor(Math.random() * AVATAR_QUIPS.length)];
  showToast(quip);
}

function onFooterClick() {
  easterEggStore.incrementFooterClick();
  if (easterEggStore.footerClickCount >= 5) {
    easterEggStore.footerClickCount = 0;
    if (!emojiRainRef.value) return;
    const emojis = ["🍗", "💗", "✨", "⭐", "🌸", "💫", "🥰", "🐷", "🐱"];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement("div");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.className = "absolute text-xl";
      el.style.cssText = `
        left:${Math.random() * 100}%;top:-5%;
        animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
        animation-delay:${Math.random() * 0.8}s;
      `;
      emojiRainRef.value.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }
}

function onDeviceMotion(e: DeviceMotionEvent) {
  const acc = e.accelerationIncludingGravity;
  if (!acc) return;
  const total =
    Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
  if (total > 25) {
    showToast("🎉 摇一摇彩蛋！");
    onPigRain();
  }
}

onMounted(() => {
  if (floatHeartsRef.value) {
    floatHeartsRef.value.startAutoSpawn(12000);
  }
  if ("DeviceMotionEvent" in window) {
    window.addEventListener("devicemotion", onDeviceMotion);
  }
});
</script>

<template>
  <div class="relative z-20 flex h-screen flex-col">
    <!-- 飞行道具层 -->
    <div
      ref="emojiRainRef"
      class="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    ></div>

    <!-- 可收集浮动物品 -->
    <FloatHearts ref="floatHeartsRef" />

    <!-- 顶部信息栏 -->
    <div
      class="flex w-full shrink-0 items-center justify-between gap-2 px-3 py-1.5"
    >
      <div class="flex shrink-0 items-center gap-1.5">
        <!-- 顶部操作按钮：毛玻璃圆钮，与搞怪栏风格统一 -->
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose/25 bg-white/65 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-rose/45 hover:bg-white/85 active:scale-95"
          @click="onGoHome"
        >
          🏠
        </button>
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose/25 bg-white/65 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-rose/45 hover:bg-white/85 active:scale-95"
          @click="onAvatarClick"
        >
          💗
        </button>
      </div>
      <div class="mx-auto w-full max-w-sm mb-2">
        <HeartMeter />
      </div>
      <button
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose/25 bg-white/65 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-rose/45 hover:bg-white/85 active:scale-95"
        @click="onOpenSettings"
      >
        ⚙️
      </button>
    </div>

    <!-- 心情签 + 工具栏：横向排列减少纵向占用 -->
    <div class="px-3">
      <div class="mx-auto w-full max-w-sm mb-2"><MoodCard /></div>

      <MischiefBar
        class="md:shrink-0"
        @throw-chicken="onThrowChicken"
        @pig-rain="onPigRain"
        @show-fortune="showFortune = true"
      />
    </div>

    <!-- 消息滚动区：basis-0 确保 flex 剩余空间优先分配给对话区 -->
    <div
      ref="chatContainer"
      class="flex min-h-0 flex-1 basis-0 flex-col gap-3 overflow-y-auto px-3 py-2"
    >
      <ChatMessage v-for="msg in displayMessages" :key="msg.id" :msg="msg" />
    </div>

    <!-- 底部固定输入区：压缩内边距为对话区腾出空间 -->
    <div class="w-full shrink-0 px-2 pb-2 pt-0">
      <div class="rounded-3xl bg-transparent px-2 py-1.5">
        <!-- 快捷按钮 -->
        <QuickChips @select="onQuickChip" />
        <!-- 分隔线 -->
        <div
          class="my-1.5 h-px bg-gradient-to-r from-transparent via-night/15 to-transparent"
        ></div>
        <!-- 输入框 -->
        <ChatInput @send="onSend" @pig-rain="onPigRain" />
        <p
          v-if="appStore.statusTip"
          class="mt-1 text-center text-[10px] text-dusk/50"
        >
          {{ appStore.statusTip }}
        </p>
        <!-- 底部装饰 -->
        <div
          class="mt-1 cursor-pointer select-none text-center text-[10px] tracking-wider text-night/25 transition-colors hover:text-rose/50"
          @click="onFooterClick"
        >
          ✦ 心语亭 · 深夜絮语 · 为你而亮 ✦
        </div>
      </div>
    </div>

    <!-- 运势弹窗 -->
    <FortuneModal v-model:visible="showFortune" />

    <!-- TODO: 背景图切换入口 - 后期可扩展为相册模式 / 幻灯片播放 -->
    <a-drawer
      v-model:open="showSettings"
      title="氛围设置"
      placement="right"
      :width="280"
    >
      <!-- 背景音乐开关 -->
      <div class="mb-6 flex items-center justify-between">
        <span class="text-sm text-night/70">背景音乐</span>
        <a-switch :checked="isMusicPlaying" @change="toggleMusic" />
      </div>

      <!-- 返回首页 -->
      <a-button block class="mb-6" @click="onGoHome"> 🏠 返回首页 </a-button>

      <!-- 背景图切换 -->
      <p class="mb-3 text-sm text-night/70">背景图片</p>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="bg in backgroundList"
          :key="bg.index"
          type="button"
          class="relative aspect-square overflow-hidden rounded-xl border-2 transition-all"
          :class="
            currentBgIndex === bg.index
              ? 'border-rose shadow-md'
              : 'border-rose/10'
          "
          @click="setBackground(bg.index)"
        >
          <!-- 缩略图加载完成才渲染 img，避免空 src 显示破裂图 -->
          <img
            v-if="bg.loaded"
            :src="bg.url"
            :alt="`背景 ${bg.index + 1}`"
            class="h-full w-full object-cover"
          />
          <!-- 加载中占位 -->
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush/40 to-petal/60"
          >
            <a-spin v-if="bg.loading" size="small" />
            <span v-else class="text-xs text-night/30">{{ bg.index + 1 }}</span>
          </div>
          <!-- 选中角标 -->
          <div
            v-if="currentBgIndex === bg.index"
            class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[8px] text-white"
          >
            ✓
          </div>
        </button>
      </div>
    </a-drawer>
  </div>
</template>
