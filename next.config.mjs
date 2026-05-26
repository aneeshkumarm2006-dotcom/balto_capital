/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/contact', destination: '/inquire', permanent: true },
      { source: '/inquiry', destination: '/inquire', permanent: true },
    ];
  },
};

export default nextConfig;
