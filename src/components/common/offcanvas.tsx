'use client';
import React from "react";
import { mobile_menus } from "@/data/menu-data";
import Link from "next/link";

// prop type
type IProps = {
  openMobileMenus: boolean;
  setOpenMobileMenus: React.Dispatch<React.SetStateAction<boolean>>;
};

const OffCanvas = ({ openMobileMenus, setOpenMobileMenus }: IProps) => {
  const [activeMenu, setActiveMenu] = React.useState("");

  const handleOpenMenu = (navTitle: string) => {
    if (navTitle === activeMenu) {
      setActiveMenu("");
    } else {
      setActiveMenu(navTitle);
    }
  };
  return (
    <>
      <section
        className={`extra__info transition-3 ${openMobileMenus ? "info-opened" : ""}`}
      >
        <div className="extra__info-inner">
          <div className="extra__info-close text-end">
            <button
              type="button"
              onClick={() => setOpenMobileMenus(false)}
              className="extra__info-close-btn cursor-pointer"
              aria-label="Close menu"
            >
              <i className="fal fa-times"></i>
            </button>
          </div>

          <nav className="side-mobile-menu d-block d-lg-none mm-menu">
            <ul>
              {mobile_menus.map((menu, i) => (
                <li
                  key={i}
                  className={`${menu.dropdownMenu ? "menu-item-has-children has-droupdown" : ""} ${activeMenu === menu.title ? "active" : ""}`}
                >
                  {menu.dropdownMenu && (
                    <button
                      type="button"
                      onClick={() => handleOpenMenu(menu.title)}
                      className="border-0 bg-transparent p-0 text-start w-100"
                      style={{ font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                    >
                      {menu.title}
                    </button>
                  )}
                  {menu.dropdownMenu ? (
                    <ul className={`sub-menu ${activeMenu === menu.title ? "active" : ""}`}>
                      {menu.dropdownMenu.map((sub_m, index) => (
                        <li key={index}>
                          <Link href={sub_m.link}>{sub_m.title}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Link href={menu.link!}>{menu.title}</Link>
                  )}
                </li>
              ))}
            </ul>


          </nav>

        </div>
      </section>

      <div
        onClick={() => setOpenMobileMenus(false)}
        className={`body-overlay transition-3 ${openMobileMenus ? "opened" : ""
          }`}
      ></div>
    </>
  );
};

export default OffCanvas;
