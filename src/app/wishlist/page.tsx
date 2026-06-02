import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import WishlistArea from "@/components/wishlist/wishlist-area";
import Footer from "@/layout/footers/footer";

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Your saved digital subscriptions wishlist at ITechLK Store.',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Wishlist" subtitle="Wishlist" />
        {/* breadcrumb end */}

        {/* wishlist area start */}
        <WishlistArea />
        {/* wishlist area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
