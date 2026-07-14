/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<your-project-id>.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;