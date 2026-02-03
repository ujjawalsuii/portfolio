import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useMediaQuery'

const styles = {
    section: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        overflow: 'hidden'
    },
    background: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
    },
    overlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(26, 35, 22, 0.3) 0%, rgba(26, 35, 22, 0.5) 50%, rgba(26, 35, 22, 0.95) 100%)',
        zIndex: 1
    },
    content: {
        zIndex: 10,
        textAlign: 'center' as const,
        maxWidth: '900px',
        padding: '0 24px'
    },
    label: {
        color: 'var(--accent-gold)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.3em',
        textTransform: 'uppercase' as const,
        marginBottom: '24px'
    },
    titleContainer: {
        position: 'relative' as const,
        marginBottom: '24px'
    },
    title: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
        lineHeight: 1.15,
        color: 'var(--text-cream)',
        textShadow: '0 4px 30px rgba(0,0,0,0.3)',
        position: 'relative' as const,
        zIndex: 1
    },
    titleColorLayer: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
        lineHeight: 1.15,
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #00b4d8, #0077b6, #48cae4, #90e0ef)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        zIndex: 2,
        pointerEvents: 'none' as const
    },
    line: {
        width: '80px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
        margin: '0 auto 32px'
    },
    subtitle: {
        fontSize: '17px',
        color: 'var(--text-light)',
        lineHeight: 1.8,
        marginBottom: '48px',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    button: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 36px',
        border: '1px solid var(--accent-gold)',
        background: 'rgba(26, 35, 22, 0.6)',
        backdropFilter: 'blur(10px)',
        color: 'var(--accent-gold)',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-body)',
        transition: 'all 0.3s ease'
    }
}

export const Hero = () => {
    const ref = useRef(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const [maskPosition, setMaskPosition] = useState({ x: 50, y: 50 })
    const [isHovering, setIsHovering] = useState(false)
    const isMobile = useIsMobile()

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (titleRef.current && !isMobile) {
            const rect = titleRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setMaskPosition({ x, y })
        }
    }

    return (
        <section id="home" ref={ref} style={styles.section}>
            {/* Parallax Background */}
            <motion.div style={{ ...styles.background, y: bgY }} />
            <div style={styles.overlay} />

            {/* Content */}
            <motion.div style={{ ...styles.content, y: contentY, opacity }}>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={styles.label}
                >
                    Welcome
                </motion.p>

                {/* Interactive Title with Paint Effect */}
                <div
                    ref={titleRef}
                    style={styles.titleContainer}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Base white text */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={styles.title}
                    >
                        <span style={{ fontStyle: 'italic' }}>Engineered</span> with Discipline.
                        <br />
                        <span style={{ color: 'var(--accent-sage)' }}>Driven</span> by Impact.
                    </motion.h1>

                    {/* Peacock color layer with mask */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                            ...styles.titleColorLayer,
                            maskImage: isHovering
                                ? `radial-gradient(circle 120px at ${maskPosition.x}% ${maskPosition.y}%, black 0%, transparent 100%)`
                                : 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)',
                            WebkitMaskImage: isHovering
                                ? `radial-gradient(circle 120px at ${maskPosition.x}% ${maskPosition.y}%, black 0%, transparent 100%)`
                                : 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)',
                            transition: 'mask-image 0.1s ease, -webkit-mask-image 0.1s ease'
                        }}
                    >
                        <span style={{ fontStyle: 'italic' }}>Engineered</span> with Discipline.
                        <br />
                        <span>Driven</span> by Impact.
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    style={styles.line}
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={styles.subtitle}
                >
                    3rd-year Computing Science at the University of Alberta.
                    <br />
                    Building high-performance systems with elite discipline.
                </motion.p>

                <motion.a
                    href="#about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    style={styles.button}
                    whileHover={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)' }}
                >
                    Explore
                    <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                    </motion.svg>
                </motion.a>
            </motion.div>
        </section>
    )
}
