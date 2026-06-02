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
  return (
    <div className={`blog__item mb-60 ${blog_col_cls?'':'blog__border-bottom pb-60'}`}>
      <div className="blog__thumb fix">
        <Link href={`/blog-details/${blog.id}`} className="w-img">
          <Image src={blog.img} alt="blog" width={736} height={434} style={imgStyle} />
        </Link>
      </div>
      <div className="blog__content">
        <h4 className={`${blog_col_cls?'':'blog__title'}`}>
          <Link href={`/blog-details/${blog.id}`}>{blog.title}</Link>
        </h4>
        <div className="blog__meta">
          <span>
            By <a href="#">{blog.author}</a>
          </span>
          <span>/ {blog.date}</span>
        </div>
        <p>{blog.desc}</p>
        <Link href={`/blog-details/${blog.id}`} className="os-btn">
          read more
        </Link>
      </div>
    </div>
  );
};

export default BlogPostboxItem;
