import { experiences, skillCategories } from '../../data/portfolio'
import { clamp, insideTerrain, layerAt, layerCount, mix, smooth, strata, terrainHeight } from './heightfield'

// The page is one route over the mountain; each section is a camp at a real height of the model (1 unit = 1,000 m).
export const camps = [
  { id: 'home', name: 'Trailhead', label: 'Home' },
  { id: 'projects', name: 'The face', label: 'Projects' },
  { id: 'about', name: 'Summit', label: 'About' },
  { id: 'experience', name: 'The descent', label: 'Experience' },
  { id: 'skills', name: 'Base camp', label: 'Skills' },
  { id: 'gallery', name: 'The valley', label: 'Gallery' },
  { id: 'contact', name: 'Summit register', label: 'Contact' },
] as const
export const chapters = camps.map(camp => camp.id)
export const chapterIndex = Object.fromEntries(chapters.map((id, index) => [id, index])) as Record<typeof chapters[number], number>

export const summit = (() => {
  let best = { x: 0, y: 0, z: 0 }
  for (let x = -1; x <= 1; x += .02) for (let z = -1.2; z <= .6; z += .02) {
    const y = terrainHeight(x, z)
    if (y > best.y) best = { x, y, z }
  }
  return best
})()
export const metres = (height: number) => Math.max(0, Math.round(height * 100) * 10)

// A switchback descent on the one flank that falls without re-climbing a secondary peak.
export const trail = (() => {
  const heading = { x: -.75, z: -.66 }, across = { x: .66, z: -.75 }
  const points: Array<[number, number, number]> = []
  for (let i = 0; i <= 420; i++) {
    const t = i / 420 * 3.6
    const sway = Math.sin(t * 5.4) * (.07 + t * .11)
    const x = summit.x + heading.x * t + across.x * sway, z = summit.z + heading.z * t + across.z * sway
    if (!insideTerrain(x, z, .92)) break
    points.push([x, terrainHeight(x, z) + .035, z])
  }
  const distance = [0]
  for (let i = 1; i < points.length; i++) distance.push(distance[i - 1] + Math.hypot(...points[i].map((value, axis) => value - points[i - 1][axis]) as [number, number, number]))
  const length = distance[distance.length - 1]
  // Waypoints are evenly spaced in altitude: the newest entry sits just below the summit, the oldest near the valley.
  const top = summit.y - .35, bottom = .32
  const waypoints: Array<{ t: number; point: [number, number, number] }> = []
  let cursor = 0
  experiences.forEach((_, index) => {
    const target = mix(top, bottom, index / Math.max(1, experiences.length - 1))
    while (cursor < points.length - 1 && points[cursor][1] > target + .035) cursor++
    waypoints.push({ t: distance[cursor] / length, point: points[cursor] })
  })
  return { points, waypoints, start: { t: 0, point: points[0] } }
})()

// Web & Frontend is the surface people see; languages are the bedrock under everything.
export const stack = ['Languages', 'Cloud, DevOps & Security', 'Data & Storage', 'Backend & APIs', 'AI & Machine Learning', 'Web & Frontend']
export const stackRoles = ['Bedrock', 'Infrastructure', 'Storage', 'Services', 'Intelligence', 'Surface']
export const stratumOf = (title: string) => stack.indexOf(title)
export const stackCategories = [...skillCategories].sort((a, b) => stratumOf(b.title) - stratumOf(a.title))
export const stratumCamp = (layer: number) => layer >= layerCount - 1 ? 'about' : layer >= 2 ? 'projects' : layer === 1 ? 'experience' : 'skills'

export type RouteLayout = { boundaries: number[]; entries: number[]; viewport: number; scrollHeight: number }
export type RoutePosition = { chapter: number; chapterProgress: number; trail: number; altitude: number }

// Pure scroll → route mapping, shared by the scene, the altimeter readout and its drawn profile.
export function locate({ boundaries, entries, viewport, scrollHeight }: RouteLayout, scroll: number): RoutePosition {
  const position = scroll + viewport * .25
  let chapter = 0
  for (let i = 1; i < boundaries.length; i++) if (position >= boundaries[i]) chapter = i
  const start = boundaries[chapter] ?? 0
  const end = boundaries[chapter + 1] ?? Math.max(start + 1, scrollHeight - viewport * .75)
  const chapterProgress = clamp((position - start) / Math.max(1, end - start))
  const line = scroll + viewport * .5
  let trail = -1
  if (entries.length) {
    if (line < entries[0]) trail = clamp((position - boundaries[chapterIndex.experience]) / Math.max(1, entries[0] - viewport * .25 - boundaries[chapterIndex.experience])) - 1
    else {
      trail = entries.length - 1
      for (let i = 0; i < entries.length - 1; i++) if (line < entries[i + 1]) { trail = i + (line - entries[i]) / Math.max(1, entries[i + 1] - entries[i]); break }
    }
  }
  return { chapter, chapterProgress, trail, altitude: altitudeAt(chapter, chapterProgress, trail) }
}

const waypointHeight = (trailValue: number) => {
  const { waypoints } = trail
  if (trailValue < 0) return mix(summit.y, waypoints[0].point[1], trailValue + 1)
  const index = Math.min(waypoints.length - 2, Math.floor(trailValue))
  return mix(waypoints[index].point[1], waypoints[index + 1].point[1], clamp(trailValue - index))
}
export const trailParameter = (trailValue: number) => {
  const { waypoints } = trail
  if (trailValue < 0) return mix(0, waypoints[0].t, trailValue + 1)
  const index = Math.min(waypoints.length - 2, Math.floor(trailValue))
  return mix(waypoints[index].t, waypoints[index + 1].t, clamp(trailValue - index))
}
const baseCamp = strata[1], lastWaypoint = trail.waypoints[trail.waypoints.length - 1].point[1]
function altitudeAt(chapter: number, progress: number, trailValue: number) {
  const height = [
    () => mix(0, strata[2], smooth(progress)),
    () => mix(strata[2], strata[5], progress),
    () => mix(strata[5], summit.y, smooth(progress / .35)),
    () => waypointHeight(trailValue),
    () => mix(lastWaypoint, baseCamp, smooth(progress / .3)),
    () => mix(baseCamp, 0, smooth(progress / .5)),
    () => mix(0, summit.y, smooth(progress / .85)),
  ][chapter]?.() ?? 0
  return height * 1000
}
export const currentLayer = (altitude: number) => layerAt(altitude / 1000)
