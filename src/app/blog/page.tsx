"use client";

import { useEffect, useState } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import BlogStandardArea from "@/components/blogs/blog-standard-area";
import IBlogType from "@/types/blog-d-t";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Only show active blogs
          setBlogs(data.filter((blog: IBlogType) => blog.active));
        } else {
          console.error("Blogs data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
        {loading ? (
          <div className="pt-100 pb-100 text-center">Loading blogs...</div>
        ) : (
          <BlogStandardArea blogs={blogs} />
        )}
        {/* blog standard area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}

