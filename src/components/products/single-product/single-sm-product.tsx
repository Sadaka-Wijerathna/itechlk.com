"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product-d-t";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";
import { useCurrency } from "@/context/CurrencyContext";

const SingleSmProduct = ({ product }: { product: IProduct }) => {
  const router = useRouter();
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

  return (
    <>
      <div className="features__product-wrapper d-flex mb-20">
        <div className="features__product-thumb mr-15">
          <Link href={`/product-details/${product.id}`}>
            <Image src={product.img} alt="pro-sm-1" width={85} height={100} />
          </Link>
        </div>
        <div className="features__product-content">
          <h5>
            <Link href={`/product-details/${product.id}`}>{product.title}</Link>
          </h5>
          <div className="price">
            <span>{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="price-old">{formatPrice(product.old_price)}</span>
            )}
            <div className="add-cart p-absolute transition-3">
              {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                <span className="text-danger" style={{ fontSize: '12px', fontWeight: 600 }}>Out of Stock</span>
              ) : (
                <button onClick={() => router.push(`/product-details/${product.id}`)}>
                  Select duration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleSmProduct;
