'use client'
import Slider from "react-slick";
import ProductItemTwo from "./single-product/product-item-2";
import { IProduct } from "@/types/product-d-t";

// slick setting
const settings = {
  autoplay: false,
  autoplaySpeed: 10000,
  slidesToShow: 4,
  responsive: [
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

// prop type
type IProps = {
  products: IProduct[];
};

const FashionFeatureProducts = ({ products }: IProps) => {
  const best_sale_prd = products.filter((p) => p.bestSeller);
  return (
    <div className="product__slider-area pt-95 pb-60">
      <div className="container custom-container-2">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__wrapper text-center">
              <h3 className="section__title-2">
                <span>FEATURED PRODUCTS</span>
              </h3>
              <p>Claritas est etiam processus dynamicus, qui sequitur.</p>
            </div>
          </div>
        </div>
        <div className="row mt-40">
          <div className="col-lg-12">
            <Slider
              className="product__slider-active slick-gap slick-carousel"
              {...settings}
            >
              {best_sale_prd.map((prd, index) => {
                return (
                  <div key={index} className="product__slider-item">
                    <ProductItemTwo product={prd} />
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionFeatureProducts;
