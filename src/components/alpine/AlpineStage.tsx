import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildTerrain } from './terrain'
import { useSceneMotion } from './motion'
import type { SceneState } from './motion'
import { AnimatedUniform, createMountainMaterials, createMountainUniforms } from './mountainMaterial'
import { insideTerrain, layerAt, layerCount, strata, terrainHeight } from './heightfield'
import { camps, currentLayer, stackCategories, stackRoles, stratumCamp, stratumOf, summit, trail, trailParameter } from './route'
import { HeroDepth } from './HeroDepth'

// Preserve the approved compositions; each camp adds its own light and detail within them.
type Pose = { x: number; y: number; s: number; r: number; solid: number; contour: number; wire: number; split: number; warm: number; night: number; path: number; stack: number }
const pose = (values: Omit<Pose, 'split' | 'warm' | 'night' | 'path' | 'stack'> & Partial<Pose>): Pose => ({ split: 0, warm: 0, night: 0, path: 0, stack: 0, ...values })
const poses = [
  pose({ x: .26, y: -.8, s: .75, r: -.55, solid: 0, contour: 0, wire: 0 }),
  pose({ x: .3, y: -.3, s: .91, r: -.4, solid: .94, contour: .12, wire: .008, split: .24 }),
  pose({ x: -.29, y: -2.35, s: 1.3, r: .4, solid: .86, contour: .05, wire: .006, warm: 1 }),
  pose({ x: -.33, y: -1.5, s: .58, r: 2.7, solid: .62, contour: .3, wire: .02, path: 1 }),
  pose({ x: .31, y: -.62, s: .56, r: 2.05, solid: .86, contour: .34, wire: .03, split: .34, stack: 1 }),
  pose({ x: -.24, y: -.5, s: .85, r: 2.55, solid: .22, contour: .12, wire: .01 }),
  pose({ x: .23, y: -.5, s: 1.28, r: 3.15, solid: .83, contour: .13, wire: .015, night: 1 }),
]
// Strata open inside Projects, and stay open through most of the Skills stack.
const openings: Record<number, [number, number, number, number]> = { 1: [.12, .40, .70, .96], 4: [.02, .2, .86, 1.01] }
const { smoothstep, lerp, damp } = THREE.MathUtils
function blendPose({ chapter, chapterProgress }: SceneState) {
  const current = poses[chapter] ?? poses[0], next = poses[Math.min(chapter + 1, poses.length - 1)]
  const t = smoothstep(chapterProgress, .72, 1)
  const blended = { ...current }
  for (const key of Object.keys(current) as Array<keyof Pose>) blended[key] = lerp(current[key], next[key], t)
  return blended
}
const opening = (chapter: number, progress: number) => {
  const range = openings[chapter]
  return range ? smoothstep(progress, range[0], range[1]) * (1 - smoothstep(progress, range[2], range[3])) : 0
}
const useRate = (enabled: boolean) => (from: number, to: number, speed: number, delta: number) => enabled ? damp(from, to, speed, Math.min(delta, .05)) : to

// Outline of each stratum at mid-height, used to anchor its label beside the exploded stack.
const rings = strata.slice(0, layerCount).map((low, layer) => {
  const middle = layer === layerCount - 1 ? (low + summit.y) / 2 : (Math.max(low, .02) + strata[layer + 1]) / 2
  const points: THREE.Vector3[] = []
  for (let i = 0; i < 28; i++) {
    const angle = i / 28 * Math.PI * 2
    for (let r = 3.9; r > 0; r -= .05) {
      const x = summit.x + Math.cos(angle) * r, z = summit.z + Math.sin(angle) * r
      if (insideTerrain(x, z) && terrainHeight(x, z) >= middle) { points.push(new THREE.Vector3(x, middle, z)); break }
    }
  }
  return points
})

// The stratum under a screen ray, marched through the displaced heightfield instead of 90k triangles.
function pickStratum(ray: THREE.Ray, offsets: Float32Array) {
  const { origin, direction } = ray
  if (direction.y > -.01) return -1
  const top = summit.y + offsets[layerCount - 1] + .1
  const t0 = (top - origin.y) / direction.y, t1 = (-.6 - origin.y) / direction.y
  for (let step = 0; step <= 150; step++) {
    const t = lerp(t0, t1, step / 150)
    const x = origin.x + direction.x * t, y = origin.y + direction.y * t, z = origin.z + direction.z * t
    if (!insideTerrain(x, z)) continue
    const height = terrainHeight(x, z)
    for (let layer = layerAt(height); layer >= 0; layer--) {
      const high = (layer === layerAt(height) ? height : strata[layer + 1]) + offsets[layer]
      if (y <= high && y >= Math.max(strata[layer], -.6) + offsets[layer]) return layer
    }
  }
  return -1
}

function Terrain() {
  const { state, enabled } = useSceneMotion()
  const group = useRef<THREE.Group>(null)
  const { viewport, size, invalidate } = useThree()
  const compact = size.width < 800
  const terrain = useMemo(() => buildTerrain(compact ? 112 : 208), [compact])
  const uniforms = useMemo(() => createMountainUniforms(), [])
  const materials = useMemo(() => createMountainMaterials(uniforms), [uniforms])
  const tools = useMemo(() => ({ raycaster: new THREE.Raycaster(), inverse: new THREE.Matrix4(), point: new THREE.Vector3(), ndc: new THREE.Vector2() }), [])
  const overlay = useRef<{ labels: HTMLElement[]; cards: HTMLElement[]; tip: HTMLElement | null; shown: string }>({ labels: [], cards: [], tip: null, shown: '' })
  const rate = useRate(enabled)

  useEffect(() => {
    overlay.current.labels = Array.from(document.querySelectorAll<HTMLElement>('[data-stratum-label]'))
    overlay.current.cards = Array.from(document.querySelectorAll<HTMLElement>('.skill-category[data-stratum]'))
    overlay.current.tip = document.querySelector<HTMLElement>('.strata-tip')
    const root = document.documentElement
    return () => { delete root.dataset.strata }
  }, [])
  useEffect(() => {
    if (enabled) return
    const redraw = () => invalidate()
    window.addEventListener('scroll', redraw, { passive: true })
    window.addEventListener('pointermove', redraw, { passive: true })
    return () => { window.removeEventListener('scroll', redraw); window.removeEventListener('pointermove', redraw) }
  }, [enabled, invalidate])
  useEffect(() => () => { Object.values(terrain).forEach(geometry => geometry.dispose()) }, [terrain])
  useEffect(() => () => { Object.values(materials).forEach(material => material.dispose()) }, [materials])

  useFrame(({ clock, camera }, delta) => {
    const mountain = group.current
    if (!mountain) return
    const scene = state.current
    const { chapter, chapterProgress: progress, pointer, heroProgress } = scene
    const current = blendPose(scene)
    const homeReveal = chapter === 0 ? smoothstep(heroProgress, .48, 1) : 1
    const mobileOpacity = compact ? .32 : 1
    const drift = enabled ? Math.sin(clock.elapsedTime * .25) * .075 : 0
    const open = opening(chapter, progress)
    const split = open * current.split * (compact ? .55 : 1)
    const stacked = current.stack > .5

    // The stratum under the mouse, when it rests on open background and the mountain is clearly visible.
    let pointed = -1
    if (!compact && scene.mouse.free && chapter > 0 && materials.surface.opacity > .3) {
      tools.ndc.set(scene.mouse.x, scene.mouse.y)
      tools.raycaster.setFromCamera(tools.ndc, camera)
      tools.raycaster.ray.applyMatrix4(tools.inverse.copy(mountain.matrixWorld).invert())
      pointed = pickStratum(tools.raycaster.ray, uniforms.uOffset.value)
    }
    const destination = pointed < 0 ? '' : stacked ? `stratum:${pointed}` : stratumCamp(pointed)
    const target = destination === camps[chapter].id ? '' : destination
    Object.assign(scene.hover, { layer: target ? pointed : -1, target })
    // Highlight the hovered stratum, else the linked skill inside the stack, else the stratum at the visitor's altitude.
    const focus = scene.hover.layer >= 0 ? scene.hover.layer : stacked ? scene.stackFocus : chapter > 0 ? currentLayer(scene.altitude) : -1
    const lift = split > .01 && focus >= 0 ? (stacked ? .16 : .06) * Math.min(1, split / .1) : 0
    let highest = 0
    for (let layer = 0; layer < layerCount; layer++) {
      const offset = layer * split + (focus >= 0 && layer >= focus ? lift : 0) + (focus >= 0 && layer > focus ? lift : 0)
      uniforms.uOffset.put(layer, rate(uniforms.uOffset.value[layer], offset, 5, delta))
      uniforms.uGlow.put(layer, rate(uniforms.uGlow.value[layer], layer === focus ? (stacked || scene.hover.layer >= 0 ? 1 : .5) : 0, 4, delta))
      highest = Math.max(highest, uniforms.uOffset.value[layer])
    }
    uniforms.uSeparation.set(rate(uniforms.uSeparation.value, split, 4, delta))
    uniforms.uAlpenglow.set(rate(uniforms.uAlpenglow.value, current.warm, 2.5, delta))

    const sway = enabled ? pointer.x : 0
    mountain.position.x = rate(mountain.position.x, viewport.width * (compact ? .13 : current.x) + sway * .11, 3.2, delta)
    mountain.position.y = rate(mountain.position.y, current.y + drift - highest * .34, 3.2, delta)
    mountain.rotation.y = rate(mountain.rotation.y, current.r + progress * .23 + sway * .09, 3.2, delta)
    mountain.rotation.x = rate(mountain.rotation.x, (enabled ? pointer.y * .015 : 0) - .03, 3.2, delta)
    mountain.scale.setScalar(rate(mountain.scale.x, current.s * (compact ? .62 : Math.min(1.15, viewport.width / 14)), 3.2, delta))
    materials.surface.setValues({ opacity: rate(materials.surface.opacity, (chapter === 0 ? homeReveal * .88 : current.solid) * mobileOpacity, 3.2, delta) })
    materials.sides.setValues({ opacity: materials.surface.opacity * .72 })
    materials.contours.setValues({ opacity: rate(materials.contours.opacity, current.contour * mobileOpacity, 3.2, delta) })
    materials.wire.setValues({ opacity: rate(materials.wire.opacity, current.wire * mobileOpacity, 3.2, delta) })
    mountain.visible = materials.surface.opacity > .005 || materials.contours.opacity > .005
    if (enabled) {
      uniforms.uScan.set(damp(uniforms.uScan.value, -.3 + progress * 3.8, 5, Math.min(delta, .05)))
      uniforms.uScanStrength.set(damp(uniforms.uScanStrength.value, chapter === 1 || chapter === 4 ? .32 + open * .5 : .08, 4, Math.min(delta, .05)))
    } else uniforms.uScanStrength.set(0)

    const { labels, cards, tip } = overlay.current
    const root = document.documentElement
    cards.forEach(card => card.classList.toggle('is-linked', stacked && scene.hover.layer >= 0 && Number(card.dataset.stratum) === scene.hover.layer))
    if (target) root.dataset.strata = 'hover'
    else delete root.dataset.strata
    if (tip) {
      const camp = camps.find(item => item.id === target)
      const text = !target ? '' : stacked ? `${stackRoles[pointed]} · ${stackCategories.find(category => stratumOf(category.title) === pointed)?.title}` : `${camp?.name} · ${camp?.label} →`
      if (text !== overlay.current.shown) { tip.textContent = text; tip.classList.toggle('is-visible', !!text); overlay.current.shown = text }
      if (text) tip.style.transform = `translate(${(scene.mouse.x + 1) / 2 * size.width + 16}px, ${(1 - scene.mouse.y) / 2 * size.height + 18}px)`
    }
    // Labels sit just left of each stratum's outline in the exploded stack.
    const labelOpacity = compact ? 0 : smoothstep(current.stack, .5, 1) * smoothstep(split, .12, .3)
    labels.forEach(label => {
      const layer = Number(label.dataset.stratumLabel)
      label.style.opacity = String(labelOpacity)
      label.classList.toggle('is-focused', layer === focus)
      if (labelOpacity < .01) return
      let left = Infinity, y = 0
      for (const point of rings[layer]) {
        tools.point.set(point.x, point.y + uniforms.uOffset.value[layer], point.z)
        mountain.localToWorld(tools.point).project(camera)
        const x = (tools.point.x + 1) / 2 * size.width
        if (x < left) { left = x; y = (1 - tools.point.y) / 2 * size.height }
      }
      label.style.transform = `translate(${left - 12}px, ${y}px) translate(-100%, -50%)`
    })
  })

  return <group ref={group} position={[5, -.8, 0]} rotation={[0, -.55, 0]}>
    <mesh geometry={terrain.geometry} material={materials.surface} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <mesh geometry={terrain.caps} material={materials.surface} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <mesh geometry={terrain.sides} material={materials.sides} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <lineSegments geometry={terrain.contours} material={materials.contours} />
    <mesh geometry={terrain.geometry} material={materials.wire} scale={1.001} />
    <Trail compact={compact} />
    <Summit compact={compact} />
  </group>
}

// Experience: the descent from the summit, one waypoint per timeline entry, lit as far as the visitor has read.
const trailShader = {
  vertexShader: /* glsl */`
    varying float vAlong;
    void main() { vAlong = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform float uHead;
    uniform float uOpacity;
    varying float vAlong;
    void main() {
      float travelled = 1.0 - smoothstep(uHead - .004, uHead + .004, vAlong);
      float head = exp(-pow((vAlong - uHead) * 70.0, 2.0));
      float dash = mix(step(.42, fract(vAlong * 150.0)), 1.0, travelled);
      vec3 color = mix(vec3(.34, .52, .66), vec3(.70, .89, 1.0), travelled) + head * vec3(.5, .7, .8);
      gl_FragColor = vec4(color, uOpacity * dash * (.3 + .45 * travelled + head));
    }`,
}
const waypointShader = {
  vertexShader: /* glsl */`
    attribute float aIndex;
    uniform float uActive;
    uniform float uPixelRatio;
    varying float vFocus;
    varying float vVisited;
    void main() {
      vFocus = 1.0 - smoothstep(0.0, .75, abs(aIndex - uActive));
      vVisited = step(aIndex, uActive + .5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = (8.0 + vFocus * 12.0) * uPixelRatio;
    }`,
  fragmentShader: /* glsl */`
    uniform float uOpacity;
    uniform float uTime;
    varying float vFocus;
    varying float vVisited;
    void main() {
      float r = length(gl_PointCoord - .5) * 2.0;
      float ring = 1.0 - smoothstep(.06, .16, abs(r - .74 - .12 * vFocus * sin(uTime * 2.6)));
      float core = 1.0 - smoothstep(.2, .36, r);
      float alpha = ring * (.45 + .55 * vFocus) + core * mix(.25, 1.0, max(vVisited, vFocus));
      gl_FragColor = vec4(mix(vec3(.55, .74, .86), vec3(.86, .96, 1.0), vFocus), uOpacity * alpha);
    }`,
}
function Trail({ compact }: { compact: boolean }) {
  const { state, enabled } = useSceneMotion()
  const { gl } = useThree()
  const path = useRef<THREE.Mesh>(null)
  const rate = useRate(enabled)
  const uniforms = useMemo(() => ({ uHead: new AnimatedUniform(0), uOpacity: new AnimatedUniform(0), uActive: new AnimatedUniform(-1), uPixelRatio: new AnimatedUniform(1), uTime: new AnimatedUniform(0) }), [])
  const tube = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trail.points.map(point => new THREE.Vector3(...point))), 900, .026, 5), [])
  const markers = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(trail.waypoints.flatMap(({ point }) => [point[0], point[1] + .03, point[2]]), 3))
    geometry.setAttribute('aIndex', new THREE.Float32BufferAttribute(trail.waypoints.map((_, index) => index), 1))
    return geometry
  }, [])
  const materials = useMemo(() => ({
    path: new THREE.ShaderMaterial({ ...trailShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    markers: new THREE.ShaderMaterial({ ...waypointShader, uniforms, transparent: true, depthWrite: false }),
  }), [uniforms])
  useEffect(() => () => { tube.dispose(); markers.dispose(); materials.path.dispose(); materials.markers.dispose() }, [tube, markers, materials])
  useFrame(({ clock }, delta) => {
    const scene = state.current
    uniforms.uOpacity.set(rate(uniforms.uOpacity.value, blendPose(scene).path * (compact ? .55 : 1), 3, delta))
    uniforms.uHead.set(rate(uniforms.uHead.value, trailParameter(scene.trail), 4, delta))
    uniforms.uActive.set(rate(uniforms.uActive.value, scene.trail, 4, delta))
    uniforms.uPixelRatio.set(gl.getPixelRatio())
    uniforms.uTime.set(enabled ? clock.elapsedTime : 0)
    if (path.current?.parent) path.current.parent.visible = uniforms.uOpacity.value > .005
  })
  return <group>
    <mesh ref={path} geometry={tube} material={materials.path} renderOrder={3} />
    <points geometry={markers} material={materials.markers} renderOrder={4} />
  </group>
}

// About: spindrift streaming off the summit in the alpenglow. Contact: a beacon lit on the summit at night.
const spindriftShader = {
  vertexShader: /* glsl */`
    attribute float aSeed;
    uniform float uTime;
    uniform float uPixelRatio;
    uniform vec3 uWind;
    varying float vAlpha;
    void main() {
      float life = fract(uTime * (.07 + aSeed * .06) + aSeed * 7.13);
      vec3 p = position + uWind * life * (1.1 + aSeed * .9);
      p.y += life * .22 - life * life * .3 + sin(life * 6.0 + aSeed * 20.0) * .03;
      p += cross(uWind, vec3(0.0, 1.0, 0.0)) * sin(life * 4.0 + aSeed * 11.0) * .1;
      vAlpha = sin(life * 3.14159) * (.45 + .55 * fract(aSeed * 13.7));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = (1.8 + fract(aSeed * 5.3) * 3.2) * uPixelRatio;
    }`,
  fragmentShader: /* glsl */`
    uniform float uOpacity;
    uniform float uWarm;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - .5);
      gl_FragColor = vec4(mix(vec3(.9, .96, 1.0), vec3(1.0, .86, .8), uWarm), uOpacity * vAlpha * (1.0 - smoothstep(.15, .5, d)));
    }`,
}
const beaconShader = {
  vertexShader: /* glsl */`
    attribute float aHalo;
    uniform float uPixelRatio;
    uniform float uTime;
    varying float vHalo;
    void main() {
      vHalo = aHalo;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = mix(12.0, 150.0, aHalo) * uPixelRatio;
    }`,
  fragmentShader: /* glsl */`
    uniform float uOpacity;
    uniform float uTime;
    varying float vHalo;
    void main() {
      float d = length(gl_PointCoord - .5) * 2.0;
      float core = 1.0 - smoothstep(.2, 1.0, d);
      // A soft glow and a signal ring that expands from the summit every few seconds.
      float wave = fract(uTime * .32);
      float ring = (1.0 - smoothstep(0.0, .045, abs(d - wave))) * (1.0 - wave) * .55;
      float halo = exp(-d * 5.5) * (.6 + .15 * sin(uTime * 1.8)) + ring;
      gl_FragColor = vec4(vec3(.82, .94, 1.0), uOpacity * mix(core, halo, vHalo) * (1.0 - step(1.0, d)));
    }`,
}
const seeded = (i: number) => { const n = Math.sin(i * 91.7 + 3.1) * 43758.5453; return n - Math.floor(n) }
function Summit({ compact }: { compact: boolean }) {
  const { state, enabled } = useSceneMotion()
  const { gl } = useThree()
  const drift = useRef<THREE.Points>(null)
  const beacon = useRef<THREE.Points>(null)
  const rate = useRate(enabled)
  const uniforms = useMemo(() => ({
    uTime: new AnimatedUniform(0), uPixelRatio: new AnimatedUniform(1), uWarm: new AnimatedUniform(0), uOpacity: new AnimatedUniform(0), uWind: { value: new THREE.Vector3(1, 0, 0) },
  }), [])
  const beaconUniforms = useMemo(() => ({ uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio, uOpacity: new AnimatedUniform(0) }), [uniforms])
  const geometry = useMemo(() => {
    const positions: number[] = [], seeds: number[] = []
    for (let i = 0; i < 200; i++) {
      const x = summit.x + (seeded(i) - .5) * .8, z = summit.z + (seeded(i + 300) - .5) * .5
      positions.push(x, terrainHeight(x, z) + .03, z); seeds.push(seeded(i + 700))
    }
    const drifting = new THREE.BufferGeometry()
    drifting.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    drifting.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
    const light = new THREE.BufferGeometry()
    light.setAttribute('position', new THREE.Float32BufferAttribute([summit.x, summit.y + .07, summit.z, summit.x, summit.y + .07, summit.z], 3))
    light.setAttribute('aHalo', new THREE.Float32BufferAttribute([1, 0], 1))
    return { drifting, light }
  }, [])
  const materials = useMemo(() => ({
    drift: new THREE.ShaderMaterial({ ...spindriftShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    beacon: new THREE.ShaderMaterial({ ...beaconShader, uniforms: beaconUniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }),
  }), [uniforms, beaconUniforms])
  useEffect(() => () => { geometry.drifting.dispose(); geometry.light.dispose(); materials.drift.dispose(); materials.beacon.dispose() }, [geometry, materials])
  useFrame(({ clock }, delta) => {
    const current = blendPose(state.current)
    const mountain = drift.current?.parent
    // Blow toward screen-right whatever the mountain's current rotation.
    if (mountain) uniforms.uWind.value.set(Math.cos(mountain.rotation.y), 0, Math.sin(mountain.rotation.y))
    uniforms.uTime.set(enabled ? clock.elapsedTime : 0)
    uniforms.uPixelRatio.set(gl.getPixelRatio())
    uniforms.uWarm.set(current.warm)
    uniforms.uOpacity.set(rate(uniforms.uOpacity.value, Math.max(current.warm, current.night * .45) * (compact ? .6 : 1) * (enabled ? 1 : .5), 3, delta))
    beaconUniforms.uOpacity.set(rate(beaconUniforms.uOpacity.value, smoothstep(state.current.altitude, 2400, summit.y * 1000 - 50) * current.night * (compact ? .55 : 1), 3, delta))
    if (drift.current) drift.current.visible = uniforms.uOpacity.value > .005
    if (beacon.current) beacon.current.visible = beaconUniforms.uOpacity.value > .005
  })
  return <>
    <points ref={drift} geometry={geometry.drifting} material={materials.drift} renderOrder={5} frustumCulled={false} />
    <points ref={beacon} geometry={geometry.light} material={materials.beacon} renderOrder={6} frustumCulled={false} />
  </>
}

// Contact: the night sky over the summit register, drawn at infinity behind the mountain.
const skyShader = {
  vertexShader: /* glsl */`
    attribute float aSeed;
    uniform float uPixelRatio;
    varying float vSeed;
    void main() { vSeed = aSeed; gl_Position = vec4(position.xy, .9999, 1.0); gl_PointSize = (1.3 + pow(fract(aSeed * 7.7), 3.0) * 3.0) * uPixelRatio; }`,
  fragmentShader: /* glsl */`
    uniform float uOpacity;
    uniform float uTime;
    varying float vSeed;
    void main() {
      float d = length(gl_PointCoord - .5);
      float twinkle = .55 + .45 * sin(uTime * (.6 + vSeed * 1.7) + vSeed * 40.0);
      gl_FragColor = vec4(vec3(.85, .92, 1.0), uOpacity * twinkle * (.35 + .65 * fract(vSeed * 3.3)) * (1.0 - smoothstep(.2, .5, d)));
    }`,
}
function Sky() {
  const { state, enabled } = useSceneMotion()
  const { gl, size } = useThree()
  const compact = size.width < 800
  const stars = useRef<THREE.Points>(null)
  const rate = useRate(enabled)
  const uniforms = useMemo(() => ({ uOpacity: new AnimatedUniform(0), uTime: new AnimatedUniform(0), uPixelRatio: new AnimatedUniform(1) }), [])
  const geometry = useMemo(() => {
    const positions: number[] = [], seeds: number[] = []
    for (let i = 0; i < 460; i++) { positions.push(seeded(i + 11) * 2 - 1, 1 - Math.pow(seeded(i + 57), 1.4) * 1.35, 0); seeds.push(seeded(i + 131)) }
    const sky = new THREE.BufferGeometry()
    sky.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    sky.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
    return sky
  }, [])
  const material = useMemo(() => new THREE.ShaderMaterial({ ...skyShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), [uniforms])
  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])
  useFrame(({ clock }, delta) => {
    uniforms.uOpacity.set(rate(uniforms.uOpacity.value, blendPose(state.current).night * (compact ? .7 : 1), 2, delta))
    uniforms.uTime.set(enabled ? clock.elapsedTime : 0)
    uniforms.uPixelRatio.set(gl.getPixelRatio())
    if (stars.current) stars.current.visible = uniforms.uOpacity.value > .005
  })
  return <points ref={stars} geometry={geometry} material={material} renderOrder={1} frustumCulled={false} />
}

// Cool daylight by default, a low warm sun on the summit, moonlight for the register.
function Lights() {
  const { state, enabled } = useSceneMotion()
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  const tone = useRef({ warm: 0, night: 0 })
  const rate = useRate(enabled)
  const palette = useMemo(() => ({
    key: new THREE.Color('#e3f3ff'), keyWarm: new THREE.Color('#ffc09a'), keyNight: new THREE.Color('#a4bcec'),
    rim: new THREE.Color('#5290b8'), rimWarm: new THREE.Color('#4f79b4'), rimNight: new THREE.Color('#5a8ed0'),
    ambient: new THREE.Color('#a5c5dc'), ambientWarm: new THREE.Color('#8d94c4'), ambientNight: new THREE.Color('#5d76a0'),
  }), [])
  useFrame((_, delta) => {
    const current = blendPose(state.current), light = tone.current
    light.warm = rate(light.warm, current.warm, 2.5, delta)
    light.night = rate(light.night, current.night, 2.5, delta)
    if (!key.current || !rim.current || !ambient.current) return
    key.current.color.copy(palette.key).lerp(palette.keyWarm, light.warm).lerp(palette.keyNight, light.night)
    key.current.intensity = 3.2 * (1 + .25 * light.warm) * (1 - .45 * light.night)
    key.current.position.set(lerp(-5, -6.5, light.warm), lerp(9, 6, light.warm), lerp(3, 4.5, light.warm))
    rim.current.color.copy(palette.rim).lerp(palette.rimWarm, light.warm).lerp(palette.rimNight, light.night)
    rim.current.intensity = 2.5 * (1 + .35 * light.night)
    ambient.current.color.copy(palette.ambient).lerp(palette.ambientWarm, light.warm).lerp(palette.ambientNight, light.night)
    ambient.current.intensity = .65 * (1 - .2 * light.warm) * (1 - .35 * light.night)
  })
  return <>
    <ambientLight ref={ambient} intensity={.65} color="#a5c5dc" />
    <directionalLight ref={key} position={[-5, 9, 3]} intensity={3.2} color="#e3f3ff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-5} shadow-camera-near={.5} shadow-camera-far={25} shadow-normalBias={.04} shadow-bias={-.0002} />
    <directionalLight ref={rim} position={[5, 3, -4]} intensity={2.5} color="#5290b8" />
    <directionalLight position={[0, -3, 5]} intensity={.2} color="#7695af" />
  </>
}

function Atmosphere() {
  const points = useRef<THREE.Points>(null)
  const { enabled } = useSceneMotion()
  const positions = useMemo(() => {
    const array = new Float32Array(240 * 3)
    for (let i = 0; i < 240; i++) {
      array[i * 3] = Math.sin(i * 12.9898) * 13
      array[i * 3 + 1] = Math.sin(i * 78.233) * 6
      array[i * 3 + 2] = Math.cos(i * 35.719) * 6 - 2
    }
    return array
  }, [])
  useFrame(({ clock }) => {
    if (points.current && enabled) { points.current.rotation.y = clock.elapsedTime * .006; points.current.position.y = Math.sin(clock.elapsedTime * .07) * .16 }
  })
  return <points ref={points}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial size={.013} color="#c1e4f8" transparent opacity={.2} sizeAttenuation depthWrite={false} />
  </points>
}

// Keep fine detail on capable displays; reduce fill cost if sustained frame time is high.
function AdaptiveFidelity() {
  const { setDpr, viewport } = useThree()
  const samples = useRef({ elapsed: 0, frames: 0, warmup: 120, cooldown: 0 })
  useFrame((_, delta) => {
    const sample = samples.current
    if (sample.warmup-- > 0 || delta > .2) return
    sample.cooldown += delta; sample.elapsed += delta; sample.frames++
    if (sample.frames < 90) return
    if (sample.elapsed / sample.frames > 1 / 42 && sample.cooldown > 4 && viewport.dpr > 1) {
      setDpr(Math.max(1, viewport.dpr - .5)); sample.cooldown = 0
    }
    sample.elapsed = 0; sample.frames = 0
  })
  return null
}

export default function AlpineStage({ pageVisible }: { pageVisible: boolean }) {
  const { enabled } = useSceneMotion()
  return <Canvas orthographic shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 6.3, 10], zoom: 88, near: .1, far: 60 }} dpr={[1, 2]} frameloop={!pageVisible ? 'never' : enabled ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} onCreated={({ camera, gl }) => { camera.lookAt(0, .4, 0); gl.setClearColor(0x060d14, 0) }}>
    <Lights />
    <Sky />
    <Terrain />
    <Atmosphere />
    <HeroDepth />
    <AdaptiveFidelity />
  </Canvas>
}
