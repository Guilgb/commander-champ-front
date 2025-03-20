/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cards.scryfall.io', 'c1.scryfall.com', 'c2.scryfall.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scryfall.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.scryfall.com',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'commander-500.vercel.app']
    }
  }
};

export default nextConfig;

