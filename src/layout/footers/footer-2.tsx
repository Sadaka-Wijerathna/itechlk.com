import Link from "next/link";
import SocialLinks from "./social-links";

const footer_data = [
  {
    id: 1,
    title: 'My Account',
    links: [
      { list: 'My Account' },
      { list: 'Checkout' },
      { list: 'Shopping Cart' },
      { list: 'Wishlist' },
      { list: 'Custom Link' },
    ]
  },
  {
    id: 2,
    title: 'Quick Links',
    links: [
      { list: 'Store Location' },
      { list: 'My Account' },
      { list: 'Orders Tracking' },
      { list: 'Size Guide' },
      { list: 'FAQs' },
    ]
  },
  {
    id: 3,
    title: 'information',
    links: [
      { list: 'About Us' },
      { list: 'Careers' },
      { list: 'Delivery Information' },
      { list: 'Privacy Policy' },
      { list: 'Terms & Condition' },
    ]
  },
  {
    id: 4,
    title: 'Customer Service',
    links: [
      { list: 'Shipping Policy' },
      { list: 'Help & Contact Us' },
      { list: 'Returns & Refunds' },
      { list: 'Online Stores' },
      { list: 'Terms & Conditions' },
    ]
  },
]

const FooterTwo = () => {
  return (
    <>
      <section className="footer__area grey-bg p-relative">
        <div className="footer__top pt-75 pb-60">
          <div className="container">
            <div className="row">
              {footer_data.map(item => (
                <div key={item.id} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="footer__widget mb-30">
                    <div className="footer__widget-title footer__widget-title-2 mb-25">
                      <h5>{item.title}</h5>
                    </div>
                    <div className="footer__widget-content">
                      <div className="footer__links footer__links-2">
                        <ul>
                          {item.links.map((link, index) => (
                            <li key={index}><a href="#">{link.list}</a></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer__bottom footer__bottom-2">
          <div className="container">
            <div className="footer__bottom-inner footer__bottom-inner-2">
              <div className="row">
                <div className="col-xl-6 col-lg-7">
                  <div className="footer__copyright footer__copyright-2">
                    <p>Copyright © <Link href="/">ITechLK</Link>
                      all rights reserved. Powered by
                      <Link href="/">Frametoque</Link>
                    </p>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-5">
                  <div className="footer__social footer__social-2 f-right">
                    <ul>
                      <SocialLinks/>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FooterTwo;