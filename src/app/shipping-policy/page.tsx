import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Breadcrumb from '@/components/common/breadcrumb';
import Footer from '@/layout/footers/footer';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy',
  description: 'Learn about how digital subscriptions are delivered at ITechLK Store. Read our instant email delivery policy.',
  alternates: { canonical: '/shipping-policy' },
  openGraph: {
    title: 'Shipping & Delivery Policy | ITechLK Store',
    description: 'Find out about our instant digital delivery details for subscriptions.',
    url: '/shipping-policy',
    type: 'website',
  },
};

export default function ShippingPolicyPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Shipping & Delivery Policy" subtitle="Shipping Policy" />

        <section className="shipping__area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-12">
                <div className="shipping__content" style={{ lineHeight: '1.8', color: '#555' }}>
                  <h2 style={{ fontWeight: 600, color: '#222', marginBottom: '24px' }}>Shipping & Delivery Policy</h2>
                  <p className="mb-20">
                    Thank you for shopping at ITechLK Store. Since we specialize in digital subscriptions and tools, we do not ship physical products. Instead, all purchases are delivered electronically.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>1. Delivery Method</h3>
                  <p className="mb-20">
                    All digital subscription accounts, activation keys, gift cards, or setup instructions will be sent directly to the email address you provide during checkout. Please ensure your email address is correct and active.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>2. Delivery Timelines</h3>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li><strong>Instant/Automated Delivery:</strong> Many of our subscriptions and key purchases are processed automatically. You should receive them in your inbox within 5–15 minutes of payment confirmation.</li>
                    <li><strong>Manual Setup (Custom Orders):</strong> Certain subscriptions require custom setup or manual activation by our team. These are typically completed within 1 to 4 hours of payment confirmation. In rare circumstances (such as late-night orders or system maintenance), delivery may take up to 12 hours.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>3. Checking Spam & Promotions Folders</h3>
                  <p className="mb-20">
                    If you haven't received your digital delivery within 30 minutes, please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folders in your email client. Sometimes, automated emails may be filtered incorrectly by email providers.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>4. Payment Verification</h3>
                  <p className="mb-20">
                    For orders paid via manual bank transfer or bank deposit, delivery will proceed only after you have submitted proof of payment (receipt/screenshot) and it has been verified by our billing team.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>5. Delivery Issues & Support</h3>
                  <p className="mb-20">
                    If your order is delayed or you run into issues activating your subscription, please do not hesitate to contact our customer support team immediately.
                  </p>
                  <p className="mb-10">We are available via:</p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li><strong>WhatsApp / Phone:</strong> +94742570943</li>
                    <li><strong>Email:</strong> indiraumamga@gmail.com</li>
                    <li><strong>Contact Form:</strong> <a href="/contact">Click here to message us</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Wrapper>
  );
}
