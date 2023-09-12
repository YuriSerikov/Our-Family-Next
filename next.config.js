/** @type {import('next').NextConfig} */

const nextConfig = {
  /* async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `http://localhost:5501/api/:slug*`,
      },
    ]
  }, */

  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
}

module.exports = nextConfig
