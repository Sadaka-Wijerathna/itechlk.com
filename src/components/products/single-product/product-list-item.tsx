'use client'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product-d-t";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";
import { handleModalProduct, handleOpenModal } from "@/redux/features/utility";
import { add_to_compare } from "@/redux/features/compare";
import { add_to_wishlist } from "@/redux/features/wishlist";
import { useCurrency } from "@/context/CurrencyContext";

// props type
type IProps = {
  product: IProduct;
};

// img style
const imgStyle = {
  width: "100%",
  height: "100%",
};

const ProductListItem = ({ product }: IProps) => {
  const router = useRouter();
  const { id, img, details, title, old_price, discount, thumb_img, price, sm_desc } = product || {};
  const { cart_products } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { compare_products } = useAppSelector((state) => state.compare);
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();

  // derived state
  const isItemAddToCart = cart_products.some((i) => i.id === product.id);
  const isWishlistAdd = wishlist.some((i) => i.id === product.id);
  const isCompareAdd = compare_products.some((i) => i.id === product.id);

  const handleProductModal = (prd: IProduct) => {
    dispatch(handleModalProduct({ product: prd }));
    dispatch(handleOpenModal());
  };

  return (
    <div className="product__wrapper mb-40">
      <div className="row">
        <div className="col-xl-4 col-lg-4 col-4">
          <div className="product__thumb">
            <Link href={`/product-details/${id}`}>
              <Image src={img} alt="product-img" width={255} height={325} style={imgStyle} />
              <Image src={thumb_img} alt="product-img" width={255} height={325} style={imgStyle} className="product__thumb-2" />
            </Link>
            <div className="product__sale">
              {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                <span className="out-of-stock">out of stock</span>
              ) : product.status?.toLowerCase() === "pre order" ? (
                <span className="pre-order">pre order</span>
              ) : (
                <>
                  {product.new && <span className="new">new</span>}
                  {discount && discount > 0 ? <span className="percent">-{discount}%</span> : null}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-8 col-8">
          <div className="product__content p-relative">
            <div className="product__content-inner list">
              <h4><Link href={`/product-details/${id}`}>{title}</Link></h4>
              <div className="product__price-2 mb-10">
                <span>{formatPrice(price)}</span>
                {old_price && <span className="old-price">{formatPrice(old_price)}</span>}
              </div>
              <p>{sm_desc}</p>
              <div className="product__list mb-30">
                <ul>
                  {details.details_list.slice(0, 3).map((l, i) => (
                    <li key={i}><span>{l}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="add-cart-list d-sm-flex align-items-center">
              {(product as any).active === false || product.status?.toLowerCase() === "out of stock" ? (
                <span className="add-cart-btn mr-10" style={{ cursor: 'not-allowed', backgroundColor: '#ccc', borderColor: '#ccc', color: '#666' }}>
                  Out of Stock
                </span>
              ) : (
                <button
                  onClick={() => router.push(`/product-details/${id}`)}
                  className="add-cart-btn mr-10 cursor-pointer"
                >
                  Select duration
                </button>
              )}
              <div className="product__action-2 transition-3 mr-20">
                <a onClick={() => dispatch(add_to_wishlist(product))} className={`cursor-pointer ${isWishlistAdd ? "active" : ""}`} title="Add to Wishlist">
                  <i className="fal fa-heart"></i>
                </a>
                <a onClick={() => dispatch(add_to_compare(product))} className={`cursor-pointer ${isCompareAdd ? "active" : ""}`} title="Compare">
                  <i className="fal fa-sliders-h"></i>
                </a>
                <a onClick={() => handleProductModal(product)} className="cursor-pointer">
                  <i className="fal fa-search"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
