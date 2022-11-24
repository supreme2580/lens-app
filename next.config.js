/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lens.infura-ipfs.io"],
    remotePatterns: [
      {
        protocol: "ipfs",
        hostname: "**"
      }
    ]
  }
}

module.exports = nextConfig
