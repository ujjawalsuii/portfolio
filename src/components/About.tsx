import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useMediaQuery'

const styles = {
    section: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 48px',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative' as const,
        overflow: 'hidden'
    },
    container: {
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '64px',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as const
    },
    label: {
        color: 'var(--accent-gold)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.25em',
        textTransform: 'uppercase' as const,
        marginBottom: '16px'
    },
    title: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        fontStyle: 'italic',
        marginBottom: '48px',
        color: 'var(--text-cream)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'start'
    },
    bio: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '24px'
    },
    paragraph: {
        fontSize: '16px',
        lineHeight: 1.8,
        color: 'var(--text-light)'
    },
    highlight: {
        color: 'var(--text-cream)',
        fontWeight: 500
    },
    goldHighlight: {
        color: 'var(--accent-gold)'
    },
    whyMe: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px'
    },
    card: {
        padding: '20px',
        borderLeft: '2px solid var(--accent-gold)',
        backgroundColor: 'rgba(36, 46, 30, 0.5)'
    },
    cardTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '16px',
        color: 'var(--accent-gold)',
        marginBottom: '6px'
    },
    cardText: {
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: 1.6
    },
    imageContainer: {
        position: 'relative' as const,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        maxWidth: '280px',
        height: 'auto',
        maxHeight: '420px',
        objectFit: 'cover' as const,
        borderRadius: '4px',
        border: '1px solid rgba(107, 107, 95, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    imageGlow: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
    }
}

export const About = () => {
    const isMobile = useIsMobile()

    return (
        <section id="about" style={{
            ...styles.section,
            padding: isMobile ? '80px 24px' : '120px 48px'
        }}>
            <div style={{
                ...styles.container,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
                gap: isMobile ? '48px' : '64px'
            }}>
                {/* Image first on mobile */}
                {isMobile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        style={styles.imageContainer}
                    >
                        <div style={styles.imageGlow} />
                        <motion.img
                            src="/Me.jpg"
                            alt="Ujjawal Pratap"
                            style={{
                                ...styles.image,
                                maxWidth: '200px',
                                maxHeight: '300px'
                            }}
                        />
                    </motion.div>
                )}

                {/* Left side - Content */}
                <div style={styles.content}>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={styles.label}
                    >
                        The Architect
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            ...styles.title,
                            marginBottom: isMobile ? '32px' : '48px'
                        }}
                    >
                        About Me
                    </motion.h2>

                    <div style={{
                        ...styles.grid,
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: isMobile ? '32px' : '48px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={styles.bio}
                        >
                            <p style={styles.paragraph}>
                                I'm a 3rd-year Computing Science student at the{' '}
                                <span style={styles.highlight}>University of Alberta</span>,
                                but my journey isn't just about code.
                            </p>
                            <p style={styles.paragraph}>
                                Whether optimizing a C-based Ray Tracer or pushing for a{' '}
                                <span style={styles.goldHighlight}>225lb bench press</span>,
                                I apply the same philosophy: absolute focus and continuous improvement.
                            </p>
                            <p style={styles.paragraph}>
                                Influenced by the mentality of greats like Ronaldo and Verstappen,
                                I believe in speed, precision, and resilience.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            style={styles.whyMe}
                        >
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>The Mindset</h3>
                                <p style={styles.cardText}>I solve problems with the intensity of a competitor.</p>
                            </div>
                            <div style={{ ...styles.card, borderColor: 'var(--accent-sage)' }}>
                                <h3 style={{ ...styles.cardTitle, color: 'var(--accent-sage)' }}>The Mission</h3>
                                <p style={styles.cardText}>Leverage technology to support my family and build real value.</p>
                            </div>
                            <div style={{ ...styles.card, borderColor: '#b8705f' }}>
                                <h3 style={{ ...styles.cardTitle, color: '#b8705f' }}>The Balance</h3>
                                <p style={styles.cardText}>Sim Racing, photography, and the gym.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right side - Image (desktop only) */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={styles.imageContainer}
                    >
                        <div style={styles.imageGlow} />
                        <motion.img
                            src="/Me.jpg"
                            alt="Ujjawal Pratap"
                            style={styles.image}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 30px 60px -12px rgba(201, 169, 98, 0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </div>
        </section>
    )
}

