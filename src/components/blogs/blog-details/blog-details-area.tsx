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
  
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: [
      blog.img ? (blog.img.startsWith('http') ? blog.img : `${siteUrl}${blog.img}`) : `${siteUrl}/assets/img/logo/logo.png`,
    ],
    datePublished: new Date(blog.date || Date.now()).toISOString(),
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
              <span>/ {blog.date}</span>
            </div>
          </div>
          <div className="postbox__thumb w-img">
            <Image src={blog.img} alt="blog-img" width={736} height={434} style={imgStyle} />
          </div>
          <div className="postbox__wrapper mb-70">
            <div className="postbox__text mt-65">
              <p>Diga, Koma and Torus are three kitchen utensils designed for <span className="highlight theme">Ommo</span>, a new design-oriented brand introduced at the Ambiente show in February 2016. <span className="highlight">Minimalist approach, bright colors, stainless steel and matte plastic</span>, abstract shapes and curved lines are the defining features of these products designed to be extremely functional, user-friendly and fun.</p>
            </div>
            <div className="postbox__text">
              <p>Diga is a two-color melamine salad bowl where vegetables can be washed, drained and served. The disk at the bottom of the bowl can be turned counterclockwise to drain water when washing vegetables and it can be turned clockwise to lock the drain and hold condiments in the bowl when serving.</p>
            </div>
            <article className="postbox format-quote mt-45 mb-50">
              <div className="postbox__quote">
                <blockquote>
                  <p> <i className="fas fa-quote-right"></i> Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. </p>
                </blockquote>
              </div>
            </article>
            <div className="postbox__details-img w-img mb-60">
              <Image src="/assets/img/blog/blog-details-sm.jpg" alt="blog-img" width={831} height={432} style={imgStyle} />
            </div>
            <div className="postbox__text">
              <p>Koma and Torus are two tea infusers, each with an original design and a concealed function. Koma has a round base and a long stainless steel-trimmed handle which offers a comfortable grip and allows.
              </p>
            </div>
            <div className="postbox__text">
              <p>And the brushed steel cover opens and closes at the touch of a finger to easily fill and empty the infuser. The perfect way to enjoy brewing tea. Torus is donut-shaped and can      cling to any cup. It is accompanied by a case that can contain up to three different diffusers and can be used for dry storage of loose tea.
              </p>
            </div>
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
                  <span>Tags :</span>
                  <a href="#">Furniture,</a>
                  <a href="#">Erentheme,</a>
                  <a href="#">Chair, </a>
                  <a href="#">Decor</a>
                </div>
              </div>
            </div>
          </div>
          <div className="postbox__related-title">
            <h3>You Might Also Like</h3>
          </div>
         {/* related blogs start */}
         <RelatedBlogs blog={blog} />
         {/* related blogs end */}
          <div className="postbox__line mt-65"></div>
          <div className="postbox__comments pt-90">
            <div className="postbox__comment-title mb-30">
              <h3>Comments (32)</h3>
            </div>
            <div className="latest-comments mb-30">
              {/* blog reviews */}
              <BlogReviews/>
              {/* blog reviews */}
            </div>
          </div>
          <div className="postbox__line mb-95"></div>
          <div className="post-comments-form mb-100">
            <div className="post-comments-title mb-30">
              <h3>Leave A Reply</h3>
            </div>
            {/* blog form start */}
            <BlogForm />
            {/* blog form start */}
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