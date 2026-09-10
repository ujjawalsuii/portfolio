import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildTerrain } from './terrain'
import { useSceneMotion } from './motion'

// One continuous scene takes a different composition in each content chapter.
const poses = [
  { x: .26, y: -.8, s: .75, r: -.55, solid: .0, contour: .0, wire: .0 },
  { x: .3, y: -.3, s: .91, r: -.4, solid: .94, contour: .12, wire: .015 },
  { x: -.26, y: -.45, s: .72, r: .4, solid: .24, contour: .08, wire: .025 },
  { x: -.34, y: -.7, s: .62, r: 1.25, solid: .62, contour: .36, wire: .04 },
  { x: .20, y: -.3, s: 1.08, r: 2.05, solid: .24, contour: .35, wire: .12 },
  { x: -.24, y: -.5, s: .85, r: 2.55, solid: .22, contour: .12, wire: .015 },
  { x: .23, y: -.5, s: 1.28, r: 3.15, solid: .83, contour: .13, wire: .02 },
]

function Terrain() {
  const { state, enabled } = useSceneMotion()
  const group = useRef<THREE.Group>(null)
  const surface = useRef<THREE.MeshStandardMaterial>(null)
  const sidesMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const contourMaterial = useRef<THREE.LineBasicMaterial>(null)
  const wireMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const { viewport, size, invalidate } = useThree()
  const compact = size.width < 800
  const terrain = useMemo(() => buildTerrain(compact ? 96 : 140), [compact])

  useEffect(() => {
    if (enabled) return
    const redraw = () => invalidate()
    window.addEventListener('scroll', redraw, { passive: true })
    return () => window.removeEventListener('scroll', redraw)
  }, [enabled, invalidate])

  useEffect(() => () => {
    terrain.geometry.dispose(); terrain.sides.dispose(); terrain.contours.dispose()
  }, [terrain])

  useFrame(({ clock }, rawDelta) => {
    if (!group.current || !surface.current || !sidesMaterial.current || !contourMaterial.current || !wireMaterial.current) return
    const delta = Math.min(rawDelta, .05)
    const { chapter, chapterProgress, pointer, heroProgress } = state.current
    const current = poses[chapter] ?? poses[0]
    const next = poses[Math.min(chapter + 1, poses.length - 1)]
    const transition = THREE.MathUtils.smoothstep(chapterProgress, .72, 1)
    const pose = (key: keyof typeof current) => THREE.MathUtils.lerp(current[key], next[key], transition)
    const homeReveal = chapter === 0 ? THREE.MathUtils.smoothstep(heroProgress, .48, 1) : 1
    const mobileOpacity = compact ? .32 : 1
    const damp = (from: number, to: number) => enabled ? THREE.MathUtils.damp(from, to, 3.2, delta) : to
    const drift = enabled ? Math.sin(clock.elapsedTime * .25) * .075 : 0
    group.current.position.x = damp(group.current.position.x, viewport.width * (compact ? .13 : pose('x')) + (enabled ? pointer.x * .11 : 0))
    group.current.position.y = damp(group.current.position.y, pose('y') + drift)
    group.current.rotation.y = damp(group.current.rotation.y, pose('r') + chapterProgress * .23 + (enabled ? pointer.x * .09 : 0))
    group.current.rotation.x = damp(group.current.rotation.x, (enabled ? pointer.y * .015 : 0) - .03)
    const targetScale = pose('s') * (compact ? .62 : Math.min(1.15, viewport.width / 14))
    group.current.scale.setScalar(damp(group.current.scale.x, targetScale))
    surface.current.opacity = damp(surface.current.opacity, (chapter === 0 ? homeReveal * .88 : pose('solid')) * mobileOpacity)
    sidesMaterial.current.opacity = surface.current.opacity * .72
    contourMaterial.current.opacity = damp(contourMaterial.current.opacity, pose('contour') * mobileOpacity)
    wireMaterial.current.opacity = damp(wireMaterial.current.opacity, pose('wire') * mobileOpacity)
    group.current.visible = surface.current.opacity > .005 || contourMaterial.current.opacity > .005
  })

  return <group ref={group} position={[5, -.8, 0]} rotation={[0, -.55, 0]}>
    <mesh geometry={terrain.geometry}><meshStandardMaterial ref={surface} vertexColors roughness={.86} metalness={.08} transparent opacity={0} depthWrite /></mesh>
    <mesh geometry={terrain.sides}><meshStandardMaterial ref={sidesMaterial} color="#253a48" roughness={.93} transparent opacity={0} side={THREE.DoubleSide} /></mesh>
    <lineSegments geometry={terrain.contours}><lineBasicMaterial ref={contourMaterial} color="#a1dafa" transparent opacity={0} depthWrite={false} /></lineSegments>
    <mesh geometry={terrain.geometry} scale={1.001}><meshBasicMaterial ref={wireMaterial} wireframe color="#7dbadc" transparent opacity={0} depthWrite={false} /></mesh>
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

export default function AlpineStage({ pageVisible }: { pageVisible: boolean }) {
  const { enabled } = useSceneMotion()
  return <Canvas orthographic camera={{ position: [0, 6.3, 10], zoom: 88, near: .1, far: 60 }} dpr={[1, 1.5]} frameloop={!pageVisible ? 'never' : enabled ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} onCreated={({ camera, gl }) => { camera.lookAt(0, .4, 0); gl.setClearColor(0x060d14, 0) }}>
    <ambientLight intensity={.65} color="#a5c5dc" />
    <directionalLight position={[-5, 9, 3]} intensity={3.2} color="#e3f3ff" />
    <directionalLight position={[5, 3, -4]} intensity={2.5} color="#5290b8" />
    <directionalLight position={[0, -3, 5]} intensity={.2} color="#7695af" />
    <Terrain />
    <Atmosphere />
  </Canvas>
}
