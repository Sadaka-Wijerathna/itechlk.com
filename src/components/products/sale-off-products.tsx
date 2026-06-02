import { IProduct } from "@/types/product-d-t";
import ProductItem from "./single-product/product-item";

// prop type
type IProps = {
  products: IProduct[];
  spacing?: string;
  style_2?: boolean;
};

const SaleOffProducts = ({products,spacing = "pb-100",style_2 = false}:IProps) => {
  const discount_products = products.filter((p) => p.discount! > 0);
  return (
    <section className={`sale__area ${spacing}`}>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__title-wrapper text-center mb-55">
              <div className="section__title mb-10">
                <h2>Sale Off</h2>
              </div>
              <div className="section__sub-title">
                <p>
                  Mirum est notare quam littera gothica quam nunc putamus parum claram!
                </p>
              </div>
            </div>
          </div>
        </div>
        {!style_2 && (
          <div className="sale__area-slider">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
              {discount_products.slice(0, 5).map((product, i) => (
                <div key={i} className="col sale__item">
                  <ProductItem product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {style_2 && (
        <div className="container-fluid">
            <div className="row">
              {discount_products.slice(0, 12).map((product, i) => (
                <div key={i} className="col-xl-2 col-lg-3 col-md-4 col-6 sale__item">
                  <ProductItem product={product} />
                </div>
              ))}
            </div>
        </div>
      )}
    </section>
  );
};

export default SaleOffProducts;
