import { createContext, useContext } from 'react'
import type { RefObject } from 'react'

export type SceneState = {
  pointer: { x: number; y: number }
  // Mouse in NDC, and whether it rests on open page background where the mountain can be picked.
  mouse: { x: number; y: number; free: boolean; moved: boolean }
  scroll: number
  progress: number
  chapter: number
  chapterProgress: number
  heroProgress: number
  trail: number
  altitude: number
  stackFocus: number
  hover: { layer: number; target: string }
  width: number
  height: number
}
type MotionContextValue = { state: RefObject<SceneState>; enabled: boolean; paused: boolean; toggle: () => void }
export const SceneMotionContext = createContext<MotionContextValue | null>(null)
export function useSceneMotion() {
  const context = useContext(SceneMotionContext)
  if (!context) throw new Error('Scene motion must be used inside its provider')
  return context
}
