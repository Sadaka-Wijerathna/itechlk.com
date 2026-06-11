import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogStandardArea from "@/components/blogs/blog-standard-area";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Read the latest updates, guides, and articles about digital subscriptions, software reviews, and tech in Sri Lanka at ITechLK.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'News & Blog | ITechLK Store',
    description: 'Read the latest updates, guides, and articles about digital subscriptions, software reviews, and tech in Sri Lanka.',
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Date objects so they can be safely passed to Client Component
  const serializedBlogs = JSON.parse(JSON.stringify(blogs));

  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="News & Blog" subtitle="Our Blog" />
        {/* breadcrumb end */}

        {/* blog standard area start */}
        <BlogStandardArea blogs={serializedBlogs} />
        {/* blog standard area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}

