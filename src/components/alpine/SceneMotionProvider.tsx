import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { SceneMotionContext } from './motion'
import type { SceneState } from './motion'

const chapters = ['home', 'projects', 'about', 'experience', 'skills', 'gallery', 'contact']

export function SceneMotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion()
  const [paused, setPaused] = useState(false)
  const enabled = !reduceMotion && !paused
  // The animation loop reads this stable store without rerendering the page on scroll.
  const [state] = useState(() => ({ current: { pointer: { x: 0, y: 0 }, scroll: 0, progress: 0, chapter: 0, chapterProgress: 0, heroProgress: 0, width: 1440, height: 900 } as SceneState }))

  useEffect(() => {
    const root = document.documentElement
    root.dataset.motion = enabled ? 'on' : 'off'
    let boundaries: number[] = []
    let frame = 0
    let pointerFrame = 0
    let alive = true
    let activeCard: HTMLElement | null = null
    let cardRect: DOMRect | null = null
    const resetCard = () => {
      activeCard?.style.setProperty('--tilt-x', '0deg')
      activeCard?.style.setProperty('--tilt-y', '0deg')
      activeCard = null
      cardRect = null
    }
    const update = () => {
      frame = 0
      const scroll = window.scrollY
      const height = window.innerHeight
      const position = scroll + height * .25
      let chapter = 0
      for (let i = 1; i < boundaries.length; i++) if (position >= boundaries[i]) chapter = i
      const next = boundaries[chapter + 1] ?? document.documentElement.scrollHeight
      Object.assign(state.current, {
        scroll, width: window.innerWidth, height, chapter,
        progress: Math.min(1, scroll / Math.max(1, root.scrollHeight - height)),
        chapterProgress: Math.max(0, Math.min(1, (position - boundaries[chapter]) / Math.max(1, next - boundaries[chapter]))),
        heroProgress: Math.min(1, scroll / height),
      })
      root.style.setProperty('--reading-progress', String(state.current.progress))
      root.style.setProperty('--hero-scroll', enabled ? String(state.current.heroProgress) : '0')
      root.dataset.chapter = chapters[chapter]
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      boundaries = chapters.map(id => document.getElementById(id)?.offsetTop ?? 0)
      resetCard()
      schedule()
    }
    const pointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== 'mouse') return
      const x = event.clientX
      const y = event.clientY
      const target = (event.target as Element).closest<HTMLElement>('[data-depth]')
      if (target !== activeCard) { resetCard(); activeCard = target; cardRect = target?.getBoundingClientRect() ?? null }
      cancelAnimationFrame(pointerFrame)
      pointerFrame = requestAnimationFrame(() => {
        state.current.pointer.x = x / window.innerWidth * 2 - 1
        state.current.pointer.y = y / window.innerHeight * 2 - 1
        root.style.setProperty('--pointer-x', String(state.current.pointer.x))
        root.style.setProperty('--pointer-y', String(state.current.pointer.y))
        if (activeCard && cardRect) {
          const cx = (x - cardRect.left) / cardRect.width - .5
          const cy = (y - cardRect.top) / cardRect.height - .5
          activeCard.style.setProperty('--tilt-x', `${-cy * 5}deg`)
          activeCard.style.setProperty('--tilt-y', `${cx * 5}deg`)
          activeCard.style.setProperty('--shine-x', `${(cx + .5) * 100}%`)
          activeCard.style.setProperty('--shine-y', `${(cy + .5) * 100}%`)
        }
      })
    }
    const leave = () => { resetCard(); state.current.pointer = { x: 0, y: 0 }; root.style.setProperty('--pointer-x', '0'); root.style.setProperty('--pointer-y', '0') }
    const resize = new ResizeObserver(measure)
    const main = document.querySelector('main')
    if (main) resize.observe(main)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pointermove', pointerMove, { passive: true })
    document.addEventListener('mouseleave', leave)
    measure()
    document.fonts.ready.then(() => { if (alive) measure() })
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.project-row,.timeline-entry,.skill-category,.gallery-cover,.about-copy,.section-heading'))
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target) } })
    }, { threshold: .06, rootMargin: '0px 0px -25px 0px' })
    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 65}ms`)
      if (!enabled || element.getBoundingClientRect().top < window.innerHeight) element.classList.add('is-visible')
      else reveal.observe(element)
    })
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pointerFrame)
      resize.disconnect()
      reveal.disconnect()
      resetCard()
      elements.forEach(element => element.classList.remove('reveal-item', 'is-visible'))
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', pointerMove)
      document.removeEventListener('mouseleave', leave)
    }
  }, [enabled, state])

  const value = useMemo(() => ({ state, enabled, paused, toggle: () => setPaused(value => !value) }), [enabled, paused, state])
  return <SceneMotionContext.Provider value={value}>
    <div className="reading-progress" aria-hidden="true" />
    {children}
    {!reduceMotion && <button className="motion-toggle" aria-pressed={paused} onClick={value.toggle} aria-label={paused ? 'Play page animations' : 'Pause page animations'}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>Motion {paused ? 'off' : 'on'}</span></button>}
  </SceneMotionContext.Provider>
}
