import { motion } from 'framer-motion'

const milestones = [
    {
        year: '2026',
        title: 'Building Aurora',
        type: 'code',
        desc: 'Creating native Android apps to help users level up their lives. Focus on self-improvement tools.'
    },
    {
        year: '2025',
        title: '225lb Bench Press Goal',
        type: 'gym',
        desc: 'Pursuing elite-level strength. Discipline in the mind equals strength in the body.'
    },
    {
        year: '2024',
        title: 'Leo the Lion',
        type: 'code',
        desc: 'Built AI-powered pediatric health companion. Won recognition at healthcare hackathon.'
    },
    {
        year: '2023',
        title: 'University of Alberta',
        type: 'edu',
        desc: 'Started BSc. Computing Science. Deep dive into compiler design and AI systems.'
    }
]

export const Journey = () => {
    return (
        <section id="journey" className="bg-[var(--bg-secondary)]">
            <div className="max-w-4xl mx-auto w-full">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="section-label text-center"
                >
                    The Path
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title text-center"
                >
                    My Journey
                </motion.h2>

                <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[var(--text-muted)]/20 -translate-x-1/2 hidden md:block" />

                    <div className="space-y-16 md:space-y-24">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                                    <span className="text-[var(--accent-gold)] font-display text-3xl">{item.year}</span>
                                    <h3 className="text-2xl font-display text-[var(--text-cream)] mt-2 mb-3">{item.title}</h3>
                                    <p className="text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                                </div>

                                <div className="relative z-10 w-4 h-4 rounded-full bg-[var(--accent-gold)] ring-4 ring-[var(--bg-secondary)] hidden md:block" />

                                <div className="md:w-[calc(50%-2rem)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
