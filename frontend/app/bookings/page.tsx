'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createBooking } from '@/lib/api'
import { Check } from 'lucide-react'

export default function BookingPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        unit_id: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        special_requests: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState('')
    const [error, setError] = useState('')

    const steps = [
        { number: 1, title: 'Property & Dates' },
        { number: 2, title: 'Guest Information' },
        { number: 3, title: 'Confirmation' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (step < 3) {
            setStep(step + 1)
        } else {
            setLoading(true)
            try {
                const response = await createBooking(formData)
                if (response.success) {
                    setReferenceNumber(response.data.reference_number)
                    setSubmitted(true)
                } else {
                    setError(response.error || 'Booking failed')
                }
            } catch (err: any) {
                setError(err.error || 'An error occurred')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <main className="bg-[#0F172A] text-white min-h-screen">
            <Navbar />

            {/* Page Header */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-[#111827] to-[#0F172A]">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold mb-4"
                    >
                        Book Your Luxury Stay
                    </motion.h1>
                </div>
            </section>

            {/* Booking Form */}
            <section className="py-20">
                <div className="container max-w-2xl mx-auto px-6">
                    {!submitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8 md:p-12"
                        >
                            {/* Steps Indicator */}
                            <div className="flex justify-between mb-12">
                                {steps.map((s) => (
                                    <div
                                        key={s.number}
                                        className="flex items-center gap-4"
                                    >
                                        <motion.div
                                            animate={{
                                                backgroundColor:
                                                    s.number <= step ? '#D4AF37' : '#111827',
                                                borderColor:
                                                    s.number <= step ? '#D4AF37' : '#D4AF37/20',
                                            }}
                                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif font-bold text-lg"
                                        >
                                            {s.number <= step ? '✓' : s.number}
                                        </motion.div>
                                        <div className="hidden md:block">
                                            <p className="text-xs uppercase tracking-wider text-gray-400">
                                                Step {s.number}
                                            </p>
                                            <p className="font-serif font-bold">{s.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}

                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-serif font-bold mb-6">
                                            Select Property & Dates
                                        </h3>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Property ID
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.unit_id}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        unit_id: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter property ID"
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                    Check-in
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.check_in_date}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            check_in_date: e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                    Check-out
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.check_out_date}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            check_out_date: e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Number of Guests
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={formData.number_of_guests}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, number_of_guests: e.target.value })
                                                }
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-serif font-bold mb-6">
                                            Your Information
                                        </h3>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.guest_name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        guest_name: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.guest_email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, guest_email: e.target.value })
                                                }
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.guest_phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, guest_phone: e.target.value })
                                                }
                                                className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-3">
                                                Special Requests (Optional)
                                            </label>
                                            <textarea
                                                value={formData.special_requests}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        special_requests: e.target.value,
                                                    })
                                                }
                                                className="w-full h-28 bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                                                placeholder="Any special requests..."
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-serif font-bold mb-6">
                                            Confirm Your Booking
                                        </h3>

                                        <div className="bg-[#0F172A] border border-[#D4AF37]/20 rounded p-6 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Guest Name:</span>
                                                <span className="font-bold">{formData.guest_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="font-bold">{formData.guest_email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Check-in:</span>
                                                <span className="font-bold">{formData.check_in_date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Check-out:</span>
                                                <span className="font-bold">{formData.check_out_date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Guests:</span>
                                                <span className="font-bold">{formData.number_of_guests}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 bg-[#0F172A] border border-[#D4AF37]/20 rounded p-4">
                                            💳 Payment will be arranged after our team confirms availability.
                                        </p>
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 mt-8">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="flex-1 px-6 py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-sm uppercase tracking-wider font-semibold rounded hover:bg-[#D4AF37]/10 transition-all duration-300"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-wider font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : step === 3 ? 'Submit Booking' : 'Next'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-12 text-center"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                                    <Check className="text-green-400" size={40} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-serif font-bold mb-4">
                                Booking Request Submitted!
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Thank you for your booking request. Our team will confirm availability within 24 hours and send payment instructions to your email.
                            </p>
                            <p className="text-2xl font-serif font-bold text-[#D4AF37] mb-8">
                                Reference: {referenceNumber}
                            </p>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="/"
                                    className="px-8 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-wider font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300"
                                >
                                    Back to Home
                                </a>
                                <a
                                    href="https://wa.me/254712345678"
                                    className="px-8 py-4 border-2 border-green-500 text-green-400 text-sm uppercase tracking-wider font-semibold rounded hover:bg-green-500/10 transition-all duration-300"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}