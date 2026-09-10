import { createContext, useContext } from 'react'
import type { RefObject } from 'react'

export type SceneState = {
  pointer: { x: number; y: number }
  scroll: number
  progress: number
  chapter: number
  chapterProgress: number
  heroProgress: number
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
