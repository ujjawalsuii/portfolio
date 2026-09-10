import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { adventuresMedia, momentsMedia, familyMedia, familyStories, galleryCategories } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'
import { PortfolioImage } from './PortfolioImage'
import { mediaAsset, mediaPoster, originalAsset } from '../data/media'

type Media = { type: string; src: string }
type Category = typeof galleryCategories[number]
const albumMedia = (id: string): Media[] => id === 'family'
  ? [{ type: 'image', src: familyStories[0].image }, ...familyMedia]
  : id === 'adventures' ? [...adventuresMedia, { type: 'image', src: 'alpine-original.jpeg' }] : momentsMedia

function Dialog({ children, titleId, onClose, className = '', onKeyDown }: {
  children: ReactNode; titleId: string; onClose: () => void; className?: string
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => { dialog?.close() }
  }, [])
  return <dialog ref={ref} className={`gallery-dialog ${className}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={onKeyDown}>{children}</dialog>
}

export const Gallery = () => {
  const [category, setCategory] = useState<Category | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const trigger = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!category) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; trigger.current?.focus() }
  }, [category])

  const openAlbum = (cat: Category, button: HTMLButtonElement) => {
    trigger.current = button
    setCategory(cat)
    setLightbox(null)
  }
  const closeAlbum = () => { setCategory(null); setLightbox(null) }
  const media = category ? albumMedia(category.id) : []
  const selected = lightbox === null ? null : media[lightbox]
  const select = (index: number) => { setVideoFailed(false); setLightbox(index) }
  const navigate = (direction: number) => {
    if (lightbox !== null) select((lightbox + direction + media.length) % media.length)
  }
  const onLightboxKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.target instanceof HTMLVideoElement) return
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1) }
  }

  return <>
    <section id="gallery" className="gallery-section">
      <div className="section-shell content-section">
        <SectionHeading number="05" label="Memories" title="Loved Ones." meta="Family / Adventures / Moments" />
        <div className="gallery-covers">
          {galleryCategories.map((cat, index) => <button data-depth className="gallery-cover" key={cat.id} onClick={event => openAlbum(cat, event.currentTarget)} aria-label={`Open ${cat.title} gallery`}>
            <span className="gallery-cover-image"><PortfolioImage source={cat.cover} alt={cat.title} loading="lazy" sizes="(max-width: 540px) 90vw, 33vw" /><span className="gallery-cover-overlay"><ArrowUpRight size={23} strokeWidth={1.4} /></span></span>
            <span className="gallery-cover-caption"><strong>{cat.title}</strong><span className="mono">{String(index + 1).padStart(2, '0')} / {albumMedia(cat.id).length} memories</span></span>
          </button>)}
        </div>
        <div className="gallery-footer"><p>My journey isn't just about code.</p><span className="mono">Family. Adventures. Moments.</span></div>
      </div>
    </section>

    {category && <Dialog titleId="album-title" onClose={closeAlbum}>
      <div className="album-header"><h2 id="album-title">{category.title}</h2><div><span className="mono">{media.length} memories</span><button className="icon-button" autoFocus onClick={closeAlbum} aria-label="Close gallery"><X size={22} /></button></div></div>
      <div className="album-content">
        {category.id === 'family' && <>
          {familyStories.map(story => <article className="family-story" key={story.id}><button className="story-photo" onClick={() => select(0)} aria-label="View My Mom photo"><PortfolioImage source={story.image} alt={story.title} sizes="(max-width: 540px) 90vw, 40vw" /></button><div><span className="mono">Family / The story</span><h3>{story.title}</h3><p>{story.story}</p></div></article>)}
          <h3 className="more-moments">More Moments</h3>
        </>}
        <div className="album-grid">
          {media.map((item, index) => category.id === 'family' && index === 0 ? null : <button className="album-item" key={item.src} onClick={() => select(index)} aria-label={`View ${category.title} ${item.type === 'video' ? 'video' : 'photo'} ${index + 1}`}>
            {item.type === 'image' ? <PortfolioImage source={item.src} alt={`${category.title} — photo ${index + 1}`} loading="lazy" sizes="(max-width: 800px) 45vw, 30vw" /> : <><img src={mediaPoster(item.src)} alt={`${category.title} — video ${index + 1}`} loading="lazy" /><span className="video-label"><Play size={16} fill="currentColor" /> Play video</span></>}
          </button>)}
        </div>
      </div>
    </Dialog>}

    {category && selected && lightbox !== null && <Dialog className="lightbox-dialog" titleId="lightbox-title" onClose={() => setLightbox(null)} onKeyDown={onLightboxKey}>
      <div className="lightbox-header"><div><span className="mono" id="lightbox-title">{category.title}</span><span className="mono">{String(lightbox + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}</span></div><button className="icon-button" autoFocus onClick={() => setLightbox(null)} aria-label="Close photo or video"><X size={22} /></button></div>
      <div className="lightbox-media" onClick={event => { if (event.target === event.currentTarget) setLightbox(null) }}>
        {selected.type === 'image' ? <PortfolioImage source={selected.src} alt={`${category.title} — photo ${lightbox + 1}`} sizes="90vw" /> : videoFailed ? <p>This video is available to open or download below.</p> : <video key={selected.src} src={mediaAsset(selected.src)} poster={mediaPoster(selected.src)} controls autoPlay playsInline preload="metadata" onError={() => setVideoFailed(true)} />}
      </div>
      <button className="lightbox-nav lightbox-prev" onClick={() => navigate(-1)} aria-label="Previous photo or video"><ChevronLeft size={25} /></button>
      <button className="lightbox-nav lightbox-next" onClick={() => navigate(1)} aria-label="Next photo or video"><ChevronRight size={25} /></button>
      <div className="lightbox-bottom"><span className="mono" aria-live="polite">{selected.type === 'video' ? 'Video / Sound available' : 'Photo / Full view'}</span><a href={selected.type === 'video' ? mediaAsset(selected.src) : originalAsset(selected.src)} target="_blank" rel="noreferrer">Open {selected.type === 'video' ? 'video' : 'full-size photo'} <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></a></div>
    </Dialog>}
  </>
}
