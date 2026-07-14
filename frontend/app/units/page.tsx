'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { fetchUnit, getReviews } from '@/lib/api'
import { Star } from 'lucide-react'

interface Unit {
    id: number
    name: string
    description?: string
    location: string
    price: string
    bedrooms: number
    bathrooms: number
    maxGuests: number
    amenities?: string
    image?: string
}

interface Review {
    id: number
    guest_name: string
    rating: number
    comment?: string
    created_at?: string
}

export default function UnitDetail() {
    const params = useParams()
    const id = parseInt(params.id as string)

    const [unit, setUnit] = useState<Unit | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [averageRating, setAverageRating] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            try {
                const unitData = await fetchUnit(id)
                setUnit(unitData)

                const reviewsData = await getReviews(id)
                setReviews(reviewsData.reviews || [])
                setAverageRating(parseFloat(reviewsData.average_rating) || 0)
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [id])

    if (loading) {
        return (
            <main className="bg-[#0F172A] text-white min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-gray-400">Loading property...</p>
                </div>
                <Footer />
            </main>
        )
    }

    if (!unit) {
        return (
            <main className="bg-[#0F172A] text-white min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-gray-400">Property not found</p>
                </div>
                <Footer />
            </main>
        )
    }

    const amenitiesList = unit.amenities
        ? unit.amenities.split(',').map((a) => a.trim())
        : []

    return (
        <main className="bg-[#0F172A] text-white">
            <Navbar />

            {/* Hero Image */}
            <section className="pt-20 h-96 bg-gray-900 relative overflow-hidden">
                {unit.image ? (
                    <img
                        src={unit.image}
                        alt={unit.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10">
                        <span className="text-8xl">🏠</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2"
                        >
                            <h1 className="text-5xl font-serif font-bold mb-4">{unit.name}</h1>
                            <p className="text-[#D4AF37] text-lg uppercase tracking-wider mb-8">
                                📍 {unit.location}
                            </p>

                            {/* Description */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">About This Property</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    {unit.description || `Beautiful luxury property located in ${unit.location}. Perfect for your next getaway.`}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8 mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-6">Property Features</h2>
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <p className="text-4xl font-serif font-bold text-[#D4AF37]">
                                            {unit.bedrooms}
                                        </p>
                                        <p className="text-gray-400 text-sm uppercase tracking-wider">
                                            Bedrooms
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-serif font-bold text-[#D4AF37]">
                                            {unit.bathrooms}
                                        </p>
                                        <p className="text-gray-400 text-sm uppercase tracking-wider">
                                            Bathrooms
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-serif font-bold text-[#D4AF37]">
                                            {unit.maxGuests}
                                        </p>
                                        <p className="text-gray-400 text-sm uppercase tracking-wider">
                                            Guests
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            {amenitiesList.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-serif font-bold mb-6">Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {amenitiesList.map((amenity, i) => (
                                            <div
                                                key={i}
                                                className="bg-[#111827] border border-[#D4AF37]/20 rounded p-4 text-center"
                                            >
                                                <p className="text-xl mb-2">✓</p>
                                                <p className="text-gray-300 text-sm">{amenity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-6">Guest Reviews</h2>

                                {reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div>
                                                <p className="text-5xl font-serif font-bold text-[#D4AF37]">
                                                    {averageRating.toFixed(1)}
                                                </p>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < Math.round(averageRating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Based on {reviews.length} reviews
                                                </p>
                                            </div>
                                        </div>

                                        {reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-6"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-semibold">{review.guest_name}</p>
                                                        <div className="flex gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < review.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {review.created_at
                                                            ? new Date(review.created_at).toLocaleDateString()
                                                            : ''}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Booking Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-[#111827] border border-[#D4AF37]/20 rounded-lg p-8 sticky top-24">
                                <p className="text-4xl font-serif font-bold text-[#D4AF37] mb-2">
                                    KES {parseFloat(unit.price).toLocaleString()}
                                </p>
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-8">
                                    Per Night
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-[#0F172A] border border-[#D4AF37]/20 rounded">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                            Capacity
                                        </p>
                                        <p className="font-semibold">Up to {unit.maxGuests} guests</p>
                                    </div>

                                    <div className="p-4 bg-[#0F172A] border border-[#D4AF37]/20 rounded">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                            Layout
                                        </p>
                                        <p className="font-semibold">
                                            {unit.bedrooms} Bed{unit.bedrooms > 1 ? 's' : ''} •{' '}
                                            {unit.bathrooms} Bath{unit.bathrooms > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href="/booking"
                                    className="w-full px-6 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block text-center mb-4"
                                >
                                    Book Now
                                </a>

                                <a
                                    href="https://wa.me/254712345678"
                                    className="w-full px-6 py-4 border-2 border-green-500 text-green-400 text-sm uppercase tracking-widest font-semibold rounded hover:bg-green-500/10 transition-all duration-300 block text-center"
                                >
                                    WhatsApp Inquiry
                                </a>

                                <p className="text-xs text-gray-400 text-center mt-6">
                                    Availability confirmed after payment
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}