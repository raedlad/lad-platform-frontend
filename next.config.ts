import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors
  },
};

export default nextConfig;
