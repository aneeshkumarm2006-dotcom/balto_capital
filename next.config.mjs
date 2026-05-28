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
      // Renamed properties — old slugs → new slugs.
      { source: '/residences/edmonton/royal-10746', destination: '/residences/edmonton/royal-lady',       permanent: true },
      { source: '/residences/edmonton/catalina',    destination: '/residences/edmonton/catalina-estates', permanent: true },
      { source: '/residences/edmonton/sky',         destination: '/residences/edmonton/sky-manor',        permanent: true },
      { source: '/residences/edmonton/cedar',       destination: '/residences/edmonton/cedar-manor',      permanent: true },
    ];
  },
};

export default nextConfig;
