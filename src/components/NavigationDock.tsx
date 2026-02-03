import { motion } from 'framer-motion'
import { Home, User, Code, Mail } from 'lucide-react'

export const NavigationDock = () => {
    const items = [
        { icon: <Home size={20} />, label: 'HOME' },
        { icon: <User size={20} />, label: 'PROFILE' },
        { icon: <Code size={20} />, label: 'PROJECTS' },
        { icon: <Mail size={20} />, label: 'CONTACT' },
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-panel)]/80 backdrop-blur-md border border-[var(--text-secondary)]/20 rounded-2xl shadow-2xl"
            >
                {items.map((item, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.2, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-xl hover:bg-[var(--accent-primary)]/10 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors relative group"
                        title={item.label}
                    >
                        {item.icon}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    )
}
