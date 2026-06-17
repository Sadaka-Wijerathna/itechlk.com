"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import { IProduct } from "@/types/product-d-t";
import { add_cart_product } from "@/redux/features/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWishlistProducts, remove_wishlist_product } from "@/redux/features/wishlist";
import { useCurrency } from "@/context/CurrencyContext";

const WishlistArea = () => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();
  // handle remove
  const handleRemove = (item: IProduct) => {
    dispatch(remove_wishlist_product(item));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      dispatch(getWishlistProducts())
    }
  }, [dispatch]);

  return (
    <section className="cart-area pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {wishlist.length === 0 &&
              <div className='text-center'>
                <h3>No wishlist product</h3>
              </div>
            }
            {wishlist.length > 0 && <div>
              <div className="table-content table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="product-thumbnail">Images</th>
                      <th className="cart-product-name">Product</th>
                      <th className="product-price">Unit Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-subtotal">Total</th>
                      <th className="product-remove">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((product, index) => (
                      <tr key={index}>
                        <td className="product-thumbnail">
                          <Link href={`/product-details/${product.slug || product.id}`}>
                              <Image src={product.img} alt="wishlist-img" width={125} height={159} />
                          </Link>
                        </td>
                        <td className="product-name">
                          <Link href={`/product-details/${product.slug || product.id}`}>
                              {product.title}
                          </Link>
                        </td>
                        <td className="product-price">
                          <span className="amount">{formatPrice(product.price)}</span>
                        </td>
                        <td className="product-quantity">
                          {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                            <button className="os-btn os-btn-black" style={{ cursor: 'not-allowed', backgroundColor: '#ccc', borderColor: '#ccc', color: '#666' }} disabled>
                              Out of Stock
                            </button>
                          ) : (
                            <button onClick={() => dispatch(add_cart_product(product))} className="os-btn os-btn-black" type="submit">Add TO Cart</button>
                          )}
                        </td>
                        <td className="product-subtotal">
                          <span className="amount">{formatPrice(product.price)}</span>
                        </td>
                        <td className="product-remove">
                          <button onClick={() => handleRemove(product)}>
                            <i className="fa fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishlistArea;