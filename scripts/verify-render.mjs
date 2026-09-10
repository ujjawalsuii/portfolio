import assert from 'node:assert/strict'
import fs from 'node:fs'
import { build } from 'esbuild'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

await build({
  entryPoints: ['src/App.tsx'], bundle: true, platform: 'node', format: 'esm',
  outfile: '.checks.local/app.mjs', packages: 'external', jsx: 'automatic',
  define: { 'import.meta.env.BASE_URL': '"/"' },
})
const { default: App } = await import('../.checks.local/app.mjs')
const html = renderToStaticMarkup(createElement(App))
const plain = html.replace(/<[^>]*>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
for (const id of ['home', 'projects', 'about', 'experience', 'skills', 'signature', 'gallery', 'contact']) {
  assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `Missing or duplicated section: ${id}`)
}
assert.equal((html.match(/class="project-row/g) || []).length, 7)
assert.equal((html.match(/class="timeline-entry/g) || []).length, 11)
assert.equal((html.match(/class="skill-category"/g) || []).length, 6)
assert.equal((html.match(/class="gallery-cover"/g) || []).length, 3)
for (const text of [
  "I'm a final-year Computing Science student at the University of Alberta , on a $10,000 Regional Excellence Scholarship — but my journey isn't just about code.",
  "I've shipped production software for a paying client as sole developer, and placed top 5 at the TELUS hackathon building an AI health platform.",
  'Whether optimizing a C-based Ray Tracer or pushing for a 225lb bench press , I apply the same philosophy: absolute focus and continuous improvement.',
  'Influenced by the mentality of greats like Ronaldo and Verstappen, I believe in speed, precision, and resilience.',
  'I solve problems with the intensity of a competitor.',
  'Leverage technology to support my family and build real value.',
  'Sim Racing, photography, and the gym.',
  "Whether you have a project in mind, want to collaborate, or just want to connect, I'm always open to discussing new opportunities.",
  'Discipline is the bridge between goals and accomplishment.',
]) {
  const normalize = value => value.replace(/\s+([,.])/g, '$1').replace(/\s+/g, ' ').trim()
  assert(normalize(plain).includes(normalize(text)), `Missing biography or contact text: ${text}`)
}
for (const link of ['https://kritanshiboutique.com/', 'https://github.com/Gfewq/Team',
  'https://github.com/ujjawalsuii/popowich-WebAble', 'https://github.com/uofa-cmput404/w26-socialdistribution-project-fuchsia',
  'https://github.com/ujjawalsuii/c-ray-engine', 'https://github.com/ujjawalsuii/rv-to-wasm',
  'https://github.com/CMPUT301F25aurora/aurora-borealis', 'mailto:ujjawalpratap1234@gmail.com',
  'https://linkedin.com/in/ujjawalps2006', 'https://github.com/ujjawalsuii', '/CV.pdf']) {
  assert(html.includes(`href="${link}"`), `Missing original link: ${link}`)
}
for (const hash of [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1])) assert(html.includes(`id="${hash}"`), `Broken section link: ${hash}`)
assert(!html.includes('opacity:0'), 'Main content must not depend on an animation finishing')
fs.writeFileSync('.checks.local/rendered.html', html)
console.log('Server render passed: all sections, biography text, records, gallery covers, links and navigation targets are present.')
