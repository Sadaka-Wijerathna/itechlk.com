import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Breadcrumb from '@/components/common/breadcrumb';
import Footer from '@/layout/footers/footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using ITechLK Store. Read about the terms governing your purchases of digital subscriptions.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms & Conditions | ITechLK Store',
    description: 'Read the terms of service governing your purchases at ITechLK Store.',
    url: '/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Terms & Conditions" subtitle="Terms" />

        <section className="terms__area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-12">
                <div className="terms__content" style={{ lineHeight: '1.8', color: '#555' }}>
                  <h2 style={{ fontWeight: 600, color: '#222', marginBottom: '24px' }}>Terms & Conditions</h2>
                  <p className="mb-20">
                    Welcome to ITechLK Store! These terms and conditions outline the rules and regulations for the use of ITechLK Store's Website, located at <strong>https://www.itechlk.com</strong>.
                  </p>
                  <p className="mb-25">
                    By accessing this website we assume you accept these terms and conditions. Do not continue to use ITechLK Store if you do not agree to take all of the terms and conditions stated on this page.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>1. Terminology</h3>
                  <p className="mb-20">
                    The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>2. Cookies</h3>
                  <p className="mb-20">
                    We employ the use of cookies. By accessing ITechLK Store, you agreed to use cookies in agreement with the ITechLK Store's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>3. License and IP Rights</h3>
                  <p className="mb-20">
                    Unless otherwise stated, ITechLK Store and/or its licensors own the intellectual property rights for all material on ITechLK Store. All intellectual property rights are reserved. You may access this from ITechLK Store for your own personal use subjected to restrictions set in these terms and conditions.
                  </p>
                  <p className="mb-15">You must not:</p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>Republish material from ITechLK Store.</li>
                    <li>Sell, rent or sub-license material from ITechLK Store.</li>
                    <li>Reproduce, duplicate or copy material from ITechLK Store.</li>
                    <li>Redistribute content from ITechLK Store.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>4. Products & Subscriptions</h3>
                  <p className="mb-20">
                    ITechLK Store sells digital products and subscriptions (including but not limited to AI tools, streaming accounts, VPNs, and creative software).
                  </p>
                  <p className="mb-20">
                    By purchasing any digital product or subscription from us, you acknowledge and agree that:
                  </p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>The accounts and subscription details are for personal, lawful use only.</li>
                    <li>Sharing account details or reselling subscriptions purchased from ITechLK without written authorization is strictly prohibited and will result in the immediate termination of the subscription without refund.</li>
                    <li>Subscriptions are subject to the terms and policies of the respective third-party service provider (e.g., Netflix, Spotify, OpenAI, etc.).</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>5. Hyperlinking to our Content</h3>
                  <p className="mb-20">
                    Organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>6. Disclaimer of Liability</h3>
                  <p className="mb-20">
                    To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                  </p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>limit or exclude our or your liability for death or personal injury;</li>
                    <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                    <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                    <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                  </ul>
                  <p className="mb-20">
                    The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
                  </p>
                  <p className="mb-20">
                    As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
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
