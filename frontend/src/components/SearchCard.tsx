'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function SearchCard() {
    const [searchData, setSearchData] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: '',
    })

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchData.location) params.append('location', searchData.location)
        window.location.href = `/units?${params.toString()}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#111827] to-[#1C1917] border border-[#D4AF37]/20 rounded-lg p-8 shadow-2xl -mt-24 relative z-10 max-w-4xl mx-auto"
        >
            <h3 className="text-2xl font-serif font-bold text-white mb-8">
                Find Your Perfect Stay
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Location */}
                <div>
                    <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-2">
                        Destination
                    </label>
                    <select
                        value={searchData.location}
                        onChange={(e) =>
                            setSearchData({ ...searchData, location: e.target.value })
                        }
                        className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    >
                        <option value="">Select Location</option>
                        <option value="Nyahururu">Nyahururu</option>
                        <option value="Nanyuki">Nanyuki</option>
                        <option value="Rumuruti">Rumuruti</option>
                    </select>
                </div>

                {/* Check-in */}
                <div>
                    <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-2">
                        Check-in
                    </label>
                    <input
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) =>
                            setSearchData({ ...searchData, checkIn: e.target.value })
                        }
                        className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                {/* Check-out */}
                <div>
                    <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-2">
                        Check-out
                    </label>
                    <input
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) =>
                            setSearchData({ ...searchData, checkOut: e.target.value })
                        }
                        className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-sm uppercase tracking-wider text-[#D4AF37] mb-2">
                        Guests
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={searchData.guests}
                        onChange={(e) =>
                            setSearchData({ ...searchData, guests: e.target.value })
                        }
                        className="w-full bg-[#0F172A] border border-[#D4AF37]/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Number of guests"
                    />
                </div>
            </div>

            {/* Helper Text */}
            <p className="text-sm text-gray-400 mt-6 italic">
                ℹ️ Availability will be confirmed by our booking team within 24 hours
            </p>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="mt-8 w-full md:w-auto px-10 py-3 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-semibold rounded flex items-center justify-center gap-2 hover:bg-[#C8A45C] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
                <Search size={20} />
                Search Properties
            </button>
        </motion.div>
    )
}