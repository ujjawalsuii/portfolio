import { useMediaQuery } from './useMediaQuery'

/** True when the visitor has asked their OS to reduce motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
