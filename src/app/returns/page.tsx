import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Breadcrumb from '@/components/common/breadcrumb';
import Footer from '@/layout/footers/footer';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'Read the Returns and Refund Policy for ITechLK Store. Understand how we handle replacement and refund requests for digital subscriptions.',
  alternates: { canonical: '/returns' },
  openGraph: {
    title: 'Returns & Refund Policy | ITechLK Store',
    description: 'Learn about our refund, warranty, and replacement policies for digital accounts.',
    url: '/returns',
    type: 'website',
  },
};

export default function ReturnsPolicyPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Returns & Refund Policy" subtitle="Returns Policy" />

        <section className="returns__area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-12">
                <div className="returns__content" style={{ lineHeight: '1.8', color: '#555' }}>
                  <h2 style={{ fontWeight: 600, color: '#222', marginBottom: '24px' }}>Returns & Refund Policy</h2>
                  <p className="mb-20">
                    At ITechLK Store, we want to ensure you are fully satisfied with your digital subscription. Because we offer intangible digital goods, standard physical product returns are not possible. Please review our policies regarding refunds and warranty replacements below.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>1. Refund Policy</h3>
                  <p className="mb-20">
                    Given the nature of digital products, <strong>all sales are final</strong> once the subscription credentials, activation keys, or access details have been successfully delivered to your email.
                  </p>
                  <p className="mb-15">We will only offer a refund under the following conditions:</p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li><strong>Non-Delivery:</strong> If we are unable to deliver the subscription details or setup your account within 24 hours of your verified payment.</li>
                    <li><strong>Out-of-Stock:</strong> If the product you paid for is out of stock and we cannot fulfill your order.</li>
                    <li><strong>Unresolvable Product Issues:</strong> If a delivered account fails to work upon initial login and our technical support team is unable to fix or replace it within 48 hours.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>2. Subscription Warranties & Replacements</h3>
                  <p className="mb-20">
                    All our subscriptions come with a warranty matching the duration you purchase (e.g., 1-month, 3-months, or 12-months warranty).
                  </p>
                  <p className="mb-20">
                    If your subscription encounters issues, stops working, or requires re-activation during the warranty period, we will troubleshoot and resolve the issue or provide a replacement account.
                  </p>
                  <p className="mb-20">
                    <strong>Warranty Exclusions:</strong> The warranty is void if the issue is caused by customer misuse, including but not limited to: changing the account password, changing account settings (profiles/billing), sharing account details with unauthorized users, or violating the terms of service of the third-party provider (e.g., Netflix, Spotify, Adobe).
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>3. How to File a Claim</h3>
                  <p className="mb-15">
                    If you experience issues with your subscription, please follow these steps:
                  </p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                    <li>Take screenshots or record a short video showing the error or issue you are experiencing.</li>
                    <li>Contact our support team immediately via <strong>WhatsApp at +94701751530</strong> or email <strong>indiraumamga@gmail.com</strong>. Include your order ID and the email address used during purchase.</li>
                    <li>Allow our team up to 12–24 hours to review your request, verify the account status, and provide a fix or replacement.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>4. Chargebacks and Disputes</h3>
                  <p className="mb-20">
                    We encourage you to contact us directly to resolve any issues. Opening a dispute or chargeback with your bank or card processor without contacting us first will result in immediate and permanent suspension of all your subscriptions, and your account will be blacklisted from future purchases at ITechLK Store.
                  </p>
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
