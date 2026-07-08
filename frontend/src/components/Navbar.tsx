'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setIsScrolled(window.scrollY > 50)
        })
    }

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Units', href: '/units' },
        { name: 'About', href: '#' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <div className="container max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <h1 className="text-3xl font-serif font-bold text-[#D4AF37]">
                        NJOKI
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                        Luxury Stays
                    </p>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm uppercase tracking-wider text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://wa.me/254712345678"
                        className="p-2 rounded-full hover:bg-[#D4AF37]/20 transition-colors"
                        title="WhatsApp"
                    >
                        💬
                    </a>
                    <a
                        href="tel:+254712345678"
                        className="p-2 rounded-full hover:bg-[#D4AF37]/20 transition-colors"
                        title="Call"
                    >
                        📞
                    </a>
                    <Link
                        href="/booking"
                        className="px-6 py-2 bg-[#D4AF37] text-black text-sm uppercase tracking-wider font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#D4AF37]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-black/95 border-t border-[#D4AF37]/20"
                >
                    <div className="flex flex-col p-6 gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm uppercase tracking-wider text-gray-300 hover:text-[#D4AF37] transition-colors py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="px-6 py-3 bg-[#D4AF37] text-black text-sm uppercase tracking-wider font-semibold rounded text-center"
                            onClick={() => setIsOpen(false)}
                        >
                            Book Now
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}