import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itechlk.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/account',
          '/checkout',
          '/cart',
          '/verify-email',
          '/compare',
          '/dashboard',
          '/login',
          '/register',
          '/wishlist',
          '/forgot-password',
          '/reset-password',
        ],
        crawlDelay: 1,
      },
      // Block AI crawlers that scrape content without permission
      {
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'CCBot',
          'PerplexityBot',
          'Bytespider',
          'ClaudeBot',
          'Applebot-Extended',
          'FacebookBot',
          'anthropic-ai',
          'cohere-ai',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
