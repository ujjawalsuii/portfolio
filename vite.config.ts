import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'web-media-delivery',
    apply: 'build',
    closeBundle() {
      // Ship the browser-compatible copies; keep every original untouched in public/.
      const variants = JSON.parse(readFileSync(resolve('src/data/media.json'), 'utf8')) as Record<string, { type: string; large: string }>
      const output = resolve('dist')
      for (const [source, variant] of Object.entries(variants)) {
        if (variant.type !== 'video') continue
        const copy = resolve(output, variant.large)
        if (!existsSync(copy)) throw new Error(`Missing web video: ${variant.large}`)
        const original = resolve(output, source)
        const within = relative(output, original)
        if (within.startsWith('..') || isAbsolute(within)) throw new Error('Media path leaves build output')
        if (existsSync(original)) unlinkSync(original)
      }
    },
  }],
  base: './',
})
