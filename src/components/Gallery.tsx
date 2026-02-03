import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useIsMobile } from '../hooks/useMediaQuery'

// Helper function to get correct path for GitHub Pages
const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`

// Adventures media files
const adventuresMedia = [
    { type: 'image', src: 'Adventures/IMG_2246.JPEG' },
    { type: 'image', src: 'Adventures/IMG_2333.JPEG' },
    { type: 'image', src: 'Adventures/IMG_2883.JPEG' },
    { type: 'image', src: 'Adventures/IMG_7832.JPEG' },
    { type: 'image', src: 'Adventures/e765ea3a-2abd-41e5-a015-90f8b7c51ba5.JPEG' },
    { type: 'image', src: 'Adventures/FullSizeRender.JPEG' },
    { type: 'video', src: 'Adventures/3C7194DA-4599-47E6-B3EB-E994421027D3.MP4' },
    { type: 'video', src: 'Adventures/IMG_2918.MP4' },
]

// Moments media files
const momentsMedia = [
    { type: 'image', src: 'Moments/IMG_7652.JPEG' },
    { type: 'image', src: 'Moments/IMG_8816.JPEG' },
    { type: 'video', src: 'Moments/copy_02F64FF5-6B85-46EB-9C0D-A54C0FF1E6FE.MOV' },
    { type: 'video', src: 'Moments/banff.mp4' },
]

// Family stories - special format with image + story
const familyStories = [
    {
        id: 'mom',
        title: 'My Mom',
        image: 'Family/My-mom.JPEG',
        story: `My mom is my biggest supporter. She has always guided me to do the right thing and taught me that no dream is ever too far if you just believe in Krishna.

She always took amazing care of me. Even when she was tired or sick, she would still make sure I felt comfortable and had something to eat. Even when she insisted that she was fine and that the burn she got from holding a hot pan was nothing, she would still make sure I was always smiling.

No amount of words can describe how grateful I am to have such an incredible mother. I made it my dream that one day I will buy her a whole jewelry store and take her to the Alps, where she has always wanted to go.`
    }
]

// Family media (other photos)
const familyMedia = [
    { type: 'image', src: 'Family/FullSizeRender.JPEG' },
    { type: 'image', src: 'Family/cecf81fd-ad55-4074-8375-08a4d5e6cabd.JPEG' },
    { type: 'image', src: 'Family/d648969d-60b5-4176-9acf-9212bc744c74.JPEG' },
]

const categories = [
    {
        id: 'family',
        title: 'Family',
        cover: 'Family/FullSizeRender.JPEG',
        hasContent: true,
        isStoryType: true
    },
    {
        id: 'adventures',
        title: 'Adventures',
        cover: 'Adventures/IMG_2246.JPEG',
        hasContent: true,
        media: adventuresMedia
    },
    {
        id: 'moments',
        title: 'Moments',
        cover: 'Moments/IMG_7652.JPEG',
        hasContent: true,
        media: momentsMedia
    },
]

const styles = {
    section: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '120px 48px 80px',
        backgroundColor: 'var(--bg-primary)'
    },
    container: {
        maxWidth: '1000px',
        width: '100%'
    },
    label: {
        color: 'var(--accent-gold)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.25em',
        textTransform: 'uppercase' as const,
        textAlign: 'center' as const,
        marginBottom: '16px'
    },
    title: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontStyle: 'italic',
        textAlign: 'center' as const,
        marginBottom: '48px',
        color: 'var(--text-cream)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '80px'
    },
    card: {
        position: 'relative' as const,
        aspectRatio: '3/4',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(107, 107, 95, 0.2)'
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        transition: 'transform 0.5s ease'
    },
    cardOverlay: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '32px 16px 16px',
        background: 'linear-gradient(to top, rgba(26, 35, 22, 0.9), transparent)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    cardTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontStyle: 'italic',
        color: 'var(--text-cream)'
    },
    // Subcategory view styles
    subView: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 1000,
        overflowY: 'auto' as const,
        padding: '80px 48px'
    },
    subHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px'
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: '1px solid var(--text-muted)',
        padding: '12px 24px',
        color: 'var(--text-cream)',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const
    },
    mediaGrid: {
        columnCount: 3,
        columnGap: '16px'
    },
    mediaItem: {
        breakInside: 'avoid' as const,
        marginBottom: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative' as const,
        borderRadius: '4px'
    },
    mediaImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
        transition: 'transform 0.3s ease'
    },
    videoOverlay: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    // Lightbox
    lightbox: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    lightboxMedia: {
        maxWidth: '90vw',
        maxHeight: '90vh',
        objectFit: 'contain' as const
    },
    lightboxClose: {
        position: 'absolute' as const,
        top: '24px',
        right: '24px',
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer'
    },
    lightboxNav: {
        position: 'absolute' as const,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        padding: '16px',
        color: 'white',
        cursor: 'pointer'
    },
    // Family Story styles
    storyContainer: {
        maxWidth: '1100px',
        margin: '0 auto'
    },
    storyCard: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        marginBottom: '64px',
        padding: '48px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(107, 107, 95, 0.15)'
    },
    storyImage: {
        width: '100%',
        height: 'auto',
        maxHeight: '500px',
        objectFit: 'cover' as const,
        borderRadius: '4px'
    },
    storyContent: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center'
    },
    storyTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        fontStyle: 'italic',
        color: 'var(--accent-gold)',
        marginBottom: '24px'
    },
    storyText: {
        fontSize: '16px',
        lineHeight: 2,
        color: 'var(--text-light)',
        whiteSpace: 'pre-line' as const
    },
    familyPhotosTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontStyle: 'italic',
        color: 'var(--text-cream)',
        marginBottom: '32px',
        textAlign: 'center' as const
    },
    footer: {
        borderTop: '1px solid rgba(107, 107, 95, 0.15)',
        paddingTop: '48px',
        textAlign: 'center' as const
    },
    footerText: {
        color: 'var(--text-muted)',
        fontSize: '13px',
        marginBottom: '24px'
    },
    links: {
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        marginBottom: '32px'
    },
    link: {
        color: 'var(--text-muted)',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const
    },
    copyright: {
        color: 'rgba(107, 107, 95, 0.5)',
        fontSize: '11px'
    }
}

export const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState<typeof categories[0] | null>(null)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const isMobile = useIsMobile()

    const openCategory = (cat: typeof categories[0]) => {
        if (cat.hasContent) {
            setActiveCategory(cat)
            document.body.style.overflow = 'hidden'
        }
    }

    const closeCategory = () => {
        setActiveCategory(null)
        document.body.style.overflow = ''
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
    }

    const closeLightbox = () => {
        setLightboxIndex(null)
    }

    const getCurrentMedia = () => {
        if (!activeCategory) return []
        if (activeCategory.id === 'family') return familyMedia
        return activeCategory.media || []
    }

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (lightboxIndex === null) return
        const media = getCurrentMedia()
        const len = media.length
        if (direction === 'prev') {
            setLightboxIndex((lightboxIndex - 1 + len) % len)
        } else {
            setLightboxIndex((lightboxIndex + 1) % len)
        }
    }

    return (
        <>
            <section id="gallery" style={{
                ...styles.section,
                padding: isMobile ? '80px 24px 60px' : '120px 48px 80px'
            }}>
                <div style={styles.container}>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={styles.label}
                    >
                        Memories
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={styles.title}
                    >
                        Loved Ones
                    </motion.h2>

                    <div style={{
                        ...styles.grid,
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: isMobile ? '16px' : '24px',
                        marginBottom: isMobile ? '48px' : '80px'
                    }}>
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                style={styles.card}
                                onClick={() => openCategory(cat)}
                            >
                                <img
                                    src={getAssetPath(cat.cover)}
                                    alt={cat.title}
                                    style={styles.cardImage}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <div style={styles.cardOverlay}>
                                    <span style={styles.cardTitle}>{cat.title}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Family Story View - Special Layout */}
            {activeCategory?.id === 'family' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.subView}
                >
                    <div style={styles.storyContainer}>
                        <div style={styles.subHeader}>
                            <button style={styles.backBtn} onClick={closeCategory}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '32px',
                                fontStyle: 'italic',
                                color: 'var(--text-cream)'
                            }}>
                                Family
                            </h2>
                            <div style={{ width: '100px' }} />
                        </div>

                        {/* Story Cards */}
                        {familyStories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                style={styles.storyCard}
                            >
                                <img
                                    src={getAssetPath(story.image)}
                                    alt={story.title}
                                    style={styles.storyImage}
                                />
                                <div style={styles.storyContent}>
                                    <h3 style={styles.storyTitle}>{story.title}</h3>
                                    <p style={styles.storyText}>{story.story}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Other Family Photos */}
                        <h3 style={styles.familyPhotosTitle}>More Moments</h3>
                        <div style={styles.mediaGrid}>
                            {familyMedia.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    style={styles.mediaItem}
                                    onClick={() => openLightbox(index)}
                                    onMouseOver={(e) => {
                                        const img = e.currentTarget.querySelector('img')
                                        if (img) img.style.transform = 'scale(1.05)'
                                    }}
                                    onMouseOut={(e) => {
                                        const img = e.currentTarget.querySelector('img')
                                        if (img) img.style.transform = 'scale(1)'
                                    }}
                                >
                                    <img src={getAssetPath(item.src)} alt="" style={styles.mediaImage} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Regular Subcategory View (Adventures, Moments) */}
            {activeCategory && activeCategory.id !== 'family' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.subView}
                >
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={styles.subHeader}>
                            <button style={styles.backBtn} onClick={closeCategory}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '32px',
                                fontStyle: 'italic',
                                color: 'var(--text-cream)'
                            }}>
                                {activeCategory.title}
                            </h2>
                            <div style={{ width: '100px' }} />
                        </div>

                        <div style={styles.mediaGrid}>
                            {activeCategory.media?.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={styles.mediaItem}
                                    onClick={() => openLightbox(index)}
                                    onMouseOver={(e) => {
                                        const img = e.currentTarget.querySelector('img, video')
                                        if (img) (img as HTMLElement).style.transform = 'scale(1.05)'
                                    }}
                                    onMouseOut={(e) => {
                                        const img = e.currentTarget.querySelector('img, video')
                                        if (img) (img as HTMLElement).style.transform = 'scale(1)'
                                    }}
                                >
                                    {item.type === 'image' ? (
                                        <img src={getAssetPath(item.src)} alt="" style={styles.mediaImage} />
                                    ) : (
                                        <>
                                            <video src={getAssetPath(item.src)} style={styles.mediaImage} muted />
                                            <div style={styles.videoOverlay}>
                                                <Play size={24} />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && activeCategory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.lightbox}
                    onClick={closeLightbox}
                >
                    <button style={styles.lightboxClose} onClick={closeLightbox}>
                        <X size={32} />
                    </button>

                    <button
                        style={{ ...styles.lightboxNav, left: '24px' }}
                        onClick={(e) => { e.stopPropagation(); navigateLightbox('prev') }}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {(() => {
                        const media = getCurrentMedia()
                        const item = media[lightboxIndex]
                        if (!item) return null

                        return item.type === 'image' ? (
                            <img
                                src={getAssetPath(item.src)}
                                alt=""
                                style={styles.lightboxMedia}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <video
                                src={getAssetPath(item.src)}
                                style={styles.lightboxMedia}
                                controls
                                autoPlay
                                onClick={(e) => e.stopPropagation()}
                            />
                        )
                    })()}

                    <button
                        style={{ ...styles.lightboxNav, right: '24px' }}
                        onClick={(e) => { e.stopPropagation(); navigateLightbox('next') }}
                    >
                        <ChevronRight size={32} />
                    </button>
                </motion.div>
            )}
        </>
    )
}
