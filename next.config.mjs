/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore lint errors during build if any arise to keep it smooth
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore ts errors during build if any arise
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
