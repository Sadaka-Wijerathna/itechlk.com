import Image from "next/image";
import { IProduct } from "@/types/product-d-t";
import ProductItem from "./single-product/product-item";
import Link from "next/link";

// prop type
type IProps = {
  products: IProduct[];
  style_2?:boolean;
};

const TrendingProductsThree = ({products,style_2=false}: IProps) => {
  const big_item_1 = products.filter((p) => p.big_img)[0];
  const big_item_2 = products.filter((p) => p.big_img)[style_2 ? 3 : 1];
  const trending_products = products.filter((p) => p.trending);

  return (
    <section className="product__area pt-60 pb-65">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__title-wrapper text-center mb-55">
              <div className="section__title mb-10">
                <h2>Trending Products</h2>
              </div>
              <div className="section__sub-title">
                <p>
                  Mirum est notare quam littera gothica quam nunc putamus parum claram!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
              <div className="row">
                {trending_products.slice(0, 2).map((item) => (
                  <div key={item.id} className="col-lg-6 col-md-6 product__item">
                    <ProductItem product={item} />
                  </div>
                ))}
              </div>
            <div className="product__banner mb-30">
              <Link href={`/product-details/${big_item_2.slug || big_item_2.id}`} className="w-img">
                <Image src={big_item_2.big_img!} alt="product_img" width={546} height={543} />
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="product__banner w-img pb-25 mb-30 p-relative">
              <Link href={`/product-details/${big_item_1.slug || big_item_1.id}`} className="w-img">
                <Image src={big_item_1.big_img!} alt="product_img" width={546} height={543} />
              </Link>
              <div className="product__banner-content p-absolute">
                <h4>
                  <Link href={`/product-details/${big_item_1.slug || big_item_1.id}`}>
                    <span dangerouslySetInnerHTML={{ __html: big_item_1?.title }}></span>
                  </Link>
                </h4>
                <Link href={`/product-details/${big_item_1.slug || big_item_1.id}`} className="link-btn">
                  discover now
                </Link>
              </div>
            </div>
              <div className="row">
                {trending_products.slice(2, 4).map((item) => (
                  <div key={item.id} className="col-lg-6 col-md-6 product__item">
                    <ProductItem product={item} />
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProductsThree;
