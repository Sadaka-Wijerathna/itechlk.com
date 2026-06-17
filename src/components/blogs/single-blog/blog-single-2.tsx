import Image from "next/image";
import Link from "next/link";
import IBlogType from "@/types/blog-d-t";

const BlogSingleTwo = ({ blog }: { blog: IBlogType }) => {
  return (
    <div key={blog.id} className="blog__slider-item">
      <div className="blog-thumb m-img">
        <Image src={blog.image || blog.img || ''} alt={blog.title} width={543} height={543} />
        <Link href={`/blog-details/${blog.id}`} className="btn">
          <i className="fa fa-link"></i>
        </Link>
      </div>
      <div className="blog__post-content">
        <div className="blog__wrapper">
          <h5 className="blog__post-title">
            <Link href={`/blog-details/${blog.id}`}>{blog.title}</Link>
          </h5>
          <div className="article-meta d-flex justify-content-center">
            <span className="article-author">
              <span>By</span> {blog.author}
            </span>
            <span> /</span>
            <span className="article-publish">
              <i className="fa fa-calendar-o"></i>
              {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSingleTwo;
