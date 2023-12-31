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
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://debolpackages.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
