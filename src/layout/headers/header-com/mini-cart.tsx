'use client'
import Link from 'next/link';
import useCartInfo from '@/hooks/use-cart-info';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { remove_product } from '@/redux/features/cart';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';

const MiniCart = () => {
  const cartItems = useAppSelector(state => state.cart.cart_products);
  const dispatch = useAppDispatch();
  const { total } = useCartInfo();
  const { formatPrice } = useCurrency();

  return (
    <>
      <div className="mini-cart">
        {cartItems.length === 0 && <h5>Your cart is empty</h5>}
        {cartItems.length >= 1 && <div className="mini-cart-inner">
          <ul className={`mini-cart-list ${cartItems.length > 2 ? 'slider-height' : ''} 
          ${cartItems.length > 1 ? 'slider-height-2' : ''}`}>

            {cartItems.map((item, index) => (
              <li key={index}>
                <div className="cart-img f-left">
                  <Link href={`/product-details/${item.slug || item.id}`}>
                      <Image src={item.img} alt="cart-img" width={75} height={96} />
                  </Link>
                </div>
                <div className="cart-content f-left text-start">
                  <h5>
                    <Link href={`/product-details/${item.slug || item.id}`}>
                       {item.title}
                    </Link>
                  </h5>
                  <div className="cart-price">
                    <span className="ammount">{item.orderQuantity} <i className="fal fa-times"></i></span>
                    <span className="price">{formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className="del-icon f-right mt-30">
                  <button onClick={() => dispatch(remove_product(item))}>
                    <i className="fal fa-times"></i>
                  </button>
                </div>
              </li>
            ))}

          </ul>
          <div className="total-price d-flex justify-content-between mb-30">
            <span>Subtotal:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="checkout-link">
            <Link href={'/cart'} className="os-btn">
              view Cart
            </Link>
            <Link href={'/checkout'} className="os-btn os-btn-black">
              Checkout
            </Link>
          </div>
        </div>}

      </div>
    </>
  );
};

export default MiniCart;