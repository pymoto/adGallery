import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19との互換性を向上
    reactCompiler: false,
  },
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
