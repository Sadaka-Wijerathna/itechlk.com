import Link from "next/link";
import IBlogType from "@/types/blog-d-t";
import Image from "next/image";

const BlogSingle = ({ item }: { item: IBlogType }) => {
  return (
    <div className="blog__item mb-30">
      <div className="blog__thumb fix">
        <Link href={`/blog-details/${item.id}`} className="w-img">
          <Image src={item.image || item.img || ''} alt="blog" width={352} height={226} />
        </Link>
      </div>
      <div className="blog__content">
        <h4>
          <Link href={`/blog-details/${item.id}`}>{item.title}</Link>
        </h4>
        <div className="blog__meta">
          <span>
            By <a href="#">{item.author}</a>
          </span>
          <span>/ {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '')}</span>
        </div>
        <p>{item.desc || item.content?.substring(0, 100)}...</p>
        <Link href={`/blog-details/${item.id}`} className="os-btn">
          read more
        </Link>
      </div>
    </div>
  );
};

export default BlogSingle;
