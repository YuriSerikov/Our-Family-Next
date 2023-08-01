/** @type {import('next').NextConfig} */
//const API_URL = process.env.API_URL

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `http://localhost:5500/api/:slug*`,
      },
    ]
  },
  /* output: 'export',
  distDir: 'dist',
  images: { unoptimized: true }, */
}

module.exports = nextConfig
