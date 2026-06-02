import Link from "next/link";
import { IProduct } from "@/types/product-d-t";
import Image from "next/image";

// prop type
type IProps = {
  style_2?: boolean;
  style_3?: boolean;
  products: IProduct[];
};

// img style
const imgStyle = {
  width: "100%",
  height: "100%",
};

const BannerProducts = ({ style_2, products, style_3 }: IProps) => {
  const bannerProducts = products.filter((p) => p.banner).slice(0, 2);
  return (
    <div className="banner__area-2 pt-60 pb-60 grey-bg">
      <div className={`container-fluid ${style_2 ? "" : "p-0"}`}>
        <div className="row g-0">
          {bannerProducts.map((item, index) => (
            <div
              key={item.id}
              className={`col-xl-6 col-lg-6 ${index === 0 ? "banner-right pr-15" : "banner-left pl-15"}`}
            >
              <div className="banner__item-2 p-relative mb-30">
                <div className="banner__thumb fix">
                  <Link href={`/product-details/${item.id}`} className="w-img">
                    <Image
                      src={item.banner_img!}
                      alt="banner"
                      width={937}
                      height={451}
                      style={imgStyle}
                    />
                  </Link>
                </div>
                <div
                  className={`banner__content-2 ${style_3 ? "banner__content-4" : ""} ${index !== 0 && style_3 ? "banner__content-4-right" : "" } p-absolute transition-3`}
                >
                  <span>Products {item.category}</span>
                  <h4>
                    <Link href={`/product-details/${item.id}`}>{item.title}</Link>
                  </h4>
                  <p style={{ maxWidth: style_3 ? "250px" : "450px" }}>
                    {style_3 ? item.sm_desc.slice(0, 50) : item.sm_desc}
                  </p>
                  <Link
                    href={`/product-details/${item.id}`}
                    className="os-btn os-btn-2"
                  >
                    buy now / <span>${item.price.toFixed(2)}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProducts;
