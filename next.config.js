const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'public/assets/scss'),
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      // Old /products (no slug) → redirect to /shop (301 permanent)
      {
        source: '/products',
        destination: '/shop',
        permanent: true,
      },
      // Old /products/:slug → redirect to /product-details/:slug (301 permanent, preserves SEO)
      {
        source: '/products/:path*',
        destination: '/product-details/:path*',
        permanent: true,
      },
      // Redirect old/missing indexed URLs to prevent 404s and preserve SEO
      {
        source: '/shipping',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/account',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
