import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import LoginForm from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your ITechLK Store account to manage your digital subscriptions and order history.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Wrapper>
      {/* header start */}
      <HeaderTwo />
      {/* header end */}

      <main>
        {/* breadcrumb start */}
        <Breadcrumb title="Login" subtitle="Login" />
        {/* breadcrumb end */}

        {/* login area start */}
        <section className="login-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="basic-login">
                  <h3 className="text-center mb-60">Login From Here</h3>
                  {/* login form start */}
                  <LoginForm />
                  {/* login form end */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* login area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
