"use client";

import { useState } from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccessMessage("If your email is registered, we have sent you a link to reset your password. Please check your inbox (and spam folder).");
        toast.success("Reset link sent!");
      } else {
        toast.error("Failed to send reset link. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Reset Password" subtitle="Forgot Password" />
        <section className="login-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="basic-login">
                  <h3 className="text-center mb-40">Forgot Password</h3>
                  <p className="text-center mb-40" style={{ color: "#666" }}>
                    Enter your email address below, and we will send you a secure link to reset your password.
                  </p>

                  {successMessage ? (
                    <div className="text-center">
                      <div className="alert alert-success" role="alert" style={{ background: "#d1e7dd", color: "#0f5132", padding: "15px", borderRadius: "4px", marginBottom: "30px" }}>
                        {successMessage}
                      </div>
                      <Link href="/login" className="os-btn os-btn-black">
                        Back to Login
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-30">
                        <label htmlFor="email" style={{ fontWeight: 600, display: "block", marginBottom: "10px" }}>Email Address <span>**</span></label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ height: "50px", width: "100%", padding: "0 20px", border: "2px solid #ebebeb", outline: "none" }}
                        />
                      </div>

                      <button className="os-btn w-100" type="submit" disabled={submitting}>
                        {submitting ? "Sending Reset Link..." : "Send Reset Link"}
                      </button>

                      <div className="text-center mt-30">
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Remember your password?{" "}
                          <Link href="/login" style={{ fontWeight: 600, textDecoration: "underline" }}>
                            Login now
                          </Link>
                        </p>
                      </div>
                    </form>
                  )}
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
