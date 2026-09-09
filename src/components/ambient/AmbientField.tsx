import { useEffect, useRef } from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { createField, drawField, rescatter, stepField } from './field'
import './ambient.css'

/**
 * One fixed canvas behind the entire page. Every section is transparent over
 * it, which is what turns a stack of coloured blocks into a single continuous
 * space.
 */
export const AmbientField = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isMobile = useIsMobile()
    const reduceMotion = usePrefersReducedMotion()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return

        const dprCap = isMobile ? 1.25 : 1.5
        const field = createField(
            window.innerWidth,
            window.innerHeight,
            isMobile ? 46 : 130,
            isMobile ? 3 : 5,
        )

        let width = 0
        let height = 0

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            rescatter(field, width, height)
        }
        resize()

        if (reduceMotion) {
            // A single composed frame: the atmosphere is present, but still.
            stepField(field, 0, 0)
            drawField(ctx, field, 0, 0)
            const redraw = () => {
                resize()
                drawField(ctx, field, 0, 0)
            }
            window.addEventListener('resize', redraw)
            return () => window.removeEventListener('resize', redraw)
        }

        let lastScroll = window.scrollY
        let velocity = 0
        const onScroll = () => {
            velocity += window.scrollY - lastScroll
            lastScroll = window.scrollY
        }

        let raf = 0
        let last = performance.now()
        let elapsed = 0

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            // Clamp dt so a backgrounded tab does not teleport the whole field.
            const dt = Math.min((now - last) / 1000, 1 / 20)
            last = now
            elapsed += dt

            velocity *= Math.exp(-dt * 3.2)
            if (Math.abs(velocity) < 0.01) velocity = 0

            stepField(field, dt, velocity)
            drawField(ctx, field, velocity, elapsed)
        }

        const start = () => {
            if (raf) return
            last = performance.now()
            raf = requestAnimationFrame(frame)
        }
        const stop = () => {
            if (!raf) return
            cancelAnimationFrame(raf)
            raf = 0
        }

        const onVisibility = () => (document.hidden ? stop() : start())

        window.addEventListener('resize', resize)
        window.addEventListener('scroll', onScroll, { passive: true })
        document.addEventListener('visibilitychange', onVisibility)
        start()

        return () => {
            stop()
            window.removeEventListener('resize', resize)
            window.removeEventListener('scroll', onScroll)
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [isMobile, reduceMotion])

    return <canvas ref={canvasRef} className="ambient" aria-hidden="true" />
}
