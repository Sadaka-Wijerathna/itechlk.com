"use client";
import Image from "next/image";
import Slider from "react-slick";

// brands
const brands: string[] = [
  "/assets/img/client/client-1.jpg",
  "/assets/img/client/client-2.jpg",
  "/assets/img/client/client-3.jpg",
  "/assets/img/client/client-4.jpg",
  "/assets/img/client/client-5.jpg",
  "/assets/img/client/client-4.jpg",
  "/assets/img/client/client-2.jpg",
];
// slider setting
const settings = {
  autoplay: true,
  autoplaySpeed: 10000,
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const BrandsAreaTwo = () => {
  return (
    <div className="brand__area pb-90">
      <div className="container custom-container-2">
        <div className="brand__slider-active slick-carousel">
          <Slider {...settings}>
            {brands.map((img, i) => {
              return (
                <div key={i} className="brand__slider-item">
                  <div className="brand__image">
                    <Image src={img} alt="client" width={240} height={125} />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default BrandsAreaTwo;
