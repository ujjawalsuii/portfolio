import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneMotion } from './motion'
import { AnimatedUniform, Slot } from './mountainMaterial'

// The hero photograph with its estimated depth: parallax from pointer and scroll, then a scan that turns the far ridges into contours.
const shader = {
  vertexShader: /* glsl */`void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D uPhoto;
    uniform sampler2D uDepth;
    uniform vec2 uViewport;
    uniform float uPixelRatio;
    uniform vec4 uRect;
    uniform vec4 uBox;
    uniform vec2 uImage;
    uniform vec2 uPosition;
    uniform vec2 uTranslate;
    uniform float uScale;
    uniform vec2 uPointer;
    uniform float uHero;
    uniform float uSaturate;
    uniform float uBrightness;
    uniform float uScan;
    uniform float uPulse;
    vec2 photoUv(vec2 screen) {
      vec2 origin = uRect.xy + uBox.xy + uBox.zw * vec2(.69, .65);
      vec2 local = origin + (screen - origin - uTranslate) / uScale - uRect.xy - uBox.xy;
      vec2 shown = uImage * max(uBox.z / uImage.x, uBox.w / uImage.y);
      vec2 uv = (local - (uBox.zw - shown) * uPosition) / shown;
      return vec2(uv.x, 1.0 - uv.y);
    }
    // Near surfaces move against the pointer and ahead of the scroll; the sky barely moves.
    vec2 shift(float depth) { return -uPointer * (depth - .35) * vec2(11.0, 7.0) + vec2(0.0, -uHero * (depth - .5) * 34.0); }
    void main() {
      vec2 screen = vec2(gl_FragCoord.x / uPixelRatio, uViewport.y - gl_FragCoord.y / uPixelRatio);
      if (screen.y < uRect.y || screen.y > uRect.y + uRect.w) discard;
      float depth = texture2D(uDepth, photoUv(screen)).r;
      depth = texture2D(uDepth, photoUv(screen - shift(depth))).r;
      vec2 uv = photoUv(screen - shift(depth));
      depth = texture2D(uDepth, uv).r;
      vec3 color = texture2D(uPhoto, uv).rgb;
      float s = uSaturate;
      color = mat3(.213 + .787 * s, .213 - .213 * s, .213 - .213 * s,
                   .715 - .715 * s, .715 + .285 * s, .715 - .715 * s,
                   .072 - .072 * s, .072 - .072 * s, .072 + .928 * s) * color * uBrightness;
      // Contours of depth across the ridges only: never the sky, and never within a margin of the person or the rock he stands on.
      vec2 reach = 26.0 / (uImage * max(uBox.z / uImage.x, uBox.w / uImage.y));
      float near = depth;
      for (int i = 0; i < 8; i++) {
        float angle = float(i) * .785398;
        near = max(near, texture2D(uDepth, uv + vec2(cos(angle), sin(angle)) * reach).r);
        near = max(near, texture2D(uDepth, uv + vec2(cos(angle), sin(angle)) * reach * .5).r);
      }
      float tone = smoothstep(.035, .07, depth) * (1.0 - smoothstep(.56, .64, depth));
      float land = tone * (1.0 - smoothstep(.5, .6, near));
      float band = depth * 30.0;
      float line = 1.0 - smoothstep(0.0, fwidth(band) * 1.4, min(fract(band), 1.0 - fract(band)));
      float ridge = smoothstep(.003, .02, fwidth(depth));
      float reached = 1.0 - smoothstep(uScan - .015, uScan, depth);
      float scanned = land * reached;
      float front = land * exp(-pow((depth - uScan) * 80.0, 2.0));
      float fade = 1.0 - smoothstep(.5, .62, uPulse);
      float pulse = land * smoothstep(uPulse - .14, uPulse, depth) * (1.0 - smoothstep(uPulse, uPulse + .006, depth)) * fade;
      float crest = land * exp(-pow((depth - uPulse) * 55.0, 2.0)) * fade;
      color = mix(color, color * .7 + vec3(.015, .04, .07), tone * reached * .5);
      color += vec3(.5, .8, 1.0) * (line * .34 + ridge * .5) * max(scanned, pulse);
      color += vec3(.72, .9, 1.0) * (front * .55 + crest * .5);
      gl_FragColor = vec4(color, 1.0);
    }`,
}
type Source = { photo: string; depth: string; saturate: number; brightness: number; mobile: boolean }
const sourceFor = (mobile: boolean): Source => {
  const base = import.meta.env.BASE_URL
  return mobile
    ? { photo: `${base}alpine-original.webp`, depth: `${base}alpine-original-depth.webp`, saturate: .85, brightness: .83, mobile }
    : { photo: `${base}alpine-panorama.webp`, depth: `${base}alpine-panorama-depth.webp`, saturate: .8, brightness: 1, mobile }
}

export function HeroDepth() {
  const { state, enabled } = useSceneMotion()
  const { gl, size } = useThree()
  const mesh = useRef<THREE.Mesh>(null)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const [textures, setTextures] = useState<{ photo: THREE.Texture; depth: THREE.Texture; source: Source } | null>(null)
  const layout = useRef({ heroTop: 0, heroHeight: 0, box: [0, 0, 0, 0], position: [.6, .68], shown: false, revealAt: 0 })
  const uniforms = useMemo(() => ({
    uPhoto: new Slot<THREE.Texture | null>(null), uDepth: new Slot<THREE.Texture | null>(null),
    uViewport: { value: new THREE.Vector2() }, uRect: { value: new THREE.Vector4() }, uBox: { value: new THREE.Vector4() },
    uImage: { value: new THREE.Vector2(1, 1) }, uPosition: { value: new THREE.Vector2(.6, .68) }, uTranslate: { value: new THREE.Vector2() },
    uPointer: { value: new THREE.Vector2() }, uPixelRatio: new AnimatedUniform(1), uScale: new AnimatedUniform(1), uHero: new AnimatedUniform(0),
    uSaturate: new AnimatedUniform(1), uBrightness: new AnimatedUniform(1), uScan: new AnimatedUniform(-1), uPulse: new AnimatedUniform(1),
  }), [])
  const material = useMemo(() => new THREE.ShaderMaterial({ ...shader, uniforms, depthTest: false, depthWrite: false }), [uniforms])
  const quad = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
  useEffect(() => () => { material.dispose(); quad.dispose() }, [material, quad])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')
    const change = () => setMobile(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (!enabled) return
    let alive = true
    const source = sourceFor(mobile)
    const loader = new THREE.TextureLoader()
    Promise.all([loader.loadAsync(source.photo), loader.loadAsync(source.depth)]).then(([photo, depth]) => {
      if (!alive) { photo.dispose(); depth.dispose(); return }
      photo.colorSpace = THREE.NoColorSpace
      photo.anisotropy = 4
      setTextures({ photo, depth, source })
    }).catch(() => undefined)
    return () => { alive = false }
  }, [enabled, mobile])
  useEffect(() => () => { textures?.photo.dispose(); textures?.depth.dispose() }, [textures])

  // Measure the same boxes the <img> is laid out in, so the swap from it is seamless.
  useEffect(() => {
    const measure = () => {
      const scene = document.querySelector<HTMLElement>('.hero-scene')
      const photo = document.querySelector<HTMLElement>('.alpine-photo')
      const image = photo?.querySelector('img')
      if (!scene || !photo || !image) return
      const [x, y] = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100)
      Object.assign(layout.current, {
        heroTop: scene.getBoundingClientRect().top + window.scrollY, heroHeight: scene.offsetHeight,
        box: [photo.offsetLeft, photo.offsetTop, photo.offsetWidth, photo.offsetHeight], position: [x, y],
      })
    }
    measure()
    const resize = new ResizeObserver(measure)
    const scene = document.querySelector('.hero-scene')
    if (scene) resize.observe(scene)
    document.fonts.ready.then(measure)
    return () => resize.disconnect()
  }, [mobile])
  useEffect(() => {
    const root = document.documentElement
    return () => { delete root.dataset.heroDepth }
  }, [])

  useFrame(({ clock }) => {
    const quadMesh = mesh.current
    const root = document.documentElement
    const active = enabled && !!textures && textures.source.mobile === mobile
    if (!quadMesh) return
    const { scroll, heroProgress, pointer } = state.current
    const { heroTop, heroHeight, box, position } = layout.current
    const top = heroTop - scroll
    quadMesh.visible = active && top + heroHeight > 0
    if (!active) { if (layout.current.shown) { delete root.dataset.heroDepth; layout.current.shown = false } return }
    uniforms.uPhoto.set(textures.photo)
    uniforms.uDepth.set(textures.depth)
    const image = textures.photo.image as HTMLImageElement
    uniforms.uImage.value.set(image.naturalWidth, image.naturalHeight)
    uniforms.uViewport.value.set(size.width, size.height)
    uniforms.uPixelRatio.set(gl.getPixelRatio())
    uniforms.uRect.value.set(0, top, size.width, heroHeight)
    uniforms.uBox.value.set(box[0], box[1], box[2], box[3])
    uniforms.uPosition.value.set(position[0], position[1])
    // Mirrors the .alpine-photo transform in alpine.css at each breakpoint.
    uniforms.uTranslate.value.set(mobile ? 0 : -7 * pointer.x, mobile ? 60 * heroProgress : -5 * pointer.y + 130 * heroProgress)
    uniforms.uScale.set(mobile ? 1.025 + heroProgress * .05 : 1.035 + heroProgress * .08)
    uniforms.uPointer.value.set(mobile ? 0 : pointer.x, mobile ? 0 : pointer.y)
    uniforms.uHero.set(heroProgress)
    uniforms.uSaturate.set(textures.source.saturate)
    uniforms.uBrightness.set(textures.source.brightness)
    uniforms.uScan.set(heroProgress < .06 ? -1 : THREE.MathUtils.lerp(.05, .62, THREE.MathUtils.smoothstep(heroProgress, .06, .62)))
    if (!layout.current.shown) { layout.current.shown = true; layout.current.revealAt = clock.elapsedTime; root.dataset.heroDepth = 'on' }
    // One sweep from the far peaks toward the viewer shortly after the photograph comes alive.
    uniforms.uPulse.set(THREE.MathUtils.lerp(.02, .64, THREE.MathUtils.clamp((clock.elapsedTime - layout.current.revealAt - .9) / 2.2, 0, 1)))
  })

  return <mesh ref={mesh} geometry={quad} material={material} renderOrder={10} frustumCulled={false} visible={false} />
}
