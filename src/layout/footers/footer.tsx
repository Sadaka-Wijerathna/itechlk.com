import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/img/logo/logo-2.png';
import SocialLinks from './social-links';

const footerWidget = [
  {
    id: 1,
    title: 'information',
    footer__links: [
      { list: 'About Us', href: '/about' },
      { list: 'Careers', href: '/about#careers' },
      { list: 'Delivery Information', href: '/shipping-policy' },
      { list: 'Privacy Policy', href: '/privacy-policy' },
      { list: 'Terms & Conditions', href: '/terms' },
    ]
  },
  {
    id: 2,
    title: 'Customer Service',
    footer__links: [
      { list: 'Shipping Policy', href: '/shipping-policy' },
      { list: 'Help & Contact Us', href: '/contact' },
      { list: 'Returns & Refunds', href: '/returns' },
      { list: 'Shop', href: '/shop' },
      { list: 'Blog', href: '/blog' },
    ]
  },
]

const Footer = ({ style_2 }: { style_2?: boolean }) => {
  return (
    <>
      <section className={`footer__area ${style_2 ? 'box-m-15' : ''}`} style={{ backgroundColor: '#121212', color: '#fff' }}>
        <div className="footer__top pt-100 pb-60">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <div className="footer__widget mb-30">
                  <div className="footer__widget-title mb-25">
                    <Link href="/">
                      <Image src={logo} alt="logo" />
                    </Link>
                  </div>
                  <div className="footer__widget-content">
                    <p>ITechLK is Sri Lanka&apos;s leading digital marketplace, providing premium subscriptions and AI tools with local payment support and 24/7 assistance.</p>
                    <div className="footer__contact">
                      <ul>
                        <li>
                          <div className="icon">
                            <i className="fal fa-map-marker-alt"></i>
                          </div>
                          <div className="text">
                            <span>Add: Dewalegma, Dellawa, Morawaka (Mathara, Sri Lanka)</span>
                          </div>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="fal fa-envelope-open-text"></i>
                          </div>
                          <div className="text">
                            <span>Email: indiraumamga@gmail.com</span>
                          </div>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="fal fa-phone-alt"></i>
                          </div>
                          <div className="text">
                            <span>Phone Number: +94701751530</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="footer__social mt-30">
                      <ul>
                        <SocialLinks />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {footerWidget.map(item => (
                <div key={item.id} className="col-xl-3 col-lg-3 col-md-3 col-12">
                  <div className="footer__widget mb-30">
                    <div className={`footer__widget-title ${item.id === 2 ? 'mb-25' : ''}`}>
                      <h5>{item.title}</h5>
                    </div>
                    <div className="footer__widget-content">
                      <div className="footer__links">
                        <ul>
                          {item.footer__links.map((link, index) => (
                            <li key={index}><Link href={link.href}>{link.list}</Link></li>
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
        <div className="footer__bottom">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="footer__copyright">
                  <p>© 2026 <Link href="/">ITechLK</Link>. All rights reserved.</p>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="footer__copyright f-right">
                  <p>Powered by <a href="https://frametoque.com/" target="_blank" rel="noopener noreferrer">Frametoque</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;