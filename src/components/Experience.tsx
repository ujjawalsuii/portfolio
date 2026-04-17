import { motion } from 'framer-motion'

const experiences = [
    {
        date: 'Jan - Apr 2026',
        title: 'Social Distribution',
        subtitle: 'Federated Social Network - CMPUT 404',
        desc: 'Django-based federated social network where independent nodes exchange entries, likes, comments, and follows via an inbox API. Built visibility tiers (public/unlisted/friends-only), GitHub activity sync, and HTTP Basic Auth between nodes. Deployed on Heroku with PostgreSQL and Cloudinary.',
        status: 'ongoing',
        tags: ['Django', 'DRF', 'PostgreSQL', 'Heroku']
    },
    {
        date: 'Jan - Feb 2026',
        title: 'Leo the Lion',
        subtitle: 'TELUS Health Hackathon - Top 5',
        desc: 'Pediatric AI health companion using LLMs for symptom analysis and emotional support. Currently adding Leo Vision for object identification.',
        status: 'completed',
        tags: ['React', 'Python', 'RAG', 'LLM']
    },
    {
        date: 'Sep - Dec 2025',
        title: 'Aurora Mobile App',
        subtitle: 'Android Development',
        desc: 'Event lottery system booking app for Android. Built with Java and Firebase, implementing real-time updates and user authentication.',
        status: 'completed',
        tags: ['Java', 'Android', 'Firebase']
    },
    {
        date: 'Sep - Dec 2025',
        title: 'RISC-V to WebAssembly Translator',
        subtitle: 'Systems & Compilers',
        desc: 'Cross-architecture binary translator mapping RISC-V branching to WebAssembly structured control flow. Implemented LEB128 compression and modular decoder for register-to-stack translation.',
        status: 'completed',
        tags: ['C', 'RISC-V', 'WASM', 'Assembly']
    },
    {
        date: 'Dec 2025',
        title: 'C-Ray Engine Update',
        subtitle: 'Major Patch Release',
        desc: 'Significant performance improvements and new features for the physics-based ray tracer.',
        status: 'completed',
        tags: ['C', 'Graphics', 'Linux']
    },
    {
        date: 'Fall 2025',
        title: 'Reinforcement Learning Library',
        subtitle: 'Machine Learning Research',
        desc: 'Custom RL library with Actor-Critic, Dyna-Q+ agents. Implemented Deep TD-Learning with Neural Networks and Tile Coding for continuous state spaces with Average Reward Softmax optimization.',
        status: 'completed',
        tags: ['Python', 'NumPy', 'Neural Networks', 'RL']
    },
    {
        date: 'Jan 2025',
        title: 'MongoDB Project',
        subtitle: 'Database Engineering',
        desc: 'Database architecture and optimization project focusing on query performance and data pipelines.',
        status: 'completed',
        tags: ['MongoDB', 'Node.js', 'API']
    },
    {
        date: 'Sep 2024',
        title: 'C-Ray Engine',
        subtitle: 'Initial Release',
        desc: 'Physics-based ray tracer built from scratch in C. Implements BVH acceleration, Monte Carlo integration, and global illumination.',
        status: 'completed',
        tags: ['C', 'Linux', 'Graphics']
    }
]

const styles = {
    section: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '120px 48px',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative' as const
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
    timeline: {
        position: 'relative' as const,
        paddingLeft: '40px'
    },
    line: {
        position: 'absolute' as const,
        left: '7px',
        top: '8px',
        bottom: '8px',
        width: '2px',
        background: 'linear-gradient(to bottom, var(--accent-gold), rgba(107, 107, 95, 0.3))'
    },
    item: {
        position: 'relative' as const,
        marginBottom: '48px',
        paddingLeft: '32px'
    },
    dot: {
        position: 'absolute' as const,
        left: '-33px',
        top: '8px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '2px solid var(--accent-gold)',
        backgroundColor: 'var(--bg-primary)'
    },
    dotOngoing: {
        backgroundColor: 'var(--accent-gold)'
    },
    date: {
        color: 'var(--accent-gold)',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    ongoingBadge: {
        fontSize: '10px',
        padding: '3px 8px',
        backgroundColor: 'rgba(201, 169, 98, 0.15)',
        border: '1px solid var(--accent-gold)',
        borderRadius: '2px',
        color: 'var(--accent-gold)'
    },
    itemTitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        color: 'var(--text-cream)',
        marginBottom: '4px'
    },
    itemSubtitle: {
        fontSize: '14px',
        color: 'var(--accent-sage)',
        marginBottom: '12px'
    },
    itemDesc: {
        fontSize: '15px',
        color: 'var(--text-light)',
        lineHeight: 1.7,
        marginBottom: '16px'
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
        padding: '5px 10px',
        border: '1px solid rgba(107, 107, 95, 0.2)',
        color: 'var(--text-muted)'
    }
}

export const Experience = () => {
    return (
        <section id="experience" style={styles.section}>
            <div style={styles.container}>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={styles.label}
                >
                    Journey
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={styles.title}
                >
                    Experience
                </motion.h2>

                <div style={styles.timeline}>
                    <div style={styles.line} />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={styles.item}
                        >
                            <div style={{
                                ...styles.dot,
                                ...(exp.status === 'ongoing' ? styles.dotOngoing : {})
                            }} />

                            <div style={styles.date}>
                                {exp.date}
                                {exp.status === 'ongoing' && (
                                    <span style={styles.ongoingBadge}>Ongoing</span>
                                )}
                            </div>

                            <h3 style={styles.itemTitle}>{exp.title}</h3>
                            <p style={styles.itemSubtitle}>{exp.subtitle}</p>
                            <p style={styles.itemDesc}>{exp.desc}</p>

                            <div style={styles.tags}>
                                {exp.tags.map((tag) => (
                                    <span key={tag} style={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
