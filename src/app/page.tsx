import { getDbProducts } from "@/lib/db-products";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';
// internal
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import HeroSliderOne from "@/components/hero-banner/hero-banner-one";
import TrendingProducts from "@/components/products/trending-products";
import SubscribeArea from "@/components/subscribe-area";
import BannerProducts from "@/components/products/banner-products";
import SmSliderProducts from "@/components/products/sm-slider-products";
import BlogArea from "@/components/blogs/blog-area";
import Footer from "@/layout/footers/footer";

export const metadata: Metadata = {
  title: 'Premium Digital Subscriptions in Sri Lanka',
  description: 'Buy AI Tools, Streaming, VPN, Creative Software & more digital subscriptions in Sri Lanka. Fast delivery, lowest prices, trusted by thousands.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ITechLK Store | Premium Digital Subscriptions in Sri Lanka',
    description: 'Buy AI Tools, Streaming, VPN, Creative Software & more digital subscriptions in Sri Lanka.',
    url: '/',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://itechlk.com/#organization',
      name: 'ITechLK Store',
      url: 'https://itechlk.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://itechlk.com/assets/img/logo/logo.png',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English', 'Sinhala'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://itechlk.com/#website',
      url: 'https://itechlk.com',
      name: 'ITechLK Store',
      publisher: { '@id': 'https://itechlk.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://itechlk.com/shop?search={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default async function HomePageFive() {
  const product_data = await getDbProducts();

  return (
    <Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* hero banner start */}
        <HeroSliderOne style_2={true} slider_cls="3" />
        {/* hero banner end */}

          {/* trending products start */}
          <TrendingProducts products={product_data} />
          {/* trending products end */}

          {/* product banner excluded */}

          {/* offer slider products start */}
          <section className="product__offer pt-115 pb-50 grey-bg">
            <div className="container">
              <SmSliderProducts products={product_data} />
            </div>
          </section>
          {/* offer slider products end */}

          {/* blog area start */}
          <BlogArea style_2={true} />
          {/* blog area end */}

          {/* subscribe area start */}
          <SubscribeArea />
          {/* subscribe area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
