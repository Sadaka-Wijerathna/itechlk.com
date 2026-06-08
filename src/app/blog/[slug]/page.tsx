"use client";

import { useEffect, useState, use } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blogs/blog-details/blog-details-area";
import IBlogType from "@/types/blog-d-t";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DynamicBlogDetailsPage({ params }: Props) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<IBlogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  return (
    <Wrapper>
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
        {loading ? (
          <div className="pt-100 pb-100 text-center">Loading article...</div>
        ) : blog ? (
          <BlogDetailsArea blog={blog} />
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
