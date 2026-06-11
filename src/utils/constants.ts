/**
 * ================================================================
 * 全局配置常量
 * 所有可配置项集中在此，方便修改
 * ================================================================
 */

// 核心应用配置已迁移至 config/app.config.ts
export {
  TARGET_NAME,
  AI_DISPLAY_NAME,
  INTRO_UNLOCK_THRESHOLD,
  UNLOCK_PER_ACTION,
  UNLOCK_MAX,
  buildSystemPrompt,
} from '@/config/app.config'

// 聊天相关文案已迁移至 data/chat.ts
export {
  buildMoodLines,
  QUICK_CHIPS,
  HEART_QUIPS,
  PRAISE_LINES,
  FORTUNE_LINES,
  METER_QUIPS,
  MOOD_FREAK_LINES,
  PLACEHOLDER_LINES,
  AVATAR_QUIPS,
  FLOAT_BUBBLE_LINES,
  EXTENDED_QUIPS,
  pickExtendedQuip,
  type QuickChip,
} from '@/data/chat'

// 开场相关文案已迁移至 data/intro.ts（IntroView 懒加载）
export {
  MASCOT_LINES,
  TYPEWRITER_LINES,
  ROULETTE_PRIZES,
  QUIZ_BANK,
  INTRO_EXTRA_QUIZ,
  WHISPER_REJECTIONS,
  WHISPER_SUCCESS,
  DICE_RESULTS,
  HARD_COMPLIMENTS,
  INTRO_BADGES,
  INTRO_SOUND_BOARD,
  KONAMI_SEQUENCE,
  INTRO_IDLE_CHATTER,
  INTRO_COMBO_REWARDS,
  INTRO_PHOTO_FILTERS,
  INTRO_RHYTHM_NOTES,
  INTRO_WELCOME_SEQUENCE,
  INTRO_COUNTDOWN_MESSAGES,
  INTRO_MINI_GAMES_HELP,
  INTRO_TIPS_ROTATION,
  INTRO_ACHIEVEMENT_DESCRIPTIONS,
  INTRO_FLOATING_HINTS_ON_ITEMS,
  INTRO_DIALOGUE_TREE,
  INTRO_STORY_CHAPTERS,
  type RoulettePrize,
  type QuizItem,
  type Badge,
  type SoundItem,
  type ComboReward,
  type PhotoFilter,
  type WelcomeStep,
  type DialogueNode,
  type StoryChapter,
} from '@/data/intro'
