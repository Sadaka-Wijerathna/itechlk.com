"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Breadcrumb from "@/components/common/breadcrumb";
import Footer from "@/layout/footers/footer";
import Link from "next/link";
import { toast } from "react-toastify";

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      toast.error("Missing reset token.");
      setErrorMsg("Missing or invalid password reset token.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } else {
        setErrorMsg(data.error || "Failed to reset password.");
        toast.error(data.error || "Failed to reset password.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="alert alert-danger" style={{ background: "#f8d7da", color: "#842029", padding: "15px", borderRadius: "4px", marginBottom: "30px" }}>
          Invalid or missing password reset token. Please request a new link.
        </div>
        <Link href="/forgot-password" className="os-btn os-btn-black">
          Request Reset Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="alert alert-success" style={{ background: "#d1e7dd", color: "#0f5132", padding: "15px", borderRadius: "4px", marginBottom: "30px" }}>
          Your password has been reset successfully! Redirecting you to login page...
        </div>
        <Link href="/login" className="os-btn os-btn-black">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="alert alert-danger" style={{ background: "#f8d7da", color: "#842029", padding: "12px", borderRadius: "4px", marginBottom: "20px" }}>
          {errorMsg}
        </div>
      )}

      <div className="mb-20">
        <label htmlFor="password" style={{ fontWeight: 600, display: "block", marginBottom: "10px" }}>New Password <span>**</span></label>
        <input
          id="password"
          type="password"
          placeholder="Enter new password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ height: "50px", width: "100%", padding: "0 20px", border: "2px solid #ebebeb", outline: "none" }}
        />
      </div>

      <div className="mb-30">
        <label htmlFor="confirmPassword" style={{ fontWeight: 600, display: "block", marginBottom: "10px" }}>Confirm New Password <span>**</span></label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ height: "50px", width: "100%", padding: "0 20px", border: "2px solid #ebebeb", outline: "none" }}
        />
      </div>

      <button className="os-btn w-100" type="submit" disabled={submitting}>
        {submitting ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <Breadcrumb title="Set New Password" subtitle="Reset Password" />
        <section className="login-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="basic-login">
                  <h3 className="text-center mb-40">Create New Password</h3>
                  <Suspense fallback={<div className="text-center">Loading reset form...</div>}>
                    <ResetPasswordFormContent />
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
