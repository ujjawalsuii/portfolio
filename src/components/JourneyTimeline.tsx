import { motion } from 'framer-motion'
import { Briefcase, Dumbbell, Code, GraduationCap } from 'lucide-react'

const milestones = [
    {
        year: '2026',
        title: 'Senior Systems Architect',
        type: 'career',
        icon: <Briefcase size={20} />,
        desc: 'Leading high-performance middleware teams. Architecting low-latency trading systems.'
    },
    {
        year: '2025',
        title: '120kg Bench Press',
        type: 'gym',
        icon: <Dumbbell size={20} />,
        desc: 'Achieved new PR in powerlifting. Discipline in the mind equals strength in the body.'
    },
    {
        year: '2024',
        title: 'Full Stack Evolution',
        type: 'code',
        icon: <Code size={20} />,
        desc: 'Mastered React/Vite ecosystem while maintaining C++ roots. Built Leo the Lion.'
    },
    {
        year: '2023',
        title: 'University of Alberta',
        type: 'edu',
        icon: <GraduationCap size={20} />,
        desc: 'BSc. Computing Science. Focus on Compiler Design and AI Systems.'
    }
]

export const JourneyTimeline = () => {
    return (
        <section className="min-h-screen w-full py-24 px-4 relative flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-[var(--text-light)]/20" />

            <h2 className="text-4xl font-display italic text-[var(--accent-gold)] mb-20 relative z-10 bg-[var(--bg-cream)] px-6">
                The Path
            </h2>

            <div className="max-w-4xl w-full flex flex-col gap-12 relative z-10">
                {milestones.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                        <div className="w-1/2 text-right">
                            {index % 2 === 0 && (
                                <>
                                    <span className="text-[var(--accent-gold)] font-display text-xl">{item.year}</span>
                                    <h3 className="text-2xl font-body font-bold text-[var(--text-olive)] mt-1">{item.title}</h3>
                                    <p className="text-[var(--text-light)] mt-2 text-sm leading-relaxed">{item.desc}</p>
                                </>
                            )}
                        </div>

                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-[var(--text-sage)] bg-[var(--bg-cream)] text-[var(--text-olive)] shadow-lg z-20">
                            {item.icon}
                        </div>

                        <div className="w-1/2 text-left">
                            {index % 2 !== 0 && (
                                <>
                                    <span className="text-[var(--accent-gold)] font-display text-xl">{item.year}</span>
                                    <h3 className="text-2xl font-body font-bold text-[var(--text-olive)] mt-1">{item.title}</h3>
                                    <p className="text-[var(--text-light)] mt-2 text-sm leading-relaxed">{item.desc}</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
