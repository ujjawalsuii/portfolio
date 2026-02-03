import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
]

const styles = {
    header: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background 0.3s'
    },
    headerScrolled: {
        backgroundColor: 'rgba(26, 35, 22, 0.95)',
        backdropFilter: 'blur(10px)'
    },
    logo: {
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '24px',
        color: 'var(--accent-gold)',
        background: 'none',
        border: 'none'
    },
    nav: {
        display: 'flex',
        gap: '40px'
    },
    navButton: {
        background: 'none',
        border: 'none',
        fontSize: '12px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        transition: 'color 0.3s'
    },
    navActive: {
        color: 'var(--accent-gold)'
    },
    navInactive: {
        color: 'var(--text-muted)'
    },
    social: {
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'var(--text-muted)',
        textDecoration: 'none'
    },
    dots: {
        position: 'fixed' as const,
        right: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        zIndex: 100
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: '1px solid var(--text-muted)',
        background: 'transparent',
        transition: 'all 0.3s'
    },
    dotActive: {
        background: 'var(--accent-gold)',
        borderColor: 'var(--accent-gold)',
        transform: 'scale(1.3)'
    },
    // Mobile styles
    hamburger: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: 'var(--text-cream)',
        padding: '8px',
        zIndex: 110
    },
    mobileMenu: {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '80px 32px 32px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
        zIndex: 105
    },
    mobileOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 104
    },
    mobileNavButton: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        padding: '16px 0',
        textAlign: 'left' as const,
        borderBottom: '1px solid rgba(107, 107, 95, 0.2)',
        transition: 'color 0.3s'
    },
    mobileClose: {
        position: 'absolute' as const,
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: 'var(--text-cream)',
        padding: '8px'
    }
}

export const Navigation = () => {
    const [activeSection, setActiveSection] = useState('home')
    const [scrolled, setScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
            const scrollPosition = window.scrollY + window.innerHeight / 2

            for (const section of sections) {
                const element = document.getElementById(section.id)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* Side dots - hidden on mobile */}
            {!isMobile && (
                <div style={styles.dots}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            style={{
                                ...styles.dot,
                                ...(activeSection === section.id ? styles.dotActive : {})
                            }}
                            title={section.label}
                        />
                    ))}
                </div>
            )}

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                    ...styles.header,
                    ...(scrolled ? styles.headerScrolled : {}),
                    padding: isMobile ? '16px 24px' : '20px 48px'
                }}
            >
                <button onClick={() => scrollToSection('home')} style={styles.logo}>
                    UPS.
                </button>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <>
                        <nav style={styles.nav}>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    style={{
                                        ...styles.navButton,
                                        ...(activeSection === section.id ? styles.navActive : styles.navInactive)
                                    }}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>

                        <a
                            href="https://linkedin.com/in/ujjawalps2006"
                            target="_blank"
                            rel="noreferrer"
                            style={styles.social}
                        >
                            LinkedIn
                        </a>
                    </>
                )}

                {/* Mobile Hamburger */}
                {isMobile && (
                    <button
                        style={{ ...styles.hamburger, display: 'block' }}
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                )}
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={styles.mobileOverlay}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: 280 }}
                            animate={{ x: 0 }}
                            exit={{ x: 280 }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            style={styles.mobileMenu}
                        >
                            <button
                                style={styles.mobileClose}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X size={24} />
                            </button>

                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    style={{
                                        ...styles.mobileNavButton,
                                        color: activeSection === section.id ? 'var(--accent-gold)' : 'var(--text-cream)'
                                    }}
                                >
                                    {section.label}
                                </button>
                            ))}

                            <a
                                href="https://linkedin.com/in/ujjawalps2006"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    ...styles.social,
                                    marginTop: '24px',
                                    display: 'block'
                                }}
                            >
                                LinkedIn
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

