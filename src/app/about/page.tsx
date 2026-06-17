import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Breadcrumb from '@/components/common/breadcrumb';
import Footer from '@/layout/footers/footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ITechLK Store — Sri Lanka\'s leading digital subscription marketplace. We offer AI tools, streaming, VPNs, and creative software with local payment support.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | ITechLK Store',
    description: 'Discover our story, mission, and the team behind Sri Lanka\'s #1 digital subscription store.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="About Us" subtitle="About" />

        <section className="about__area pt-100 pb-100">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-12 mb-40">
                <div className="about__content">
                  <div className="section__title mb-20">
                    <h2 style={{ fontWeight: 600 }}>
                      Sri Lanka&apos;s <span style={{ color: '#21a8c9' }}>#1 Digital</span> Subscription Store
                    </h2>
                  </div>
                  <p className="mb-20">
                    ITechLK Store was founded with a simple mission: make world-class digital subscriptions accessible and affordable for everyone in Sri Lanka. From AI tools to streaming services, VPNs, and creative software — we bring you genuine, premium accounts at unbeatable LKR prices.
                  </p>
                  <p className="mb-20">
                    We understand the challenges of purchasing international digital services locally. That&apos;s why we handle the complexity so you don&apos;t have to — with local payment options, instant delivery, and round-the-clock customer support.
                  </p>
                  <p className="mb-30">
                    Trusted by thousands of customers across Sri Lanka, ITechLK is your one-stop shop for all things digital.
                  </p>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-12 mb-40">
                <div className="row g-4">
                  {[
                    { icon: 'fal fa-bolt', title: 'Instant Delivery', desc: 'Receive your subscription credentials instantly via email after payment confirmation.' },
                    { icon: 'fal fa-shield-check', title: '100% Genuine', desc: 'All our subscriptions are verified and guaranteed to work. No fake accounts, ever.' },
                    { icon: 'fal fa-headset', title: '24/7 Support', desc: 'Our team is available around the clock via WhatsApp, email, and live chat.' },
                    { icon: 'fal fa-money-bill-wave', title: 'Local Payments', desc: 'Pay in LKR using local bank transfers and online payment methods — no foreign cards needed.' },
                  ].map((item, i) => (
                    <div key={i} className="col-xl-6 col-sm-6">
                      <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', height: '100%' }}>
                        <i className={item.icon} style={{ fontSize: '28px', color: '#21a8c9', marginBottom: '12px', display: 'block' }}></i>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Our Story */}
            <div className="row mt-60">
              <div className="col-xl-12">
                <div style={{ background: '#121212', color: '#fff', borderRadius: '16px', padding: '48px' }}>
                  <div className="row align-items-center">
                    <div className="col-xl-8">
                      <h2 style={{ fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
                        Our <span style={{ color: '#21a8c9' }}>Mission</span>
                      </h2>
                      <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: '16px' }}>
                        We believe digital tools should be accessible to every Sri Lankan — student, entrepreneur, creator, or professional. Our mission is to bridge the gap between global software and local purchasing power, one subscription at a time.
                      </p>
                      <p style={{ color: '#aaa', lineHeight: 1.8, margin: 0 }}>
                        Based in Morawaka, Matara, we proudly serve customers island-wide with fast, reliable, and honest service.
                      </p>
                    </div>
                    <div className="col-xl-4 text-center mt-30">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[['5000+', 'Happy Customers'], ['50+', 'Products Available'], ['24/7', 'Customer Support'], ['100%', 'Satisfaction Rate']].map(([num, label]) => (
                          <div key={label} style={{ background: 'rgba(33,168,201,0.1)', borderRadius: '8px', padding: '12px 24px', border: '1px solid rgba(33,168,201,0.3)' }}>
                            <span style={{ color: '#21a8c9', fontWeight: 700, fontSize: '20px' }}>{num}</span>
                            <span style={{ color: '#aaa', marginLeft: '10px', fontSize: '14px' }}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Careers section */}
            <div className="row mt-80" id="careers">
              <div className="col-xl-12 text-center">
                <h2 style={{ fontWeight: 600 }}>
                  Join Our <span style={{ color: '#21a8c9' }}>Team</span>
                </h2>
                <p style={{ color: '#666', maxWidth: '600px', margin: '16px auto 32px' }}>
                  We&apos;re a small but passionate team growing fast. If you&apos;re excited about digital products and want to help serve Sri Lanka, we&apos;d love to hear from you.
                </p>
                <a href="/contact" className="os-btn">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Wrapper>
  );
}
