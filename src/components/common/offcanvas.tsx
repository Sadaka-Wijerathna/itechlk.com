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
            <a
              onClick={() => setOpenMobileMenus(false)}
              className="extra__info-close-btn cursor-pointer"
            >
              <i className="fal fa-times"></i>
            </a>
          </div>

          <nav className="side-mobile-menu d-block d-lg-none mm-menu">
            <ul>
              {mobile_menus.map((menu, i) => (
                <li
                  key={i}
                  className={`${menu.dropdownMenu ? "menu-item-has-children has-droupdown" : ""} ${activeMenu === menu.title ? "active" : ""}`}
                >
                  {menu.dropdownMenu && <a onClick={() => handleOpenMenu(menu.title)}>{menu.title}</a>}
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
