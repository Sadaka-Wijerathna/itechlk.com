'use client'
import Image from "next/image";
import Slider from "react-slick";

// data
const testimonial_data = [
  {
    id: 1,
    img: '/assets/img/testimonial/testi1.webp',
    desc: 'Great theme, extended super and fast professional support. easy to use, flexible, visual composer and more functional plugins on board. Yes a real good, strong theme with structured coding. Enjoy it! friendly and super good!'
  },
  {
    id: 2,
    img: '/assets/img/testimonial/testi2.webp',
    desc: 'Great theme, extended super and fast professional support. easy to use, flexible, visual composer and more functional plugins on board. Yes a real good, strong theme with structured coding. Enjoy it! friendly and super good!'
  },
  {
    id: 3,
    img: '/assets/img/testimonial/testi3.webp',
    desc: 'Great theme, extended super and fast professional support. easy to use, flexible, visual composer and more functional plugins on board. Yes a real good, strong theme with structured coding. Enjoy it! friendly and super good!'
  },
]

// slick setting
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
};

const TestimonialTwo = () => {
  return (
      <div className="testimonial__area grey-bg pt-95 pb-95">
        <div className="container custom-container-2">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-xl-12">
                  <div className="section__wrapper text-center mb-40">
                    <h3 className="section__title-2">OUR TESTIMONIAL</h3>
                    <p className="sub-title">Commodo sociosqu venenatis cras dolor sagittis integer luctus sem primis eget maecenas sed urna malesuada consectetuer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="testimonial__slider-active">
                <Slider {...settings}>
                  {testimonial_data.map((item) => (
                    <div key={item.id} className="testimonail__slider-item">
                      <div className="testimonial__image text-center mb-50">
                        <Image src={item.img} alt="user" width={100} height={100} />
                      </div>
                      <div className="testimonial__content">
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TestimonialTwo;