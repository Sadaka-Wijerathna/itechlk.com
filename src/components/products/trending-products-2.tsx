import Link from 'next/link';
import { IProduct } from '@/types/product-d-t';
import Image from 'next/image';
import ProductItem from './single-product/product-item';

// prop type 
type IProps = {
  products:IProduct[]
}

const TrendingProductsTwo = ({products}:IProps) => {
  const big_item = products.find(p => p.big_img)!;
  const trending_products = products.filter(p => p.trending).slice(0, 6);
  return (
    <section className="product__area pt-60 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__title-wrapper text-center mb-55">
              <div className="section__title mb-10">
                <h2>Trending Products</h2>
              </div>
              <div className="section__sub-title">
                <p>Mirum est notare quam littera gothica quam nunc putamus parum claram!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="product__banner p-relative">
          <div className="product__banner-inner p-absolute fix d-none d-lg-block">
            <div className="product__banner-img fix">
              <Link href={`/product-details/${big_item.id}`}>
                <Image src={big_item.big_img!} alt="product-banner" width={905} height={900} />
              </Link>
            </div>
            <div className="product__banner-content p-absolute">
              <h4>
                <Link href={`/product-details/${big_item.id}`}>
                  <span dangerouslySetInnerHTML={{ __html: big_item.title }}></span>
                </Link>
              </h4>
              <Link href={`/product-details/${big_item.id}`} className="link-btn">
                discover now
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 offset-xl-6 col-lg-6 offset-lg-6">
                <div className="row">
                  {trending_products.map((item) => (
                    <div key={item.id} className="col-lg-4 col-md-6 product__item">
                      <ProductItem product={item} />
                    </div>
                  ))}
                </div>
            </div> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProductsTwo;