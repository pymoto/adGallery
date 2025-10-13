import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19との互換性を向上
    reactCompiler: false,
  },
  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'onshdnsrvqkouuzojjpk.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  // Webpack設定を調整
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
