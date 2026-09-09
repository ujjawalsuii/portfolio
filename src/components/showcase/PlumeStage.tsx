import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Plume } from './Plume'

type StageProps = {
    progress: React.RefObject<number>
    pointer: React.RefObject<{ x: number; y: number }> | null
    barbCount: number
    /** 'never' parks the loop entirely when the section is off-screen. */
    frameloop: 'always' | 'demand' | 'never'
    dprMax: number
    antialias: boolean
}

/**
 * Lazy-loaded so three.js never lands in the initial bundle. The lighting is a
 * studio rig built from lightformers rather than an HDR, so the scene pulls
 * zero bytes over the network.
 */
const PlumeStage = ({ progress, pointer, barbCount, frameloop, dprMax, antialias }: StageProps) => (
    <Canvas
        frameloop={frameloop}
        dpr={[1, dprMax]}
        gl={{ antialias, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.05, 7.4], fov: 30 }}
        style={{ pointerEvents: 'none' }}
    >
        <ambientLight intensity={0.4} />
        <directionalLight position={[-4, 5, 4]} intensity={0.8} color="#fff4de" />
        <directionalLight position={[3, -2, 5]} intensity={0.35} color="#8fd8de" />

        <Environment resolution={192} frames={1}>
            {/* Broad key, upper left — the soft product-shot wash. */}
            <Lightformer form="rect" intensity={2.9} position={[-4, 3.5, 3]} scale={[7, 7, 1]} color="#fff6e8" />
            {/* Thin gold strip right: the long specular streak down the barbs. */}
            <Lightformer form="rect" intensity={3.4} position={[3.6, 0.4, 2.2]} scale={[0.32, 8, 1]} color="#c9a962" />
            {/* Thin teal strip left: pushes the peacock end of the iridescence. */}
            <Lightformer form="rect" intensity={3.6} position={[-3.6, -0.6, 2]} scale={[0.4, 8, 1]} color="#3fb3bc" />
            {/* Cool rim behind to separate the plume from the ground. */}
            <Lightformer form="ring" intensity={1.8} position={[0.5, 0.6, -4.5]} scale={5.5} color="#7d9b6b" />
            {/* Broad frontal fill: without it the lower two thirds of the plume
                fall to black, because there is nothing in front to reflect. */}
            <Lightformer form="rect" intensity={1.15} position={[0, -1.2, 6]} scale={[10, 9, 1]} color="#dff0f2" />
        </Environment>

        <Plume progress={progress} pointer={pointer} barbCount={barbCount} />
    </Canvas>
)

export default PlumeStage
