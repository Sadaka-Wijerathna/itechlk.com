"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";

const navItems = [
  { href: "/admin", label: "Overview", icon: "fa fa-tachometer-alt" },
  { href: "/admin/products", label: "Products", icon: "fa fa-archive" },
  { href: "/admin/blogs", label: "Blogs", icon: "fa fa-newspaper" },
  { href: "/admin/comments", label: "Comments", icon: "fa fa-comments" },
  { href: "/admin/orders", label: "Orders", icon: "fa fa-file" },
  { href: "/admin/users", label: "Users", icon: "fa fa-users" },
  { href: "/admin/settings", label: "Settings", icon: "fa fa-cog" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <HeaderTwo />
      <Breadcrumb title="Admin Panel" subtitle="Dashboard" />

      <section className="profile__menu pb-70 bg-white" style={{ paddingTop: "50px" }}>
        <div className="container-fluid" style={{ padding: '20px 60px' }}>
          <div className="row">
            {/* Sidebar */}
            <div className="col-xxl-2 col-md-3">
              <div className="profile__menu-left bg-white mb-50" style={{ borderRadius: 0, border: '1px solid #eaedff' }}>
                <div className="profile__menu-tab">
                  <div
                    className="nav nav-tabs flex-column justify-content-start text-start"
                    role="tablist"
                  >
                    {navItems.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`nav-link${active ? " active" : ""}`}
                          style={{ borderRadius: 0 }}
                        >
                          <i className={item.icon}></i> {item.label}
                        </Link>
                      );
                    })}
                    <button
                      className="nav-link logout-link"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      style={{ borderRadius: 0 }}
                    >
                      <i className="fa fa-sign-out"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-xxl-10 col-md-9">
              <div className="profile__menu-right">
                <div className="tab-content">
                  <div className="tab-pane fade show active">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
