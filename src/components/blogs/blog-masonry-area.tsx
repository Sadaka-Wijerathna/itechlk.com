'use client'
import Link from "next/link";
import blog_data from "@/data/blog-data";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";


const items = blog_data.filter(blog => blog.blog === 'blog-masonry');

const BlogTwoCalMasonryArea = () => {
  return (
    <>
      <section className="blog__area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 750: 2, }} >
              <Masonry gutter="25px">
                {items.map((item, index) => (
                  <div key={index} className="">
                    <div className="blog__item mb-60">
                      <div className="blog__thumb fix">
                        <Link href={`/blog-details/${item.id}`} className="w-img">
                            <img src={item.image || item.img} alt="blog" />
                        </Link>
                      </div>
                      <div className="blog__content">
                        <h4>
                          <Link href={`/blog-details/${item.id}`}>
                             {item.title}
                          </Link>
                        </h4>
                        <div className="blog__meta">
                          <span>By <a href="#">{item.author}</a></span>
                          <span>/ {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '')}</span>
                        </div>
                        <p>{item.desc || item.content?.substring(0, 100)}...</p>
                        <Link href={`/blog-details/${item.id}`} className="os-btn">
                           read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogTwoCalMasonryArea;