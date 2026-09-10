import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { mediaAsset } from '../../data/media'

const PlumeStage = lazy(() => import('./PlumeStage'))
const CHIPS = [
  { value: '300 barbs', label: 'one instanced draw' },
  { value: '0 KB', label: 'model data' },
  { value: 'Parks', label: 'when off-screen' },
]

function Fallback({ error = false }: { error?: boolean }) {
  return <div className="signature-fallback"><img src={mediaAsset('background.png', 'small')} alt="" loading="lazy" />{error && <span className="mono">Real-time rendering is unavailable on this device.</span>}</div>
}
class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <Fallback error /> : this.props.children }
}

export const Showcase = () => {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(1)
  const pointer = useRef({ x: 0, y: 0 })
  const reduceMotion = usePrefersReducedMotion()
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const element = section.current
    if (!element) return
    const arm = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl2')
      setWebgl(Boolean(context))
      context?.getExtension('WEBGL_lose_context')?.loseContext()
      setArmed(true)
      arm.disconnect()
    }, { rootMargin: '250px' })
    const watch = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .01 })
    arm.observe(element)
    watch.observe(element)
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { arm.disconnect(); watch.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  return <section id="signature" ref={section} className="signature-section section-shell">
    <div className="signature-card">
      <div className="signature-stage" onPointerMove={event => {
        if (reduceMotion || event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        pointer.current = { x: (event.clientX - rect.left) / rect.width * 2 - 1, y: (event.clientY - rect.top) / rect.height * 2 - 1 }
      }} onPointerLeave={() => { pointer.current = { x: 0, y: 0 } }}>
        {armed && webgl ? <StageBoundary><Suspense fallback={<Fallback />}><PlumeStage progress={progress} pointer={reduceMotion ? null : pointer} barbCount={300} frameloop={!visible || !pageVisible ? 'never' : reduceMotion ? 'demand' : 'always'} dprMax={1.5} antialias /></Suspense></StageBoundary> : <Fallback error={armed && !webgl} />}
        <span className="signature-stage-label mono">05 / Signature</span>
      </div>
      <div className="signature-content">
        <p className="mono">Signature / A study in code</p>
        <h2>Rendered in<br /><em>real time.</em></h2>
        <p className="signature-body">A peacock plume with no model file behind it. Three hundred barbs placed by code, lit by thin-film interference, drawn in a single instanced pass. The same discipline goes into the systems that aren’t this pretty.</p>
        <div className="signature-stats">{CHIPS.map(chip => <div key={chip.value}><strong>{chip.value}</strong><span className="mono">{chip.label}</span></div>)}</div>
        <a href="#projects" className="text-link">See the work <ArrowUpRight size={18} /></a>
      </div>
    </div>
  </section>
}
