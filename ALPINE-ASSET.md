# Updated alpine hero asset

Built-in image generation, edit mode. Updated from the user-supplied IMG_8938.JPEG, 1536 × 2048. The MPO input was losslessly normalized before generation.

Saved assets:
- public/alpine-original.jpeg: untouched supplied higher-quality file, replacing the previous lower-quality copy.
- public/alpine-original.webp: full-resolution mobile hero, 1536 × 2048.
- public/alpine-panorama.png: refreshed panoramic extension, 1672 × 941.
- public/alpine-panorama.webp: high-quality delivery copy of that panorama.
- public/media/alpine-original-720.webp and public/media/alpine-original-1800.webp: responsive gallery copies.

The generation tool returned 1672 × 941 despite a request for a higher pixel count. No artificial upscaling is used. The original supplied photo remains available in Adventures. The panoramic landscape is an AI extension; the procedural 3D mountain is artistic rather than a geographical reconstruction.

## Exact generation prompt

Use case: identity-preserve.
Asset type: one photorealistic 16:9 alpine panorama for a portfolio website hero.

Input image 1 (alpine-original-normalized.png, losslessly decoded from IMG_8938.JPEG): the higher-quality original photograph and EDIT TARGET. Use this as the source of truth for the person's precise identity, anatomy, hair, clothing, belongings, lighting, real photographic textures, and the photographed mountain landscape.
Input image 2 (alpine-panorama.png): COMPOSITION-ONLY reference. Match its recognizable broad panoramic framing and cool blue alpine atmosphere; do not use its lower-resolution person or its softened textures as source material.

Primary request: extend and reframe the higher-quality original photo into a wide 16:9 panorama, keeping the photographed person unchanged in appearance and pose. Request the maximum supported native output resolution, ideally 3072 by 1728 pixels, or at least 2048 pixels wide. Preserve crisp photographic detail in rock strata, gravel, hair, clothing folds, and backpack fabric without invented microtexture, fake sharpening, halos, or overprocessed HDR.

Composition: broad cool blue sky and layered mountain range with spacious usable negative space across the left 60% of the image. Place the same full-body person near the right side, centered at approximately 70% of image width, feet approximately 95% down the image, total person height approximately 40% of image height. Preserve the existing panorama's recognizable relationship between the rocky foreground, layered valley on the left, snowy central distant peak, ridgeline, and person on the right. Keep the full person and both boots visible. Natural, seamless expansion of the original mountainous landscape, with realistic depth, perspective, and atmospheric haze.

Subject invariants: the exact same person from input image 1, in the same rear/side pose facing right, same face/profile and skin tone, same dark curly hair, navy short-sleeved shirt, light trousers, red backpack with teal straps, light garment tied around the waist, dark boots, and all original belongings. Preserve body proportions, arm and hand positions, stance, backpack shape, straps, clothing silhouette, and footwear. Do not redesign, beautify, substitute, or restyle the person. Treat identity and clothing fidelity as paramount.

Style and lighting: natural real-camera outdoor photography. Preserve the cool blue palette and daylight/backlighting visible in the original; detailed yet believable shadows. Maintain realistic mountain rock, sparse alpine vegetation, and stony foreground texture.

Constraints: one final image only. No typography, UI, logos, watermarks, extra people, added props, cartoon or painterly effects. No artificial extreme contrast or excessive saturation.
