import { BufferGeometry, Color, Float32BufferAttribute } from 'three'
import { assignLayers, sliceTerrain } from './geology'

const mix = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const hash = (x: number, z: number) => { const n = Math.sin(x * 127.1 + z * 311.7 + 8.41) * 43758.5453; return n - Math.floor(n) }
function noise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z)
  const fx = smooth(x - ix), fz = smooth(z - iz)
  return mix(mix(hash(ix, iz), hash(ix + 1, iz), fx), mix(hash(ix, iz + 1), hash(ix + 1, iz + 1), fx), fz)
}
function fbm(x: number, z: number) {
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

export function buildTerrain(segments = 150) {
  const vertices: number[] = [], indices: number[] = [], colors: number[] = []
  const spanX = 8, spanZ = 6.2
  for (let z = 0; z <= segments; z++) for (let x = 0; x <= segments; x++) {
    const px = (x / segments - .5) * spanX
    const pz = (z / segments - .5) * spanZ
    vertices.push(px, terrainHeight(px, pz), pz)
  }
  for (let z = 0; z < segments; z++) for (let x = 0; x < segments; x++) {
    const px = ((x + .5) / segments - .5) * spanX
    const pz = ((z + .5) / segments - .5) * spanZ
    if (Math.hypot(px / 3.95, pz / 3.05) > 1) continue
    const a = z * (segments + 1) + x, b = a + 1, c = a + segments + 1, d = c + 1
    indices.push(a, c, b, b, c, d)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  const normals = geometry.getAttribute('normal')
  const dark = new Color('#263d4c'), rock = new Color('#79909b'), snow = new Color('#edf5f8'), color = new Color()
  for (let i = 0; i < vertices.length / 3; i++) {
    const x = vertices[i * 3], y = vertices[i * 3 + 1], z = vertices[i * 3 + 2]
    const variation = noise(x * 19, z * 19)
    color.copy(dark).lerp(rock, clamp(y * .23 + variation * .25))
    const snowline = smooth((y + fbm(x * 3, z * 3) * .55 - 1.4) / .8)
    const slope = smooth((normals.getY(i) - .43) / .37)
    color.lerp(snow, snowline * Math.max(.15, slope))
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.computeBoundingSphere()

  const sideVertices: number[] = [], sideIndices: number[] = []
  const steps = 160
  for (let i = 0; i <= steps; i++) {
    const angle = i / steps * Math.PI * 2
    const x = Math.cos(angle) * 3.9, z = Math.sin(angle) * 3
    sideVertices.push(x, terrainHeight(x, z) - .01, z, x * .86, -.55 - noise(x * 5, z * 5) * .22, z * .86)
    if (i < steps) { const j = i * 2; sideIndices.push(j, j + 1, j + 2, j + 2, j + 1, j + 3) }
  }
  const sides = new BufferGeometry()
  sides.setAttribute('position', new Float32BufferAttribute(sideVertices, 3)); sides.setIndex(sideIndices); sides.computeVertexNormals()

  const lines: number[] = []
  const lineGrid = segments > 150 ? 128 : 90
  const field: number[][] = []
  for (let z = 0; z <= lineGrid; z++) {
    field[z] = []
    for (let x = 0; x <= lineGrid; x++) field[z][x] = terrainHeight((x / lineGrid - .5) * spanX, (z / lineGrid - .5) * spanZ)
  }
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0]]
  for (let level = .22; level < 3.1; level += .23) {
    for (let zi = 0; zi < lineGrid; zi++) for (let xi = 0; xi < lineGrid; xi++) {
      const x = (xi / lineGrid - .5) * spanX, z = (zi / lineGrid - .5) * spanZ
      if (Math.hypot(x / 3.8, z / 2.9) > 1) continue
      const corners = [[x, z], [x + spanX / lineGrid, z], [x + spanX / lineGrid, z + spanZ / lineGrid], [x, z + spanZ / lineGrid]]
      const heights = [field[zi][xi], field[zi][xi + 1], field[zi + 1][xi + 1], field[zi + 1][xi]]
      const cuts: number[][] = []
      edges.forEach(([a, b]) => {
        if ((heights[a] < level) === (heights[b] < level)) return
        const t = (level - heights[a]) / (heights[b] - heights[a])
        cuts.push([mix(corners[a][0], corners[b][0], t), level + .01, mix(corners[a][1], corners[b][1], t)])
      })
      if (cuts.length >= 2) lines.push(...cuts[0], ...cuts[1])
      if (cuts.length === 4) lines.push(...cuts[2], ...cuts[3])
    }
  }
  const contours = new BufferGeometry()
  contours.setAttribute('position', new Float32BufferAttribute(lines, 3))
  const sliced = sliceTerrain(geometry)
  geometry.dispose()
  return { geometry: sliced.surface, caps: sliced.caps, sides: assignLayers(sides), contours: assignLayers(contours) }
}
