import Link from "next/link";
import Image from "next/image";
// internal
import category_data from "@/data/category-data";

// type
type IProps = {
  spacing?: string;
  style_2?: boolean;
  style_3?: boolean;
  style_4?: boolean;
  category_2?: boolean;
};

const ShopCategory = ({spacing='',style_2,style_3,style_4,category_2=false}:IProps) => {
  return (
    <>
      {!category_2 && (
        <div className={`banner__area ${spacing}`}
        >
          <div className={`container ${style_3 ? "custom-container" : ""}`}>
            <div className={`${!style_2 && !style_3 && !style_4? "banner__inner p-relative mt--95 z-index-1": ""} ${style_4 ? "banner__inner-2 p-relative" : ""}`}>
              <div className="row">
                {category_data.slice(0, 3).map((item, index) => (
                  <div key={index} className="col-xl-4 col-lg-4 col-md-6 col-6">
                    <div className="banner__item mb-30 p-relative">
                      <div className="banner__thumb fix">
                        <Link
                          href={`/shop`}
                          className="w-img"
                        >
                          <Image
                            src={item.img!}
                            alt="banner"
                            width={356}
                            height={219}
                          />
                        </Link>
                      </div>
                      <div className="banner__content p-absolute transition-3">
                        <h5>
                          <Link href={`/shop`}
                            dangerouslySetInnerHTML={{__html: item.parentTitle}}
                          ></Link>
                        </h5>
                        <Link href={`/shop`}className="link-btn">
                          Discover now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {category_2 && (
        <div className="banner__area-df mt-10">
          {category_data.slice(3, 6).map((banner) => (
            <div key={banner.id} className="banner__item-3 mb-30">
              <div className="banner__item-3-image m-img">
                <Image src={banner.img!} alt="banner-img" width={628} height={359} />
              </div>
              <div className="banner__content-5">
                <h5>{banner.parentTitle}</h5>
                <p>{banner.smDesc}</p>
                <Link href="/shop" className="os-btn-5">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ShopCategory;
