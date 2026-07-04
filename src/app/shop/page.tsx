import { Suspense } from "react";
import { getDbProducts } from "@/lib/db-products";
import { Metadata } from "next";

// Revalidate every hour — allows a fast cached version for Googlebot
// (force-dynamic was preventing static caching and slowing page delivery)
export const revalidate = 3600;
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import ShopArea from "@/components/shop/shop-area";

export const metadata: Metadata = {
  title: 'Shop Digital Subscriptions',
  description: 'Browse all digital subscriptions — AI Tools, Streaming, VPNs, Creative & Editing Software, Work & OS tools. Best prices in Sri Lanka.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop Digital Subscriptions | ITechLK Store',
    description: 'Browse all digital subscriptions — AI Tools, Streaming, VPNs, Creative & Editing Software. Best prices in Sri Lanka.',
    url: '/shop',
    type: 'website',
  },
};

export default async function ShopPage() {
  const product_data = await getDbProducts();
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo hideCart={true} />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Shop" subtitle="Shop" />
        {/* breadcrumb end */}

        {/* shop area start — wrapped in Suspense because ShopArea uses useSearchParams() */}
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <ShopArea product_data={product_data} />
        </Suspense>
        {/* shop area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
