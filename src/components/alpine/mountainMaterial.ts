import { MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, MeshDepthMaterial, LineBasicMaterial, DoubleSide, RGBADepthPacking, Uniform } from 'three'
import type { Material } from 'three'
import { layerCount, strata } from './heightfield'

export class Slot<T> extends Uniform<T> {
  set(value: T) { this.value = value }
}
export class AnimatedUniform extends Slot<number> {}
class LayerUniform extends Uniform<Float32Array> {
  put(layer: number, value: number) { this.value[layer] = value }
}
export const createMountainUniforms = () => ({
  uSeparation: new AnimatedUniform(0), uScan: new AnimatedUniform(-1), uScanStrength: new AnimatedUniform(0), uAlpenglow: new AnimatedUniform(0),
  // Final vertical offset and highlight of each stratum; offsets only ever grow upward so layers never interpenetrate.
  uOffset: new LayerUniform(new Float32Array(layerCount)), uGlow: new LayerUniform(new Float32Array(layerCount)),
})
export type MountainUniforms = ReturnType<typeof createMountainUniforms>
const last = layerCount - 1
const noise = /* glsl */`
float alpineHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(.1, .2, .3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float alpineNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(alpineHash(i), alpineHash(i + vec3(1,0,0)), f.x),
                 mix(alpineHash(i + vec3(0,1,0)), alpineHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(alpineHash(i + vec3(0,0,1)), alpineHash(i + vec3(1,0,1)), f.x),
                 mix(alpineHash(i + vec3(0,1,1)), alpineHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
`
type Mode = 'surface' | 'lines' | 'plain'
export function configureMountainMaterial(material: Material, uniforms: MountainUniforms, mode: Mode = 'plain') {
  material.customProgramCacheKey = () => `alpine-strata-v3-${mode}`
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>
      attribute float aLayer;
      attribute float aCut;
      uniform float uSeparation;
      uniform float uOffset[${layerCount}];
      uniform float uGlow[${layerCount}];
      const float alpineStrata[${strata.length}] = float[${strata.length}](${strata.map(value => value.toFixed(3)).join(', ')});
      varying vec3 vAlpinePosition;
      varying float vAlpineCut;
      varying float vAlpineGap;
      varying float vAlpineGlow;
      varying float vAlpineTop;
    `).replace('#include <begin_vertex>', `#include <begin_vertex>
      int alpineLayer = int(clamp(aLayer + .5, 0.0, ${last}.0));
      float alpineLift = uOffset[alpineLayer];
      vAlpinePosition = position;
      vAlpineCut = aCut;
      vAlpineGlow = uGlow[alpineLayer];
      vAlpineTop = alpineStrata[alpineLayer + 1];
      // Upper cut faces look through the gap above their layer, lower faces through the gap below.
      vAlpineGap = normal.y > 0.0 ? uOffset[min(alpineLayer + 1, ${last})] - alpineLift : alpineLift - uOffset[max(alpineLayer - 1, 0)];
      transformed.y += alpineLift;
      transformed.x += sin(aLayer * 1.45) * uSeparation * .17;
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      uniform float uSeparation;
      uniform float uScan;
      uniform float uScanStrength;
      uniform float uAlpenglow;
      varying vec3 vAlpinePosition;
      varying float vAlpineCut;
      varying float vAlpineGap;
      varying float vAlpineGlow;
      varying float vAlpineTop;
      ${mode === 'surface' ? noise : ''}
    `)
    if (mode === 'lines') shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb += vec3(.18, .34, .42) * vAlpineGlow;
        diffuseColor.a = min(1.0, diffuseColor.a * (1.0 + vAlpineGlow * 2.6));
      `)
    if (mode !== 'surface') return
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        if (vAlpineCut > .5 && vAlpineGap < .008) discard;
        float alpineGrain = alpineNoise(vAlpinePosition * 55.0);
        float alpineStriation = sin(vAlpinePosition.y * 110.0 + alpineNoise(vAlpinePosition * 7.0) * 8.0);
        float alpineSnow = smoothstep(.30, .75, max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)));
        diffuseColor.rgb *= .87 + .18 * alpineGrain + .035 * alpineStriation * (1.0 - alpineSnow);
        // Alpenglow: sunset light catches only the high snow while the lower slopes stay in cool shadow.
        float alpineWarm = uAlpenglow * smoothstep(1.1, 2.9, vAlpinePosition.y) * (1.0 - vAlpineCut);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.35, .88, .8), alpineWarm);
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(.91, .47, alpineSnow) + alpineGrain * .06;
      `)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        float alpineBump = (alpineGrain * .0025 + alpineStriation * .0007) * (1.0 - .75 * alpineSnow);
        vec3 alpineDx = normalize(dFdx(-vViewPosition));
        vec3 alpineDy = normalize(dFdy(-vViewPosition));
        vec3 alpineR1 = cross(alpineDy, normal);
        vec3 alpineR2 = cross(normal, alpineDx);
        float alpineDet = dot(alpineDx, alpineR1) * faceDirection;
        vec3 alpineGradient = sign(alpineDet) * (dFdx(alpineBump) * alpineR1 + dFdy(alpineBump) * alpineR2);
        normal = normalize(max(abs(alpineDet), .00001) * normal - alpineGradient);
      `)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float alpineScan = 1.0 - smoothstep(.018, .085, abs(vAlpinePosition.y - uScan));
        totalEmissiveRadiance += vec3(.16, .52, .82) * alpineScan * uScanStrength * (1.0 - vAlpineCut);
        totalEmissiveRadiance += vec3(.025, .07, .10) * vAlpineCut * smoothstep(0.0, .20, vAlpineGap);
        float alpineRim = 1.0 - smoothstep(0.0, .1, vAlpineTop - vAlpinePosition.y);
        totalEmissiveRadiance += vec3(.09, .30, .50) * vAlpineGlow * (.16 + .5 * vAlpineCut + .7 * alpineRim * (1.0 - vAlpineCut));
        totalEmissiveRadiance += vec3(1.0, .46, .36) * alpineWarm * (.06 + .5 * alpineSnow);
      `)
  }
}
export function createMountainMaterials(uniforms: MountainUniforms) {
  const materials = {
    surface: new MeshPhysicalMaterial({ vertexColors: true, roughness: .85, metalness: .06, clearcoat: .16, clearcoatRoughness: .36, transparent: true, opacity: 0 }),
    sides: new MeshStandardMaterial({ color: '#253a48', roughness: .93, transparent: true, opacity: 0, side: DoubleSide }),
    contours: new LineBasicMaterial({ color: '#a1dafa', transparent: true, opacity: 0, depthWrite: false }),
    wire: new MeshBasicMaterial({ wireframe: true, color: '#7dbadc', transparent: true, opacity: 0, depthWrite: false }),
    depth: new MeshDepthMaterial({ depthPacking: RGBADepthPacking }),
  }
  const modes: Record<keyof typeof materials, Mode> = { surface: 'surface', sides: 'plain', contours: 'lines', wire: 'lines', depth: 'plain' }
  Object.entries(materials).forEach(([key, material]) => configureMountainMaterial(material, uniforms, modes[key as keyof typeof materials]))
  return materials
}
