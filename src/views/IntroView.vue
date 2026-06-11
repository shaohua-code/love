<script setup lang="ts">
/**
 * ================================================================
 * 开场体验视图
 * 包含吉祥物、工具栏、刮刮卡、滑动条、充能按钮、成就徽章
 * 以及各种小游戏弹窗
 * ================================================================ */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useIntroStore } from '@/stores/intro'
import { showToast } from '@/composables/useToast'
import { TARGET_NAME } from '@/config/app.config'
import {
  MASCOT_LINES,
  TYPEWRITER_LINES,
  ROULETTE_PRIZES,
  QUIZ_BANK,
  WHISPER_REJECTIONS,
  WHISPER_SUCCESS,
  DICE_RESULTS,
  HARD_COMPLIMENTS,
  INTRO_BADGES,
  INTRO_SOUND_BOARD,
  INTRO_IDLE_CHATTER,
  INTRO_PHOTO_FILTERS,
  INTRO_WELCOME_SEQUENCE,
  INTRO_MINI_GAMES_HELP,
  INTRO_TIPS_ROTATION,
  INTRO_STORY_CHAPTERS,
  INTRO_DIALOGUE_TREE,
} from '@/data/intro'

const appStore = useAppStore()
const introStore = useIntroStore()

// ==================== 弹窗状态 ====================
const showRoulette = ref(false)
const showQuiz = ref(false)
const showWhisper = ref(false)
const showDice = ref(false)
const showPraise = ref(false)
const showSound = ref(false)
const showStory = ref(false)
const showDialogue = ref(false)
const showHelp = ref(false)
const showAchievements = ref(false)
const showPhoto = ref(false)
const showRhythm = ref(false)
const showStars = ref(false)

// ==================== 游戏状态 ====================
const rouletteAngle = ref(0)
const quizIdx = ref(0)
const whisperText = ref('')
const diceResult = ref('')
const praiseText = ref('')
const photoFilter = ref(INTRO_PHOTO_FILTERS[0])
const rhythmScore = ref(0)
const rhythmTarget = ref(8)
const storyChapter = ref(0)
const dialogueText = ref('')
const dialogueChoices = ref<{ label: string; next: string }[]>([])
const typewriterText = ref('')
const typewriterIdx = ref(0)
const typewriterLineIdx = ref(0)
const mascotBubble = ref('')
const showBubble = ref(false)
const tipsIdx = ref(0)
let tipsTimer: ReturnType<typeof setInterval> | null = null
let idleTimer: ReturnType<typeof setTimeout> | null = null
let typewriterTimer: ReturnType<typeof setInterval> | null = null

// ==================== 其他状态 ====================
const scratchRevealed = ref(false)
const slideProgress = ref(0)
const isSliding = ref(false)
const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const tapFrenzyActive = ref(false)
const tapFrenzyCount = ref(0)
const catchPigActive = ref(false)
const catchPigCount = ref(0)
const catchPigPos = ref({ x: 50, y: 50 })
const catchPigVisible = ref(false)

// ==================== 方法 ====================

/**
 * 显示吉祥物气泡
 */
function showMascotBubble(text: string) {
  mascotBubble.value = text
  showBubble.value = true
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    showBubble.value = false
  }, 3000)
}

/**
 * 吉祥物点击
 */
function onMascotClick() {
  introStore.incrementMascotClick()
  if (introStore.mascotClickCount >= 5) {
    introStore.earnBadge('mascot')
    showToast('🐷 猪猪之友徽章！')
  }
  const line = MASCOT_LINES[Math.floor(Math.random() * MASCOT_LINES.length)]
  showMascotBubble(line)
}

/**
 * 标题点击（连点 7 次触发彩蛋）
 */
function onTitleClick() {
  introStore.incrementTitleClick()
  if (introStore.titleClickCount >= 7) {
    introStore.earnBadge('title')
    showToast('✨ 标题抖动徽章！')
    introStore.titleClickCount = 0
  }
}

/**
 * 标题长按（3 秒触发心跳异常弹窗）
 */
function onTitleTouchStart() {
  longPressTimer.value = setTimeout(() => {
    showToast('💓 心跳异常：检测到过度可爱')
  }, 3000)
}

function onTitleTouchEnd() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

/**
 * 刮刮卡
 */
function onScratch() {
  scratchRevealed.value = true
  introStore.addUnlock(15)
  introStore.earnBadge('scratch')
  showToast('🎫 刮刮达人徽章！')
}

let slideTrackRect: DOMRect | null = null

function onSlideStart(e: TouchEvent | MouseEvent) {
  isSliding.value = true
  slideTrackRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  if (e instanceof TouchEvent) {
    e.preventDefault()
    document.addEventListener('touchmove', onSlideMove, { passive: false })
    document.addEventListener('touchend', onSlideEnd)
    document.addEventListener('touchcancel', onSlideEnd)
  }
}

function onSlideMove(e: TouchEvent | MouseEvent) {
  if (!isSliding.value || !slideTrackRect) return
  if (e instanceof TouchEvent) e.preventDefault()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const progress = Math.min(100, Math.max(0, ((clientX - slideTrackRect.left) / slideTrackRect.width) * 100))
  slideProgress.value = progress
  if (progress >= 95) {
    cleanupSlide()
    introStore.addUnlock(15)
    introStore.earnBadge('slide')
    showToast('💗 滑入高手徽章！')
    tryEnterMain()
  }
}

function onSlideEnd() {
  if (slideProgress.value < 95) {
    slideProgress.value = 0
  }
  cleanupSlide()
}

function cleanupSlide() {
  isSliding.value = false
  slideTrackRect = null
  document.removeEventListener('touchmove', onSlideMove)
  document.removeEventListener('touchend', onSlideEnd)
  document.removeEventListener('touchcancel', onSlideEnd)
}

/**
 * 充能按钮
 */
function onChargeStart() {
  introStore.setCharging(true)
  let progress = 0
  const timer = setInterval(() => {
    progress += 2
    introStore.setChargeProgress(progress)
    if (progress >= 100) {
      clearInterval(timer)
      introStore.setCharging(false)
      introStore.addUnlock(15)
      introStore.earnBadge('charge')
      showToast('⚡ 充能达人徽章！')
      tryEnterMain()
    }
  }, 50)
}

function onChargeEnd() {
  introStore.setCharging(false)
  introStore.setChargeProgress(0)
}

/**
 * 转盘
 */
function spinRoulette() {
  rouletteAngle.value += 1080 + Math.random() * 360
  setTimeout(() => {
    const prize = ROULETTE_PRIZES[Math.floor(Math.random() * ROULETTE_PRIZES.length)]
    showToast(`${prize.emoji} ${prize.text}`)
    introStore.addUnlock(10)
    introStore.earnBadge('roulette')
    showRoulette.value = false
  }, 2000)
}

/**
 * 灵魂拷问
 */
function startQuiz() {
  quizIdx.value = Math.floor(Math.random() * QUIZ_BANK.length)
  showQuiz.value = true
}

function answerQuiz(idx: number) {
  const quiz = QUIZ_BANK[quizIdx.value]
  if (idx === quiz.correct) {
    showToast(`✅ ${quiz.reward}`)
    introStore.addUnlock(10)
    introStore.earnBadge('quiz')
  } else {
    showToast('❌ 答错啦，再试一次～')
  }
  showQuiz.value = false
}

/**
 * 悄悄话
 */
function onWhisperSubmit(name: string) {
  if (name.trim() === TARGET_NAME) {
    showToast(WHISPER_SUCCESS[Math.floor(Math.random() * WHISPER_SUCCESS.length)])
    introStore.addUnlock(15)
    introStore.earnBadge('whisper')
  } else {
    showToast(WHISPER_REJECTIONS[Math.floor(Math.random() * WHISPER_REJECTIONS.length)])
  }
  showWhisper.value = false
}

/**
 * 掷骰子
 */
function rollDice() {
  diceResult.value = DICE_RESULTS[Math.floor(Math.random() * DICE_RESULTS.length)]
  introStore.addUnlock(5)
}

/**
 * 硬夸
 */
function showHardPraise() {
  praiseText.value = HARD_COMPLIMENTS[Math.floor(Math.random() * HARD_COMPLIMENTS.length)]
  showPraise.value = true
  introStore.addUnlock(5)
}

/**
 * 疯狂点
 */
function startTapFrenzy() {
  tapFrenzyActive.value = true
  tapFrenzyCount.value = 0
  const timer = setInterval(() => {
    tapFrenzyCount.value++
    if (tapFrenzyCount.value >= 30) {
      clearInterval(timer)
      tapFrenzyActive.value = false
      introStore.addUnlock(10)
      introStore.earnBadge('tap')
      showToast('👆 点击狂魔徽章！')
    }
  }, 100)
  setTimeout(() => {
    clearInterval(timer)
    tapFrenzyActive.value = false
  }, 10000)
}

/**
 * 抓猪猪
 */
function startCatchPig() {
  catchPigActive.value = true
  catchPigCount.value = 0
  movePig()
}

function movePig() {
  if (!catchPigActive.value) return
  catchPigVisible.value = true
  catchPigPos.value = {
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }
  setTimeout(movePig, 800 + Math.random() * 600)
}

function onCatchPig() {
  catchPigCount.value++
  if (catchPigCount.value >= 4) {
    catchPigActive.value = false
    catchPigVisible.value = false
    introStore.addUnlock(10)
    introStore.earnBadge('catch')
    showToast('🏃 捕猪能手徽章！')
  }
}

/**
 * 音效板
 */
function playSound(item: typeof INTRO_SOUND_BOARD[0]) {
  showToast(`${item.emoji} ${item.text}`)
  introStore.addUnlock(3)
}

/**
 * 小故事
 */
function showStoryChapter() {
  showStory.value = true
  storyChapter.value = 0
}

function nextStoryChapter() {
  storyChapter.value++
  if (storyChapter.value >= INTRO_STORY_CHAPTERS.length) {
    showStory.value = false
    introStore.addUnlock(10)
  }
}

/**
 * 对话树
 */
function startDialogue() {
  showDialogue.value = true
  setDialogueNode('root')
}

function setDialogueNode(nodeId: string) {
  const node = INTRO_DIALOGUE_TREE[nodeId]
  if (!node) return
  if (node.text === '__DYNAMIC_SILLY__') {
    const silly = [
      `${TARGET_NAME} 今天吃了什么？`,
      '月亮好看还是你好看？',
      '鸡腿和抱抱选哪个？',
      '你觉得猪猪可爱吗？',
      '今晚想听什么故事？',
    ]
    dialogueText.value = silly[Math.floor(Math.random() * silly.length)]
  } else {
    dialogueText.value = node.text
  }
  dialogueChoices.value = node.choices
}

/**
 * 自拍滤镜
 */
function showPhotoFilter() {
  photoFilter.value = INTRO_PHOTO_FILTERS[Math.floor(Math.random() * INTRO_PHOTO_FILTERS.length)]
  showPhoto.value = true
  introStore.addUnlock(5)
  introStore.earnBadge('photo')
}

/**
 * 节奏游戏
 */
function startRhythm() {
  showRhythm.value = true
  rhythmScore.value = 0
  rhythmTarget.value = 8
}

function tapRhythm() {
  rhythmScore.value++
  if (rhythmScore.value >= rhythmTarget.value) {
    showRhythm.value = false
    introStore.addUnlock(10)
    introStore.earnBadge('rhythm')
    showToast('🎵 节奏大师徽章！')
  }
}

/**
 * 星座连线
 */
function startStars() {
  showStars.value = true
}

function connectStar() {
  introStore.addUnlock(5)
  introStore.earnBadge('stars')
  showToast('✨ 星座使者徽章！')
  showStars.value = false
}

/**
 * 玩法说明
 */
function showHelpModal() {
  showHelp.value = true
}

/**
 * 成就列表
 */
function showAchievementList() {
  showAchievements.value = true
}

/**
 * 尝试进入主界面
 */
function tryEnterMain() {
  if (introStore.isUnlocked) {
    showToast(`🎉 欢迎 ${TARGET_NAME}！`)
    appStore.setIntroActive(false)
  }
}

/**
 * 键盘监听（Konami 秘技）
 */
function onKeydown(e: KeyboardEvent) {
  if (introStore.recordKonamiKey(e.key)) {
    introStore.earnBadge('konami')
    showToast('🕹️ 秘技玩家徽章！')
    introStore.addUnlock(15)
  }
}

/**
 * 闲置闲聊
 */
function idleChatter() {
  if (Math.random() > 0.7) {
    const line = INTRO_IDLE_CHATTER[Math.floor(Math.random() * INTRO_IDLE_CHATTER.length)]
    showMascotBubble(line)
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 欢迎序列
  INTRO_WELCOME_SEQUENCE.forEach((step) => {
    setTimeout(() => {
      if (step.action === 'toast') {
        showToast(step.text)
      } else {
        showMascotBubble(step.text)
      }
    }, step.delay)
  })

  // 提示轮播
  tipsTimer = setInterval(() => {
    tipsIdx.value = (tipsIdx.value + 1) % INTRO_TIPS_ROTATION.length
  }, 6000)

  // 闲置闲聊
  const idleInterval = setInterval(idleChatter, 12000)

  // 打字机效果
  typewriterTimer = setInterval(() => {
    const line = TYPEWRITER_LINES[typewriterLineIdx.value]
    if (typewriterIdx.value < line.length) {
      typewriterText.value = line.slice(0, typewriterIdx.value + 1)
      typewriterIdx.value++
    } else {
      typewriterLineIdx.value = (typewriterLineIdx.value + 1) % TYPEWRITER_LINES.length
      typewriterIdx.value = 0
      typewriterText.value = ''
    }
  }, 150)

  // 键盘监听
  window.addEventListener('keydown', onKeydown)

  onUnmounted(() => {
    clearInterval(idleInterval)
    if (tipsTimer) clearInterval(tipsTimer)
    if (typewriterTimer) clearInterval(typewriterTimer)
    window.removeEventListener('keydown', onKeydown)
  })
})

// 监听解锁进度，检查组合技
watch(() => introStore.earnedBadges.size, () => {
  const combos = introStore.checkComboRewards()
  combos.forEach((text) => showToast(text))
  if (combos.length > 0) {
    introStore.earnBadge('combo')
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto px-4 py-8"
    style="background: linear-gradient(135deg, #2d1b36 0%, #4a2c5a 50%, #2d1b36 100%);"
  >
    <!-- 粒子背景 -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-30"></div>

    <!-- 标题 -->
    <div
      class="relative z-10 text-center"
      @click="onTitleClick"
      @touchstart="onTitleTouchStart"
      @touchend="onTitleTouchEnd"
      @mousedown="onTitleTouchStart"
      @mouseup="onTitleTouchEnd"
      @mouseleave="onTitleTouchEnd"
    >
      <h1 class="font-serif text-3xl font-light tracking-widest text-cream/90">
        乐乐是猪
      </h1>
      <p class="mt-1 text-xs tracking-[0.3em] text-cream/40">
        心语亭 · 深夜絮语
      </p>
      <p class="mt-2 text-[10px] tracking-widest text-cream/30">
        {{ typewriterText }}<span class="animate-pulse">|</span>
      </p>
    </div>

    <!-- 吉祥物 -->
    <div class="relative z-10 mt-8">
      <button
        type="button"
        class="intro-pig text-5xl transition-transform active:scale-110"
        @click="onMascotClick"
      >
        🐷
      </button>
      <div
        v-if="showBubble"
        class="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-rose/30 bg-white/90 px-3 py-1.5 text-xs text-night/70 shadow-lg backdrop-blur-sm"
      >
        {{ mascotBubble }}
      </div>
    </div>

    <!-- 解锁进度 -->
    <div class="relative z-10 mt-6 w-full max-w-xs">
      <div class="flex items-center justify-between text-[10px] text-cream/40">
        <span>解锁进度</span>
        <span>{{ introStore.unlockProgress }}%</span>
      </div>
      <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-cream/10">
        <div
          class="h-full rounded-full bg-gradient-to-r from-rose to-dusk transition-all duration-500"
          :style="{ width: introStore.unlockProgress + '%' }"
        ></div>
      </div>
      <p class="mt-1 text-center text-[10px] text-cream/30">
        {{ INTRO_TIPS_ROTATION[tipsIdx] }}
      </p>
    </div>

    <!-- 搞怪工具栏 -->
    <div class="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="(btn, i) in [
          { label: '🎰 转盘', action: () => showRoulette = true },
          { label: '📝 灵魂拷问', action: startQuiz },
          { label: '🏃 抓猪猪', action: startCatchPig },
          { label: '👆 疯狂点', action: startTapFrenzy },
          { label: '🤫 悄悄话', action: () => showWhisper = true },
          { label: '🕹️ 秘技', action: () => showToast('键盘输入 ↑↑↓↓←→←→') },
          { label: '🎲 掷骰子', action: () => { showDice = true; rollDice() } },
          { label: '💖 硬夸', action: showHardPraise },
          { label: '📸 自拍', action: showPhotoFilter },
          { label: '🎵 节奏', action: startRhythm },
          { label: '✨ 星座', action: startStars },
          { label: '🔊 音效板', action: () => showSound = true },
          { label: '📖 小故事', action: showStoryChapter },
          { label: '💬 问猪猪', action: startDialogue },
          { label: '❓ 玩法', action: showHelpModal },
        ]"
        :key="i"
        type="button"
        class="rounded-full border border-rose/20 bg-white/10 px-3 py-1.5 text-xs text-cream/70 backdrop-blur-sm transition-transform active:scale-95"
        @click="btn.action"
      >
        {{ btn.label }}
      </button>
    </div>

    <!-- 刮刮卡 -->
    <div class="relative z-10 mt-6 w-full max-w-xs">
      <div
        class="relative h-20 w-full cursor-pointer overflow-hidden rounded-xl border border-rose/20 bg-white/5"
        @click="onScratch"
      >
        <div class="flex h-full items-center justify-center text-xs text-cream/40">
          {{ scratchRevealed ? '✨ 你是最可爱的！' : '点击刮开' }}
        </div>
        <div
          v-if="!scratchRevealed"
          class="intro-scratch-cover absolute inset-0"
        ></div>
      </div>
    </div>

    <!-- 滑动进入条 -->
    <div class="relative z-10 mt-6 w-full max-w-xs">
      <div
        class="relative h-10 w-full cursor-pointer overflow-hidden rounded-full border border-rose/20 bg-white/5 select-none"
        @touchstart.prevent="onSlideStart"
        @mousedown="onSlideStart"
        @mousemove="onSlideMove"
        @mouseup="onSlideEnd"
        @mouseleave="onSlideEnd"
      >
        <div
          class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rose/40 to-dusk/40 transition-all"
          :style="{ width: slideProgress + '%' }"
        ></div>
        <div class="flex h-full items-center justify-center text-xs text-cream/40">
          滑动进入 →
        </div>
      </div>
    </div>

    <!-- 充能按钮 -->
    <div class="relative z-10 mt-4">
      <button
        type="button"
        class="relative overflow-hidden rounded-full border border-rose/30 bg-white/10 px-8 py-2 text-xs text-cream/70 backdrop-blur-sm transition-transform active:scale-95"
        @touchstart="onChargeStart"
        @touchend="onChargeEnd"
        @mousedown="onChargeStart"
        @mouseup="onChargeEnd"
        @mouseleave="onChargeEnd"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-rose/30 to-dusk/30 transition-all"
          :style="{ width: introStore.chargeProgress + '%' }"
        ></div>
        <span class="relative z-10">长按充能进入</span>
      </button>
    </div>

    <!-- 成就徽章 -->
    <div class="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="badge in INTRO_BADGES"
        :key="badge.id"
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all"
        :class="introStore.earnedBadges.has(badge.id)
          ? 'border-rose/40 bg-white/20'
          : 'border-cream/10 bg-white/5 opacity-40'"
        :title="badge.hint"
        @click="showAchievementList"
      >
        {{ badge.icon }}
      </button>
    </div>

    <!-- 进入按钮 -->
    <div class="relative z-10 mt-6">
      <button
        type="button"
        class="rounded-full bg-gradient-to-r from-rose to-dusk px-10 py-3 text-sm text-white shadow-lg transition-transform active:scale-95"
        :class="introStore.isUnlocked ? 'opacity-100' : 'opacity-40'"
        :disabled="!introStore.isUnlocked"
        @click="tryEnterMain"
      >
        {{ introStore.isUnlocked ? '✨ 进入心语亭' : '继续解锁…' }}
      </button>
    </div>

    <!-- 底部装饰 -->
    <div class="relative z-10 mt-8 text-center text-[10px] text-cream/20">
      心语亭 · 深夜絮语 · 为你而亮
    </div>

    <!-- ==================== 弹窗 ==================== -->

    <!-- 转盘弹窗 -->
    <div
      v-if="showRoulette"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showRoulette = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-4xl" :style="{ transform: `rotate(${rouletteAngle}deg)`, transition: 'transform 2s ease-out' }">🎰</p>
        <button type="button" class="mt-4 rounded-full bg-gradient-to-r from-rose to-dusk px-6 py-2 text-xs text-white" @click="spinRoulette">
          开始转动
        </button>
      </div>
    </div>

    <!-- 问答弹窗 -->
    <div
      v-if="showQuiz"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showQuiz = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-sm text-night/80">{{ QUIZ_BANK[quizIdx]?.q }}</p>
        <div class="mt-4 flex flex-col gap-2">
          <button
            v-for="(opt, i) in QUIZ_BANK[quizIdx]?.opts"
            :key="i"
            type="button"
            class="rounded-full border border-rose/20 px-4 py-2 text-xs text-night/60 transition-transform active:scale-95"
            @click="answerQuiz(i)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- 悄悄话弹窗 -->
    <div
      v-if="showWhisper"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showWhisper = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-sm text-night/80">输入暗号（你的名字）</p>
        <input
          v-model="whisperText"
          type="text"
          class="mt-3 w-full rounded-xl border border-rose/20 bg-white/50 px-4 py-2 text-sm text-night/80 outline-none"
          placeholder="输入暗号..."
          @keyup.enter="onWhisperSubmit(whisperText)"
        />
        <button
          type="button"
          class="mt-3 w-full rounded-full bg-gradient-to-r from-rose to-dusk py-2 text-xs text-white"
          @click="onWhisperSubmit(whisperText)"
        >
          提交
        </button>
      </div>
    </div>

    <!-- 骰子弹窗 -->
    <div
      v-if="showDice"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showDice = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-4xl">🎲</p>
        <p class="mt-3 text-sm text-night/80">{{ diceResult }}</p>
        <button type="button" class="mt-4 rounded-full border border-rose/30 px-6 py-2 text-xs text-night/60" @click="rollDice">
          再掷一次
        </button>
      </div>
    </div>

    <!-- 硬夸弹窗 -->
    <div
      v-if="showPraise"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showPraise = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-2xl">💖</p>
        <p class="mt-3 font-serif text-sm leading-relaxed text-night/80">{{ praiseText }}</p>
        <button type="button" class="mt-4 rounded-full border border-rose/30 px-6 py-2 text-xs text-night/60" @click="showHardPraise">
          再来一句
        </button>
      </div>
    </div>

    <!-- 音效板弹窗 -->
    <div
      v-if="showSound"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showSound = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-xs tracking-widest text-dusk/50">音效板</p>
        <div class="mt-3 grid grid-cols-4 gap-2">
          <button
            v-for="(sound, i) in INTRO_SOUND_BOARD"
            :key="i"
            type="button"
            class="rounded-full border border-rose/20 py-2 text-xs transition-transform active:scale-95"
            @click="playSound(sound)"
          >
            {{ sound.emoji }}
          </button>
        </div>
      </div>
    </div>

    <!-- 故事弹窗 -->
    <div
      v-if="showStory"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showStory = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-xs tracking-widest text-dusk/50">{{ INTRO_STORY_CHAPTERS[storyChapter]?.title }}</p>
        <div class="mt-3 space-y-1">
          <p v-for="(line, i) in INTRO_STORY_CHAPTERS[storyChapter]?.lines" :key="i" class="text-sm text-night/70">
            {{ line }}
          </p>
        </div>
        <button
          type="button"
          class="mt-4 rounded-full bg-gradient-to-r from-rose to-dusk px-6 py-2 text-xs text-white"
          @click="nextStoryChapter"
        >
          {{ storyChapter < INTRO_STORY_CHAPTERS.length - 1 ? '下一章' : '结束' }}
        </button>
      </div>
    </div>

    <!-- 对话树弹窗 -->
    <div
      v-if="showDialogue"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showDialogue = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-sm text-night/80">{{ dialogueText }}</p>
        <div class="mt-4 flex flex-col gap-2">
          <button
            v-for="(choice, i) in dialogueChoices"
            :key="i"
            type="button"
            class="rounded-full border border-rose/20 px-4 py-2 text-xs text-night/60 transition-transform active:scale-95"
            @click="setDialogueNode(choice.next)"
          >
            {{ choice.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 玩法说明弹窗 -->
    <div
      v-if="showHelp"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showHelp = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-xs tracking-widest text-dusk/50">玩法说明</p>
        <div class="mt-3 space-y-1">
          <p v-for="(line, i) in INTRO_MINI_GAMES_HELP" :key="i" class="text-xs text-night/60">
            {{ line }}
          </p>
        </div>
      </div>
    </div>

    <!-- 成就弹窗 -->
    <div
      v-if="showAchievements"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showAchievements = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 shadow-2xl" @click.stop>
        <p class="text-center text-xs tracking-widest text-dusk/50">成就徽章</p>
        <div class="mt-3 grid grid-cols-4 gap-2">
          <div
            v-for="badge in INTRO_BADGES"
            :key="badge.id"
            class="flex flex-col items-center gap-1"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full border text-xs"
              :class="introStore.earnedBadges.has(badge.id)
                ? 'border-rose/40 bg-white/20'
                : 'border-cream/10 bg-white/5 opacity-40'"
            >
              {{ badge.icon }}
            </span>
            <span class="text-[8px] text-night/40">{{ badge.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 自拍弹窗 -->
    <div
      v-if="showPhoto"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showPhoto = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-4xl">{{ photoFilter.emoji }}</p>
        <p class="mt-2 text-xs text-dusk/50">{{ photoFilter.name }}</p>
        <p class="mt-1 text-sm text-night/70">{{ photoFilter.line }}</p>
      </div>
    </div>

    <!-- 节奏弹窗 -->
    <div
      v-if="showRhythm"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showRhythm = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-xs text-dusk/50">跟着节拍点击！</p>
        <p class="mt-2 text-2xl">{{ rhythmScore }} / {{ rhythmTarget }}</p>
        <button
          type="button"
          class="mt-4 rounded-full bg-gradient-to-r from-rose to-dusk px-8 py-3 text-sm text-white active:scale-95"
          @click="tapRhythm"
        >
          🎵 点我！
        </button>
      </div>
    </div>

    <!-- 星座弹窗 -->
    <div
      v-if="showStars"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 px-6 backdrop-blur-sm"
      @click="showStars = false"
    >
      <div class="w-full max-w-xs rounded-3xl border border-rose/30 bg-white/95 p-6 text-center shadow-2xl" @click.stop>
        <p class="text-xs text-dusk/50">连点五颗星星</p>
        <div class="mt-3 flex justify-center gap-3">
          <button
            v-for="i in 5"
            :key="i"
            type="button"
            class="text-2xl transition-transform active:scale-125"
            @click="connectStar"
          >
            ⭐
          </button>
        </div>
      </div>
    </div>

    <!-- 抓猪猪逃跑层 -->
    <div
      v-if="catchPigActive"
      class="fixed inset-0 z-[55]"
      @click="catchPigActive = false"
    >
      <div
        v-if="catchPigVisible"
        class="absolute cursor-pointer select-none text-4xl transition-all"
        :style="{ left: catchPigPos.x + '%', top: catchPigPos.y + '%' }"
        @click.stop="onCatchPig"
      >
        🐷
      </div>
    </div>

    <!-- 疯狂点层 -->
    <div
      v-if="tapFrenzyActive"
      class="fixed inset-0 z-[55] flex items-center justify-center bg-night/40"
    >
      <button
        type="button"
        class="rounded-full bg-gradient-to-r from-rose to-dusk px-10 py-4 text-lg text-white shadow-lg active:scale-95"
        @click="tapFrenzyCount++"
      >
        👆 疯狂点！{{ tapFrenzyCount }}/30
      </button>
    </div>
  </div>
</template>
