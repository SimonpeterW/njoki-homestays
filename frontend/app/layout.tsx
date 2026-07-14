import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NJOKI Homestays - Premium Luxury Accommodation in Kenya',
  description: 'Discover luxury vacation rentals in Nyahururu, Nanyuki, and Rumuruti. Book premium accommodations with Njoki Homestays.',
  keywords: 'luxury vacation rental, Kenya, accommodation, booking, premium stays',
  openGraph: {
    title: 'NJOKI Homestays - Premium Luxury Stays',
    description: 'Discover carefully selected premium accommodations across Kenya',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}