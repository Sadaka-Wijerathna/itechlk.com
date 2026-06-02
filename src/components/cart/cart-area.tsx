'use client'
import Link from 'next/link';
import Image from 'next/image';
import {useEffect} from 'react';
// internal
import useCartInfo from '@/hooks/use-cart-info';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {add_cart_product,clearCart,getCartProducts,quantityDecrement,remove_product} from '@/redux/features/cart';

const CartArea = () => {
  const { cart_products } = useAppSelector((state) => state.cart);
  const { total } = useCartInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      dispatch(getCartProducts())
    }
  }, [dispatch]);

  return (
    <section className="cart-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
            {cart_products.length === 0 &&
                <div className='text-center'>
                  <h3>Your cart is empty</h3>
                  <Link href="/shop" className="os-btn os-btn-2 mt-30">Return to shop</Link>
                </div>
              }
              {cart_products.length > 0 && <div>
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
                      {cart_products.map((item, index) => (
                        <tr key={index}>
                          <td className="product-thumbnail">
                            <Link href={`/product-details/${item.id}`}>
                                <Image src={item.img} alt="cart_img" width={125} height={160} />
                            </Link>
                          </td>
                          <td className="product-name">
                            <Link href={`/product-details/${item.id}`}>
                               {item.title}
                            </Link>
                            {item.selectedDuration && (
                              <div className="mt-1" style={{ fontSize: '13px', color: '#666' }}>
                                Duration: {item.selectedDuration}
                              </div>
                            )}
                          </td>
                          <td className="product-price">
                            <span className="amount">${item.price}</span>
                          </td>
                          <td className="product-quantity">
                            <div className="cart-plus-minus">
                              <input type="text" value={item.orderQuantity} readOnly />
                              <div onClick={() => dispatch(quantityDecrement(item))} className="dec qtybutton">-</div>
                              <div 
                                onClick={() => dispatch(add_cart_product(item))} 
                                className="inc qtybutton"
                              >+</div>
                            </div>
                          </td>
                          <td className="product-subtotal">
                            <span className="amount">${item.price * item.orderQuantity!}</span>
                          </td>
                          <td onClick={() => dispatch(remove_product(item))} className="product-remove">
                            <button ><i className="fa fa-times"></i></button>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="coupon-all">
                      <div className="coupon">
                        <input required id="coupon_code" className="input-text" name="coupon_code" placeholder="Coupon code" type="text" />
                        <button className="os-btn os-btn-black" name="apply_coupon" type="submit">Apply coupon</button>
                      </div>
                      <div className="coupon2">
                        <button onClick={() => dispatch(clearCart())} className="os-btn os-btn-black" 
                        name="update_cart" type="button">Clear cart</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5 ms-auto">
                    <div className="cart-page-total">
                      <h2>Cart totals</h2>
                      <ul className="mb-20">
                        <li>Subtotal <span>${total.toFixed(2)}</span></li>
                        <li>Total <span>${total.toFixed(2)}</span></li>
                      </ul>
                      <Link href='/checkout' className="os-btn">
                         Proceed to checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </section>
  );
};

export default CartArea;