import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildBarbs, rachisPoint, OCELLUS_RINGS, OCELLUS_T } from './plumeGeometry'

type PlumeProps = {
    /** 0 = furled, 1 = fully bloomed. Mutated by GSAP, never by React. */
    progress: React.RefObject<number>
    /** Damped pointer position in -1..1, or null when parallax is off. */
    pointer: React.RefObject<{ x: number; y: number }> | null
    barbCount: number
}

const dummy = new THREE.Object3D()
const scratch = new THREE.Vector3()

export const Plume = ({ progress, pointer, barbCount }: PlumeProps) => {
    const barbsRef = useRef<THREE.InstancedMesh>(null)
    const groupRef = useRef<THREE.Group>(null)
    const eyeRef = useRef<THREE.Group>(null)
    const rachisRef = useRef<THREE.Mesh>(null)

    const barbs = useMemo(() => buildBarbs(barbCount), [barbCount])
    const eyeAnchor = useMemo(() => rachisPoint(OCELLUS_T, new THREE.Vector3()), [])

    // Swept along the same curve the barbs are planted on, stopping just short
    // of the ocellus so the eye reads as the tip rather than a bead on a wire.
    const rachisGeometry = useMemo(() => {
        const pts: THREE.Vector3[] = []
        for (let i = 0; i <= 40; i++) pts.push(rachisPoint((i / 40) * 0.9, new THREE.Vector3()))
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.015, 6, false)
    }, [])

    // A three-sided tapered prism reads as a barb and facets the light hard,
    // which is what sells "machined" over "organic blob".
    const barbGeometry = useMemo(() => {
        const g = new THREE.CylinderGeometry(0.004, 0.019, 1, 3, 1)
        g.computeVertexNormals()
        return g
    }, [])

    useLayoutEffect(() => {
        const mesh = barbsRef.current
        if (!mesh) return
        barbs.forEach((b, i) => mesh.setColorAt(i, b.color))
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }, [barbs])

    useLayoutEffect(() => () => {
        barbGeometry.dispose()
        rachisGeometry.dispose()
    }, [barbGeometry, rachisGeometry])

    useFrame((_, rawDelta) => {
        const mesh = barbsRef.current
        if (!mesh) return
        const delta = Math.min(rawDelta, 1 / 30)
        const p = progress.current ?? 0

        for (let i = 0; i < barbs.length; i++) {
            const b = barbs[i]
            // Stagger the bloom from quill to eye so it unfurls rather than pops.
            const staggered = THREE.MathUtils.clamp((p - b.t * 0.3) / 0.7, 0, 1)
            const grow = 1 - Math.pow(1 - staggered, 3)
            const len = b.length * grow
            if (len < 1e-4) {
                dummy.scale.setScalar(0)
                dummy.updateMatrix()
                mesh.setMatrixAt(i, dummy.matrix)
                continue
            }

            rachisPoint(b.t, scratch)
            dummy.position.copy(scratch)
            dummy.rotation.set(0, 0, 0)
            dummy.scale.set(1, len, 1)
            // Furled barbs cling to the rachis and are over-rolled; both relax as they grow.
            dummy.rotateX(b.bow * grow)
            dummy.rotateZ(-b.side * THREE.MathUtils.lerp(b.alpha * 0.28, b.alpha, grow))
            dummy.rotateY(THREE.MathUtils.lerp(b.roll + 1.35, b.roll, grow))
            dummy.translateY(len * 0.5)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
        }
        mesh.instanceMatrix.needsUpdate = true

        if (rachisRef.current) {
            const total = rachisRef.current.geometry.index?.count ?? 0
            const drawn = Math.max(3, Math.floor(total * THREE.MathUtils.clamp(p * 1.25, 0, 1)))
            rachisRef.current.geometry.setDrawRange(0, drawn)
        }
        if (eyeRef.current) {
            const eyeIn = THREE.MathUtils.clamp((p - 0.55) / 0.45, 0, 1)
            const eased = 1 - Math.pow(1 - eyeIn, 4)
            eyeRef.current.scale.setScalar(eased)
            eyeRef.current.rotation.z = (1 - eased) * 0.9
        }

        if (groupRef.current) {
            const px = pointer?.current?.x ?? 0
            const py = pointer?.current?.y ?? 0
            // Bounded parallax plus a very slow idle drift. Never a free spin.
            const idle = Math.sin(performance.now() * 0.00012) * 0.05
            const targetY = px * 0.16 + idle
            const targetX = -py * 0.1
            groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta)
            groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta)
            groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, px * 0.12, 4, delta)
        }
    })

    return (
        <group ref={groupRef} rotation={[0, 0, 0.05]} scale={0.86} position={[0, -0.12, 0]}>
            <mesh ref={rachisRef} geometry={rachisGeometry}>
                <meshPhysicalMaterial
                    color="#c9a35a"
                    metalness={0.9}
                    roughness={0.3}
                    iridescence={0.6}
                    iridescenceIOR={1.6}
                    envMapIntensity={2.2}
                />
            </mesh>

            <instancedMesh
                ref={barbsRef}
                args={[barbGeometry, undefined, barbs.length]}
                frustumCulled={false}
            >
                <meshPhysicalMaterial
                    metalness={0.78}
                    roughness={0.3}
                    iridescence={1}
                    iridescenceIOR={1.95}
                    iridescenceThicknessRange={[120, 640]}
                    envMapIntensity={2.4}
                    flatShading
                />
            </instancedMesh>

            <group ref={eyeRef} position={[eyeAnchor.x, eyeAnchor.y, eyeAnchor.z + 0.3]} rotation={[0, 0.05, 0]}>
                {OCELLUS_RINGS.map((ring) => (
                    <mesh key={ring.radius}>
                        <torusGeometry args={[ring.radius, ring.tube, 10, 96]} />
                        <meshPhysicalMaterial
                            color={ring.color}
                            metalness={ring.metalness}
                            roughness={ring.roughness}
                            iridescence={0.5}
                            iridescenceIOR={1.55}
                            iridescenceThicknessRange={[200, 480]}
                            envMapIntensity={2.3}
                        />
                    </mesh>
                ))}
                <mesh position={[0, 0, 0.01]}>
                    <circleGeometry args={[0.145, 64]} />
                    <meshPhysicalMaterial
                        color="#0b1a2c"
                        metalness={1}
                        roughness={0.06}
                        iridescence={1}
                        iridescenceIOR={2.1}
                        envMapIntensity={2.6}
                    />
                </mesh>
            </group>
        </group>
    )
}
