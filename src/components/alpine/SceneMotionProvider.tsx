import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { SceneMotionContext } from './motion'
import type { SceneState } from './motion'
import { camps, chapterIndex, chapters, locate, summit } from './route'
import type { RouteLayout } from './route'

// Anything the visitor reads or operates; the rest of the page is open background over the mountain.
const content = 'a,button,input,label,p,h1,h2,h3,li,figure,img,video,picture,article,dialog,header,nav,.project-row,.skill-category,.timeline-entry,.contact-links,.proof-strip,.hero-scene,.tags,.section-heading-title,.altimeter'
const summitMetres = summit.y * 1000
const format = new Intl.NumberFormat('en-US')

export function SceneMotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion()
  const [paused, setPaused] = useState(false)
  const enabled = !reduceMotion && !paused
  // The animation loop reads this stable store without rerendering the page on scroll.
  const [state] = useState(() => ({ current: {
    pointer: { x: 0, y: 0 }, mouse: { x: 0, y: 0, free: false, moved: false }, scroll: 0, progress: 0, chapter: 0, chapterProgress: 0, heroProgress: 0,
    trail: -1, altitude: 0, stackFocus: -1, hover: { layer: -1, target: '' }, width: 1440, height: 900,
  } as SceneState }))

  useEffect(() => {
    const root = document.documentElement
    root.dataset.motion = enabled ? 'on' : 'off'
    let layout: RouteLayout = { boundaries: [], entries: [], viewport: 900, scrollHeight: 1 }
    const entries = Array.from(document.querySelectorAll<HTMLElement>('.timeline-entry'))
    const altitudeReadouts = Array.from(document.querySelectorAll<HTMLElement>('[data-altitude]'))
    const campReadouts = Array.from(document.querySelectorAll<HTMLElement>('[data-camp]'))
    let shownAltitude = -1, shownCamp = -1
    let currentEntry: HTMLElement | undefined
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
      const route = locate(layout, scroll)
      Object.assign(state.current, {
        ...route, scroll, width: window.innerWidth, height,
        progress: Math.min(1, scroll / Math.max(1, root.scrollHeight - height)),
        heroProgress: Math.min(1, scroll / height),
      })
      root.style.setProperty('--reading-progress', String(state.current.progress))
      root.style.setProperty('--hero-scroll', enabled ? String(state.current.heroProgress) : '0')
      root.style.setProperty('--altitude', String(route.altitude / summitMetres))
      root.dataset.chapter = chapters[route.chapter]
      const metres = Math.round(route.altitude / 10) * 10
      if (metres !== shownAltitude) { shownAltitude = metres; altitudeReadouts.forEach(element => { element.textContent = format.format(metres) }) }
      if (route.chapter !== shownCamp) { shownCamp = route.chapter; campReadouts.forEach(element => { element.textContent = camps[route.chapter].name }) }
      // The timeline entry at the trail's current waypoint is marked as the visitor's position.
      const entry = route.chapter === chapterIndex.experience && route.trail > -.5 ? entries[Math.round(route.trail)] : undefined
      if (entry !== currentEntry) { currentEntry?.classList.remove('is-current'); entry?.classList.add('is-current'); currentEntry = entry }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      const top = (element: Element) => element.getBoundingClientRect().top + window.scrollY
      layout = {
        boundaries: chapters.map(id => { const element = document.getElementById(id); return element ? top(element) : 0 }),
        entries: entries.map(top), viewport: window.innerHeight, scrollHeight: root.scrollHeight,
      }
      resetCard()
      schedule()
      const range = Math.max(1, layout.scrollHeight - layout.viewport)
      const profile = Array.from({ length: 181 }, (_, i) => locate(layout, range * i / 180).altitude / summitMetres)
      const stops = layout.boundaries.map(boundary => Math.max(0, Math.min(1, (boundary - layout.viewport * .25) / range)))
      window.dispatchEvent(new CustomEvent('alpine:route', { detail: { profile, stops } }))
    }
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const x = event.clientX
      const y = event.clientY
      const element = event.target as Element
      const stratum = element.closest<HTMLElement>('[data-stratum]')
      state.current.stackFocus = stratum ? Number(stratum.dataset.stratum) : -1
      Object.assign(state.current.mouse, { x: x / window.innerWidth * 2 - 1, y: 1 - y / window.innerHeight * 2, free: !element.closest(content), moved: true })
      if (!enabled) return
      const target = element.closest<HTMLElement>('[data-depth]')
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
    const leave = () => {
      resetCard()
      state.current.pointer = { x: 0, y: 0 }
      state.current.stackFocus = -1
      Object.assign(state.current.mouse, { free: false, moved: true })
      root.style.setProperty('--pointer-x', '0'); root.style.setProperty('--pointer-y', '0')
    }
    // A stratum under the mouse is a way into the section it belongs to.
    const click = (event: MouseEvent) => {
      const { hover, mouse } = state.current
      if (!hover.target || !mouse.free || (event.target as Element).closest(content)) return
      if (hover.target.startsWith('stratum:')) {
        const card = document.querySelector<HTMLElement>(`[data-stratum="${hover.target.slice(8)}"]`)
        card?.scrollIntoView({ block: 'nearest' })
        card?.classList.remove('is-pinged')
        requestAnimationFrame(() => card?.classList.add('is-pinged'))
        return
      }
      document.getElementById(hover.target)?.scrollIntoView()
    }
    const resize = new ResizeObserver(measure)
    const main = document.querySelector('main')
    if (main) resize.observe(main)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pointermove', pointerMove, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('click', click)
    measure()
    document.fonts.ready.then(() => { if (alive) measure() })
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.project-row,.timeline-entry,.skill-category,.gallery-cover,.about-copy,.section-heading'))
    const reveal = new IntersectionObserver(items => {
      items.forEach(item => { if (item.isIntersecting) { item.target.classList.add('is-visible'); reveal.unobserve(item.target) } })
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
      currentEntry?.classList.remove('is-current')
      elements.forEach(element => element.classList.remove('reveal-item', 'is-visible'))
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', pointerMove)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('click', click)
    }
  }, [enabled, state])

  const value = useMemo(() => ({ state, enabled, paused, toggle: () => setPaused(value => !value) }), [enabled, paused, state])
  return <SceneMotionContext.Provider value={value}>
    <div className="reading-progress" aria-hidden="true" />
    {children}
    {!reduceMotion && <button className="motion-toggle" aria-pressed={paused} onClick={value.toggle} aria-label={paused ? 'Play page animations' : 'Pause page animations'}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>Motion {paused ? 'off' : 'on'}</span></button>}
  </SceneMotionContext.Provider>
}
