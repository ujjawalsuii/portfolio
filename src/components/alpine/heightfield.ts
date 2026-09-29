// Pure terrain maths, shared by the WebGL scene and the page shell without importing Three.js.
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export const clamp = (n: number) => Math.max(0, Math.min(1, n))
export const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const hash = (x: number, z: number) => { const n = Math.sin(x * 127.1 + z * 311.7 + 8.41) * 43758.5453; return n - Math.floor(n) }
export function noise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z)
  const fx = smooth(x - ix), fz = smooth(z - iz)
  return mix(mix(hash(ix, iz), hash(ix + 1, iz), fx), mix(hash(ix, iz + 1), hash(ix + 1, iz + 1), fx), fz)
}
export function fbm(x: number, z: number) {
  let n = 0, amplitude = .5
  for (let i = 0; i < 6; i++) { n += noise(x, z) * amplitude; x = x * 2.06 + 9.2; z = z * 2.03 + 3.8; amplitude *= .49 }
  return n
}
const peaks = [
  { x: -.1, z: -.35, h: 3.35, wx: 1.05, wz: 1.6 },
  { x: -1.55, z: .25, h: 2.25, wx: 1.1, wz: .8 },
  { x: 1.2, z: -.55, h: 2.65, wx: .85, wz: 1.05 },
  { x: 2, z: .75, h: 1.8, wx: .8, wz: .85 },
  { x: -.8, z: 1.45, h: 1.5, wx: 1.6, wz: .7 },
]
export const insideTerrain = (x: number, z: number, margin = 1) => Math.hypot(x / 3.95, z / 3.05) <= margin
export function terrainHeight(x: number, z: number) {
  const warp = (fbm(x * 1.1, z * 1.1) - .5) * .65
  let elevation = 0
  peaks.forEach(peak => {
    const dx = (x - peak.x + warp) / peak.wx
    const dz = (z - peak.z - warp) / peak.wz
    elevation = Math.max(elevation, peak.h * Math.exp(-Math.sqrt(dx * dx + dz * dz) * 1.03))
  })
  const ridge = 1 - Math.abs(fbm(x * 2.7 + 10, z * 2.7) * 2 - 1)
  const erosion = Math.pow(1 - Math.abs(noise(x * 8 + warp * 2, z * 8) * 2 - 1), 3)
  const detail = (fbm(x * 13, z * 13) - .5) * .035 - erosion * .095 * Math.min(1, elevation)
  const edge = smooth((1 - Math.hypot(x / 3.95, z / 3.05)) * 5)
  return Math.max(.02, (elevation + ridge * .26 + detail) * edge)
}

// Every split is a real cut, so surfaces separate without stretching triangles.
export const strata = [-1, .18, .68, 1.16, 1.68, 2.25, 4.5]
export const layerCount = strata.length - 1
export const layerAt = (height: number) => Math.max(0, Math.min(layerCount - 1, strata.findIndex(top => top > height) - 1))
