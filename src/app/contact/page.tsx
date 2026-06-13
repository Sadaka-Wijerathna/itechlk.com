import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import Footer from "@/layout/footers/footer";

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ITechLK Store. We are available via WhatsApp, email, and live chat to help with your digital subscription queries.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact ITechLK Store',
    description: 'Reach out to us for digital subscription support and inquiries.',
    url: '/contact',
    type: 'website',
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itechlk.com';

const getContactJsonLd = (url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'OnlineBusiness',
  '@id': `${url}/#organization`,
  name: 'ITechLK Store',
  url: url,
  logo: `${url}/assets/img/logo/logo.png`,
  description: 'Premium digital subscriptions in Sri Lanka — AI Tools, Streaming, VPNs, Creative Software and more.',
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Sinhala'],
      contactOption: 'TollFree',
    },
  ],
});

export default function ContactPage() {
  return (
    <Wrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactJsonLd(siteUrl)) }}
      />
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb
          title="Contact Us"
          subtitle="Contact"
        />
        {/* breadcrumb end */}

        {/* contact area start */}
        <ContactArea />
        {/* contact area end */}

        {/* contact map start */}
        <section className="contact__map">
          <div className="container-fluid p-0">
            <div className="row g-0">
              <div className="col-xl-12">
                <div className="contact__map-wrapper p-relative">
                  <iframe src="https://www.google.com/maps?q=8C9G+FHC+I+TECH+LK+STORE,+Morawaka&ftid=0x3ae161007c3632e1:0x193f8ce13fc7563d&output=embed"></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* contact map end */}
      </main>

      {/* footer start */}
      <Footer/>
      {/* footer end */}
    </Wrapper>
  );
}
