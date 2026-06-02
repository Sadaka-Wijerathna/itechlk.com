import Image from 'next/image';
import { IProduct } from '@/types/product-d-t';
import ProductItemTwo from './single-product/product-item-2';
import Link from 'next/link';

// prop type
type IProps = {
  products: IProduct[];
};

const FashionProducts = ({products}: IProps) => {
  const best_sale_prd = products.filter((p) => p.bestSeller);
  const big_item_1 = best_sale_prd.filter(p => p.big_img)[1];
  const big_item_2 = best_sale_prd.filter(p => p.big_img)[0];
  const sm_best_prd = best_sale_prd.filter(p => !p.big_img);
  return (
    <>
    <div className="product__view-area pt-60 pb-60">
      <div className="container custom-container-2">
        <div className="row">
          <div className="col-xl-12">
            <div className="section__wrapper text-center">
              <h3 className="section__title-2"><span>BESTSELLER PRODUCTS</span></h3>
              <p>Eodem modo typi, qui nunc nobis videntur parum clari</p>
            </div>
          </div>
        </div>
        <div className="row mt-40">
          <div className="col-xl-6 col-lg-6">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  {sm_best_prd.slice(0,2).map((item) => (
                    <div key={item.id} className="col-xl-6 col-lg-12 col-md-6">
                      <ProductItemTwo product={item} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-12">
                <div className="product__big-image effectThree mb-40">
                  <Link href='/shop'>
                    <Image src={big_item_1?.img} alt="product-img" width={546} height={697}/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-lg-6">
            <div className="row">
              <div className="col-lg-12">
                <div className="product__big-image effectThree mb-40">
                  <Link href='/shop'>
                    <Image src={big_item_2?.img} alt="product-img" width={546} height={697}/>
                  </Link>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="row">
                  {sm_best_prd.slice(2,4).map((item) => (
                      <div key={item.id} className="col-xl-6 col-lg-12 col-md-6">
                        <ProductItemTwo product={item} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
    </>
  );
};

export default FashionProducts;