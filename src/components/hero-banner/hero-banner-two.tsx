'use client'
import Link from "next/link";
import Slider from "react-slick";
import { HeroSliderData } from "@/data/hero-slider-data";

// slick setting
const settings = {
  autoplay: false,
  autoplaySpeed: 10000,
  dots: true,
  fade: true,
  arrows: false,
};

const HeroSliderTwo = () => {
  const {hero_slider_two} = HeroSliderData;
  return (
      <section className="slider__area slider__area-2 p-relative pl-15 pr-15">
        <Slider className='slider-active' {...settings}>
          {
            hero_slider_two.map((slider, index) => {
              return <div key={index}>
                <div className="single-slider single-slider-2 slider__height-2 d-flex align-items-center"
                  style={{ backgroundImage: `url(${slider.bgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-xl-6 col-lg-7 col-md-10 col-sm-10 col-12">
                        <div className={`slider__content ${slider.isDark ? 'slider__content-black' : ''} 
                        slider__content-3 pl-250 p-relative z-index-1`}>
                          <h2 dangerouslySetInnerHTML={{ __html: slider.title }}></h2>
                          <p>{slider.subtitle} </p>
                          <div className="hero-slider-btn">
                            <Link href="/shop" className={`os-btn ${slider.isDark ? 'os-btn-white' : 'os-btn-2'}`}>
                              Discover now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </Slider>
    </section>
  );
};

export default HeroSliderTwo;