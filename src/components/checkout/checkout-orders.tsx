'use client'
import useCartInfo from "@/hooks/use-cart-info";
import { IProduct } from "@/types/product-d-t";
import { useCurrency } from "@/context/CurrencyContext";

// prop type 
type IProps = {
  cart_products:IProduct[];
  discountAmount?: number;
}

const CheckoutOrders = ({cart_products, discountAmount = 0}:IProps) => {
  const { total } = useCartInfo();
  const { formatPrice } = useCurrency();

  return (
    <div className="your-order-table table-responsive">
      {cart_products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="product-name">Product</th>
              <th className="product-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart_products.map((item,i) => (
            <tr key={i} className="cart_item">
              <td className="product-name">
                {item.title}{" "}
                <strong className="product-quantity"> × {item.orderQuantity}</strong>
              </td>
              <td className="product-total">
                <span className="amount">{formatPrice(item.price * item.orderQuantity!)}</span>
              </td>
            </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="cart-subtotal">
              <th>Cart Subtotal</th>
              <td>
                <span className="amount">{formatPrice(total)}</span>
              </td>
            </tr>
            {discountAmount > 0 && (
              <tr className="cart-discount">
                <th>Discount</th>
                <td>
                  <span className="amount" style={{ color: '#10b981' }}>-{formatPrice(discountAmount)}</span>
                </td>
              </tr>
            )}
            <tr className="order-total">
              <th>Order Total</th>
              <td>
                <strong>
                  <span className="amount">
                    {formatPrice(total - discountAmount)}
                  </span>
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default CheckoutOrders;
