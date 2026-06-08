"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// internal
import { IProduct } from "@/types/product-d-t";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_to_wishlist } from "@/redux/features/wishlist";
import { add_to_compare } from "@/redux/features/compare";
import { handleModalProduct, handleOpenModal } from "@/redux/features/utility";
import { useCurrency } from "@/context/CurrencyContext";

// img style 
const imgStyle = { width: "100%", height: "100%", };

const ProductItem = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  const { cart_products } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { compare_products } = useAppSelector((state) => state.compare);
  const dispatch = useAppDispatch();
  const { formatPrice } = useCurrency();

  // derived state instead of setState in useEffect
  const isItemAddToCart = cart_products.some((i) => i.id === product.id);
  const isWishlistAdd = wishlist.some((i) => i.id === product.id);
  const isCompareAdd = compare_products.some((i) => i.id === product.id);
  // Derive out-of-stock from multiple fields (DB source of truth)
  const isOutOfStock = (product as any).active === false || product.status?.toLowerCase() === "out of stock";

  const handleProductModal = (prd: IProduct) => {
    dispatch(handleModalProduct({ product: prd }));
    dispatch(handleOpenModal());
  };

  return (
    <div className="product__wrapper mb-60 position-relative">
      <div className="product__thumb">
        <Link href={`/product-details/${product.id}`}>
       <Image src={product.img} alt="product-img" width={255} height={325} style={imgStyle} /> <Image className="product__thumb-2" src={product.thumb_img} alt="product-img" width={255} height={325} style={imgStyle} />
        </Link>
        <div className="product__action transition-3">
          <a
            onClick={() => dispatch(add_to_wishlist(product))}
            className={`cursor-pointer ${isWishlistAdd ? "active" : ""}`}
            title="Add to Wishlist"
          >
            <i className="fal fa-heart"></i>
          </a>
          <a
            onClick={() => dispatch(add_to_compare(product))}
            className={`cursor-pointer ${isCompareAdd ? "active" : ""}`}
            title="Compare"
          >
            <i className="fal fa-sliders-h"></i>
          </a>
          <a className="cursor-pointer" onClick={() => handleProductModal(product)}>
            <i className="fal fa-search"></i>
          </a>
        </div>
        <div className="product__sale">
          {isOutOfStock ? (
            <span className="out-of-stock">Out of Stock</span>
          ) : product.status?.toLowerCase() === "pre order" ? (
            <span className="pre-order">Pre Order</span>
          ) : (
            <>
              {product.new && <span className="new">new</span>}
              {(product.discount ?? 0) > 0 && <span className="percent">-{product.discount}%</span>}
            </>
          )}
        </div>
      </div>
      <div className="product__content p-relative">
        <div className="product__content-inner">
          <h4>
            <Link
              href={`/product-details/${product.id}`}
              dangerouslySetInnerHTML={{ __html: product.title }}
            />
          </h4>
          <div className="product__price transition-3">
            <span>{formatPrice(product.price)}</span>
            {product.old_price && <span className="old-price">{formatPrice(product.old_price)}</span>}
          </div>
        </div>
        <div className="add-cart p-absolute transition-3">
          {isOutOfStock ? (
            <span style={{ color: "#cc0000", fontWeight: 600, fontSize: 13, cursor: "default" }}>Out of Stock</span>
          ) : (
            <button
              onClick={() => router.push(`/product-details/${product.id}`)}
              className="cursor-pointer"
            >
              + Select duration
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
