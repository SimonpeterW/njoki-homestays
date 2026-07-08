'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SearchCard from '@/components/SearchCard'
import UnitCard from '@/components/UnitCard'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { fetchUnits } from '@/lib/api'

interface Unit {
  id: number
  name: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities?: string
}

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await fetchUnits()
        setUnits(data.slice(0, 3)) // Show first 3 units
      } catch (error) {
        console.error('Error loading units:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUnits()
  }, [])

  return (
    <main className="bg-[#0F172A] text-white">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Search Card */}
      <section className="bg-[#0F172A] py-16">
        <div className="container max-w-5xl mx-auto px-6">
          <SearchCard />
        </div>
      </section>

      {/* Featured Units */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Handpicked luxury accommodations for discerning travelers
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading properties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {units.map((unit, i) => (
                <UnitCard key={unit.id} unit={unit} index={i} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <a
              href="/units"
              className="inline-block px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] text-sm uppercase tracking-widest font-semibold rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              View All Properties
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#D4AF37] to-[#C8A45C] py-20">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
            Ready for Your Luxury Getaway?
          </h2>
          <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Browse our exclusive collection of premium accommodations and book your perfect stay today.
          </p>
          <a
            href="/units"
            className="inline-block px-10 py-4 bg-black text-[#D4AF37] text-sm uppercase tracking-widest font-semibold rounded hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Explore Properties
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}