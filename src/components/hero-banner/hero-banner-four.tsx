"use client";
import { useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { HeroSliderData } from "@/data/hero-slider-data";

const HeroSliderFour = () => {
  const { hero_slider_four } = HeroSliderData;
  const [currentSlide, setCurrentSlide] = useState(0);

  // slick setting
  const settings = {
    autoplay: false,
    autoplaySpeed: 10000,
    dots: true,
    arrows: false,
    fade: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <section className="slider__area slider__area-4 p-relative">
      <Slider className="slider-active" {...settings}>
        {hero_slider_four.map((slider, index) => {
          const isActive = index === currentSlide;
          return (
            <div key={index} inert={isActive ? undefined : true}>
              <div
                className="single-slider single-slider-2 slider__height-4 d-flex align-items-center"
                style={{ backgroundImage: `url(${slider.bgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-9 col-sm-11 col-12">
                      <div className="slider__content slider__content-4 p-relative z-index-1">
                        <h2 dangerouslySetInnerHTML={{ __html: slider.title }}></h2>
                        <p>{slider.subtitle} </p>
                        <div className="hero-slider-btn">
                          <Link href={`/shop`} className="os-btn os-btn-2">
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
    </section>
  );
};

export default HeroSliderFour;
