import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogStandardArea from "@/components/blogs/blog-standard-area";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides on Digital Subscriptions",
  description: "Read the latest tips, guides, and news about digital subscriptions, AI tools, streaming services, and software in Sri Lanka from ITechLK Store.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | ITechLK Store",
    description: "Tips, guides, and news about digital subscriptions, AI tools, and streaming in Sri Lanka.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
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
        <BlogStandardArea />
        {/* blog standard area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
