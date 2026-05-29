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
      { source: '/residences/edmonton/copper',      destination: '/residences/edmonton/copper-manor',     permanent: true },
      { source: '/residences/edmonton/grandview',   destination: '/residences/edmonton/grandview-manor',  permanent: true },
      { source: '/residences/edmonton/courts',      destination: '/residences/edmonton/courts-manor',     permanent: true },
      { source: '/residences/edmonton/oakwood',     destination: '/residences/edmonton/oakwood-manor',    permanent: true },
      { source: '/residences/edmonton/balwin',      destination: '/residences/edmonton/balwin-manor',     permanent: true },
      { source: '/residences/edmonton/royal-10215', destination: '/residences/edmonton/royal-manor',      permanent: true },
    ];
  },
};

export default nextConfig;
