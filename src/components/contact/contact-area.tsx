import SocialLinks from "@/layout/footers/social-links";
import ContactForm from "../forms/contact-form";

const contactInfo = [
  {
    icon: "fal fa-map-marker-alt",
    title: "Address:",
    subtitle: "Dewalegma, Dellawa, Morawaka (Mathara, Sri Lanka)",
  },
  {
    icon: "fal fa-envelope-open-text",
    title: "Email:",
    subtitle: "indiraumamga@gmail.com",
  },
  {
    icon: "fal fa-phone-alt",
    title: "Number Phone:",
    subtitle: "+94742570943",
  },
];

const ContactArea = () => {
  return (
    <>
      <section className="contact__area pb-100 pt-95">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6">
              <div className="contact__info">
                <h3>Find us here.</h3>
                <ul className="mb-55">
                  {contactInfo.map((item) => (
                    <li key={item.title} className="d-flex mb-35">
                      <div className="contact__info-icon mr-20">
                        <i className={item.icon}></i>
                      </div>
                      <div className="contact__info-content">
                        <h6>{item.title}</h6>
                        <span>{item.subtitle}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p>
                  ITechLK is Sri Lanka&apos;s leading digital marketplace, providing premium subscriptions and AI tools with local payment support and 24/7 assistance. We are committed to making global digital services accessible to everyone in Sri Lanka with ease and reliability.
                </p>

                <div className="contact__social">
                  <ul>
                    <SocialLinks />
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="contact__form">
                <h3>Contact Us.</h3>
                {/* contact form stat */}
                <ContactForm />
                {/* contact form stat */}
                <p className="ajax-response"></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
