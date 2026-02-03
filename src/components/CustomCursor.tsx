import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    const springX = useSpring(0, { stiffness: 500, damping: 28 })
    const springY = useSpring(0, { stiffness: 500, damping: 28 })

    useEffect(() => {
        // Detect touch device
        const checkTouchDevice = () => {
            setIsTouchDevice(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia('(pointer: coarse)').matches
            )
        }
        checkTouchDevice()

        const handleMouseMove = (e: MouseEvent) => {
            springX.set(e.clientX)
            springY.set(e.clientY)
            setIsVisible(true)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [springX, springY])

    // Don't render on touch devices
    if (isTouchDevice) return null

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                x: springX,
                y: springY,
                pointerEvents: 'none',
                zIndex: 99999,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.2s'
            }}
        >
            <img
                src="/peacockcursor.png"
                alt=""
                style={{
                    width: '40px',
                    height: 'auto',
                    transform: 'translate(-5px, -5px)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
            />
        </motion.div>
    )
}

