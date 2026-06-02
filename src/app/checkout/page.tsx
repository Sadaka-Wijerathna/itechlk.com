import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import CheckoutArea from "@/components/checkout/checkout-area";

export const metadata: Metadata = {
  title: "Checkout Page",
};

export default function CheckoutPage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Checkout" subtitle="Checkout" />
        {/* breadcrumb end */}

        {/* checkout area start */}
        <CheckoutArea />
        {/* checkout area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
