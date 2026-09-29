import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { camps } from './alpine/route'

type Route = { profile: number[]; stops: number[] }

// The page drawn as an elevation profile: down the gauge is down the page, across is altitude on the mountain.
export const Altimeter = () => {
  const [route, setRoute] = useState<Route | null>(null)
  useEffect(() => {
    const receive = (event: Event) => setRoute((event as CustomEvent<Route>).detail)
    window.addEventListener('alpine:route', receive)
    return () => window.removeEventListener('alpine:route', receive)
  }, [])
  const last = (route?.profile.length ?? 1) - 1
  const path = route?.profile.map((altitude, index) => `${index ? 'L' : 'M'}${(altitude * 100).toFixed(2)} ${(index / last * 1000).toFixed(1)}`).join(' ')
  return <nav className="altimeter" aria-label="Route by altitude">
    <p className="altimeter-readout mono" aria-hidden="true"><span><span data-altitude>0</span> m</span><span data-camp>{camps[0].name}</span></p>
    <div className="altimeter-track">
      <svg viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path d={path} /></svg>
      <div className="altimeter-travelled" aria-hidden="true"><svg viewBox="0 0 100 1000" preserveAspectRatio="none"><path d={path} /></svg></div>
      <ol>{camps.map((camp, index) => {
        const stop = route?.stops[index] ?? index / (camps.length - 1)
        const style = { '--stop': stop, '--stop-altitude': route?.profile[Math.round(stop * last)] ?? 0 } as CSSProperties
        return <li key={camp.id} style={style}><a href={`#${camp.id}`}><span className="altimeter-dot" /><span className="altimeter-label mono">{camp.name}<span>{camp.label}</span></span></a></li>
      })}</ol>
      <span className="altimeter-marker" aria-hidden="true" />
    </div>
  </nav>
}
