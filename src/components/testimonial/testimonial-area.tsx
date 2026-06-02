"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import Slider from "react-slick";

// slick setting nav
const settings_nav = {
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: false,
  centerMode: true,
  centerPadding: "0",
  focusOnSelect: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

// slick setting
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  dots: true,
};

const nav_data = [
  { img: "/assets/img/testimonial/person-1.jpg" },
  { img: "/assets/img/testimonial/person-2.jpg" },
  { img: "/assets/img/testimonial/person-3.jpg" },
  { img: "/assets/img/testimonial/person-4.jpg" },
];

const testimonial_data = [
  {
    id: 1,
    name: "Mason Robinson",
    title: "UX - Designer",
    desc: "Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius consuetudium lectorum.",
  },
  {
    id: 2,
    name: "David Cruso",
    title: "Web Developer",
    desc: "Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius consuetudium lectorum.",
  },
  {
    id: 3,
    name: "Shahnewaz Sakil",
    title: "Web Designer",
    desc: "Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius consuetudium lectorum.",
  },
  {
    id: 4,
    name: "Salim Rana",
    title: "WP Expert",
    desc: "Typi non habent claritatem insitam, est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius consuetudium lectorum.",
  },
];
const Testimonial = () => {
  const [slider1, setSlider1] = useState<Slider | null>(null);
  const [slider2, setSlider2] = useState<Slider | null>(null);
  const sliderRef = useRef<Slider | null>(null);

  return (
    <>
      <section
        className="testimonial__area box-m-15 pt-100 pb-140"
        style={{
          background: "url(/assets/img/testimonial/testimonial-bg.jpg)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-lg-8 offset-lg-2">
              <div className="">
                <Slider
                  asNavFor={slider2 as Slider}
                  ref={(slider) => {
                    setSlider1(slider);
                    sliderRef.current = slider;
                  }}
                  className="testimonial__nav"
                  {...settings_nav}
                >
                  {nav_data.map((item, index) => (
                    <div key={index} className={`testimonial__nav-thumb item-${index + 1}`}>
                      <Image src={item.img} alt="person" width={80} height={80} />
                    </div>
                  ))}
                </Slider>
              </div>

              <div className=" mt-40">
                <Slider
                  asNavFor={slider1 as Slider}
                  ref={(slider) => setSlider2(slider)}
                  className="testimonial__wrapper"
                  {...settings}
                >
                  {testimonial_data.map((item) => (
                    <div key={item.id} className={`testimonial__item item-${item.id}`}>
                      <div className="avater__info mb-15">
                        <h6>{item.name}</h6>
                        <span>{item.title}</span>
                      </div>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonial;
