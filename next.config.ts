import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ['@prisma/client'],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL,
    SUPABASE_DIRECT_URL: process.env.SUPABASE_DIRECT_URL,
  },
  // Vercel serverless function config
  experimental: {
    // Allow larger body for upload (base64 data URLs can be big)
    // Default is 1MB, we raise to 15MB for safety
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;
