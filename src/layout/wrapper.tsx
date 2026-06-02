"use client";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { getCartProducts, initialOrderQuantity } from "@/redux/features/cart";
import { getWishlistProducts } from "@/redux/features/wishlist";
import { getCompareProducts } from "@/redux/features/compare";
import ProductModal from "@/components/common/modals/product-modal";
import BackToTop from "@/components/common/back-to-top";
import WhatsappButton from "@/components/common/whatsapp-button";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Bootstrap only load in client
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    dispatch(initialOrderQuantity());
    dispatch(getCartProducts());
    dispatch(getWishlistProducts());
    dispatch(getCompareProducts());
  }, [router, dispatch]);

  return (
    <>
      {children}
      {pathname === "/" && <WhatsappButton />}
      <BackToTop />
      <ProductModal />
      <ToastContainer />
    </>
  );
};

export default Wrapper;
