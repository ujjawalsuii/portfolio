import type { ImgHTMLAttributes } from 'react'
import { mediaAsset, mediaDimensions, mediaSourceSet } from '../data/media'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & { source: string; alt: string }
export const PortfolioImage = ({ source, alt, sizes = '100vw', ...props }: Props) => (
  <img src={mediaAsset(source)} srcSet={mediaSourceSet(source)} sizes={sizes} alt={alt} {...mediaDimensions(source)} {...props} />
)
