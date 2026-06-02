import { useMemo } from "react";
import { useAppSelector } from "@/redux/hook";

const useCartInfo = () => {
  const { cart_products } = useAppSelector((state) => state.cart);

  const { quantity, total } = useMemo(() => {
    return cart_products.reduce(
      (cartTotal, cartItem) => {
        const { price, orderQuantity } = cartItem;
        if (typeof orderQuantity !== "undefined") {
          const itemTotal = price * orderQuantity;
          cartTotal.quantity += orderQuantity;
          cartTotal.total += itemTotal;
        }
        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );
  }, [cart_products]);
  
  return {
    quantity,
    total,
  };
};

export default useCartInfo;