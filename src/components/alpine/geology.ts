import { BufferGeometry, Float32BufferAttribute, ShapeUtils, Vector2 } from 'three'

// Every split is a real cut, so surfaces separate without stretching triangles.
export const strata = [-1, .18, .68, 1.16, 1.68, 2.25, 4.5]
export const layerAt = (height: number) => Math.max(0, Math.min(strata.length - 2, strata.findIndex(top => top > height) - 1))
type Vertex = number[] // position, normal, linear RGB
function clip(polygon: Vertex[], height: number, above: boolean): Vertex[] {
  const result: Vertex[] = []
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length]
    const insideA = above ? a[1] >= height : a[1] <= height
    const insideB = above ? b[1] >= height : b[1] <= height
    if (insideA) result.push(a)
    if (insideA !== insideB) {
      const t = (height - a[1]) / (b[1] - a[1])
      result.push(a.map((value, axis) => value + (b[axis] - value) * t))
    }
  }
  return result
}
function collector() {
  const positions: number[] = [], normals: number[] = [], colors: number[] = [], layers: number[] = [], cuts: number[] = []
  return {
    triangle(a: Vertex, b: Vertex, c: Vertex, layer: number, cut = false) {
      for (const vertex of [a, b, c]) {
        positions.push(...vertex.slice(0, 3)); normals.push(...vertex.slice(3, 6)); colors.push(...vertex.slice(6, 9))
        layers.push(layer); cuts.push(cut ? 1 : 0)
      }
    },
    finish() {
      const geometry = new BufferGeometry()
      for (const [key, array, itemSize] of [
        ['position', positions, 3], ['normal', normals, 3], ['color', colors, 3],
        ['aLayer', layers, 1], ['aCut', cuts, 1],
      ] as const) geometry.setAttribute(key, new Float32BufferAttribute(array, itemSize))
      geometry.computeBoundingSphere()
      // Shader movement raises the top layer by at most 1.25 world units.
      if (geometry.boundingSphere) geometry.boundingSphere.radius += 1.5
      return geometry
    },
  }
}
export function sliceTerrain(source: BufferGeometry) {
  const surface = collector(), caps = collector()
  const sections: Array<Array<[Vertex, Vertex]>> = strata.map(() => [])
  const positions = source.getAttribute('position'), normals = source.getAttribute('normal'), colors = source.getAttribute('color')
  const indices = source.index!
  const vertex = (i: number): Vertex => [
    positions.getX(i), positions.getY(i), positions.getZ(i),
    normals.getX(i), normals.getY(i), normals.getZ(i),
    colors.getX(i), colors.getY(i), colors.getZ(i),
  ]
  for (let i = 0; i < indices.count; i += 3) {
    const triangle = [vertex(indices.getX(i)), vertex(indices.getX(i + 1)), vertex(indices.getX(i + 2))]
    const min = Math.min(...triangle.map(v => v[1])), max = Math.max(...triangle.map(v => v[1]))
    for (let layer = 0; layer < strata.length - 1; layer++) {
      const low = strata[layer], high = strata[layer + 1]
      if (max < low || min > high) continue
      const polygon = clip(clip(triangle, low, true), high, false)
      for (let p = 1; p < polygon.length - 1; p++) surface.triangle(polygon[0], polygon[p], polygon[p + 1], layer)
    }
    for (let cut = 1; cut < strata.length - 1; cut++) {
      const height = strata[cut]
      if (max <= height || min >= height) continue
      const intersections: Vertex[] = []
      for (let edge = 0; edge < 3; edge++) {
        const a = triangle[edge], b = triangle[(edge + 1) % 3]
        if ((a[1] < height) === (b[1] < height)) continue
        const t = (height - a[1]) / (b[1] - a[1])
        intersections.push([a[0] + (b[0] - a[0]) * t, height, a[2] + (b[2] - a[2]) * t])
      }
      if (intersections.length === 2) sections[cut].push([intersections[0], intersections[1]])
    }
  }
  // Planar cut faces need only their boundary, not the full terrain tessellation.
  for (let cut = 1; cut < strata.length - 1; cut++) {
    const loops = sectionLoops(sections[cut]).sort((a, b) => Math.abs(ShapeUtils.area(b)) - Math.abs(ShapeUtils.area(a)))
    const parents = loops.map((loop, index) => {
      for (let j = index - 1; j >= 0; j--) if (contains(loops[j], loop[0])) return j
      return -1
    })
    const depths = loops.map((_, index) => { let depth = 0, parent = parents[index]; while (parent >= 0) { depth++; parent = parents[parent] } return depth })
    loops.forEach((outer, index) => {
      if (depths[index] % 2) return
      const holes = loops.filter((_, child) => parents[child] === index && depths[child] % 2 === 1)
      const points = [...outer, ...holes.flat()]
      const triangles = ShapeUtils.triangulateShape(outer, holes)
      const vertex = (point: Vector2, normal: number): Vertex => [point.x, strata[cut], point.y, 0, normal, 0, .075 + cut * .014, .115 + cut * .019, .145 + cut * .022]
      for (const indices of triangles) {
        const [a, b, c] = indices.map(i => points[i])
        const face = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0 ? [a, c, b] : [a, b, c]
        caps.triangle(vertex(face[0], 1), vertex(face[1], 1), vertex(face[2], 1), cut - 1, true)
        caps.triangle(vertex(face[0], -1), vertex(face[2], -1), vertex(face[1], -1), cut, true)
      }
    })
  }
  return { surface: surface.finish(), caps: caps.finish() }
}
function contains(polygon: Vector2[], point: Vector2) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j]
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}
function sectionLoops(segments: Array<[Vertex, Vertex]>) {
  const nodes = new Map<string, { point: Vector2; links: Set<string> }>()
  const key = (v: Vertex) => `${Math.round(v[0] * 100000)}:${Math.round(v[2] * 100000)}`
  for (const [a, b] of segments) {
    const ka = key(a), kb = key(b)
    if (ka === kb) continue
    if (!nodes.has(ka)) nodes.set(ka, { point: new Vector2(a[0], a[2]), links: new Set() })
    if (!nodes.has(kb)) nodes.set(kb, { point: new Vector2(b[0], b[2]), links: new Set() })
    nodes.get(ka)!.links.add(kb); nodes.get(kb)!.links.add(ka)
  }
  const loops: Vector2[][] = []
  for (const [start, node] of nodes) {
    if (!node.links.size) continue
    const loop: Vector2[] = []
    let current = start
    for (let step = 0; step <= segments.length; step++) {
      const entry = nodes.get(current)!
      loop.push(entry.point)
      const next = entry.links.values().next().value
      if (!next) break
      entry.links.delete(next); nodes.get(next)!.links.delete(current)
      current = next
      if (current === start) { if (loop.length >= 3) loops.push(loop); break }
    }
  }
  return loops
}
export function assignLayers(geometry: BufferGeometry) {
  const position = geometry.getAttribute('position')
  geometry.setAttribute('aLayer', new Float32BufferAttribute(Array.from({ length: position.count }, (_, i) => layerAt(position.getY(i))), 1))
  geometry.setAttribute('aCut', new Float32BufferAttribute(new Float32Array(position.count), 1))
  return geometry
}
