import Image from 'next/image';
import avatar from '@/assets/img/blog/comments/avater-3.png';
import blog_data from '@/data/blog-data';
import Link from 'next/link';

// recent blogs 
const recent_blogs = blog_data.slice(-3)

const BlogSidebar = () => {
  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__widget mb-55">
          <div className="widget__search p-relative">
              <form action="#">
                  <input type="text" placeholder="Search..."/>
                  <button type="submit"><i className="far fa-search"></i></button>
              </form>
          </div>
      </div>
      <div className="sidebar__widget mb-55">
          <div className="sidebar__widget-title mb-25">
              <h3>Product Categories</h3>
          </div>
          <div className="sidebar__widget-content">
              <div className="categories">
                  <div id="accordion">
                      <div className="card">
                          <div className="card-header white-bg" id="accessories">
                          <h5 className="mb-0">
                              <button className="shop-accordion-btn" data-bs-toggle="collapse" data-bs-target="#collapseAccessories" aria-expanded="true" aria-controls="collapseAccessories">
                                  Accessories
                              </button>
                          </h5>
                          </div>
                          <div id="collapseAccessories" className="collapse show" aria-labelledby="accessories" data-bs-parent="#accordion">
                          <div className="card-body">
                              <div className="categories__list">
                                  <ul>
                                      <li><a href="#">Catagories 1</a></li>
                                      <li><a href="#">Catagories 2</a></li>
                                  </ul>
                              </div>
                          </div>
                          </div>
                      </div>
                      <div className="card">
                          <div className="card-header white-bg" id="cloth">
                          <h5 className="mb-0">
                              <button className="shop-accordion-btn collapsed" data-bs-toggle="collapse" data-bs-target="#collapsecloth" aria-expanded="false" aria-controls="collapsecloth">
                                  Clothing
                              </button>
                          </h5>
                          </div>
                          <div id="collapsecloth" className="collapse" aria-labelledby="cloth" data-bs-parent="#accordion">
                          <div className="card-body">
                              <div className="categories__list">
                                  <ul>
                                      <li><a href="#">Catagories 1</a></li>
                                      <li><a href="#">Catagories 2</a></li>
                                  </ul>
                              </div>
                          </div>
                          </div>
                      </div>
                      <div className="card">
                          <div className="card-header white-bg" id="men">
                          <h5 className="mb-0">
                              <button className="shop-accordion-btn collapsed" data-bs-toggle="collapse" data-bs-target="#collapsemen" aria-expanded="false" aria-controls="collapsemen">
                                  Men
                              </button>
                          </h5>
                          </div>
                          <div id="collapsemen" className="collapse" aria-labelledby="men" data-bs-parent="#accordion">
                          <div className="card-body">
                              <div className="categories__list">
                                  <ul>
                                      <li><a href="#">Catagories 1</a></li>
                                      <li><a href="#">Catagories 2</a></li>
                                  </ul>
                              </div>
                          </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div className="sidebar__widget mb-55">
          <div className="sidebar__widget-title mb-25">
              <h3>Latest Posts</h3>
          </div>
          <div className="sidebar__widget-content">
              <div className="rc__post-wrapper">
                  <ul>
                    {recent_blogs.map((b,i) => (
                      <li key={i} className="d-flex">
                      <div className="rc__post-thumb mr-20 ">
                          <Link href={`/blog-details/${b.id}`}>
                            <Image src={b.img} alt="blog-1" width={70} height={70}/>
                          </Link>
                      </div>
                      <div className="rc__post-content">
                          <h6>
                              <Link href={`/blog-details/${b.id}`}>{b.title.slice(0,20)}</Link>
                          </h6>
                          <div className="rc__meta">
                              <span>{b.date}</span>
                          </div>
                      </div>
                    </li>
                    ))}
                 </ul>
              </div>
          </div>
      </div>
      <div className="sidebar__widget mb-55">
          <div className="sidebar__widget-title mb-25">
              <h3>Recent Comments</h3>
          </div>
          <div className="sidebar__widget-content">
              <div className="rc__comments">
                  <ul>
                      <li className="d-flex mb-20">
                          <div className="rc__comments-avater mr-15">
                              <Image src={avatar} alt="avatar"/>
                          </div>
                          <div className="rc__comments-content">
                              <h6>Salim Rana</h6>
                              <p>Hi, this is a comment....</p>
                              <span>on <span className="highlight comment"> Hello world!</span></span>
                          </div>
                      </li>
                      <li className="d-flex mb-20">
                          <div className="rc__comments-avater mr-15">
                            <Image src={avatar} alt="avatar"/>
                          </div>
                          <div className="rc__comments-content">
                              <h6>Shahnewaz Sakil</h6>
                              <p>Hi, this is a comment....</p>
                              <span>on <span className="highlight comment"> Hello world!</span></span>
                          </div>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <div className="sidebar__widget mb-55">
          <div className="sidebar__widget-title mb-25">
              <h3>Archives</h3>
          </div>
          <div className="sidebar__widget-content">
              <div className="sidebar__links">
                  <ul>
                      <li><a href="#">December 2023</a></li>
                      <li><a href="#"> November 2023</a></li>
                      <li><a href="#"> September 2023</a></li>
                      <li><a href="#">November 2022</a></li>
                  </ul>
              </div>
          </div>
      </div>
      <div className="sidebar__widget mb-55">
          <div className="sidebar__widget-title mb-25">
              <h3>Meta</h3>
          </div>
          <div className="sidebar__widget-content">
              <div className="sidebar__links">
                  <ul>
                      <li><a href="#">Log in</a></li>
                      <li><a href="#">Entries RSS</a></li>
                      <li><a href="#">Comments RSS</a></li>
                      <li><a href="#">WordPress.org</a></li>
                  </ul>
              </div>
          </div>
      </div>
   </div>
  );
};

export default BlogSidebar;