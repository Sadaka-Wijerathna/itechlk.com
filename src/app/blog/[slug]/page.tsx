import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blogs/blog-details/blog-details-area";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug: slug },
  });

  if (!blog) {
    return { title: 'Article Not Found' };
  }

  const title = `${blog.title} | ITechLK Blog`;
  const cleanDesc = blog.content 
    ? blog.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...'
    : 'Read the latest article on ITechLK Blog.';

  return {
    title,
    description: cleanDesc,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: cleanDesc,
      url: `/blog/${slug}`,
      type: 'article',
      images: blog.image ? [{ url: blog.image, alt: blog.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: cleanDesc,
      images: blog.image ? [blog.image] : [],
    },
  };
}

export default async function DynamicBlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  
  const blog = await prisma.blog.findUnique({
    where: { slug: slug },
    include: {
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itechlk.com';
  const cleanDesc = blog?.content 
    ? blog.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...'
    : 'Read the latest article on ITechLK Blog.';

  const blogJsonLd = blog ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.image ? (blog.image.startsWith('http') ? blog.image : `${siteUrl}${blog.image}`) : `${siteUrl}/assets/img/logo/logo.png`,
    datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ITechLK Store',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ITechLK Store',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/img/logo/logo.png`,
      },
    },
    description: cleanDesc,
  } : null;

  return (
    <Wrapper>
      {blog && blogJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
      )}
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb 
          title={blog ? blog.title : "Blog Details"} 
          subtitle="Blog Details" 
        />
        {/* breadcrumb end */}

        {/* blog details area start */}
        {blog ? (
          <BlogDetailsArea blog={blog as any} />
        ) : (
          <div className="pt-100 pb-100 text-center">Article not found.</div>
        )}
        {/* blog details area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
