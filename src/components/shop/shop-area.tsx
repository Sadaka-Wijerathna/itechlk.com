"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import ShopSidebar from "./shop-sidebar";
import { IProduct } from "@/types/product-d-t";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/ui/pagination";
import { reset, add_sub_category, set_max_price } from "@/redux/features/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import ProductItem from "../products/single-product/product-item";
import ProductListItem from "../products/single-product/product-list-item";
import { useSearchParams } from "next/navigation";

// prop type 
type IProps = {
  shop_right?:boolean;
  shop_col?:string;
  product_data:IProduct[];
}

const ShopArea = ({product_data,shop_right,shop_col}:IProps) => {
  const brands = [...new Set(product_data.map((p) => p.brand))];
  const allColors = product_data.flatMap((item) => item.colors);
  const uniqueColors = [...new Set(allColors)].slice(0, 8);
  const allSizes = product_data.flatMap((item) => item.sizes);
  const uniqueSizes = [...new Set(allSizes)];
  const feature_products = product_data.filter((p) => p.trending).slice(0, 2);

  // pagination per page
  const pagination_per_page = shop_col ? 12 : 9;

  const { category,subCategory,sizes,colors,brand,priceValue,availability} = useAppSelector((state) => state.filter);
  
  //filtered products calculate
  const filteredProducts = useMemo(() => {
    return [...product_data].filter((p) =>
      (category && !subCategory) ? p.parentCategory.toLowerCase() === category.toLowerCase() :
      (!category && subCategory) ? p.category.toLowerCase() === subCategory.toLowerCase() :
      (category && subCategory) ? p.parentCategory.toLowerCase() === category.toLowerCase() && p.category.toLowerCase() === subCategory.toLowerCase() :
      true
    ).filter((p) =>
      p.price >= priceValue[0] && p.price <= priceValue[1]
    ).filter((p) => {
      if (sizes.length > 0) {
        return p.sizes.some((s) => sizes.includes(s));
      }
      return true;
    }).filter((p) => {
      if (colors.length > 0) {
        return p.colors.some((c) => colors.includes(c));
      }
      return true;
    }).filter((p) => {
      if (brand) {
        return p.brand.toLowerCase() === brand.toLowerCase();
      }
      return true;
    }).filter((p) => {
      if (availability.length > 0) {
        return availability.some((a) => {
          if (a.toLowerCase() === "in stock") {
            return ["active", "new"].includes(p.status?.toLowerCase() || "");
          }
          return p.status?.toLowerCase() === a.toLowerCase();
        });
      }
      return true;
    });
  }, [brand, category, colors, priceValue, product_data, sizes, subCategory, availability]);

  const [sortBy, setSortBy] = useState<string>("asc");

  const products = useMemo(() => {
    let result = [...filteredProducts];
    if (sortBy === "sale") {
      result = result.filter((p) => (p.discount || 0) > 0);
    } else if (sortBy === "high") {
      result = result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "low") {
      result = result.sort((a, b) => a.price - b.price);
    }
    return result;
  }, [filteredProducts, sortBy]);

  const {currentItems,handlePageClick,pageCount} = usePagination<IProduct>(products,pagination_per_page);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const dispatch = useAppDispatch();

  const maxProductPrice = useMemo(() => {
    return product_data.length > 0 
      ? Math.ceil(Math.max(...product_data.map(p => p.price))) 
      : 500;
  }, [product_data]);

  useEffect(() => {
    dispatch(set_max_price(maxProductPrice));
  }, [dispatch, maxProductPrice]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (categoryParam) {
      // Small timeout to ensure reset happened first if they both trigger
      dispatch(add_sub_category(categoryParam));
    }
  }, [categoryParam, dispatch]);

  // handle Sort Change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <section className="shop__area pt-100 pb-100">
      <div className="container">
        <div className="row">
          {!shop_right && !shop_col && <div className="col-xl-3 col-lg-3 col-md-4">
            {/* shop sidebar start */}
            <ShopSidebar
              feature_products={feature_products}
              brands={brands}
              colors={uniqueColors}
              sizes={uniqueSizes}
            />
            {/* shop sidebar end */}
          </div>}
          <div className={shop_col ? 'col-xl-12' : 'col-xl-9 col-lg-8'}>
            <div className="shop__content-area">
              <div className="shop__header d-sm-flex justify-content-between align-items-center mb-40">
                <div className="shop__header-left">
                  <div className="show-text">
                    <span>Showing 1–{currentItems.length} of {products.length} results</span>
                  </div>
                </div>
                <div className="shop__header-right d-flex align-items-center justify-content-between justify-content-sm-end">
                  <div className="sort-wrapper mr-30 pr-25 p-relative">
                    <select onChange={handleSortChange}>
                      <option value="asc">Default Sorting</option>
                      <option value="sale">On Sale</option>
                      <option value="high">Price High To Low</option>
                      <option value="low">Price Low To High</option>
                    </select>
                  </div>
                  <ul className="nav nav-pills" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-grid-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#pills-grid"
                        type="button"
                        role="tab"
                        aria-controls="pills-grid"
                        aria-selected="true"
                        tabIndex={-1}
                      >
                        <i className="fas fa-th"></i>
                      </button>
                    </li>
                    <li className="nav-item d-none d-sm-block" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-grid-3-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#pills-grid-3"
                        type="button"
                        role="tab"
                        aria-controls="pills-grid-3"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        <svg width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor" style={{ verticalAlign: '-0.125em' }}>
                          <path d="M0 0h110v110H0zm134 0h110v110H134zm134 0h110v110H268zm134 0h110v110H402zM0 134h110v110H0zm134 0h110v110H134zm134 0h110v110H268zm134 0h110v110H402zM0 268h110v110H0zm134 0h110v110H134zm134 0h110v110H268zm134 0h110v110H402zM0 402h110v110H0zm134 0h110v110H134zm134 0h110v110H268zm134 0h110v110H402z"/>
                        </svg>
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-list-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#pills-list"
                        type="button"
                        role="tab"
                        aria-controls="pills-list"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        <i className="fas fa-list-ul"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* if no item in product */}
              {products.length === 0 && <div  className="cartmini__empty text-center mt-80">
                <div className="mb-30">
                <Image src="/assets/img/shop/empty-cart.png" alt="empty-cart-img" width={283} height={171} />
                </div>
                <h4>Sorry! Could not find the product you were looking For!!!</h4>
                <p>Please check if you have misspelt something or try searching with other words.</p>
                <button onClick={()=> dispatch(reset())} className="os-btn os-btn-3">
                  Continue Shopping
                </button>
              </div>
              }
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-grid"
                  role="tabpanel"
                  aria-labelledby="pills-grid-tab"
                >
                  <div className="row custom-row-10">
                    {currentItems.map((item, i) => (
                      <div
                        key={i}
                        className={shop_col ? shop_col : "col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6"}
                      >
                        <ProductItem product={item} />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-grid-3"
                  role="tabpanel"
                  aria-labelledby="pills-grid-3-tab"
                >
                  <div className="row custom-row-10">
                    {currentItems.map((item, i) => (
                      <div
                        key={i}
                        className={shop_col ? shop_col : "col-xl-3 col-lg-4 col-md-6 col-sm-6 custom-col-10"}
                      >
                        <ProductItem product={item} />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-list"
                  role="tabpanel"
                  aria-labelledby="pills-list-tab"
                >
                  {currentItems.map((item, i) => (
                    <ProductListItem key={i} product={item} />
                  ))}
                </div>
              </div>
              <div className="row mt-40">
                <div className="col-xl-12">
                  <div className="shop-pagination-wrapper d-flex justify-content-center align-items-center">
                    <div className="basic-pagination">
                      <nav>
                        <Pagination
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                        />
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {shop_right && !shop_col && <div className="col-xl-3 col-lg-3 col-md-4">
            {/* shop sidebar start */}
            <ShopSidebar
              feature_products={feature_products}
              brands={brands}
              colors={uniqueColors}
              sizes={uniqueSizes}
            />
            {/* shop sidebar end */}
          </div>}
        </div>
      </div>
    </section>
  );
};

export default ShopArea;