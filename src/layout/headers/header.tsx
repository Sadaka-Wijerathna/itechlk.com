'use client'
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// internal
import ExtraInfo from './header-com/extra-info';
import NavManus from './header-com/nav-manus';
import useCartInfo from '@/hooks/use-cart-info';
import useSticky from '@/hooks/use-sticky';
import logo from '@/assets/img/logo/logo.png';
import SearchPopup from './header-com/search-popup';
const OffCanvas = dynamic(() => import('@/components/common/offcanvas'), {
  ssr: false
})
const MiniCart = dynamic(() => import('./header-com/mini-cart'), { ssr: false })

// props 
type IProps = {
  header_big?:boolean;
  white_bg?:boolean;
}

const Header = ({header_big,white_bg}:IProps) => {
  const {sticky} = useSticky();
  const {quantity} = useCartInfo();
  const [showSidebar,setShowSidebar] = useState<boolean>(false);
  const [showSearch,setShowSearch] = useState<boolean>(false);
  return (
    <>
    <header>
    <div id="header-sticky" className={`header__area ${header_big ? 'box-25' : !white_bg && 'grey-bg'} 
    ${sticky ? 'sticky' : ''}`}>
      <div className={`${header_big ? 'container-fluid' : 'container'}`}>
        <div className="row align-items-center">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4">
            <div className="logo">
              <Link href="/">
                  <Image src={logo} alt="logo" priority />
              </Link>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-8 col-sm-8">
            <div className="header__right p-relative d-flex justify-content-between align-items-center">
              <div className="main-menu d-none d-lg-block">
                <nav>
                  <NavManus />
                </nav>
              </div>
              <div className="mobile-menu-btn d-lg-none">
                <button onClick={()=> setShowSidebar(true)} className="mobile-menu-toggle" aria-label="Open mobile menu">
                  <i className="fas fa-bars"></i>
                </button>
              </div>
              <div className="header__action">
                <ul>
                  <li>
                    <button className="search-toggle" onClick={() => setShowSearch(true)}>
                      <i className="ion-ios-search-strong"></i> 
                      Search
                    </button>
                  </li>
                  <li> 
                    <button aria-label="Toggle user info">
                      <i className="far fa-bars"></i>
                    </button>
                    <ExtraInfo/>
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
     <SearchPopup showSearch={showSearch} setShowSearch={setShowSearch}/>
    {/* search popup end */}

    {/* offcanvas start */}
    <OffCanvas openMobileMenus={showSidebar} setOpenMobileMenus={setShowSidebar} />
    {/* offcanvas end */}
    </>
  );
};

export default Header;