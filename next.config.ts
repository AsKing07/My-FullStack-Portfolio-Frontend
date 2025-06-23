import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Add supported experimental options here if needed
  },
  images:{
     domains: [
      'github.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  }
};

export default nextConfig;
