/**
 * ================================================================
 * 开场体验状态管理 (Pinia)
 * 管理解锁进度、成就徽章、小游戏状态等
 * ================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  INTRO_UNLOCK_THRESHOLD,
  UNLOCK_MAX,
  INTRO_COMBO_REWARDS,
  KONAMI_SEQUENCE,
} from '@/utils/constants'

export const useIntroStore = defineStore('intro', () => {
  // ==================== 状态 ====================

  /** 解锁进度 0-100 */
  const unlockProgress = ref(0)

  /** 已获得的徽章 ID 集合 */
  const earnedBadges = ref<Set<string>>(new Set())

  /** 已触发的组合技键集合 */
  const earnedComboKeys = ref<Set<string>>(new Set())

  /** 吉祥物点击次数 */
  const mascotClickCount = ref(0)

  /** 标题点击次数 */
  const titleClickCount = ref(0)

  /** 疯狂点击计数 */
  const tapFrenzyCount = ref(0)

  /** Konami 按键缓冲 */
  const konamiBuffer = ref<string[]>([])

  /** 充能进度 */
  const chargeProgress = ref(0)

  /** 是否正在充能 */
  const isCharging = ref(false)

  /** 是否已解锁进入 */
  const isUnlocked = computed(() => unlockProgress.value >= INTRO_UNLOCK_THRESHOLD)

  // ==================== 方法 ====================

  /**
   * 增加解锁进度
   * @param points - 增加的进度点数
   * @returns 增加前的进度是否低于阈值
   */
  function addUnlock(points: number): boolean {
    const before = unlockProgress.value
    unlockProgress.value = Math.min(UNLOCK_MAX, unlockProgress.value + points)
    return before < INTRO_UNLOCK_THRESHOLD && unlockProgress.value >= INTRO_UNLOCK_THRESHOLD
  }

  /**
   * 获得徽章
   * @param id - 徽章 ID
   * @returns 是否是首次获得
   */
  function earnBadge(id: string): boolean {
    if (earnedBadges.value.has(id)) return false
    earnedBadges.value.add(id)
    return true
  }

  /**
   * 检查组合技奖励
   * @returns 触发的新组合技文本数组
   */
  function checkComboRewards(): string[] {
    const triggered: string[] = []
    INTRO_COMBO_REWARDS.forEach((combo) => {
      const key = combo.need.join('+')
      if (earnedComboKeys.value.has(key)) return
      if (combo.need.every((id) => earnedBadges.value.has(id))) {
        earnedComboKeys.value.add(key)
        triggered.push(combo.text)
      }
    })
    return triggered
  }

  /**
   * 增加吉祥物点击次数
   */
  function incrementMascotClick(): void {
    mascotClickCount.value++
  }

  /**
   * 增加标题点击次数
   */
  function incrementTitleClick(): void {
    titleClickCount.value++
  }

  /**
   * 记录 Konami 按键
   * @param key - 按键值
   * @returns 是否触发了秘技
   */
  function recordKonamiKey(key: string): boolean {
    konamiBuffer.value.push(key)
    if (konamiBuffer.value.length > KONAMI_SEQUENCE.length) {
      konamiBuffer.value.shift()
    }
    if (konamiBuffer.value.join(',') === KONAMI_SEQUENCE.join(',')) {
      konamiBuffer.value = []
      return true
    }
    return false
  }

  /**
   * 设置充能进度
   */
  function setChargeProgress(progress: number): void {
    chargeProgress.value = progress
  }

  /**
   * 设置充能状态
   */
  function setCharging(charging: boolean): void {
    isCharging.value = charging
  }

  /**
   * 重置所有开场状态
   */
  function reset(): void {
    unlockProgress.value = 0
    earnedBadges.value.clear()
    earnedComboKeys.value.clear()
    mascotClickCount.value = 0
    titleClickCount.value = 0
    tapFrenzyCount.value = 0
    konamiBuffer.value = []
    chargeProgress.value = 0
    isCharging.value = false
  }

  return {
    // 状态
    unlockProgress,
    earnedBadges,
    earnedComboKeys,
    mascotClickCount,
    titleClickCount,
    tapFrenzyCount,
    konamiBuffer,
    chargeProgress,
    isCharging,
    isUnlocked,
    // 方法
    addUnlock,
    earnBadge,
    checkComboRewards,
    incrementMascotClick,
    incrementTitleClick,
    recordKonamiKey,
    setChargeProgress,
    setCharging,
    reset,
  }
})
