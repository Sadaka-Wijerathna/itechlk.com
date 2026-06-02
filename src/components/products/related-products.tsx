import { IProduct } from '@/types/product-d-t';
import ProductItem from './single-product/product-item';

// props
type IProps = {
  product_data: IProduct[];
  product: IProduct;
};
const RelatedProducts = ({ product_data, product }: IProps) => {
  const related_product = product_data.filter(p => p.category === product.category);
  return (
    <section className="related__product pb-60">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__title-wrapper text-center mb-55">
              <div className="section__title mb-10">
                <h2 style={{ fontWeight: 600 }}>Related <span style={{ color: '#21a8c9' }}>Products</span></h2>
              </div>
              <div className="section__sub-title">
                <p>Mirum est notare quam littera gothica quam nunc putamus parum claram!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5">
          {related_product.slice(0, 5).map((product, i) => (
            <div key={i} className="col">
              <div className="product__item">
                <ProductItem product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;