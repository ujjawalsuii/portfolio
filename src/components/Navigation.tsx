import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const sections = [
  { id: 'home', label: 'Home' }, { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' }, { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'gallery', label: 'Gallery' }, { id: 'contact', label: 'Contact' },
]

export const Navigation = () => {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const position = window.scrollY + window.innerHeight * 0.32
      const current = sections.filter(({ id }) => (document.getElementById(id)?.offsetTop ?? Infinity) <= position).at(-1)
      if (current) setActive(current.id)
      frame = 0
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!open) return
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus() }
    }
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const resize = () => { if (window.innerWidth > 800) setOpen(false) }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', resize)
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize) }
  }, [open])

  return <header className="site-header" ref={headerRef}>
    <a href="#home" className="wordmark" aria-label="Ujjawal Pratap, home">u<span className="wordmark-slash">/</span>p<span className="wordmark-dot">.</span></a>
    <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      {sections.map(({ id, label }) => <a key={id} href={`#${id}`} className={`${active === id ? 'is-active' : ''} nav-${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <a className="header-contact" href="mailto:ujjawalpratap1234@gmail.com">Let’s talk <ArrowUpRight size={17} /></a>
    <button ref={menuRef} className="menu-toggle icon-button" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>
}
