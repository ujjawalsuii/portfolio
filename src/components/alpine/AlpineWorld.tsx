import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { stackCategories, stackRoles, stratumOf } from './route'

const AlpineStage = lazy(() => import('./AlpineStage'))

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export const AlpineWorld = () => {
  const [ready, setReady] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    // The photo and content paint first; the shared mountain scene follows.
    const timer = window.setTimeout(() => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2')
      if (!gl) return
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      setReady(true)
    }, 450)
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  // Labels and the pointer tip are positioned by the scene each frame; they duplicate content that is already on the page.
  return <>
    <div className="alpine-world" aria-hidden="true">
      <div className="world-glow" />
      <div className="stack-labels">{stackCategories.map(category => {
        const layer = stratumOf(category.title)
        return <span className="stack-label mono" data-stratum-label={layer} key={category.title}><span>{String(layer + 1).padStart(2, '0')}</span>{stackRoles[layer]}</span>
      })}</div>
      {ready && <SceneBoundary><Suspense fallback={null}><AlpineStage pageVisible={pageVisible} /></Suspense></SceneBoundary>}
    </div>
    <span className="strata-tip mono" aria-hidden="true" />
  </>
}
