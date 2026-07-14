'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/constants'

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-24 bg-[#111827]">
            <div className="container max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Everything you need to know about booking with us
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#0F172A] border border-[#D4AF37]/20 rounded-lg overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between hover:bg-[#111827] transition-colors duration-300"
                            >
                                <h3 className="text-lg font-serif font-bold text-white text-left">
                                    {item.question}
                                </h3>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 ml-4"
                                >
                                    <ChevronDown size={24} className="text-[#D4AF37]" />
                                </motion.div>
                            </button>

                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? 'auto' : 0,
                                    opacity: openIndex === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-8 py-6 border-t border-[#D4AF37]/20 bg-[#111827]/50">
                                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-400 mb-6">
                        Still have questions? Our team is here to help.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                    >
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </section>
    )
}