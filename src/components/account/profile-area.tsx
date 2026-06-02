"use client";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/redux/hook';

const ProfileArea = () => {
  const { data: session } = useSession();
  const { cart_products } = useAppSelector(state => state.cart);
  return (
    <section className="profile__area pt-120 pb-50 bg-white">
    <div className="container">
      <div className="profile__basic-inner pb-20 bg-white">
        <div className="row align-items-center">
          <div className="col-xxl-6 col-md-6">
            <div className="profile__basic d-md-flex align-items-center">
              <div className="profile__basic-thumb mr-30">
                <img src={session?.user?.image || "/assets/img/testimonial/person-1.jpg"} alt="profile"/>
              </div>
              <div className="profile__basic-content">
                <h3 className="profile__basic-title">
                  Welcome Back <span>{(session?.user as any)?.firstName ? `${(session?.user as any).firstName} ${(session?.user as any).lastName}` : session?.user?.name || "User"}</span>
                </h3>
                <p>Welcome to our store! <Link href="/shop">View Products</Link></p>
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="profile__basic-cart d-flex align-items-center justify-content-md-end">
              <div className="cart-info mr-10">
                <Link href="/cart">View cart</Link>
              </div>
              <div className="cart-item">
                <Link href="/cart">
                  <i className="fa-regular fa-basket-shopping"></i>
                  <span className="cart-quantity">{cart_products.length}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default ProfileArea;