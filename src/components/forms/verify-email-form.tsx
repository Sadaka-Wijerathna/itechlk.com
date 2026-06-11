'use client'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Auto sign-in if password was passed in params
      if (password) {
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          router.push("/login?verified=true");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        router.push("/login?verified=true");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleVerify}>
      <div className="mb-30">
        <label htmlFor="code" style={{ marginBottom: '10px', display: 'block', fontWeight: 600 }}>6-Digit Verification Code <span>**</span></label>
        <input 
          id="code"
          type="text" 
          placeholder="Enter the 6-digit code from your email..." 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          style={{ height: '50px', width: '100%', padding: '0 20px', border: '2px solid #ebebeb', outline: 'none' }}
        />
      </div>

      {error && <p style={{ color: "red", marginBottom: "20px", fontWeight: 500 }}>{error}</p>}
      {success && <p style={{ color: "green", marginBottom: "20px", fontWeight: 500 }}>Verification successful! Redirecting...</p>}

      <button className="os-btn w-100" type="submit" disabled={loading || success}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <div className="text-center mt-30">
        <p style={{ fontSize: '14px', color: '#666' }}>
          Didn&apos;t receive the code?{' '}
          <button 
            type="button"
            onClick={() => router.push("/register")}
            style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
          >
            Go back and try again
          </button>
        </p>
      </div>
    </form>
  );
};

export default VerifyEmailForm;
