import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogStandardArea from "@/components/blogs/blog-standard-area";

export const metadata: Metadata = {
  title: "Blog Page",
};

export default function BlogLeftSidePage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="News & Blog" subtitle="Blog Standard" />
        {/* breadcrumb end */}

        {/* blog standard area start */}
        <BlogStandardArea left_side={true} />
        {/* blog standard area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
