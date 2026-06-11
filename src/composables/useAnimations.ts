/**
 * ================================================================
 * 动画效果 Composable
 * 封装各种视觉特效的创建和管理
 * ================================================================ */

/**
 * 创建星空背景
 * @param container - 容器元素
 * @param count - 星星数量
 */
export function useStars(container: HTMLElement, count = 60): void {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div')
    const size = Math.random() * 2 + 1
    star.className = 'star-item absolute cursor-pointer rounded-full bg-white animate-twinkle transition-transform'
    star.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 3}s;
      animation-duration:${2 + Math.random() * 2}s;
    `
    container.appendChild(star)
  }
}

/**
 * 创建飘落花瓣
 * @param container - 容器元素
 * @param count - 花瓣数量
 */
export function usePetals(container: HTMLElement, count = 18): void {
  const petalChars = ['🌸', '✿', '❀', '🌷']
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div')
    petal.textContent = petalChars[i % petalChars.length]
    petal.className = 'petal-item absolute cursor-pointer text-sm opacity-60 transition-transform hover:scale-125'
    const duration = 8 + Math.random() * 12
    const delay = Math.random() * 10
    const size = 0.6 + Math.random() * 0.8
    petal.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      font-size:${size}rem;
      animation: fall ${duration}s linear ${delay}s infinite;
    `
    container.appendChild(petal)
  }
}

/**
 * 触发 emoji 雨
 * @param container - 容器元素
 * @param duration - 持续时间(ms)
 */
export function triggerEmojiRain(container: HTMLElement, duration = 4000): void {
  const emojis = ['🍗', '💗', '✨', '⭐', '🌸', '💫', '🥰', '🐷', '🐱']
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div')
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    el.className = 'absolute text-xl'
    el.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
      animation-delay:${Math.random() * 0.8}s;
    `
    container.appendChild(el)
    setTimeout(() => el.remove(), duration)
  }
}

/**
 * 触发猪猪雨
 * @param container - 容器元素
 */
export function triggerPigRain(container: HTMLElement): void {
  const pigs = ['🐷', '🐽', '💗', '🐷', '✨']
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div')
    el.textContent = pigs[Math.floor(Math.random() * pigs.length)]
    el.className = 'absolute text-xl'
    el.style.cssText = `
      left:${Math.random() * 100}%;top:-5%;
      animation: emojiRain ${2 + Math.random() * 2}s linear forwards;
      animation-delay:${Math.random() * 0.8}s;
    `
    container.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}

/**
 * 飞行道具（扔鸡腿等）
 * @param container - 容器元素
 * @param emoji - 要飞行的 emoji
 * @param size - 大小
 */
export function flyAcross(container: HTMLElement, emoji: string, size = '1.8rem'): void {
  const el = document.createElement('div')
  el.textContent = emoji
  el.className = 'absolute'
  el.style.cssText = `
    top:${15 + Math.random() * 50}%;left:0;
    font-size:${size};
    animation: flyAcross ${2 + Math.random()}s linear forwards;
  `
  container.appendChild(el)
  setTimeout(() => el.remove(), 3500)
}

/**
 * 创建漂浮气泡
 * @param text - 气泡文字
 */
export function spawnFloatBubble(text: string): void {
  const bubble = document.createElement('div')
  bubble.textContent = text
  bubble.className = 'pointer-events-none absolute rounded-full border border-rose/20 bg-white/80 px-3 py-1 text-xs text-night/60 shadow-sm'
  bubble.style.cssText = `
    left:${20 + Math.random() * 60}%;bottom:20%;
    animation: floatBubble 2s ease-out forwards;
  `
  document.body.appendChild(bubble)
  setTimeout(() => bubble.remove(), 2000)
}

/**
 * 创建可收集的浮动物品
 * @param container - 容器元素
 * @param onCollect - 收集回调
 */
export function spawnFloatHearts(
  container: HTMLElement,
  onCollect: (emoji: string) => void
): void {
  container.innerHTML = ''
  const items = ['💗', '💗', '🍗', '🐱', '🐷', '✨']
  const count = 4 + Math.floor(Math.random() * 3)

  for (let i = 0; i < count; i++) {
    const item = document.createElement('button')
    item.type = 'button'
    const emoji = items[Math.floor(Math.random() * items.length)]
    item.textContent = emoji
    item.className = 'absolute text-lg opacity-80 pointer-events-auto transition-transform hover:scale-125 active:scale-150'
    const side = Math.random() > 0.5 ? 'left' : 'right'
    const offset = 8 + Math.random() * 20
    const top = 15 + Math.random() * 60
    item.style.cssText = `
      ${side}:${offset}px;top:${top}%;
      animation: heartFloat ${2 + Math.random() * 2}s ease-in-out infinite;
      animation-delay:${Math.random() * 2}s;
    `
    item.addEventListener('click', () => {
      item.classList.add('animate-pop')
      item.style.pointerEvents = 'none'
      onCollect(emoji)
      setTimeout(() => item.remove(), 400)
    })
    container.appendChild(item)
  }
}

/**
 * 开场粒子效果
 * @param container - 容器元素
 */
export function spawnIntroParticles(container: HTMLElement): () => void {
  const interval = setInterval(() => {
    const p = document.createElement('div')
    p.className = 'absolute h-1 w-1 rounded-full bg-cream/60'
    p.style.cssText = `
      left:${Math.random() * 100}%;bottom:0;
      animation: floatBubble 3s ease-out forwards;
    `
    container.appendChild(p)
    setTimeout(() => p.remove(), 3000)
  }, 400)

  return () => clearInterval(interval)
}

/**
 * 开场 burst 特效
 * @param container - 容器元素
 */
export function spawnIntroBurst(container: HTMLElement): void {
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div')
    s.textContent = ['💗', '✨', '🐷'][i % 3]
    s.className = 'pointer-events-none absolute text-lg'
    s.style.cssText = `
      left:50%;top:50%;
      animation: introSparkleBurst 0.8s ease forwards;
      animation-delay:${i * 0.04}s;
    `
    container.appendChild(s)
    setTimeout(() => s.remove(), 1200)
  }
}

/**
 * 开场浮动物品
 * @param container - 容器元素
 * @param onClick - 点击回调
 */
export function spawnIntroFloatItems(
  container: HTMLElement,
  onClick: (emoji: string) => void
): void {
  const items = ['💗', '🍗', '🐷', '✨', '🌸', '⭐', '🐱', '💫']
  for (let i = 0; i < 10; i++) {
    const btn = document.createElement('button')
    btn.type = 'button'
    const emoji = items[i % items.length]
    btn.textContent = emoji
    btn.className = 'intro-float-item pointer-events-auto absolute text-lg opacity-50 transition-transform hover:scale-125 active:scale-150'
    btn.style.cssText = `
      left:${5 + Math.random() * 85}%;top:${10 + Math.random() * 75}%;
      animation-delay:${Math.random() * 3}s;
    `
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      btn.style.animation = 'introSparkleBurst 0.5s ease forwards'
      onClick(emoji)
      setTimeout(() => btn.remove(), 500)
    })
    container.appendChild(btn)
  }
}
