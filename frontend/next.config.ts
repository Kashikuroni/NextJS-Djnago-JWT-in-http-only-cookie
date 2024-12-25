import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: Disables ESLint during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
