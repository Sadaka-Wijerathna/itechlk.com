import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types/product-d-t';

// prop type 
type IProps = {
  products:IProduct[];
}

const FeatureProducts = ({products}:IProps) => {
  return (
    <div className="sidebar__widget">
      <div className="sidebar__widget-title mb-30">
          <h3>Featured Products</h3>
      </div>
      <div className="sidebar__widget-content">
          <div className="features__product">
              <ul>
                {products.map((prd,i) => (
                  <li key={i} className="mb-20">
                      <div className="featires__product-wrapper d-flex">
                          <div className="features__product-thumb mr-15">
                              <Link href={`/product-details/${prd.slug || prd.id}`}>
                                <Image src={prd.img} alt="pro-sm-1" width={86} height={110}/>
                              </Link>
                          </div>
                          <div className="features__product-content">
                              <h5><Link href={`/product-details/${prd.slug || prd.id}`}>{prd.title}</Link></h5>
                              <div className="price">
                                  <span>${prd.price.toFixed(2)}</span>
                                  {prd.old_price&&<span className="price-old">${prd.old_price.toFixed(2)}</span>}
                              </div>
                          </div>
                      </div>
                  </li>
                ))}
              </ul>
          </div>
      </div>
  </div>
  );
};

export default FeatureProducts;