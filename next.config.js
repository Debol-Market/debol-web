/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
    ],
  },
  webpack5: false,
};

module.exports = nextConfig;
