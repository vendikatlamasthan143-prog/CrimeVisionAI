import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH !== undefined ? process.env.NEXT_PUBLIC_BASE_PATH : '',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/crimevision-ai/:path*',
        destination: 'http://localhost:8090/server/crimevision-ai/api/crimevision-ai/:path*',
      },
      {
        source: '/api/crimevision-ai',
        destination: 'http://localhost:8090/server/crimevision-ai/api/crimevision-ai',
      },
    ];
  },
};

export default nextConfig;
