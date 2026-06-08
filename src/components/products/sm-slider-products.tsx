"use client";
import {useRef} from "react";
import { IProduct } from "@/types/product-d-t";
import Slider from "react-slick";
import SingleSmProduct from "./single-product/single-sm-product";

// slick setting
const settings = {
  autoplay: false,
  autoplaySpeed: 10000,
  infinite: false,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};

function chunkArray(arr: IProduct[], chunkSize: number) {
  const chunkedArray = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunkedArray.push({ id: i + 1, products: arr.slice(i, i + chunkSize) });
  }
  return chunkedArray;
}

// prop type
type IProps = {
  products: IProduct[];
};

const SmSliderProducts = ({ products }: IProps) => {
  const trendingRef = useRef<Slider | null>(null);
  const discountRef = useRef<Slider | null>(null);
  const topRatedRef = useRef<Slider | null>(null);
  // Smarter unique product selection
  const usedIds = new Set();

  // Robust filtering for out-of-stock and inactive products
  const filterStock = (p: IProduct) => {
    const isInactive = (p as any).active === false;
    const isOutOfStock = p.status?.toLowerCase() === "out of stock";
    const isZeroQuantity = p.quantity === 0;
    return !isInactive && !isOutOfStock && !isZeroQuantity;
  };

  const onSaleProductsList = products
    .filter((p) => p.discount! > 0 && filterStock(p))
    .slice(0, 12);
  onSaleProductsList.forEach(p => usedIds.add(p.id));

  const trendingProductsList = products
    .filter((p) => (p.trending || p.bestSeller) && !usedIds.has(p.id) && filterStock(p))
    .slice(0, 12);
  
  // If trending is too empty, add some even if they are on sale
  if (trendingProductsList.length < 4) {
    const extraTrending = products
      .filter(p => (p.trending || p.bestSeller) && !trendingProductsList.some(tp => tp.id === p.id) && filterStock(p))
      .slice(0, 4 - trendingProductsList.length);
    trendingProductsList.push(...extraTrending);
  }
  trendingProductsList.forEach(p => usedIds.add(p.id));

  const topRatedProductsList = products
    .filter((p) => (p.topRated || (p.rating && p.rating >= 4)) && !usedIds.has(p.id) && filterStock(p))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);

  // Fallback for top rated if empty
  if (topRatedProductsList.length < 4) {
    const extraRated = products
      .filter(p => !topRatedProductsList.some(rp => rp.id === p.id) && filterStock(p))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8 - topRatedProductsList.length);
    topRatedProductsList.push(...extraRated);
  }

  const trending_slider_products = chunkArray(trendingProductsList, 4);
  const discount_slider_products = chunkArray(onSaleProductsList, 4);
  const top_rated_slider_products = chunkArray(topRatedProductsList, 4);
  return (
    <div className="row">
      <div className="col-xl-4 col-lg-4 col-md-6">
        <div className="product__offer-inner mb-30">
          <div className="product__title mb-60">
            <h4 style={{ backgroundColor: '#f5f5f5' }}>Top Seller Products</h4>
          </div>
          <div className="product__offer-slider p-relative">
            <Slider {...settings} ref={trendingRef}>
              {trending_slider_products.map((items, i) => (
                <div key={i} className="product__offer-wrapper">
                  <div className="sidebar__widget-content">
                    {items.products.slice(0, 4).map((item, index) => (
                      <SingleSmProduct key={index} product={item} />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
            <div className="owl-nav">
              <div className="owl-prev" onClick={() => trendingRef.current?.slickPrev()}>
                <button>
                  <i className="fal fa-angle-left"></i>
                </button>
              </div>
              <div className="owl-next" onClick={() => trendingRef.current?.slickNext()}> 
                <button>
                  <i className="fal fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6">
        <div className="product__offer-inner mb-30">
          <div className="product__title mb-60">
            <h4 style={{ backgroundColor: '#f5f5f5' }}>On Sale Products</h4>
          </div>
          <div className="product__offer-slider p-relative">
            <Slider {...settings} ref={discountRef}>
              {discount_slider_products.map((items, i) => (
                <div key={i} className="product__offer-wrapper">
                  <div className="sidebar__widget-content">
                    {items.products.slice(0, 4).map((item, index) => (
                      <SingleSmProduct key={index} product={item} />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
            <div className="owl-nav">
              <div className="owl-prev" onClick={() => discountRef.current?.slickPrev()}>
                <button>
                  <i className="fal fa-angle-left"></i>
                </button>
              </div>
              <div className="owl-next" onClick={() => discountRef.current?.slickNext()}>
                <button>
                  <i className="fal fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6">
        <div className="product__offer-inner mb-30">
          <div className="product__title mb-60">
            <h4 style={{ backgroundColor: '#f5f5f5' }}>Top Rated Products</h4>
          </div>
          <div className="product__offer-slider p-relative">
            <Slider {...settings} ref={topRatedRef}>
              {top_rated_slider_products.map((items, i) => (
                <div key={i} className="product__offer-wrapper">
                  <div className="sidebar__widget-content">
                    {items.products.slice(0, 4).map((item, index) => (
                      <SingleSmProduct key={index} product={item} />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
            <div className="owl-nav">
              <div className="owl-prev" onClick={() => topRatedRef.current?.slickPrev()}>
                <button>
                  <i className="fal fa-angle-left"></i>
                </button>
              </div>
              <div className="owl-next" onClick={() => topRatedRef.current?.slickNext()}>
                <button>
                  <i className="fal fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmSliderProducts;
