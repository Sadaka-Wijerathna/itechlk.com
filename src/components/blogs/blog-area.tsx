"use client";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import blog_data from "@/data/blog-data";
import BlogSingle from "./single-blog/blog-single";

// blog items
const blog_items = blog_data.filter((blog) => blog.blog === "home");

// props type
type IProps = {
  style_2?: boolean;
  style_3?: boolean;
};

const BlogArea = ({ style_2, style_3 }: IProps) => {
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 992) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlides();
    setMounted(true);
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 10000,
    arrows: false,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className={`blog__area pb-70 ${style_2 ? "pt-90" : ""}`}>
        <div className={`container ${style_3 ? "custom-container" : ""}`}>
          <div className="row">
            <div className="col-xl-12">
              <div
                className={`section__title-wrapper text-center mb-55 ${style_3 ? "p-relative" : ""}`}
              >
                <div className="section__title mb-10">
                  <h2 style={{ fontWeight: 600 }}>
                    Our Blog{" "}
                    <span style={{ color: "#21a8c9" }}>Posts</span>
                  </h2>
                </div>
                <div className="section__sub-title">
                  <p>
                    Mirum est notare quam littera gothica quam nunc putamus
                    parum claram!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="blog__slider owl-carousel">
                {mounted && (
                  <Slider {...settings}>
                    {blog_items.map((item, i) => (
                      <BlogSingle key={i} item={item} />
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogArea;
