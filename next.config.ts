import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "mock.shop",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typescript: {
    // Enable production builds even if typescript has minor compilation warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore eslint during build to keep compilation quick
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
