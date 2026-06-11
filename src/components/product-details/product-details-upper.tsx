"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import { IProduct } from "@/types/product-d-t";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product, decrement, increment } from "@/redux/features/cart";
import { useCurrency } from "@/context/CurrencyContext";
import { notifyError } from "@/utils/toast";

// prop type
type IProps = {
  product: IProduct;
  style_2?: boolean;
  bottomShow?: boolean;
};

const ProductDetailsUpper = ({
  product,
  style_2,
  bottomShow = true,
}: IProps) => {
  const { orderQuantity } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();

  const [activeImg, setActiveImg] = useState(product.related_images[0]);
  const [selectedDuration, setSelectedDuration] = useState("");

  const handleImageActive = (img: string) => {
    setActiveImg(img);
  };

  const handleAddToCart = () => {
    if (!selectedDuration) {
      notifyError("Please select a duration");
      return;
    }
    
    let price = product.price;
    let old_price = product.old_price;
    
    if (product.durationPrices && product.durationPrices[selectedDuration]) {
      price = product.durationPrices[selectedDuration].price;
      old_price = product.durationPrices[selectedDuration].oldPrice ?? undefined;
    }

    dispatch(add_cart_product({ ...product, selectedDuration, price, old_price }));
  };

  return (
    <>
      <div className="row">
        {!style_2 && (
          <div className="col-xl-6 col-lg-6">
            <div className="product__modal-box d-flex">
              {product.related_images.length > 1 && (
                <div className="product__modal-nav mr-20">
                  <nav>
                    <div className="nav nav-tabs" id="product-details">
                      {product.related_images.map((img, i) => (
                      <a key={i}
                        className={`nav-item nav-link cursor-pointer ${img === activeImg ? "active" : ""}`}
                      >
                        <div className="product__nav-img w-img" onClick={() => handleImageActive(img)}>
                          <Image
                            src={img}
                            alt="product-img"
                            width={92}
                            height={117}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </a>
                    ))}
                    </div>
                  </nav>
                </div>
              )}
              <div className="tab-content mb-20" id="product-detailsContent">
                <div className="product__modal-img product__thumb w-img">
                  <Image
                    src={activeImg}
                    alt="product-img"
                    width={418}
                    height={534}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="product__sale">
                    {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                      <span className="out-of-stock">Out of Stock</span>
                    ) : product.status?.toLowerCase() === "pre order" ? (
                      <span className="pre-order">Pre Order</span>
                    ) : (
                      <>
                        {product.new && <span className="new">new</span>}
                        {(() => {
                          let displayDiscount = product.discount;
                          if (selectedDuration && product.durationPrices && product.durationPrices[selectedDuration]) {
                            const d = product.durationPrices[selectedDuration];
                            if (d.price && d.oldPrice && d.oldPrice > 0) {
                              displayDiscount = Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100);
                            } else {
                              displayDiscount = 0;
                            }
                          }
                          return (displayDiscount ?? 0) > 0 ? <span className="percent">-{displayDiscount}%</span> : null;
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {style_2 && (
          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
            <div className="product__modal-box p-relative">
              <div className="tab-content mb-20" id="nav-tabContent">
                <div className="product__modal-img w-img">
                  <Image
                    src={activeImg}
                    alt="product-img"
                    width={327}
                    height={416}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="product__sale">
                    {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                      <span className="out-of-stock">Out of Stock</span>
                    ) : product.status?.toLowerCase() === "pre order" ? (
                      <span className="pre-order">Pre Order</span>
                    ) : (
                      <>
                        {product.new && <span className="new">new</span>}
                        {(() => {
                          let displayDiscount = product.discount;
                          if (selectedDuration && product.durationPrices && product.durationPrices[selectedDuration]) {
                            const d = product.durationPrices[selectedDuration];
                            if (d.price && d.oldPrice && d.oldPrice > 0) {
                              displayDiscount = Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100);
                            } else {
                              displayDiscount = 0;
                            }
                          }
                          return (displayDiscount ?? 0) > 0 ? <span className="percent">-{displayDiscount}%</span> : null;
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {product.related_images.length > 1 && (
                <nav>
                  <div className="nav nav-tabs justify-content-between">
                    {product.related_images.map((img, i) => (
                      <a key={i}
                        className={`nav-item nav-link cursor-pointer ${img === activeImg ? "active" : ""}`}
                      >
                        <div className="product__nav-img w-img" onClick={() => handleImageActive(img)}>
                          <Image
                            src={img}
                            alt="product-img"
                            width={92}
                            height={117}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </div>
        )}

        <div
          className={style_2?"col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12":"col-xl-6 col-lg-6"}
        >
          <div className="product__modal-content product__modal-content-2">
            <h2>
              <Link href={`/product-details/${product.id}`}>
                {product.title}
              </Link>
            </h2>
            <div className="product__price-2 mb-25">
              <span>
                {selectedDuration && product.durationPrices && product.durationPrices[selectedDuration]
                  ? formatPrice(product.durationPrices[selectedDuration].price)
                  : formatPrice(product.price)}
              </span>
              {(selectedDuration && product.durationPrices && product.durationPrices[selectedDuration]
                ? product.durationPrices[selectedDuration].oldPrice
                : product.old_price) && (
                <span className="old-price">
                  {formatPrice(selectedDuration && product.durationPrices && product.durationPrices[selectedDuration]
                    ? (product.durationPrices[selectedDuration].oldPrice as number)
                    : (product.old_price as number))}
                </span>
              )}
            </div>
            <div className="product__modal-des mb-30">
              <p>{product.sm_desc}</p>
            </div>
            <div className="product__modal-form mb-30">
              <form action="#">
                <div className="product__modal-input size mb-20">
                  <label>
                    Duration <i className="fas fa-star-of-life"></i>
                  </label>
                  <select 
                    value={selectedDuration} 
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    <option value="">- Please select -</option>
                    {product.sizes && product.sizes.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="pro-quan-area d-sm-flex align-items-center">
                  <div className="product-quantity-title">
                    <label>Quantity</label>
                  </div>
                  <div className="product-quantity mr-20 mb-20 text-center">
                    {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                      <div className="cart-plus-minus" style={{ backgroundColor: '#f5f5f5', opacity: 0.6 }}>
                        <input type="text" value={0} disabled readOnly />
                        <div className="dec qtybutton" style={{ cursor: 'not-allowed' }}>-</div>
                        <div className="inc qtybutton" style={{ cursor: 'not-allowed' }}>+</div>
                      </div>
                    ) : (
                      <div className="cart-plus-minus">
                        <input
                          type="text"
                          value={orderQuantity}
                          disabled
                          readOnly
                        />
                        <div
                          onClick={() => dispatch(decrement())}
                          className="dec qtybutton"
                        >
                          -
                        </div>
                        <div
                          onClick={() => dispatch(increment())}
                          className="inc qtybutton"
                        >
                          +
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pro-cart-btn">
                    {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                      <a className="add-cart-btn mb-20" style={{ backgroundColor: '#ccc', borderColor: '#ccc', cursor: 'not-allowed' }}>
                        Out of Stock
                      </a>
                    ) : (
                      <a
                        onClick={handleAddToCart}
                        className="add-cart-btn mb-20 cursor-pointer"
                      >
                        + Add to Cart
                      </a>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {bottomShow && (
              <div>
                <div className="product__tag mb-25">
                  <span>Category:</span>
                  <span>
                    <a className="cursor-pointer">{product.category}</a>
                  </span>
                </div>
                <div className="product__share">
                  <span>Share :</span>
                  <ul>
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-behance"></i></a></li>
                    <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsUpper;
