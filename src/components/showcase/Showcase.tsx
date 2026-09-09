import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import './showcase.css'

// Both the renderer and the animation library are split out of the entry
// bundle: this section sits below the fold, so neither belongs in first paint.
const PlumeStage = lazy(() => import('./PlumeStage'))

const CHIPS = [
    { value: '300 barbs', label: 'one instanced draw' },
    { value: '0 KB', label: 'model data' },
    { value: 'Parks', label: 'when off-screen' },
]

export const Showcase = () => {
    const isMobile = useIsMobile()
    const reduceMotion = usePrefersReducedMotion()

    const sectionRef = useRef<HTMLElement>(null)
    const progress = useRef(0)
    const pointer = useRef({ x: 0, y: 0 })

    // Mount the WebGL chunk just before the section arrives, park it once it leaves.
    const [armed, setArmed] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const arm = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setArmed(true),
            { rootMargin: '400px 0px' },
        )
        const watch = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.01 },
        )
        arm.observe(el)
        watch.observe(el)
        return () => {
            arm.disconnect()
            watch.disconnect()
        }
    }, [])

    // One orchestrated reveal: the plume unfurls while the copy rises under it.
    useLayoutEffect(() => {
        const el = sectionRef.current
        if (!el) return

        if (reduceMotion) {
            progress.current = 1
            return
        }

        const fades = Array.from(
            el.querySelectorAll<HTMLElement>('.sig__eyebrow, .sig__body, .sig__chip, .sig__cta'),
        )
        const lines = Array.from(el.querySelectorAll<HTMLElement>('.sig__line > span'))

        // Hide synchronously, before first paint, so there is no flash of laid-out
        // copy while GSAP streams in over the network.
        fades.forEach((n) => {
            n.style.opacity = '0'
            n.style.transform = 'translateY(16px)'
        })
        lines.forEach((n) => {
            n.style.transform = 'translateY(108%)'
        })

        const reveal = () => {
            for (const n of [...fades, ...lines]) {
                n.style.opacity = ''
                n.style.transform = ''
            }
        }

        let cancelled = false
        let ctx: { revert: () => void } | undefined
        // If GSAP never arrives, the section must end up legible rather than blank.
        const failsafe = window.setTimeout(reveal, 4000)

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
            .then(([{ gsap }, { ScrollTrigger }]) => {
                window.clearTimeout(failsafe)
                if (cancelled) return
                gsap.registerPlugin(ScrollTrigger)
                // Measure before building the trigger, not after. Refreshing on a
                // timer once a `once: true` trigger has already fired can strand
                // its tweens at their start values.
                ScrollTrigger.refresh()

                ctx = gsap.context(() => {
                    // y is pinned to 0 deliberately: GSAP resolves the pre-hide's
                    // translateY(108%) into a pixel y offset, which would otherwise
                    // survive the yPercent tween and leave the line one line low.
                    gsap.set('.sig__line > span', { yPercent: 108, y: 0 })
                    gsap.set(['.sig__eyebrow', '.sig__body', '.sig__chip', '.sig__cta'], { opacity: 0, y: 16 })

                    const tl = gsap.timeline({
                        scrollTrigger: { trigger: el, start: 'top 62%', once: true },
                        defaults: { ease: 'power3.out' },
                    })

                    tl.to(progress, { current: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
                        .to('.sig__eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.25)
                        .to('.sig__line > span', { yPercent: 0, duration: 1.05, stagger: 0.09 }, 0.32)
                        .to('.sig__body', { opacity: 1, y: 0, duration: 0.85 }, 0.68)
                        .to('.sig__chip', { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.82)
                        .to('.sig__cta', { opacity: 1, y: 0, duration: 0.7 }, 1.0)
                }, el)
            })
            .catch(() => {
                window.clearTimeout(failsafe)
                reveal()
            })

        return () => {
            cancelled = true
            window.clearTimeout(failsafe)
            ctx?.revert()
        }
    }, [reduceMotion])

    // Pointer parallax, pointer-device only. Coordinates are normalised to -1..1.
    useEffect(() => {
        if (reduceMotion || isMobile) return
        const el = sectionRef.current
        if (!el) return
        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
            pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1
        }
        const onLeave = () => {
            pointer.current.x = 0
            pointer.current.y = 0
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
            el.removeEventListener('pointermove', onMove)
            el.removeEventListener('pointerleave', onLeave)
        }
    }, [isMobile, reduceMotion])

    const frameloop = reduceMotion ? 'demand' : visible ? 'always' : 'never'

    return (
        <section
            id="signature"
            ref={sectionRef}
            className={`sig ${reduceMotion ? 'sig--static' : 'sig--animated'}`}
        >
            <div className="sig__stage" aria-hidden="true">
                {armed && (
                    <Suspense fallback={null}>
                        <PlumeStage
                            progress={progress}
                            pointer={reduceMotion || isMobile ? null : pointer}
                            barbCount={isMobile ? 140 : 300}
                            frameloop={frameloop}
                            dprMax={isMobile ? 1.35 : 1.75}
                            antialias={!isMobile}
                        />
                    </Suspense>
                )}
            </div>

            <div className="sig__grain" aria-hidden="true" />

            <div className="sig__content">
                <div className="sig__inner">
                    <p className="sig__eyebrow sig__reveal">Signature</p>

                    <h2 className="sig__title">
                        <span className="sig__line"><span>Rendered in</span></span>
                        <span className="sig__line"><span><em>real time.</em></span></span>
                    </h2>

                    <p className="sig__body sig__reveal">
                        A peacock plume with no model file behind it. Three hundred barbs placed by
                        code, lit by thin-film interference, drawn in a single instanced pass. The
                        same discipline goes into the systems that aren&rsquo;t this pretty.
                    </p>

                    <div className="sig__meta">
                        {CHIPS.map((chip) => (
                            <div className="sig__chip sig__reveal" key={chip.value}>
                                <span className="sig__chipValue">{chip.value}</span>
                                <span className="sig__chipLabel">{chip.label}</span>
                            </div>
                        ))}
                    </div>

                    <a className="sig__cta sig__reveal" href="#projects">
                        See the work
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}
