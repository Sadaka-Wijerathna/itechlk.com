import Image from "next/image";
import Link from "next/link";
import IBlogType from "@/types/blog-d-t";

// props 
type IProps = {
  blog:IBlogType;
  blog_col_cls?:boolean;
}

// img style 
const imgStyle = {
  width:'100%',
  height:'100%'
}

const BlogPostboxItem = ({blog,blog_col_cls=false}:IProps) => {
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return (
    <div className={`blog__item mb-60 ${blog_col_cls?'':'blog__border-bottom pb-60'}`}>
      <div className="blog__thumb fix">
        <Link href={`/blog/${blog.slug}`} className="w-img">
          <img src={blog.image} alt="blog" style={{ width: '100%', height: 'auto' }} />
        </Link>
      </div>
      <div className="blog__content">
        <h4 className={`${blog_col_cls?'':'blog__title'}`}>
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h4>
        <div className="blog__meta">
          <span>
            By <a href="#">{blog.author}</a>
          </span>
          <span>/ {formattedDate}</span>
        </div>
        <div 
          style={{ marginBottom: '20px' }}
          dangerouslySetInnerHTML={{ __html: blog.content.length > 200 ? blog.content.substring(0, 200) + '...' : blog.content }}
        />
        <Link href={`/blog/${blog.slug}`} className="os-btn">
          read more
        </Link>
      </div>
    </div>
  );
};

export default BlogPostboxItem;
