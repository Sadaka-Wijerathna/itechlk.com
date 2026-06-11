'use client'
import Image from "next/image";
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

// prop type
type IProps = {
  style_2?:boolean;
  slider_cls?:string;
}

const HeroSliderOne = ({ style_2=false,slider_cls }:IProps) => {
  const {hero_slider_one} = HeroSliderData;
  return (
    <>
      <section className={`slider__area ${style_2 ? `slider__area-${slider_cls?slider_cls:'2'}` : ''} p-relative`}>
        <Slider className='slider-active' {...settings}>
          {
            hero_slider_one.map((slider, index) => {
              // First slide: plain white bg + hero_img1.png as actual image
              if (index === 0) {
                return (
                  <div key={index}>
                    <div
                      className={`${style_2 ? 'single-slider-2' : 'single-slider'} d-flex align-items-center`}
                      style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}
                    >
                      {/* Hero image — absolutely positioned, full-height, flush to right edge */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '55%',
                        zIndex: 1,
                      }}>
                        <Image
                          src="/assets/img/slider/hero_img1.png"
                          alt="Hero Image"
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'left center' }}
                          priority
                        />
                      </div>

                      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="row align-items-center">
                          <div className="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12">
                            <div className="slider__content p-relative z-index-1">
                              <h1 dangerouslySetInnerHTML={{ __html: slider.title }}></h1>
                              <p>{slider.subtitle}</p>
                              <div className="hero-slider-btn">
                                <Link href="/shop" className="os-btn os-btn-2">
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
              }

              // Slides 2+ keep existing background-image behaviour
              return (
                <div key={index}>
                  <div
                    className={`${style_2 ? 'single-slider-2' : 'single-slider'} d-flex align-items-center`}
                    style={{ backgroundImage: `url(${slider.bgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', width: '100%' }}
                  >
                    <div className="container">
                      <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12">
                          <div className="slider__content p-relative z-index-1">
                            <h1 dangerouslySetInnerHTML={{ __html: slider.title }}></h1>
                            <p>{slider.subtitle}</p>
                            <div className="hero-slider-btn">
                              <Link href="/shop" className="os-btn os-btn-2">
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
            })
          }
        </Slider>
      </section>
    </>
  );
};

export default HeroSliderOne;