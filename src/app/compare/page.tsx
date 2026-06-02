import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import CompareArea from "@/components/compare/compare-area";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare digital subscription products side by side at ITechLK Store.",
  robots: { index: false, follow: false },
};

export default function ComparePage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Compare" subtitle="Compare" />
        {/* breadcrumb end */}

        {/* compare area start */}
        <CompareArea />
        {/* compare area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
