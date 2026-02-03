import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const styles = {
    container: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
    },
    logo: {
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '48px',
        color: 'var(--accent-gold)'
    },
    line: {
        width: '60px',
        height: '2px',
        backgroundColor: 'var(--accent-gold)',
        marginTop: '24px',
        transformOrigin: 'left'
    },
    tagline: {
        marginTop: '16px',
        fontSize: '12px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase' as const,
        color: 'var(--text-muted)'
    }
}

interface LoadingScreenProps {
    onComplete: () => void
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onComplete, 500) // Wait for exit animation
        }, 2000)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={styles.container}
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={styles.logo}
                    >
                        UPS.
                    </motion.span>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        style={styles.line}
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        style={styles.tagline}
                    >
                        Engineered with Discipline
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
