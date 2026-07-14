'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        placeholder="John Doe"
                        required
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
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                    Phone Number
                </label>
                <input
                    type="tel"
                    className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="+254712345678"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                    Subject
                </label>
                <input
                    type="text"
                    className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="Inquiry about properties"
                    required
                />
            </div>

            <div className="mb-8">
                <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                    Message
                </label>
                <textarea
                    className="w-full h-40 bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                />
            </div>

            {submitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded text-green-300 text-sm"
                >
                    ✓ Message sent successfully! We'll get back to you soon.
                </motion.div>
            )}

            <button
                type="submit"
                className="w-full px-6 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-semibold rounded flex items-center justify-center gap-2 hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
                <Send size={20} />
                Send Message
            </button>
        </motion.form>
    )
}