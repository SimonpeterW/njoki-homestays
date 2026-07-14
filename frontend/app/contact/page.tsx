'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
    return (
        <main className="bg-[#0F172A] text-white">
            <Navbar />

            {/* Page Header */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-[#111827] to-[#0F172A]">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold mb-4"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg"
                    >
                        We're here to help and answer any question you might have.
                    </motion.p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8">
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <Phone className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif font-bold text-white mb-2">
                                            Phone
                                        </h4>
                                        <a
                                            href="tel:+254712345678"
                                            className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                                        >
                                            +254 712 345 678
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 mb-8">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <Mail className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif font-bold text-white mb-2">
                                            Email
                                        </h4>
                                        <a
                                            href="mailto:info@njoki-homestays.com"
                                            className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                                        >
                                            info@njoki-homestays.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <MapPin className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif font-bold text-white mb-2">
                                            Location
                                        </h4>
                                        <p className="text-gray-400">Kenya</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <a
                                href="https://wa.me/254712345678"
                                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-green-600 text-white text-sm uppercase tracking-wider font-semibold rounded hover:bg-green-700 transition-all duration-300"
                            >
                                💬 Chat on WhatsApp
                            </a>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8">
                                <h2 className="text-2xl font-serif font-bold text-white mb-8">
                                    Send us a Message
                                </h2>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            placeholder="+254712345678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            placeholder="Inquiry about properties"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                            Message
                                        </label>
                                        <textarea
                                            className="w-full h-40 bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-6 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}