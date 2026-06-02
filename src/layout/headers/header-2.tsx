"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useCurrency, type Currency } from "@/context/CurrencyContext";
// internal
import NavManus from "./header-com/nav-manus";
import useCartInfo from "@/hooks/use-cart-info";
import useSticky from "@/hooks/use-sticky";
import logo from "@/assets/img/logo/logo.png";
import SearchPopup from "./header-com/search-popup";
import MiniCart from "./header-com/mini-cart";
const OffCanvas = dynamic(() => import('@/components/common/offcanvas'), {
  ssr: false
})

const HeaderTwo = () => {
  const { data: session, status } = useSession();
  const { sticky } = useSticky();
  const { quantity } = useCartInfo();
  const { currency, setCurrency } = useCurrency();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <>
      <header>
        <div
          id="header-sticky"
          className={`header__area header__transparent box-25 ${sticky ? "sticky" : ""}`}
        >
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6">
                <div className="d-flex align-items-center">
                  <div className="mobile-menu-btn d-lg-none mr-15">
                    <button
                      onClick={() => setShowSidebar(true)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: '#000' }}
                    >
                      <i className="fas fa-bars"></i>
                    </button>
                  </div>
                  <div className="logo">
                    <Link href="/">
                      <Image src={logo} alt="logo" priority />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 d-none d-lg-block">
                <div className="main-menu position-relative">
                  <nav>
                    <NavManus />
                  </nav>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-8 col-sm-8 col-6">
                <div className="header__right p-relative d-flex justify-content-end align-items-center">
                  <div className="header__action">
                    <ul>
                      <li className="d-none d-sm-inline-block">
                        <button
                          className="search-toggle"
                          onClick={() => setShowSearch(true)}
                        >
                          <i className="ion-ios-search-strong"></i>
                        </button>
                      </li>
                      <li>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as Currency)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none', fontWeight: 500, color: '#333' }}
                        >
                          <option value="USD">USD</option>
                          <option value="LKR">LKR</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </li>
                      <li className="d-none d-sm-inline-block">
                        <Link href="/wishlist" className="action-btn">
                          <i className="far fa-heart"></i>
                        </Link>
                      </li>
                      <li>
                        <button className="cart">
                          <i className="ion-bag"></i>{" "}
                          <span>({quantity})</span>
                        </button>
                        {/* cart area start */}
                        <MiniCart />
                        {/* cart area end */}
                      </li>
                      <li>
                        {status === "authenticated" ? (
                          <>
                            <Link href="/account" className="os-btn os-btn-2 d-none d-md-inline-block" style={{ height: '38px', lineHeight: '36px', padding: '0 20px' }}>
                              My Account
                            </Link>
                            <Link href="/account" className="action-btn d-inline-block d-md-none">
                              <i className="far fa-user"></i>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/login" className="os-btn os-btn-2 d-none d-md-inline-block" style={{ height: '38px', lineHeight: '36px', padding: '0 20px' }}>
                              Login
                            </Link>
                            <Link href="/login" className="action-btn d-inline-block d-md-none">
                              <i className="far fa-user"></i>
                            </Link>
                          </>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* search popup start */}
      <SearchPopup showSearch={showSearch} setShowSearch={setShowSearch} />
      {/* search popup end */}

      {/* offcanvas start */}
      <OffCanvas openMobileMenus={showSidebar} setOpenMobileMenus={setShowSidebar} />
      {/* offcanvas end */}
    </>
  );
};

export default HeaderTwo;
