'use client'
import Image from "next/image";
import Slider from "react-slick";

// brands 
const brands:string[] = [
  '/assets/img/client/client-1.jpg',
  '/assets/img/client/client-2.jpg',
  '/assets/img/client/client-3.jpg',
  '/assets/img/client/client-4.jpg',
  '/assets/img/client/client-5.jpg',
  '/assets/img/client/client-4.jpg',
  '/assets/img/client/client-2.jpg',
]

const settings = {
  autoplay: true,
  autoplaySpeed: 10000,
  arrows: false,
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
};

const Brands = ({df}:{df?:boolean}) => {
  return (
    <>
      <section className={`client__area ${df ? '' : 'pt-15 pb-140'}`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className={`client__slider ${df ? 'pt-80 pb-80 border-top-1' : ''} text-center`}>
                <Slider {...settings}>
                  {
                    brands.map((img, i) => {
                      return <div key={i} className="client__thumb">
                        <a href="#">
                          <Image src={img} alt="client" width={240} height={125} />
                        </a>
                      </div>
                    })
                  }
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Brands;