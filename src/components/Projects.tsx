import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useIsMobile } from '../hooks/useMediaQuery'

const projects = [
    {
        name: 'C-Ray Engine',
        subtitle: 'Graphics & Physics',
        desc: 'Physics-based ray tracer built from scratch in C.',
        tags: ['C', 'Linux', 'Graphics'],
        link: 'https://github.com/ujjawalsuii/c-ray-engine'
    },
    {
        name: 'Leo the Lion',
        subtitle: 'AI & Healthcare',
        desc: 'Pediatric health companion using LLMs.',
        tags: ['React', 'Python', 'RAG'],
        link: 'https://github.com/Gfewq/Team'
    },
    {
        name: 'Social Distribution',
        subtitle: 'Backend & Federation',
        desc: 'Federated social network with inbox-based node-to-node delivery.',
        tags: ['Django', 'DRF', 'PostgreSQL'],
        link: 'https://github.com/uofa-cmput404/w26-socialdistribution-project-fuchsia'
    },
    {
        name: 'RISC-V Translator',
        subtitle: 'Systems & Compilers',
        desc: 'Binary translator: RISC-V to WebAssembly.',
        tags: ['C', 'WASM', 'Assembly'],
        link: 'https://github.com/ujjawalsuii/rv-to-wasm'
    },
    {
        name: 'Aurora',
        subtitle: 'Mobile Engineering',
        desc: 'Event lottery system booking app for Android.',
        tags: ['Java', 'Android', 'Firebase'],
        link: 'https://github.com/CMPUT301F25aurora/aurora-borealis'
    }
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
        backgroundColor: 'var(--bg-primary)'
    },
    container: {
        maxWidth: '900px',
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
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
    },
    card: {
        padding: '40px',
        backgroundColor: 'transparent',
        border: '1px solid rgba(107, 107, 95, 0.2)',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        minHeight: '280px',
        transition: 'all 0.3s ease'
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
    },
    subtitle: {
        color: 'var(--accent-gold)',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        marginBottom: '8px'
    },
    projectName: {
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        color: 'var(--text-cream)'
    },
    arrow: {
        padding: '8px',
        border: '1px solid rgba(107, 107, 95, 0.3)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        color: 'var(--text-muted)',
        fontSize: '14px',
        lineHeight: 1.6,
        marginBottom: '24px'
    },
    tags: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap' as const
    },
    tag: {
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        padding: '6px 12px',
        border: '1px solid rgba(107, 107, 95, 0.2)',
        color: 'var(--text-muted)'
    }
}

export const Projects = () => {
    const isMobile = useIsMobile()

    return (
        <section id="projects" style={{
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
                    Selected Works
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
                    Projects
                </motion.h2>

                <div style={{
                    ...styles.grid,
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: isMobile ? '16px' : '24px'
                }}>
                    {projects.map((project, index) => (
                        <motion.a
                            key={project.name}
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4, borderColor: 'rgba(201, 169, 98, 0.4)' }}
                            style={{
                                ...styles.card,
                                padding: isMobile ? '24px' : '40px',
                                minHeight: isMobile ? '220px' : '280px'
                            }}
                        >
                            <div>
                                <div style={styles.cardTop}>
                                    <div>
                                        <p style={styles.subtitle}>{project.subtitle}</p>
                                        <h3 style={{
                                            ...styles.projectName,
                                            fontSize: isMobile ? '20px' : '24px'
                                        }}>{project.name}</h3>
                                    </div>
                                    <div style={styles.arrow}>
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                                <p style={styles.desc}>{project.desc}</p>
                            </div>
                            <div style={styles.tags}>
                                {project.tags.map((tag) => (
                                    <span key={tag} style={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}

