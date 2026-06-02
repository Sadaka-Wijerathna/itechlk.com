import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import CartArea from "@/components/cart/cart-area";

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your selected digital subscriptions before checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Your Cart" subtitle="Cart" />
        {/* breadcrumb end */}

        {/* cart area start */}
        <CartArea />
        {/* cart area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
