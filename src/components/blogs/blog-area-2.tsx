'use client'
import Slider from "react-slick";
import blog_data from "@/data/blog-data";
import BlogSingleTwo from "./single-blog/blog-single-2";

// blog items 
const blog_items = blog_data.filter(blog => blog.blog === 'home-7');

// slider setting
const settings = {
  autoplay: true,
  autoplaySpeed: 10000,
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
};


const BlogsAreaTwo = () => {
  return (
    <>
      <div className="blog__slider-area pt-100 pb-100">
        <div className="container custom-container-2">
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-xl-12">
                  <div className="section__wrapper text-center">
                    <h3 className="section__title-2"><span> From Our Blog </span></h3>
                    <p>Update The Latest Fashion Trends in The World</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-40">
            <div className="col-xl-12">
              <div className="blog__slider-active slick-gap slick-carousel">

                <Slider {...settings}>
                  {blog_items.map(blog => (
                    <BlogSingleTwo key={blog.id} blog={blog}/>
                  ))}
                </Slider>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsAreaTwo;