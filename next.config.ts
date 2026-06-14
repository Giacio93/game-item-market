import type { NextConfig } from 'next';

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
} satisfies NextConfig;

export default nextConfig;