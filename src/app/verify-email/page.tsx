import { Metadata } from "next";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import VerifyEmailForm from "@/components/forms/verify-email-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email | ITechLK Store",
  description: "Verify your email address to activate your ITechLK Store account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Verify Email" subtitle="Verify Email" />
        <section className="login-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="basic-login">
                  <h3 className="text-center mb-60">Enter Verification Code</h3>
                  <p className="text-center mb-40">
                    We&apos;ve sent a 6-digit verification code to your email. 
                    Please enter it below to activate your account.
                  </p>
                  <Suspense fallback={<div>Loading...</div>}>
                    <VerifyEmailForm />
                  </Suspense>
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
