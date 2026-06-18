import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Njoki Homestays - Book Your Stay',
  description: 'Discover beautiful homestays in Nyahururu, Rumuruti, and Nanyuki',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-primary">
                Njoki Homestays
              </a>
              <div className="space-x-4">
                <a href="/" className="text-gray-600 hover:text-primary">
                  Browse
                </a>
                <a href="/bookings" className="text-gray-600 hover:text-primary">
                  My Bookings
                </a>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p>&copy; 2024 Njoki Homestays. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
