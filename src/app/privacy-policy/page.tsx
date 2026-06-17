import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Breadcrumb from '@/components/common/breadcrumb';
import Footer from '@/layout/footers/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ITechLK Store. Read about how we collect, protect, and use your personal information.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | ITechLK Store',
    description: 'Learn how we collect and safeguard your data at ITechLK Store.',
    url: '/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Privacy Policy" subtitle="Privacy Policy" />

        <section className="privacy__area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10 col-12">
                <div className="privacy__content" style={{ lineHeight: '1.8', color: '#555' }}>
                  <h2 style={{ fontWeight: 600, color: '#222', marginBottom: '24px' }}>Privacy Policy</h2>
                  <p className="mb-20">
                    At ITechLK Store, accessible from <strong>https://www.itechlk.com</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ITechLK Store and how we use it.
                  </p>
                  <p className="mb-25">
                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>1. Consent</h3>
                  <p className="mb-20">
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>2. Information We Collect</h3>
                  <p className="mb-20">
                    The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                  </p>
                  <p className="mb-20">
                    If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                  </p>
                  <p className="mb-20">
                    When you register for an Account or place an order, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>3. How We Use Your Information</h3>
                  <p className="mb-15">We use the information we collect in various ways, including to:</p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li>Provide, operate, and maintain our website and online store.</li>
                    <li>Improve, personalize, and expand our website and product offerings.</li>
                    <li>Understand and analyze how you use our website.</li>
                    <li>Develop new products, services, features, and functionality.</li>
                    <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                    <li>Send you emails containing subscription credentials, invoices, or updates.</li>
                    <li>Find and prevent fraud.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>4. Log Files</h3>
                  <p className="mb-20">
                    ITechLK Store follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>5. Cookies and Web Beacons</h3>
                  <p className="mb-20">
                    Like any other website, ITechLK Store uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>6. Third-Party Privacy Policies</h3>
                  <p className="mb-20">
                    ITechLK Store's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>7. GDPR & Data Protection Rights</h3>
                  <p className="mb-20">
                    We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                  </p>
                  <ul className="mb-20" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                    <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
                    <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                    <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                    <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                    <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                  </ul>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>8. Children's Information</h3>
                  <p className="mb-20">
                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                  </p>
                  <p className="mb-20">
                    ITechLK Store does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                  </p>

                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginTop: '30px', marginBottom: '15px' }}>9. Changes to This Privacy Policy</h3>
                  <p className="mb-20">
                    We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
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
