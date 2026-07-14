'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerSections = [
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Contact', href: '/contact' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
            ],
        },
        {
            title: 'Properties',
            links: [
                { name: 'All Units', href: '/units' },
                { name: 'Nyahururu', href: '/units' },
                { name: 'Nanyuki', href: '/units' },
                { name: 'Rumuruti', href: '/units' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'FAQ', href: '#' },
                { name: 'Booking Help', href: '#' },
                { name: 'Policies', href: '#' },
                { name: 'Safety', href: '#' },
            ],
        },
    ]

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
    ]

    return (
        <footer className="bg-[#0F172A] border-t border-[#D4AF37]/20">
            <div className="container max-w-6xl mx-auto px-6 py-20">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl font-serif font-bold text-[#D4AF37] mb-4">
                            NJOKI
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Premium luxury accommodations across Kenya
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Phone size={18} />
                                <a href="tel:+254712345678" className="hover:text-[#D4AF37] transition-colors">
                                    +254 712 345 678
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail size={18} />
                                <a href="mailto:info@njoki-homestays.com" className="hover:text-[#D4AF37] transition-colors">
                                    info@njoki-homestays.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin size={18} />
                                <span>Kenya</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    {footerSections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <h4 className="text-lg font-serif font-bold text-white mb-6">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm uppercase tracking-wider"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-[#111827] to-[#1C1917] border border-[#D4AF37]/20 rounded-lg p-8 mb-16"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h4 className="text-2xl font-serif font-bold text-white mb-2">
                                Subscribe to Our Newsletter
                            </h4>
                            <p className="text-gray-400">
                                Get exclusive offers and updates on luxury stays
                            </p>
                        </div>
                        <form className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-3 bg-[#0F172A] border border-[#D4AF37]/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#D4AF37] text-black text-sm uppercase tracking-wider font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Bottom Section */}
                <div className="border-t border-[#D4AF37]/20 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Social Links */}
                        <div className="flex items-center justify-center md:justify-start gap-6">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="p-2 hover:bg-[#D4AF37]/20 rounded-full transition-all duration-300"
                                    >
                                        <Icon size={20} className="text-[#D4AF37]" />
                                    </a>
                                )
                            })}
                        </div>

                        {/* Copyright */}
                        <p className="text-center text-gray-400 text-sm">
                            © {currentYear} Njoki Homestays. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
                            <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}