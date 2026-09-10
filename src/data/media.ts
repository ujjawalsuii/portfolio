import manifest from './media.json'

type Variant = { small: string; large: string; type: string; poster?: string; width?: number; height?: number }
const variants: Record<string, Variant> = manifest

export const originalAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`
export const mediaAsset = (path: string, size: 'small' | 'large' = 'large') => originalAsset(variants[path]?.[size] ?? path)
export const mediaPoster = (path: string) => variants[path]?.poster ? originalAsset(variants[path].poster!) : undefined
export const mediaDimensions = (path: string) => ({ width: variants[path]?.width, height: variants[path]?.height })
export const mediaSourceSet = (path: string) => {
  const { width = 1800, height = 1800 } = variants[path] ?? {}
  const scaledWidth = (limit: number) => Math.round(width * Math.min(1, limit / width, (limit * 2) / height))
  return `${mediaAsset(path, 'small')} ${scaledWidth(720)}w, ${mediaAsset(path)} ${scaledWidth(1800)}w`
}
