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

const HeaderFour = () => {
  const { sticky } = useSticky();
  const { quantity } = useCartInfo();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  return (
    <>
      <header>
        <div id="header-sticky" className={`header__area header__transparent header__transparent-2 pt-15 pb-15 box-25 ${sticky ? "sticky" : ""}`}
        >
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-3">
                <div className="logo">
                  <Link href="/">
                    <Image src={logo} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-7 col-lg-6 col-md-1 col-sm-1">
                <div className="main-menu main-menu-3 d-none d-lg-block p-relative">
                  <nav>
                    <NavManus />
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-7 col-sm-8">
                <div className="header__right p-relative d-flex justify-content-between justify-content-sm-end align-items-center">
                  <div className="mobile-menu-btn d-lg-none">
                    <button className="mobile-menu-toggle" onClick={() => setShowSidebar(true)}>
                      <i className="fas fa-bars"></i>
                    </button>
                  </div>
                  <div className="header__action">
                    <ul>
                      <li>
                        <button className="search-toggle" onClick={() => setShowSearch(true)}>
                          <i className="fas fa-search"></i>
                        </button>
                      </li>
                      <li>
                        <button className="cart">
                          <i className="fas fa-cart-plus"></i>
                          <span className="cart-number-2">{quantity}</span>
                        </button>
                        <nav>
                          {/* cart area start */}
                          <MiniCart />
                          {/* cart area end */}
                        </nav>
                      </li>
                      <li>
                        <button>
                          <i className="fas fa-user"></i>
                        </button>
                        <ExtraInfo />
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

export default HeaderFour;
