import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogStandardArea from "@/components/blogs/blog-standard-area";

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itechlk.com';

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Read the latest updates, guides, and articles about digital subscriptions, software reviews, and tech in Sri Lanka at ITechLK.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'News & Blog | ITechLK Store',
    description: 'Read the latest updates, guides, and articles about digital subscriptions, software reviews, and tech in Sri Lanka.',
    url: '/blog',
    type: 'website',
    images: [{ url: `${siteUrl}/assets/img/logo/logo.png`, width: 1200, height: 630, alt: 'ITechLK Store Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Blog | ITechLK Store',
    description: 'Read the latest updates, guides, and articles about digital subscriptions, software reviews, and tech in Sri Lanka.',
    images: [`${siteUrl}/assets/img/logo/logo.png`],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Our Blog', item: `${siteUrl}/blog` },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="News &amp; Blog" subtitle="Our Blog" />
        {/* breadcrumb end */}

        {/* blog standard area start — allBlogs feeds the sidebar server-side */}
        <BlogStandardArea blogs={serializedBlogs} allBlogs={serializedBlogs} />
        {/* blog standard area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
