import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery'

const categories = [
    { title: 'Languages', skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C', 'Bash', 'RISC-V'], icon: '⚡' },
    { title: 'Machine Learning', skills: ['Generative AI', 'LLM Orchestration', 'RAG', 'NLP', 'PyTorch', 'RL'], icon: '🧠' },
    { title: 'Web & Backend', skills: ['React 18', 'Node.js', 'FastAPI', 'TailwindCSS', 'WebSocket/SSE', 'REST APIs'], icon: '🌐' },
    { title: 'DevOps & Tools', skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Git', 'Linux/Unix', 'VS Code'], icon: '⚙️' },
    { title: 'Cloud & Database', skills: ['Firebase', 'Firestore', 'MongoDB', 'PostgreSQL', 'GCP'], icon: '☁️' },
    { title: 'Data & Analytics', skills: ['Query Optimization', 'Data Pipelines', 'JSON Processing', 'System Design'], icon: '📊' }
]

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
        perspective: '1000px'
    },
    container: {
        maxWidth: '1100px',
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
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        fontStyle: 'italic',
        textAlign: 'center' as const,
        marginBottom: '64px',
        color: 'var(--text-cream)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
    },
    cardWrapper: {
        perspective: '1000px'
    },
    card: {
        padding: '32px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid rgba(107, 107, 95, 0.15)',
        transformStyle: 'preserve-3d' as const,
        transition: 'box-shadow 0.3s ease'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(107, 107, 95, 0.15)'
    },
    cardIcon: {
        fontSize: '24px',
        transform: 'translateZ(30px)'
    },
    cardTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        color: 'var(--accent-gold)'
    },
    skillList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px'
    },
    skill: {
        fontSize: '14px',
        color: 'var(--text-light)',
        padding: '4px 0',
        transition: 'all 0.2s ease',
        transform: 'translateZ(20px)'
    }
}

// 3D Tilt Card Component
const TiltCard = ({ category, index, isMobile }: { category: typeof categories[0], index: number, isMobile: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || isMobile) return

        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...styles.cardWrapper,
                rotateX: isMobile ? 0 : rotateX,
                rotateY: isMobile ? 0 : rotateY,
                transformStyle: 'preserve-3d'
            }}
        >
            <motion.div
                style={{
                    ...styles.card,
                    padding: isMobile ? '24px' : '32px'
                }}
                whileHover={isMobile ? {} : {
                    boxShadow: '0 25px 50px -12px rgba(201, 169, 98, 0.25)',
                    borderColor: 'rgba(201, 169, 98, 0.3)'
                }}
            >
                <div style={styles.cardHeader}>
                    <motion.span
                        style={styles.cardIcon}
                        animate={isMobile ? {} : {
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                    >
                        {category.icon}
                    </motion.span>
                    <h3 style={styles.cardTitle}>{category.title}</h3>
                </div>
                <div style={styles.skillList}>
                    {category.skills.map((skill, skillIndex) => (
                        <motion.span
                            key={skill}
                            style={{
                                ...styles.skill,
                                fontSize: isMobile ? '13px' : '14px'
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                            whileHover={isMobile ? {} : {
                                x: 8,
                                color: '#c9a962',
                                textShadow: '0 0 20px rgba(201, 169, 98, 0.5)'
                            }}
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

export const TechArsenal = () => {
    const isMobile = useIsMobile()
    const isTablet = useIsTablet()

    const getGridColumns = () => {
        if (isMobile) return '1fr'
        if (isTablet) return 'repeat(2, 1fr)'
        return 'repeat(3, 1fr)'
    }

    return (
        <section id="skills" style={{
            ...styles.section,
            padding: isMobile ? '80px 24px' : '120px 48px'
        }}>
            <div style={styles.container}>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={styles.label}
                >
                    Proficiency
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        ...styles.title,
                        marginBottom: isMobile ? '40px' : '64px'
                    }}
                >
                    Technical Arsenal
                </motion.h2>

                <div style={{
                    ...styles.grid,
                    gridTemplateColumns: getGridColumns(),
                    gap: isMobile ? '16px' : '24px'
                }}>
                    {categories.map((category, index) => (
                        <TiltCard key={category.title} category={category} index={index} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </section>
    )
}

