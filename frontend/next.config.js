/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'njoki-homestays.com'],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
