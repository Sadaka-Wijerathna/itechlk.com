import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import blog_data from "@/data/blog-data";
import BlogDetailsArea from "@/components/blogs/blog-details/blog-details-area";

export const metadata: Metadata = {
  title: "Blog Details — Digital Subscription Guides",
  description: "In-depth articles and guides about digital subscriptions, AI tools, streaming services, VPNs, and software available in Sri Lanka at ITechLK Store.",
  alternates: { canonical: "/blog-details" },
  openGraph: {
    title: "Blog Details | ITechLK Store",
    description: "In-depth guides about digital subscriptions, AI tools, streaming, and software in Sri Lanka.",
    url: "/blog-details",
    type: "article",
  },
};

export default function BlogDetailsPage() {
  const blog = blog_data.filter((b) => b.blog === "blog-standard")[0];
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Blog Details" subtitle="Blog Details" />
        {/* breadcrumb end */}

        {/* blog details area start */}
        <BlogDetailsArea blog={blog} />
        {/* blog details area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
