/**
 * ================================================================
 * 彩蛋系统状态管理 (Pinia)
 * 管理各种隐藏彩蛋的触发计数和状态
 * ================================================================
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEasterEggStore = defineStore('easterEgg', () => {
  // ==================== 状态 ====================

  /** 键盘输入缓冲（用于暗号检测） */
  const secretBuffer = ref('')

  /** 底部装饰点击计数 */
  const footerClickCount = ref(0)

  /** 标题连点计数 */
  const titleClickCount = ref(0)

  /** 发送按钮点击计数 */
  const sendBtnClickCount = ref(0)

  /** 心情签切换次数 */
  const moodSwitchCount = ref(0)

  /** 每日任务完成状态 */
  const dailyTasks = ref([
    { id: 'chat1', label: '说一句话', done: false, reward: 5 },
    { id: 'chip1', label: '用快捷按钮', done: false, reward: 5 },
    { id: 'mischief1', label: '扔一次鸡腿', done: false, reward: 5 },
    { id: 'mood3', label: '换3次心情签', done: false, reward: 5 },
    { id: 'heart50', label: '心动值到50', done: false, reward: 10 },
  ])

  // ==================== 方法 ====================

  /**
   * 记录键盘输入（用于暗号检测）
   * @param key - 按键字符
   */
  function recordKey(key: string): void {
    secretBuffer.value += key
    if (secretBuffer.value.length > 10) {
      secretBuffer.value = secretBuffer.value.slice(-10)
    }
  }

  /**
   * 检查暗号是否匹配
   * @param code - 要检测的暗号
   */
  function checkSecret(code: string): boolean {
    return secretBuffer.value.includes(code)
  }

  /**
   * 清空暗号缓冲
   */
  function clearSecret(): void {
    secretBuffer.value = ''
  }

  /**
   * 增加底部点击计数
   */
  function incrementFooterClick(): void {
    footerClickCount.value++
  }

  /**
   * 增加标题点击计数
   */
  function incrementTitleClick(): void {
    titleClickCount.value++
  }

  /**
   * 增加发送按钮点击计数
   */
  function incrementSendBtnClick(): void {
    sendBtnClickCount.value++
  }

  /**
   * 增加心情签切换次数
   */
  function incrementMoodSwitch(): void {
    moodSwitchCount.value++
  }

  /**
   * 检查并完成每日任务
   * @param taskId - 任务 ID
   * @returns 任务奖励分数，如果已完成则返回 0
   */
  function checkDaily(taskId: string): number {
    const task = dailyTasks.value.find((t) => t.id === taskId)
    if (task && !task.done) {
      task.done = true
      return task.reward
    }
    return 0
  }

  /**
   * 获取未完成的每日任务列表
   */
  function getPendingTasks() {
    return dailyTasks.value.filter((t) => !t.done)
  }

  /**
   * 检查心动值任务
   * @param heartScore - 当前心动值
   */
  function checkHeartTask(heartScore: number): number {
    if (heartScore >= 50) {
      return checkDaily('heart50')
    }
    return 0
  }

  /**
   * 重置所有彩蛋状态
   */
  function reset(): void {
    secretBuffer.value = ''
    footerClickCount.value = 0
    titleClickCount.value = 0
    sendBtnClickCount.value = 0
    moodSwitchCount.value = 0
    dailyTasks.value.forEach((t) => { t.done = false })
  }

  return {
    // 状态
    secretBuffer,
    footerClickCount,
    titleClickCount,
    sendBtnClickCount,
    moodSwitchCount,
    dailyTasks,
    // 方法
    recordKey,
    checkSecret,
    clearSecret,
    incrementFooterClick,
    incrementTitleClick,
    incrementSendBtnClick,
    incrementMoodSwitch,
    checkDaily,
    getPendingTasks,
    checkHeartTask,
    reset,
  }
})
