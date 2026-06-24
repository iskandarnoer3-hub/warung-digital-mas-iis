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
    // Allow longer timeout for AI chat
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;

// Vercel function timeout (in seconds) - applied via vercel.json
