import { motion } from 'framer-motion'

const experiences = [
    {
        date: 'Jul - Aug 2026',
        kind: 'work',
        title: 'Kritanshi Boutique',
        subtitle: 'Freelance Web Developer · Abu Dhabi, UAE (Remote)',
        desc: "Shipped a production storefront as sole developer for an Abu Dhabi retail client, translating non-technical requirements into a live site. Scoped a WhatsApp ordering flow that met the client's needs without payment-processor integration, keeping the build out of PCI scope entirely. Built an admin dashboard with product CRUD, drag-and-drop image upload to object storage, category filtering, and recoverable soft deletes, so the owner publishes changes with zero developer involvement. Enforced admin-only writes at the database layer with Postgres Row Level Security behind a SECURITY DEFINER predicate, verified by an automated security probe (6/6 checks passing). Scored 99/100 Lighthouse performance with 100/100 across accessibility, SEO, and best practices.",
        status: 'completed',
        tags: ['Next.js 16', 'TypeScript', 'Supabase', 'Row Level Security', 'Vercel']
    },
    {
        date: 'Jan - Apr 2026',
        kind: 'project',
        title: 'Social Distribution',
        subtitle: 'Federated Social Network · CMPUT 404',
        desc: 'Django-based federated social network where independently deployed nodes exchange entries, likes, comments, and follow requests through an inbox API secured by a custom DRF authentication backend. Designed a three-tier visibility model (public, unlisted, friends-only) with bidirectional follow detection, enforced at both the view and serializer layers. Ingested GitHub Events API activity as markdown sanitized through markdown-it-py and bleach. Deployed on Heroku with PostgreSQL, Gunicorn, WhiteNoise, and Cloudinary.',
        status: 'completed',
        tags: ['Django', 'DRF', 'PostgreSQL', 'Heroku', 'Cloudinary']
    },
    {
        date: 'Feb 2026',
        kind: 'project',
        title: 'WebAble',
        subtitle: 'On-Device ASL Recognition Extension · Hackathon',
        desc: 'All-in-one accessibility Chrome extension making the web safer and easier to read in real time: ASL-to-text, live captions, text-to-speech, epilepsy-safe protections, dyslexia-friendly reading, voice commands, and color modes. Wrote a zero-dependency Multi-Layer Perceptron inference engine in vanilla JavaScript, running forward propagation and softmax classification over 63-dimensional MediaPipe hand-landmark vectors with no ML runtime. Held 60 FPS classification through optimized webcam and screen-share capture loops with spatial normalization, and kept every inference step on-device so no camera or gesture data leaves the browser. Injected accessibility layers past strict Content Security Policies via isolated iframes.',
        status: 'completed',
        tags: ['JavaScript', 'MediaPipe', 'Neural Networks', 'Chrome Extension APIs']
    },
    {
        date: 'Jan - Feb 2026',
        kind: 'project',
        title: 'Leo the Lion',
        subtitle: 'AI Pediatric Health Platform · TELUS Hackathon, Top 5',
        desc: 'Dual-interface health companion serving separate child and parent clients from one FastAPI service, placing top 5 in the field at the TELUS hackathon. Cut perceived latency 40% with a bi-directional Server-Sent Events streaming layer for instant voice and text interaction. Grounded model responses in medical protocols through a Python RAG engine built on Hugging Face Sentence Transformers and Google Gemma 3, and shipped in-browser object detection with TensorFlow.js (Coco-SSD) plus a Web Speech API voice persona.',
        status: 'completed',
        tags: ['React 18', 'FastAPI', 'RAG', 'Gemma 3', 'TensorFlow.js', 'SSE']
    },
    {
        date: 'Sep - Dec 2025',
        kind: 'project',
        title: 'Aurora',
        subtitle: 'Event Lottery System · Android Application',
        desc: 'Native Android app resolving oversubscribed event registration with a custom randomization algorithm that selects entrants from waitlists without bias. Handled concurrent sign-ups and shared profile state with Firebase Firestore real-time sync, role-based access control across Entrants, Organizers, and Admins, QR scanning for waitlist joins and check-ins, and an asynchronous notification system that promotes waitlisted users automatically when a spot opens.',
        status: 'completed',
        tags: ['Java', 'Android SDK', 'Firebase Firestore', 'MVC', 'RBAC']
    },
    {
        date: 'Sep - Dec 2025',
        kind: 'project',
        title: 'RISC-V to WebAssembly Translator',
        subtitle: 'Systems & Compilers',
        desc: 'Cross-architecture binary translator mapping RISC-V branching to WebAssembly structured control flow. Implemented LEB128 compression and a modular decoder for register-to-stack translation.',
        status: 'completed',
        tags: ['C', 'RISC-V', 'WASM', 'Assembly']
    },
    {
        date: 'Dec 2025',
        kind: 'project',
        title: 'C-Ray Engine Update',
        subtitle: 'Major Patch Release',
        desc: 'Significant performance improvements and new features for the physics-based ray tracer.',
        status: 'completed',
        tags: ['C', 'Graphics', 'Linux']
    },
    {
        date: 'Fall 2025',
        kind: 'project',
        title: 'Reinforcement Learning Library',
        subtitle: 'Machine Learning Research',
        desc: 'Custom RL library with Actor-Critic and Dyna-Q+ agents. Implemented Deep TD-Learning with neural networks and tile coding for continuous state spaces, with Average Reward Softmax optimization.',
        status: 'completed',
        tags: ['Python', 'NumPy', 'Neural Networks', 'RL']
    },
    {
        date: 'Jan - Sep 2025',
        kind: 'leadership',
        title: 'Indian Students Association (INDSA)',
        subtitle: 'VP Media',
        desc: 'Integrated generative AI workflows (LLMs, image generation) into the content pipeline, cutting drafting and design time while holding brand consistency across channels. Analyzed audience engagement metrics to identify posting trends and optimize scheduling, contributing directly to a sold-out major cultural event.',
        status: 'completed',
        tags: ['Generative AI', 'Content Strategy', 'Analytics']
    },
    {
        date: 'Jan 2025',
        kind: 'project',
        title: 'MongoDB Project',
        subtitle: 'Database Engineering',
        desc: 'Database architecture and optimization project focusing on query performance and data pipelines.',
        status: 'completed',
        tags: ['MongoDB', 'Node.js', 'API']
    },
    {
        date: 'Sep 2024',
        kind: 'project',
        title: 'C-Ray Engine',
        subtitle: 'Initial Release',
        desc: 'Physics-based ray tracer built from scratch in C. Implements BVH acceleration, Monte Carlo integration, and global illumination.',
        status: 'completed',
        tags: ['C', 'Linux', 'Graphics']
    }
]

const kindLabels: Record<string, string> = {
    work: 'Professional',
    project: 'Project',
    leadership: 'Leadership'
}

const styles = {
    section: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '120px 48px',
        backgroundColor: 'transparent',
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
        backgroundColor: '#0d1409'
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
    kindBadge: {
        fontSize: '9px',
        padding: '3px 8px',
        borderRadius: '2px',
        letterSpacing: '0.12em',
        border: '1px solid rgba(107, 107, 95, 0.35)',
        color: 'var(--text-muted)'
    },
    kindWork: {
        borderColor: 'rgba(201, 169, 98, 0.55)',
        backgroundColor: 'rgba(201, 169, 98, 0.12)',
        color: 'var(--accent-gold)'
    },
    kindLeadership: {
        borderColor: 'rgba(184, 112, 95, 0.55)',
        backgroundColor: 'rgba(184, 112, 95, 0.12)',
        color: '#b8705f'
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
                                <span style={{
                                    ...styles.kindBadge,
                                    ...(exp.kind === 'work' ? styles.kindWork : {}),
                                    ...(exp.kind === 'leadership' ? styles.kindLeadership : {})
                                }}>
                                    {kindLabels[exp.kind]}
                                </span>
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
