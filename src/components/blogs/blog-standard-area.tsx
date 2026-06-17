"use client";

import usePagination from "@/hooks/use-pagination";
import IBlogType from "@/types/blog-d-t";
import BlogSidebar from "./blog-sidebar";
import Pagination from "@/ui/pagination";
import BlogPostboxItem from "./single-blog/blog-postbox-item";

// props type
type IProps = {
  blogs: IBlogType[];
  allBlogs?: IBlogType[];
  left_side?: boolean;
  no_sidebar?: boolean;
  blog_col?: string;
  blog_col_cls?: boolean;
  blog_3?: boolean;
};

const BlogStandardArea = ({blogs, allBlogs, left_side,no_sidebar,blog_col,blog_col_cls,blog_3}:IProps) => {
  const {currentItems,handlePageClick,pageCount} = usePagination<IBlogType>(blogs,blog_3?6:4);
  return (
    <section className="blog__area pt-100 pb-100">
      <div className="container">
        {!blog_col && (
          <div className="row">
            {left_side && !no_sidebar && (
              <div className="col-xl-3 col-lg-4">
                <BlogSidebar allBlogs={allBlogs || blogs} />
              </div>
            )}
            <div
              className={`col-xl-${left_side?"9":""} col-lg-8 ${no_sidebar?"offset-xl-2 offset-lg-2":""}`}
            >
              <div className="blog__wrapper">
                {currentItems &&
                  currentItems.map((blog, i) => (
                    <BlogPostboxItem key={i} blog={blog} />
                  ))}
              </div>

              <div className="row mt-35">
                <div className="col-xl-12">
                  <div className="shop-pagination-wrapper d-md-flex justify-content-between align-items-center">
                    <Pagination handlePageClick={handlePageClick} pageCount={pageCount}/>
                    <div className="shop__header-left">
                      <div className="show-text bottom">
                        <span>
                          Showing 1–{currentItems.length} of {blogs.length}{" "} results
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!left_side && !no_sidebar && (
              <div className="col-xl-3 col-lg-4 offset-xl-1">
                <BlogSidebar allBlogs={allBlogs || blogs} />
              </div>
            )}
          </div>
        )}
        {blog_col && (
          <div className="row">
            {currentItems &&
              currentItems.map((blog, i) => (
                <div key={i} className={`${blog_col}`}>
                  <BlogPostboxItem blog={blog} blog_col_cls={blog_col_cls} />
                </div>
              ))}
                <div className="row mt-35">
                <div className="col-xl-12">
                  <div className="shop-pagination-wrapper d-md-flex justify-content-between align-items-center">
                   <Pagination handlePageClick={handlePageClick} pageCount={pageCount}/>
                    <div className="shop__header-left">
                      <div className="show-text bottom">
                        <span>
                          Showing 1–{currentItems.length} of {blogs.length}{" "} results
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogStandardArea;
