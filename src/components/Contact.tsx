import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Download } from 'lucide-react'

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
        position: 'relative' as const
    },
    container: {
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center' as const
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
        marginBottom: '24px',
        color: 'var(--text-cream)'
    },
    subtitle: {
        fontSize: '17px',
        color: 'var(--text-light)',
        lineHeight: 1.8,
        marginBottom: '48px',
        maxWidth: '600px',
        margin: '0 auto 48px'
    },
    emailLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 40px',
        border: '1px solid var(--accent-gold)',
        background: 'transparent',
        color: 'var(--accent-gold)',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-body)',
        textDecoration: 'none',
        marginBottom: '48px'
    },
    socialLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '48px'
    },
    socialLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        border: '1px solid rgba(107, 107, 95, 0.3)',
        color: 'var(--text-muted)',
        textDecoration: 'none',
        transition: 'all 0.3s ease'
    },
    resumeButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 32px',
        background: 'var(--accent-gold)',
        border: 'none',
        color: 'var(--bg-primary)',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-body)',
        textDecoration: 'none'
    },
    divider: {
        width: '60px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
        margin: '48px auto'
    },
    quote: {
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontStyle: 'italic',
        color: 'var(--text-light)',
        maxWidth: '500px',
        margin: '0 auto'
    }
}

export const Contact = () => {
    return (
        <section id="contact" style={styles.section}>
            <div style={styles.container}>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={styles.label}
                >
                    Get in Touch
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={styles.title}
                >
                    Let's Build Something Great
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={styles.subtitle}
                >
                    Whether you have a project in mind, want to collaborate, or just want to connect,
                    I'm always open to discussing new opportunities.
                </motion.p>

                <motion.a
                    href="mailto:ujjawalpratap1234@gmail.com"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={styles.emailLink}
                    whileHover={{
                        backgroundColor: 'var(--accent-gold)',
                        color: 'var(--bg-primary)'
                    }}
                >
                    <Mail size={18} />
                    ujjawalpratap1234@gmail.com
                </motion.a>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    style={styles.socialLinks}
                >
                    <motion.a
                        href="https://linkedin.com/in/ujjawalps2006"
                        target="_blank"
                        rel="noreferrer"
                        style={styles.socialLink}
                        whileHover={{
                            borderColor: 'var(--accent-gold)',
                            color: 'var(--accent-gold)',
                            y: -4
                        }}
                    >
                        <Linkedin size={22} />
                    </motion.a>
                    <motion.a
                        href="https://github.com/ujjawalsuii"
                        target="_blank"
                        rel="noreferrer"
                        style={styles.socialLink}
                        whileHover={{
                            borderColor: 'var(--accent-gold)',
                            color: 'var(--accent-gold)',
                            y: -4
                        }}
                    >
                        <Github size={22} />
                    </motion.a>
                </motion.div>

                <motion.a
                    href="/CV.pdf"
                    download
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    style={styles.resumeButton}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: '0 10px 30px rgba(201, 169, 98, 0.3)'
                    }}
                >
                    <Download size={16} />
                    Download Resume
                </motion.a>

                <div style={styles.divider} />

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    style={styles.quote}
                >
                    "Discipline is the bridge between goals and accomplishment."
                </motion.p>
            </div>
        </section>
    )
}
