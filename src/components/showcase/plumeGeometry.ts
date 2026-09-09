import * as THREE from 'three'

/**
 * Static description of one barb on the plume. Everything here is computed once
 * at module scope so the render loop only ever composes matrices.
 */
export type Barb = {
    t: number      // 0..1 along the rachis, base to tip
    side: 1 | -1
    length: number
    alpha: number  // angle away from the rachis, radians
    roll: number   // spin about the barb's own axis
    bow: number    // out-of-plane lean, gives the fan depth
    color: THREE.Color
}

// Brighter than the source palette on purpose: at 0.8 metalness these are
// tints on a reflection, not paint, so they read several stops darker on screen.
const TEAL = new THREE.Color('#1a8a91')
const PEACOCK = new THREE.Color('#2a7cc4')
const SAGE = new THREE.Color('#9dbd85')
const GOLD = new THREE.Color('#e6c27e')

const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}

/** Where the rachis sits at a given t. A slight S-lean keeps it off-axis and alive. */
export const rachisPoint = (t: number, out = new THREE.Vector3()) =>
    out.set(
        Math.sin(t * 1.15) * 0.17 - 0.05,
        -1.78 + t * 3.28,
        -0.28 * t * t,
    )

/** Peak length mid-feather, tapering to nothing at the base and around the eye. */
const lengthAt = (t: number) => {
    const rise = Math.pow(THREE.MathUtils.clamp(t / 0.14, 0, 1), 0.75)
    const clearEye = 1 - 0.9 * smoothstep(0.6, 0.95, t)
    return 1.04 * rise * clearEye * (0.42 + 0.58 * Math.sin(Math.PI * Math.min(t * 1.02, 1)))
}

/** Teal at the quill, peacock blue through the body, gold as it approaches the eye. */
const colorAt = (t: number) => {
    const c = new THREE.Color()
    if (t < 0.34) c.copy(TEAL).lerp(PEACOCK, t / 0.34)
    else if (t < 0.66) c.copy(PEACOCK).lerp(SAGE, (t - 0.34) / 0.32)
    else c.copy(SAGE).lerp(GOLD, (t - 0.66) / 0.34)
    return c
}

export const buildBarbs = (count: number): Barb[] => {
    const barbs: Barb[] = []
    const perSide = Math.floor(count / 2)
    for (let side = 0; side < 2; side++) {
        for (let i = 0; i < perSide; i++) {
            // Bias sampling toward the tip so the eye stays dense while the quill stays sparse.
            const t = Math.pow((i + 0.5) / perSide, 0.86)
            const jitter = Math.sin(i * 12.9898 + side * 78.233) * 0.5
            barbs.push({
                t,
                side: side === 0 ? 1 : -1,
                length: lengthAt(t) * (1 + jitter * 0.06),
                alpha: THREE.MathUtils.lerp(0.86, 0.37, Math.pow(t, 0.8)) + jitter * 0.04,
                roll: (side === 0 ? 1 : -1) * ((t - 0.5) * 1.1) + jitter * 0.35,
                bow: Math.sin(t * Math.PI) * 0.11 * (side === 0 ? 1 : -1) + jitter * 0.05,
                color: colorAt(t),
            })
        }
    }
    return barbs
}

/** Concentric rings of the ocellus, outermost first. Radii in world units. */
export const OCELLUS_RINGS = [
    { radius: 0.385, tube: 0.046, color: '#e6c27e', roughness: 0.16, metalness: 0.95 },
    { radius: 0.3, tube: 0.042, color: '#8fae78', roughness: 0.2, metalness: 0.9 },
    { radius: 0.221, tube: 0.038, color: '#215f96', roughness: 0.18, metalness: 0.9 },
    { radius: 0.148, tube: 0.034, color: '#14707a', roughness: 0.22, metalness: 0.9 },
]

export const OCELLUS_T = 0.875
