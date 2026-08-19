import type { NextConfig } from 'next';
import { apiRewrites } from './src/rewrite-config';

const nextConfig: NextConfig = {
  async rewrites() {
    return apiRewrites;
  },
};

export default nextConfig;
