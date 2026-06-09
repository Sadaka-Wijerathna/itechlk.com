import Link from 'next/link';
import Image from 'next/image';
import BlogForm from '@/components/forms/blog-form';
import BlogSidebar from '../blog-sidebar';
import IBlogType from '@/types/blog-d-t';
import BlogReviews from './blog-reviews';
import RelatedBlogs from './related-blogs';

// img style 
const imgStyle = {
  width:'100%',
  height:'100%'
}

// prop type 
type IProps = {
  blog:IBlogType;
}

const BlogDetailsArea = ({blog}:IProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itechlk.com';
  const dateStr = blog.createdAt || blog.date || new Date().toISOString();
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const blogImage = blog.image || blog.img || '';
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: [
      blogImage ? (blogImage.startsWith('http') ? blogImage : `${siteUrl}${blogImage}`) : `${siteUrl}/assets/img/logo/logo.png`,
    ],
    datePublished: date.toISOString(),
    author: [{
      '@type': 'Person',
      name: blog.author || 'ITechLK Admin',
      url: siteUrl
    }],
    publisher: {
      '@type': 'Organization',
      name: 'ITechLK Store',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/img/logo/logo.png`
      }
    }
  };

  return (
    <section className="blog__area pt-55">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        suppressHydrationWarning
      />
    <div className="container">
      <div className="row">
        <div className="col-xl-9 col-lg-8">
          <div className="postbox__title mb-55">
            <h1>
              <Link href={'/blog'}>
                 {blog.title}
              </Link>
            </h1>
            <div className="blog__meta">
              <span>By <a href="#">{blog.author}</a></span>
              <span>/ {formattedDate}</span>
            </div>
          </div>
          <div className="postbox__thumb w-img mb-60">
             <img src={blogImage} alt="blog" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="postbox__wrapper mb-70">
            <div 
              className="postbox__text mt-65 dynamic-content" 
              dangerouslySetInnerHTML={{ __html: blog.content || blog.desc || '' }}
            />
          </div>
          <div className="postbox__share mb-95">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="postbox__social">
                  <span>Share to friends:</span>
                  <ul>
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-dribbble"></i></a></li>
                    <li><a href="#"><i className="fas fa-share-alt"></i></a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="postbox__tag f-right">
                  <span>Category :</span>
                  <a href="#">{blog.category}</a>
                </div>
              </div>
            </div>
          </div>
          {/* We can re-enable these logic later with dynamic data if needed */}
          {/* <div className="postbox__related-title">
            <h3>You Might Also Like</h3>
          </div>
          <RelatedBlogs blog={blog} /> */}
          <div className="postbox__line mt-65"></div>
          <div className="postbox__comments pt-90">
            <div className="postbox__comment-title mb-30">
              <h3>Comments ({blog.comments?.length || 0})</h3>
            </div>
            <div className="latest-comments mb-30">
              <BlogReviews comments={blog.comments} />
            </div>
          </div>
          <div className="postbox__line mt-65"></div>
          <div className="post-comments-form mb-100">
            <div className="postbox__comment-title mb-40">
              <h3>Leave a Comment</h3>
            </div>
            <BlogForm blogId={String(blog.id)} />
          </div>
        </div>
        <div className="col-xl-3 col-lg-4">
          <BlogSidebar />
        </div>
      </div>
    </div>
  </section>
  );
};

export default BlogDetailsArea;