import Link from "next/link";
import blog_data from "@/data/blog-data";
import IBlogType from "@/types/blog-d-t";
import Image from "next/image";

// img style 
const imgStyle = {
  width:'100%',
  height:'100%'
}

// prop type
type IProps = {
  blog: IBlogType;
};

const RelatedBlogs = ({ blog }: IProps) => {
  const related_blogs = blog_data.slice(0,2);
  return (
    <div className="postbox__related-item">
      <div className="row">
        {related_blogs.map((blog, index) => (
          <div key={index} className="col-xl-6 col-lg-6 col-md-6">
            <div className="blog__item mb-30">
              <div className="blog__thumb fix">
                <Link href={`/blog/${blog.slug || blog.id}`} className="w-img">
                  <Image src={blog.image || blog.img || ''} alt="blog" width={404} height={238} style={imgStyle} />
                </Link>
              </div>
              <div className="blog__content">
                <h4>
                  <Link href={`/blog/${blog.slug || blog.id}`}>{blog.title}</Link>
                </h4>
                <div className="blog__meta">
                  <span>
                    By <a href="#">{blog.author}</a>
                  </span>
                  <span>/ {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
