import { MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, MeshDepthMaterial, LineBasicMaterial, DoubleSide, RGBADepthPacking, Uniform } from 'three'
import type { Material } from 'three'

class AnimatedUniform extends Uniform<number> {
  set(value: number) { this.value = value }
}
export const createMountainUniforms = () => ({
  uSeparation: new AnimatedUniform(0), uScan: new AnimatedUniform(-1), uScanStrength: new AnimatedUniform(0),
})
type Uniforms = ReturnType<typeof createMountainUniforms>
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
export function configureMountainMaterial(material: Material, uniforms: Uniforms, detailed = false) {
  material.customProgramCacheKey = () => `alpine-strata-v2-${detailed}`
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>
      attribute float aLayer;
      attribute float aCut;
      uniform float uSeparation;
      varying vec3 vAlpinePosition;
      varying float vAlpineCut;
    `).replace('#include <begin_vertex>', `#include <begin_vertex>
      vAlpinePosition = position;
      vAlpineCut = aCut;
      transformed.y += aLayer * uSeparation;
      transformed.x += sin(aLayer * 1.45) * uSeparation * .17;
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      uniform float uSeparation;
      uniform float uScan;
      uniform float uScanStrength;
      varying vec3 vAlpinePosition;
      varying float vAlpineCut;
      ${detailed ? noise : ''}
    `)
    if (!detailed) return
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        if (vAlpineCut > .5 && uSeparation < .008) discard;
        float alpineGrain = alpineNoise(vAlpinePosition * 55.0);
        float alpineStriation = sin(vAlpinePosition.y * 110.0 + alpineNoise(vAlpinePosition * 7.0) * 8.0);
        float alpineSnow = smoothstep(.30, .75, max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)));
        diffuseColor.rgb *= .87 + .18 * alpineGrain + .035 * alpineStriation * (1.0 - alpineSnow);
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
        totalEmissiveRadiance += vec3(.025, .07, .10) * vAlpineCut * smoothstep(0.0, .20, uSeparation);
      `)
  }
}
export function createMountainMaterials(uniforms: Uniforms) {
  const materials = {
    surface: new MeshPhysicalMaterial({ vertexColors: true, roughness: .85, metalness: .06, clearcoat: .16, clearcoatRoughness: .36, transparent: true, opacity: 0 }),
    sides: new MeshStandardMaterial({ color: '#253a48', roughness: .93, transparent: true, opacity: 0, side: DoubleSide }),
    contours: new LineBasicMaterial({ color: '#a1dafa', transparent: true, opacity: 0, depthWrite: false }),
    wire: new MeshBasicMaterial({ wireframe: true, color: '#7dbadc', transparent: true, opacity: 0, depthWrite: false }),
    depth: new MeshDepthMaterial({ depthPacking: RGBADepthPacking }),
  }
  Object.entries(materials).forEach(([key, material]) => configureMountainMaterial(material, uniforms, key === 'surface'))
  return materials
}
