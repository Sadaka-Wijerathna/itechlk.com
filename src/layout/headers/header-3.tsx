"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
// internal
import ExtraInfo from "./header-com/extra-info";
import NavManus from "./header-com/nav-manus";
import useCartInfo from "@/hooks/use-cart-info";
import useSticky from "@/hooks/use-sticky";
import logo from "@/assets/img/logo/logo.png";
import SearchPopup from "./header-com/search-popup";
import MiniCart from "./header-com/mini-cart";
const OffCanvas = dynamic(() => import('@/components/common/offcanvas'), {
  ssr: false
})

const HeaderThree = () => {
  const { sticky } = useSticky();
  const { quantity } = useCartInfo();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  return (
    <>
      <header>
        <div id="header__transparent" className="header__area header__transparent">
          <div className="container">
            <div className="header__top header__top-2">
              <div className="row align-items-center">
                <div className="col-xl-4 col-lg-4 col-md-3 col-sm-12">
                  <div className="header__welcome">
                    <span>Welcome to ITechLK Store!</span>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-3 col-sm-5">
                  <div className="logo logo__6 text-md-center">
                    <Link href="/">
                      <Image src={logo} alt="logo" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-7">
                  <div className="header__right p-relative d-flex justify-content-between justify-content-sm-end align-items-center">
                    <div className="mobile-menu-btn d-lg-none">
                      <button
                        className="mobile-menu-toggle"
                        onClick={() => setShowSidebar(true)}
                      >
                        <i className="fas fa-bars"></i>
                      </button>
                    </div>
                    <div className="header__action">
                      <ul>
                        <li>
                          <button className="search-toggle" onClick={() => setShowSearch(true)}>
                            <i className="ion-ios-search-strong"></i> Search
                          </button>
                        </li>
                        <li>
                          <button className="cart">
                            <i className="ion-bag"></i> Cart{" "}
                            <span>({quantity})</span>
                          </button>
                          {/* cart area start */}
                          <MiniCart />
                          {/* cart area end */}
                        </li>
                        <li>
                          <button>
                            <i className="far fa-bars"></i>
                          </button>
                          <ul className="extra-info">
                            <ExtraInfo />
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="header-sticky" className={`header__bottom ${sticky ? "sticky" : ""}`}>
              <div className="row">
                <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
                  <div className="main-menu d-none d-lg-flex justify-content-center position-relative">
                    <nav>
                      <NavManus />
                    </nav>
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

export default HeaderThree;
