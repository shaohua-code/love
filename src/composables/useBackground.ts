/**
 * ================================================================
 * 背景与音乐管理 Composable
 * 管理背景图切换、背景音乐播放，状态持久化到 localStorage
 * ================================================================
 */
import { ref, computed } from 'vue'

/** localStorage 键名 */
const BG_INDEX_KEY = 'love_bg_index'
const MUSIC_KEY = 'love_music_playing'

// 背景图编号列表（1~6），切换时按需动态加载，减少首屏体积
const BG_IDS = [1, 2, 3, 4, 5, 6]

// 模块初始化时注册所有背景图加载器（避免运行时 glob 路径匹配失败）
const bgLoaders = import.meta.glob<string>('@/assets/img/*.jpg', {
  import: 'default',
})
const bgLoaderMap = new Map<number, () => Promise<string>>()
Object.entries(bgLoaders).forEach(([path, loader]) => {
  const match = path.match(/(\d+)\.jpg/)
  if (match) {
    bgLoaderMap.set(Number(match[1]), loader as () => Promise<string>)
  }
})

/** 已加载的背景图 URL（响应式，确保缩略图列表能刷新） */
const loadedUrls = ref<Record<number, string>>({})

/** 正在加载的背景图 id 集合 */
const loadingIds = ref<Set<number>>(new Set())

/** 当前背景图索引 */
const currentBgIndex = ref(0)

/** 当前显示的背景图 URL */
const currentBgUrl = ref('')

/** 背景音乐是否播放中 */
const isMusicPlaying = ref(false)

/** 音频实例（单例） */
let audioInstance: HTMLAudioElement | null = null

/**
 * 动态加载指定背景图
 */
async function loadBackground(id: number): Promise<string> {
  if (loadedUrls.value[id]) return loadedUrls.value[id]

  const loader = bgLoaderMap.get(id)
  if (!loader) return ''

  loadingIds.value = new Set([...loadingIds.value, id])
  try {
    const url = await loader()
    loadedUrls.value = { ...loadedUrls.value, [id]: url }
    return url
  } finally {
    const next = new Set(loadingIds.value)
    next.delete(id)
    loadingIds.value = next
  }
}

/**
 * 应用背景图到显示层
 */
async function applyBackground(index: number): Promise<void> {
  const id = BG_IDS[index]
  if (!id) return
  const url = await loadBackground(id)
  if (url) currentBgUrl.value = url
}

/**
 * 从 localStorage 恢复用户偏好
 */
async function restorePreferences(): Promise<void> {
  const savedIndex = localStorage.getItem(BG_INDEX_KEY)
  if (savedIndex !== null) {
    const idx = parseInt(savedIndex, 10)
    if (idx >= 0 && idx < BG_IDS.length) {
      currentBgIndex.value = idx
    }
  }
  isMusicPlaying.value = localStorage.getItem(MUSIC_KEY) === 'true'
  await applyBackground(currentBgIndex.value)
}

/**
 * 初始化音频实例
 */
function initAudio(): void {
  if (audioInstance) return
  import('@/assets/music/music.m4a').then((mod) => {
    audioInstance = new Audio(mod.default)
    audioInstance.loop = true
    audioInstance.volume = 0.4
  })
}

/**
 * 切换背景音乐播放/暂停
 */
function toggleMusic(): void {
  initAudio()
  if (!audioInstance) {
    setTimeout(toggleMusic, 200)
    return
  }

  if (isMusicPlaying.value) {
    audioInstance.pause()
    isMusicPlaying.value = false
  } else {
    audioInstance.play().catch(() => {
      isMusicPlaying.value = false
    })
    isMusicPlaying.value = true
  }
  localStorage.setItem(MUSIC_KEY, String(isMusicPlaying.value))
}

/**
 * 设置指定索引的背景图
 */
async function setBackground(index: number): Promise<void> {
  if (index < 0 || index >= BG_IDS.length) return
  currentBgIndex.value = index
  localStorage.setItem(BG_INDEX_KEY, String(index))
  await applyBackground(index)
}

/**
 * 切换到下一张背景图
 */
async function nextBackground(): Promise<void> {
  await setBackground((currentBgIndex.value + 1) % BG_IDS.length)
}

/**
 * 预加载所有背景缩略图
 */
async function preloadAllBackgrounds(): Promise<void> {
  await Promise.all(BG_IDS.map((id) => loadBackground(id)))
}

/**
 * 背景图列表（缩略图）
 */
const backgroundList = computed(() =>
  BG_IDS.map((id, index) => ({
    index,
    id,
    url: loadedUrls.value[id] || '',
    loaded: !!loadedUrls.value[id],
    loading: loadingIds.value.has(id),
  }))
)

restorePreferences()

export function useBackground() {
  return {
    currentBgUrl,
    currentBgIndex,
    backgroundList,
    isMusicPlaying,
    toggleMusic,
    setBackground,
    nextBackground,
    loadBackground,
    preloadAllBackgrounds,
  }
}
