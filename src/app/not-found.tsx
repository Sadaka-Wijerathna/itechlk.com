import { Metadata } from "next";
import Link from "next/link";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";

export const metadata: Metadata = {
  title: "Page Not Found — 404",
  description: "The page you are looking for does not exist. Return to ITechLK Store to browse our digital subscriptions.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="404" subtitle="404" />
        {/* breadcrumb end */}

        {/* 404 area start */}
        <section className="error__area pt-60 pb-100">
          <div className="container">
            <div className="col-xl-8 offset-xl-2 col-lg-8 offset-lg-2">
              <div className="error__content text-center">
                <div className="error__number">
                  <h1>404</h1>
                </div>
                <span>component not found</span>
                <h2>Nothing To See Here!</h2>
                <p>
                  The page are looking for has been moved or doesn’t exist
                  anymore, if you like you can return to our homepage. If the
                  problem persists, please send us an email to{" "}
                  <span className="highlight comment">
                    basictheme400@gmail.com
                  </span>
                </p>

                <div className="error__search">
                  <Link href="/" className="os-btn os-btn-3 os-btn-black">
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 404 area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
