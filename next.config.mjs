/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow importing JSON files (data/cases.json)
  experimental: {
    turbo: {
      rules: {},
    },
  },
  // Suppress ioredis warnings about eval in edge runtime
  serverExternalPackages: ["ioredis"],
}

export default nextConfig
