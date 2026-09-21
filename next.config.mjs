/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
