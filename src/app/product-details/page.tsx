import { getDbProducts } from "@/lib/db-products";
import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import ProductDetailsUpper from "@/components/product-details/product-details-upper";
import ProductDetailsBottom from "@/components/product-details/product-details-bottom";
import RelatedProducts from "@/components/products/related-products";

export const metadata: Metadata = {
  title: "Shop Details Page",
};

export default async function ProductDetailsPage() {
  const product_data = await getDbProducts();
  const product = [...product_data][0];
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Product Details" subtitle="Product Details" />
        {/* breadcrumb end */}

        {/* shop details upper area start */}
        <section className="shop__area pb-65">
          <div className="shop__top grey-bg-6 pt-100 pb-90">
            <div className="container">
              <ProductDetailsUpper product={product} />
              <ProductDetailsBottom product={product}/>
            </div>
          </div>
        </section>
        {/* shop details upper area end */}

        {/* related products start */}
        <RelatedProducts product_data={product_data} product={product}/>
        {/* related products end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}

