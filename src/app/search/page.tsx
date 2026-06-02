import { getDbProducts } from "@/lib/db-products";
import { Metadata } from "next";
import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import SearchArea from "@/components/search/search-area";

export const metadata: Metadata = {
  title: "Search Digital Subscriptions",
  description: "Search for digital subscriptions including AI tools, streaming, VPNs, and creative software at ITechLK Store.",
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const product_data = await getDbProducts();
  
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Search" subtitle="Search" />
        {/* breadcrumb end */}

        {/* search area start */}
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading search results...</p>
          </div>
        }>
          <SearchArea product_data={product_data}/>
        </Suspense>
        {/* search area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}