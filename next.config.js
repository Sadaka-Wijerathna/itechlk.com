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

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking — disallows site from being embedded in iframes on other domains
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limit referrer information sent to other sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Enforce HTTPS for 1 year (HSTS)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Disable unused browser features to reduce attack surface
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Basic XSS protection for older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
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

