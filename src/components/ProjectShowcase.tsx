import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'

const projects = [
    {
        id: '01',
        name: 'C-Ray Engine',
        type: 'Graphics',
        desc: 'Physics-based ray tracer built from scratch. Implements BVH acceleration, Monte Carlo integration, and global illumination.',
        tags: ['C', 'Linux', 'Graphics'],
        link: 'https://github.com/ujjawalsuii/c-ray-engine'
    },
    {
        id: '02',
        name: 'Leo the Lion',
        type: 'AI Health',
        desc: 'Pediatric health companion using LLMs for symptom analysis and emotional support. Built for the University Health Hackathon.',
        tags: ['React', 'Python', 'FastAPI'],
        link: 'https://github.com/Gfewq/Team'
    },
    {
        id: '03',
        name: 'RISC-V Translator',
        type: 'Compiler',
        desc: 'Static binary translator converting RISC-V assembly to WebAssembly. Enables running low-level ASM on the web.',
        tags: ['C', 'WASM', 'Binary Encoding'],
        link: 'https://github.com/ujjawalsuii/rv-to-wasm'
    }
]

export const ProjectShowcase = () => {
    return (
        <section className="min-h-screen w-full py-24 px-4 md:px-20 bg-[var(--bg-cream)]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <span className="text-[var(--text-light)] uppercase tracking-widest text-sm mb-4 block">Selected Works</span>
                    <h2 className="text-5xl font-display italic text-[var(--accent-gold)]">Creation</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="group relative bg-[#fff] rounded-none p-8 border border-[var(--text-sage)]/10 hover:border-[var(--accent-gold)]/50 transition-colors duration-500 shadow-sm hover:shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-display text-4xl text-[var(--text-olive)]/10 group-hover:text-[var(--accent-gold)]/20 transition-colors">
                                    {project.id}
                                </span>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-full border border-[var(--text-sage)]/20 text-[var(--text-sage)] hover:bg-[var(--text-olive)] hover:text-[#fff] transition-all"
                                >
                                    <ArrowUpRight size={20} />
                                </a>
                            </div>

                            <h3 className="text-2xl font-display text-[var(--text-olive)] mb-3 group-hover:text-[var(--text-sage)] transition-colors">
                                {project.name}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs uppercase tracking-wider px-3 py-1 bg-[var(--bg-paper)] text-[var(--text-light)] rounded-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-[var(--text-light)] text-sm leading-relaxed mb-6 font-body">
                                {project.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
