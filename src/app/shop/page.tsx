import { getDbProducts } from "@/lib/db-products";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';
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
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Shop" subtitle="Shop" />
        {/* breadcrumb end */}

        {/* shop area start */}
        <ShopArea product_data={product_data} />
        {/* shop area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
