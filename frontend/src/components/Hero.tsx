'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden pt-20">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(17, 24, 39, 0.7) 100%), url(/images/DSC_1359.JPG)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <span className="inline-block text-[#D4AF37] text-sm uppercase tracking-widest px-4 py-2 border border-[#D4AF37]/30 rounded-full">
                        ✨ Premium Luxury Stays
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 max-w-5xl leading-tight"
                >
                    Discover Luxury Stays Across Kenya
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 font-light"
                >
                    Experience carefully selected premium accommodations in Nyahururu, Nanyuki, and Rumuruti
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col md:flex-row gap-6 mb-20"
                >
                    <a
                        href="/units"
                        className="px-8 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        Browse Units
                    </a>
                    <a
                        href="/contact"
                        className="px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                    >
                        Contact Us
                    </a>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                >
                    {[
                        { icon: '⭐', text: '4.9 Rating' },
                        { icon: '👥', text: '500+ Guests' },
                        { icon: '✓', text: 'Verified' },
                        { icon: '🔒', text: 'Secure' },
                    ].map((badge, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <p className="text-sm text-gray-300 uppercase tracking-wider">
                                {badge.text}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <ChevronDown className="text-[#D4AF37]" size={32} />
            </motion.div>
        </section>
    )
}