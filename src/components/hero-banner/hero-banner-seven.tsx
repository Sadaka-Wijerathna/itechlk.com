"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { HeroSliderData } from "@/data/hero-slider-data";

const HeroSliderSeven = () => {
  const { hero_slider_seven } = HeroSliderData;
  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // slick setting
  const settings = {
    arrows: false,
    autoplay: false,
    autoplaySpeed: 10000,
    dots: true,
    fade: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <section className="slider__area slider__area-3 p-relative">
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="slick-prev slick-arrow"
        aria-label="Previous slide"
      >
        <i className="fal fa-angle-left"></i>
      </button>
      <Slider ref={sliderRef} className="slider-active-3" {...settings}>
        {hero_slider_seven.map((slider, index) => {
          const isActive = index === currentSlide;
          return (
            <div key={index} inert={isActive ? undefined : true}>
              <div
                className="single-slider single-slider-2 slider__height-6 d-flex align-items-center"
                style={{ backgroundImage: `url(${slider.bgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="container custom-container-2">
                  <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-10">
                      <div className="slider__content slider__content-5">
                        <span className={`${slider.meta ? "meta" : ""}`}>
                          {slider.sm_title}
                        </span>
                        <h2 dangerouslySetInnerHTML={{ __html: slider.title }}></h2>
                        <p>{slider.subtitle} </p>
                        <div className="hero-slider-btn">
                          <Link href="/shop" className="os-btn-4">
                            Discover now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="slick-next slick-arrow"
        aria-label="Next slide"
      >
        <i className="fal fa-angle-right"></i>
      </button>
    </section>
  );
};

export default HeroSliderSeven;
