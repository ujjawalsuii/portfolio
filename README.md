# Ujjawal Pratap — Portfolio

A responsive React and TypeScript portfolio built with Vite. The design uses oversized typography, an indexed project list, a full experience timeline, personal photo albums, and a lazy-loaded WebGL signature study.

## Development

- `npm ci` installs the locked dependencies.
- `npm run dev` starts the local site.
- `npm run build` creates the production site in `dist/`.
- `npm run preview` serves that production build.
- `npm run lint` checks the source.

The relative asset base supports both a root domain and GitHub Pages under `/portfolio/`.

## Content and media

All existing project descriptions, timeline entries, skill categories, gallery records, and the family story are preserved in `src/data/portfolio.ts`. The original photos, videos, and resume remain in `public/`.

`public/media/` contains smaller WebP images, video posters, and browser-compatible H.264/AAC videos. `src/data/media.json` maps original media to these delivery copies. Original full-resolution photos remain available from the gallery viewer. Videos are requested only when the viewer is opened. Production builds omit redundant original video files after verifying their delivery copies exist.

To regenerate delivery copies, use Python with Pillow and imageio-ffmpeg, then run `python scripts/optimize-media.py`. The current copies are committed, so this step is not required for ordinary installation or deployment.

## Verification

- `node scripts/verify-content.mjs` compares every original data group with the snapshot from before the redesign and checks original asset files.
- `node scripts/verify-render.mjs` checks rendered sections, biography and contact text, project links, and navigation destinations.

The photo albums use native modal dialogs for focus containment and Escape handling, with arrow-key navigation in the media viewer. The site respects reduced motion, supports keyboard focus, retains normal scrolling and the native cursor, and renders main content without a loading gate. The WebGL section loads near the viewport, pauses off-screen, and provides a fallback when rendering is unavailable.
