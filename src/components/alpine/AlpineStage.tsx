import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildTerrain } from './terrain'
import { useSceneMotion } from './motion'
import { createMountainMaterials, createMountainUniforms } from './mountainMaterial'

// Preserve the approved compositions; details and formation evolve within them.
const poses = [
  { x: .26, y: -.8, s: .75, r: -.55, solid: .0, contour: .0, wire: .0 },
  { x: .3, y: -.3, s: .91, r: -.4, solid: .94, contour: .12, wire: .008 },
  { x: -.26, y: -.45, s: .72, r: .4, solid: .24, contour: .08, wire: .015 },
  { x: -.34, y: -.7, s: .62, r: 1.25, solid: .62, contour: .36, wire: .025 },
  { x: .20, y: -.3, s: 1.08, r: 2.05, solid: .32, contour: .42, wire: .06 },
  { x: -.24, y: -.5, s: .85, r: 2.55, solid: .22, contour: .12, wire: .01 },
  { x: .23, y: -.5, s: 1.28, r: 3.15, solid: .83, contour: .13, wire: .015 },
]

function Terrain() {
  const { state, enabled } = useSceneMotion()
  const group = useRef<THREE.Group>(null)
  const { viewport, size, invalidate } = useThree()
  const compact = size.width < 800
  const terrain = useMemo(() => buildTerrain(compact ? 112 : 208), [compact])
  const uniforms = useMemo(() => createMountainUniforms(), [])
  const materials = useMemo(() => createMountainMaterials(uniforms), [uniforms])

  useEffect(() => {
    if (enabled) return
    const redraw = () => invalidate()
    window.addEventListener('scroll', redraw, { passive: true })
    return () => window.removeEventListener('scroll', redraw)
  }, [enabled, invalidate])
  useEffect(() => () => { Object.values(terrain).forEach(geometry => geometry.dispose()) }, [terrain])
  useEffect(() => () => { Object.values(materials).forEach(material => material.dispose()) }, [materials])

  useFrame(({ clock }, rawDelta) => {
    if (!group.current) return
    const delta = Math.min(rawDelta, .05)
    const { chapter, chapterProgress: progress, pointer, heroProgress } = state.current
    const current = poses[chapter] ?? poses[0]
    const next = poses[Math.min(chapter + 1, poses.length - 1)]
    const transition = THREE.MathUtils.smoothstep(progress, .72, 1)
    const pose = (key: keyof typeof current) => THREE.MathUtils.lerp(current[key], next[key], transition)
    const homeReveal = chapter === 0 ? THREE.MathUtils.smoothstep(heroProgress, .48, 1) : 1
    const mobileOpacity = compact ? .32 : 1
    const damp = (from: number, to: number) => enabled ? THREE.MathUtils.damp(from, to, 3.2, delta) : to
    const drift = enabled ? Math.sin(clock.elapsedTime * .25) * .075 : 0
    group.current.position.x = damp(group.current.position.x, viewport.width * (compact ? .13 : pose('x')) + (enabled ? pointer.x * .11 : 0))
    group.current.position.y = damp(group.current.position.y, pose('y') + drift - uniforms.uSeparation.value * 1.7)
    group.current.rotation.y = damp(group.current.rotation.y, pose('r') + progress * .23 + (enabled ? pointer.x * .09 : 0))
    group.current.rotation.x = damp(group.current.rotation.x, (enabled ? pointer.y * .015 : 0) - .03)
    const targetScale = pose('s') * (compact ? .62 : Math.min(1.15, viewport.width / 14))
    group.current.scale.setScalar(damp(group.current.scale.x, targetScale))
    materials.surface.setValues({ opacity: damp(materials.surface.opacity, (chapter === 0 ? homeReveal * .88 : pose('solid')) * mobileOpacity) })
    materials.sides.setValues({ opacity: materials.surface.opacity * .72 })
    materials.contours.setValues({ opacity: damp(materials.contours.opacity, pose('contour') * mobileOpacity) })
    materials.wire.setValues({ opacity: damp(materials.wire.opacity, pose('wire') * mobileOpacity) })
    group.current.visible = materials.surface.opacity > .005 || materials.contours.opacity > .005

    if (enabled) {
      const opening = (chapter === 1 || chapter === 4)
        ? THREE.MathUtils.smoothstep(progress, .12, .40) * (1 - THREE.MathUtils.smoothstep(progress, .70, .96))
        : 0
      uniforms.uSeparation.set(THREE.MathUtils.damp(uniforms.uSeparation.value, opening * (compact ? .13 : .24), 4, delta))
      uniforms.uScan.set(THREE.MathUtils.damp(uniforms.uScan.value, -.3 + progress * 3.8, 5, delta))
      uniforms.uScanStrength.set(THREE.MathUtils.damp(uniforms.uScanStrength.value, chapter === 1 || chapter === 4 ? .32 + opening * .5 : .08, 4, delta))
    }
  })

  return <group ref={group} position={[5, -.8, 0]} rotation={[0, -.55, 0]}>
    <mesh geometry={terrain.geometry} material={materials.surface} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <mesh geometry={terrain.caps} material={materials.surface} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <mesh geometry={terrain.sides} material={materials.sides} customDepthMaterial={materials.depth} castShadow receiveShadow />
    <lineSegments geometry={terrain.contours} material={materials.contours} />
    <mesh geometry={terrain.geometry} material={materials.wire} scale={1.001} />
  </group>
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
    <ambientLight intensity={.65} color="#a5c5dc" />
    <directionalLight position={[-5, 9, 3]} intensity={3.2} color="#e3f3ff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-5} shadow-camera-near={.5} shadow-camera-far={25} shadow-normalBias={.04} shadow-bias={-.0002} />
    <directionalLight position={[5, 3, -4]} intensity={2.5} color="#5290b8" />
    <directionalLight position={[0, -3, 5]} intensity={.2} color="#7695af" />
    <Terrain />
    <Atmosphere />
    <AdaptiveFidelity />
  </Canvas>
}
