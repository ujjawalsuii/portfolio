import { motion } from 'framer-motion'

const photos = [
    { id: 1, color: '#C5A065', caption: 'Family' },
    { id: 2, color: '#556B2F', caption: 'Travels' },
    { id: 3, color: '#A65D57', caption: 'Moments' },
]

export const LoveGallery = () => {
    return (
        <section className="w-full py-24 px-4 bg-[var(--bg-paper)] overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-display italic text-[var(--text-olive)]">Moments of Grace</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                {photos.map((photo, i) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{
                            scale: 1.05,
                            rotateZ: Math.random() * 4 - 2,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                        }}
                        className="w-64 h-80 bg-white p-3 shadow-md relative transform cursor-pointer"
                    >
                        <div
                            className="w-full h-64 bg-gray-200"
                            style={{ backgroundColor: photo.color }} // Placeholder color
                        >
                            {/* Image would go here */}
                        </div>
                        <div className="mt-4 text-center font-display text-[var(--text-olive)] italic">
                            {photo.caption}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
