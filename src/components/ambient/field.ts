/**
 * "Slipstream" — the page-wide atmosphere.
 *
 * A volume of iridescent barb filaments drifting past the viewport, bending
 * with scroll velocity so moving down the page feels like moving through air.
 * It is the peacock read as flight and material rather than as a bird.
 *
 * Canvas2D on purpose: a WebGL layer here would drag three.js into the entry
 * bundle for every visitor, and the Signature section hits harder if it owns
 * the only WebGL moment on the page.
 */

type Rgb = { r: number; g: number; b: number }

/** Peacock ramp, sampled from the same colours the plume uses. */
const RAMP: Rgb[] = [
    { r: 26, g: 138, b: 145 },  // teal
    { r: 42, g: 124, b: 196 },  // peacock blue
    { r: 157, g: 189, b: 133 }, // sage
    { r: 230, g: 194, b: 126 }, // gold
]

const SEGMENTS = 5

/** Deterministic RNG so the reduced-motion still frame is the same every load. */
const mulberry32 = (seed: number) => () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

type Filament = {
    x: number
    y: number
    depth: number
    len: number
    width: number
    angle: number
    sway: number
    swayFreq: number
    phase: number
    phaseSpeed: number
    riseSpeed: number
    driftX: number
    /** Precomputed per segment so the draw loop allocates no strings. */
    colors: string[]
}

type Ocellus = {
    x: number
    y: number
    radius: number
    depth: number
    riseSpeed: number
    pulse: number
    pulseSpeed: number
    rings: { scale: number; mid: string; edge: string; halo: number }[]
}

export type Field = {
    filaments: Filament[]
    ocelli: Ocellus[]
    width: number
    height: number
}

const rgba = (c: Rgb, a: number) => `rgba(${c.r}, ${c.g}, ${c.b}, ${a.toFixed(4)})`

const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
})

/** Sample the ramp continuously so filaments are not limited to four colours. */
const rampAt = (t: number): Rgb => {
    const scaled = t * (RAMP.length - 1)
    const i = Math.min(Math.floor(scaled), RAMP.length - 2)
    return mix(RAMP[i], RAMP[i + 1], scaled - i)
}

export const createField = (width: number, height: number, count: number, ocellusCount: number): Field => {
    const rand = mulberry32(0x9e37)
    const filaments: Filament[] = []

    for (let i = 0; i < count; i++) {
        const depth = rand()
        const colour = rampAt(rand())
        // Far filaments are thin, dim and slow; near ones are the accents.
        const alpha = 0.075 + depth * 0.28
        const colors: string[] = []
        for (let s = 0; s < SEGMENTS; s++) {
            // Bell taper so both ends of the barb dissolve instead of cutting off.
            const bell = Math.sin((Math.PI * (s + 0.5)) / SEGMENTS)
            colors.push(rgba(colour, alpha * bell))
        }

        filaments.push({
            x: rand() * width,
            y: rand() * height,
            depth,
            len: 70 + rand() * 210 * (0.45 + depth),
            width: 0.5 + rand() * 1.5 * (0.35 + depth),
            // Steeply raked, leaning the same way as the plume's barbs.
            angle: -Math.PI / 2 + (rand() - 0.5) * 0.85,
            sway: 6 + rand() * 22,
            swayFreq: 1.4 + rand() * 2.2,
            phase: rand() * Math.PI * 2,
            phaseSpeed: 0.16 + rand() * 0.34,
            riseSpeed: 7 + depth * 34,
            driftX: (rand() - 0.5) * 9,
            colors,
        })
    }

    const ocelli: Ocellus[] = []
    for (let i = 0; i < ocellusCount; i++) {
        const depth = 0.15 + rand() * 0.5
        const radius = 70 + rand() * 150
        ocelli.push({
            x: rand() * width,
            y: rand() * height,
            radius,
            depth,
            riseSpeed: 4 + depth * 13,
            pulse: rand() * Math.PI * 2,
            pulseSpeed: 0.1 + rand() * 0.14,
            rings: [0.42, 0.62, 0.82, 1].map((scale, ring) => {
                const c = rampAt(1 - ring / 3.4)
                return {
                    scale,
                    mid: rgba(c, (0.055 - ring * 0.008) * (0.4 + depth)),
                    edge: rgba(c, 0),
                    halo: 10 + (1 - scale) * 26,
                }
            }),
        })
    }

    return { filaments, ocelli, width, height }
}

/** Re-scatter positions after a resize without rebuilding the whole field. */
export const rescatter = (field: Field, width: number, height: number) => {
    const sx = width / (field.width || width)
    const sy = height / (field.height || height)
    for (const f of field.filaments) {
        f.x *= sx
        f.y *= sy
    }
    for (const o of field.ocelli) {
        o.x *= sx
        o.y *= sy
    }
    field.width = width
    field.height = height
}

export const stepField = (field: Field, dt: number, scrollVelocity: number) => {
    const { width, height } = field
    // Scrolling drags the whole volume along and rakes it over.
    const boost = 1 + Math.min(Math.abs(scrollVelocity) * 0.05, 7)
    const margin = 340

    for (const f of field.filaments) {
        f.y -= f.riseSpeed * boost * dt
        f.x += f.driftX * dt
        f.phase += f.phaseSpeed * dt

        if (f.y < -margin) {
            f.y = height + margin
            f.x = Math.random() * width
        } else if (f.y > height + margin) {
            f.y = -margin
        }
        if (f.x < -margin) f.x = width + margin
        else if (f.x > width + margin) f.x = -margin
    }

    for (const o of field.ocelli) {
        o.y -= o.riseSpeed * boost * dt
        o.pulse += o.pulseSpeed * dt
        if (o.y < -o.radius * 2) {
            o.y = height + o.radius * 2
            o.x = Math.random() * width
        } else if (o.y > height + o.radius * 2) {
            o.y = -o.radius * 2
        }
    }
}

export const drawField = (
    ctx: CanvasRenderingContext2D,
    field: Field,
    scrollVelocity: number,
    time: number,
) => {
    const { width, height } = field
    ctx.clearRect(0, 0, width, height)

    // Three slow colour hazes give the flat ground some depth without banding.
    ctx.globalCompositeOperation = 'lighter'
    const hazes = [
        { c: RAMP[0], px: 0.24, py: 0.3, s: 0.095 },
        { c: RAMP[3], px: 0.78, py: 0.62, s: 0.075 },
        { c: RAMP[1], px: 0.52, py: 0.88, s: 0.08 },
    ]
    for (let i = 0; i < hazes.length; i++) {
        const h = hazes[i]
        const cx = width * (h.px + Math.sin(time * 0.06 + i * 2.1) * 0.06)
        const cy = height * (h.py + Math.cos(time * 0.05 + i * 1.7) * 0.05)
        const r = Math.max(width, height) * 0.44
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, rgba(h.c, h.s))
        g.addColorStop(1, rgba(h.c, 0))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
    }

    // Ocelli sit behind the filaments, read as out-of-focus peacock eyes.
    for (const o of field.ocelli) {
        const r = o.radius * (1 + Math.sin(o.pulse) * 0.05)
        for (const ring of o.rings) {
            const rr = r * ring.scale
            const inner = Math.max(0, rr - ring.halo)
            const outer = rr + ring.halo
            const g = ctx.createRadialGradient(o.x, o.y, inner, o.x, o.y, outer)
            g.addColorStop(0, ring.edge)
            g.addColorStop(0.5, ring.mid)
            g.addColorStop(1, ring.edge)
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(o.x, o.y, outer, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    // Filaments. Every colour string is precomputed, so this loop only does maths.
    const shear = Math.max(-1, Math.min(1, scrollVelocity * 0.02))
    ctx.lineCap = 'round'
    for (const f of field.filaments) {
        const dx = Math.cos(f.angle)
        const dy = Math.sin(f.angle)
        const px = -dy
        const py = dx
        ctx.lineWidth = f.width

        let prevX = 0
        let prevY = 0
        for (let s = 0; s <= SEGMENTS; s++) {
            const t = s / SEGMENTS
            const along = (t - 0.5) * f.len
            // Sway grows toward the tip, and scroll shear rakes the whole barb.
            const lateral =
                Math.sin(f.phase + t * f.swayFreq) * f.sway * (0.25 + t) +
                shear * f.len * 0.42 * f.depth * t * t
            const x = f.x + dx * along + px * lateral
            const y = f.y + dy * along + py * lateral
            if (s > 0) {
                ctx.beginPath()
                ctx.moveTo(prevX, prevY)
                ctx.lineTo(x, y)
                ctx.strokeStyle = f.colors[s - 1]
                ctx.stroke()
            }
            prevX = x
            prevY = y
        }
    }

    ctx.globalCompositeOperation = 'source-over'
}
