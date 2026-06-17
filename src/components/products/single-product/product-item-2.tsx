'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import { IProduct } from "@/types/product-d-t";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";
import { handleModalProduct, handleOpenModal } from "@/redux/features/utility";
import { useCurrency } from "@/context/CurrencyContext";

// img style
const imgStyle = {
  width: "100%",
  height: "100%",
};

const ProductItemTwo = ({ product }: { product: IProduct }) => {
  const [isItemAddToCart, setIsItemAddToCart] = useState(false);
  const { cart_products } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // asynchronous update to avoid cascading render warning
    const timer = setTimeout(() => {
      setIsItemAddToCart(cart_products.some((i) => i.id === product.id));
    }, 0);

    return () => clearTimeout(timer);
  }, [cart_products, product.id]);

  const handleProductModal = (prd: IProduct) => {
    dispatch(handleModalProduct({ product: prd }));
    dispatch(handleOpenModal());
  };

  return (
    <div className="product__item mb-40">
      <div className="product__wrapper">
        <div className="product__thumb">
          <Link href={`/product-details/${product.slug || product.id}`} className="w-img">
            <Image src={product.img} alt={product.title} width={261} height={333} style={imgStyle} />
            <Image
              className="product__thumb-2"
              src={product.thumb_img}
              alt={product.title}
              width={261} height={333} style={imgStyle}
            />
          </Link>
          <div className="product__action-3 transition-3">
            {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
              <span className="action-btn" style={{ cursor: 'not-allowed', backgroundColor: '#ccc', color: '#666' }}>
                <i className="fal fa-times"></i> Out of Stock
              </span>
            ) : isItemAddToCart ? (
              <Link href="/cart" className="action-btn">
                View Cart
              </Link>
            ) : (
              <a
                onClick={() => dispatch(add_cart_product(product))}
                className="action-btn"
              >
                <i className="fal fa-plus"></i> Add to cart
              </a>
            )}
            <a
              className="action-btn cursor-pointer"
              onClick={() => handleProductModal(product)}
            >
              <i className="fal fa-eye"></i>
            </a>
          </div>
          <div className="product__sale product__sale-3">
            {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
              <span className="out-of-stock">out of stock</span>
            ) : product.status?.toLowerCase() === "pre order" ? (
              <span className="pre-order">pre order</span>
            ) : (
              <>
                {product.new && <span className="new">new</span>}
                {(product.discount ?? 0) > 0 && <span className="percent">-{product.discount}%</span>}
              </>
            )}
          </div>
        </div>
        <div className="product__content product__content-2 p-relative text-center">
          <div className="product__content-inner">
            <div className="rating">
              <a href="#"><i className="fal fa-star"></i></a>
              <a href="#"><i className="fal fa-star"></i></a>
              <a href="#"><i className="fal fa-star"></i></a>
              <a href="#"><i className="fal fa-star"></i></a>
              <a href="#"><i className="fal fa-star"></i></a>
            </div>
            <h4>
              <Link href={`/product-details/${product.slug || product.id}`}>
                {product.title}
              </Link>
            </h4>
            <div className="product__price-3">
              <span>{formatPrice(product.price)}</span>
              {product.old_price && (
                <span className="old-price">
                  <del>{formatPrice(product.old_price)}</del>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemTwo;
