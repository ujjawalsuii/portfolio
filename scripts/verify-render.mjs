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
for (const id of ['home', 'projects', 'about', 'experience', 'skills', 'gallery', 'contact']) {
  assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `Missing or duplicated section: ${id}`)
}
assert.equal((html.match(/class="project-row/g) || []).length, 7)
assert.equal((html.match(/class="timeline-entry/g) || []).length, 11)
assert.equal((html.match(/class="skill-category"/g) || []).length, 6)
assert.equal((html.match(/class="gallery-cover"/g) || []).length, 3)
for (const text of [
  "I am a fourth-year Computing Science student at the University of Alberta",
  "Most of what I know came from shipping things rather than from lectures. This past summer I built a production storefront and an internal admin tool as the sole developer for a retail client in Abu Dhabi, from requirements through to release. The part I care about is that the owner runs it themselves now, publishing and editing content with no developer involved. I enforced admin-only writes at the database layer with Postgres Row Level Security rather than trusting the application to behave, and wrote an automated probe that runs on every deploy confirming an anonymous client cannot write, read privileged tables, self-register, or upload.",
  "I work across the stack. On the frontend that means React, Next.js, and TypeScript. On the backend, Django REST Framework, FastAPI, and Postgres. I have also spent time further down: a 3D ray tracing engine in C99 with manual memory management and no external math libraries, and a binary translator that compiles RISC-V machine code into executable WebAssembly.",
  "My other interest is applied machine learning. At the TELUS hackathon my team placed top six with a pediatric health platform that grounded model responses in medical protocol documents through a Python retrieval pipeline, serving separate child and parent interfaces from a single API.",
  "Outside of code, I spent a term as VP Media for the Indian Students Association, where I brought generative AI tooling into a manual content pipeline and used engagement data to reschedule posting, contributing to a sold-out cultural event.",
  "I’m open to internship opportunities and collaborations in software development and engineering. Feel free to reach out to discuss potential projects or ideas!",
  "Top skills",
  "Python (Programming Language)",
  "Whether you have a project in mind, want to collaborate, or just want to connect, I'm always open to discussing new opportunities.",
  "Discipline is the bridge between goals and accomplishment."
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
assert(!html.includes('id="signature"'), 'Removed plume section must not be rendered')
assert(html.includes('alpine-panorama.webp'), 'Alpine hero photo must be present')
assert(html.includes('alpine-original.webp'), 'High-resolution mobile hero must be present')
assert(!/top 5/i.test(plain), 'TELUS placement must match the supplied LinkedIn update')
fs.writeFileSync('.checks.local/rendered.html', html)
console.log('Server render passed: all sections, biography text, records, gallery covers, links and navigation targets are present.')
