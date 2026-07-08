'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Users, Bed, Bath } from 'lucide-react'

interface Unit {
  id: number
  name: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  image?: string
  amenities?: string
  rating?: number
  reviews?: number
}

export default function UnitCard({ unit, index = 0 }: { unit: Unit; index?: number }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const amenityIcons = {
    wifi: '📶',
    parking: '🅿️',
    kitchen: '🍳',
    breakfast: '🥐',
    pool: '🏊',
    garden: '🌳',
    gym: '💪',
    tv: '🎬',
    ac: '❄️',
    heating: '🔥',
  }

  const amenities = unit.amenities
    ? unit.amenities.split(',').map((a) => a.trim())
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="bg-[#111827] rounded-lg overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-gray-900">
          {unit.image ? (
            <Image
              src={unit.image}
              alt={unit.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10">
              <span className="text-4xl">🏠</span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <p className="text-[#D4AF37] text-2xl font-serif font-bold">
              KES {parseFloat(unit.price).toLocaleString()}
            </p>
            <p className="text-gray-300 text-xs uppercase tracking-wider">
              Per Night
            </p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/80 backdrop-blur hover:bg-[#D4AF37]/80 transition-all duration-300"
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white'}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Link href={`/units/${unit.id}`}>
            <h3 className="text-xl font-serif font-bold text-white mb-2 hover:text-[#D4AF37] transition-colors">
              {unit.name}
            </h3>
          </Link>

          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">
            📍 {unit.location}
          </p>

          {/* Quick Features */}
          <div className="flex gap-6 mb-6 pb-6 border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={16} />
              <span className="text-sm">{unit.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Bed size={16} />
              <span className="text-sm">{unit.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Bath size={16} />
              <span className="text-sm">{unit.bathrooms} Baths</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-xl"
                title={amenity}
              >
                {amenityIcons[amenity as keyof typeof amenityIcons] || '✓'}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-400 self-center">
                +{amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/units/${unit.id}`}
              className="flex-1 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-center"
            >
              View Details
            </Link>
            <Link
              href="/booking"
              className="flex-1 px-4 py-2 bg-[#D4AF37] text-black text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#C8A45C] transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}