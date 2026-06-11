import type { Metadata } from 'next';
import './globals.scss';
import { Providers } from '@/redux/provider';
import { Poppins } from "next/font/google";
import { VideoProvider } from '@/provider/VideoProvider';
import NextAuthProvider from '@/provider/NextAuthProvider';
import SmoothScrollProvider from '@/provider/SmoothScrollProvider';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itechlk.com';

export const viewport = {
  themeColor: '#D55433',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ITechLK Store | Premium Digital Subscriptions in Sri Lanka',
    template: '%s | ITechLK Store',
  },
  description: 'Buy premium digital subscriptions in Sri Lanka — AI Tools, Streaming, VPNs, Creative Software, and more. Fast delivery, best prices, reliable service.',
  keywords: ['digital subscriptions', 'Sri Lanka', 'AI tools', 'streaming', 'VPN', 'software subscriptions', 'ITechLK', 'buy subscriptions online'],
  authors: [{ name: 'ITechLK Store', url: siteUrl }],
  creator: 'ITechLK Store',
  publisher: 'ITechLK Store',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'ITechLK Store',
    title: 'ITechLK Store | Premium Digital Subscriptions in Sri Lanka',
    description: 'Buy premium digital subscriptions in Sri Lanka — AI Tools, Streaming, VPNs, Creative Software, and more.',
    images: [
      {
        url: '/assets/img/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'ITechLK Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ITechLK Store | Premium Digital Subscriptions in Sri Lanka',
    description: 'Buy premium digital subscriptions in Sri Lanka — AI Tools, Streaming, VPNs, Creative Software, and more.',
    images: ['/assets/img/logo/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

const poppins = Poppins({
  weight: ['300', "400", "500", "600", "700", "800", '900'],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.variable}`}>
        <NextAuthProvider>
          <CurrencyProvider>
            <Providers>
              <VideoProvider>
                <SmoothScrollProvider>
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </SmoothScrollProvider>
              </VideoProvider>
            </Providers>
          </CurrencyProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
