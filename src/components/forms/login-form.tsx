'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMsg from '../common/error-msg';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
});

const LoginForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
    } else {
      reset();
      router.push("/");
      router.refresh();
    }
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='mb-20'>
          <label htmlFor="email">Email Address <span>**</span></label>
          <input id='email' {...register("email")} type="email" placeholder='Email address...' />
          <ErrorMsg msg={errors.email?.message!} />
        </div>

        <div className='mb-20'>
          <label htmlFor="password">Password <span>**</span></label>
          <div style={{ position: 'relative' }}>
            <input 
              id="password" 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter password..." 
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                padding: '5px'
              }}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <ErrorMsg msg={errors.password?.message!} />
        </div>

        {serverError && <p style={{ color: "red", marginBottom: 12 }}>{serverError}</p>}

        <div className="login-action mb-20 fix">
          <span className="log-rem f-left">
            <input id="remember" type="checkbox" />
            <label htmlFor="remember">Remember me!</label>
          </span>
          <span className="forgot-login f-right">
            <Link href="#">Forget password?</Link>
          </span>
        </div>

        <button className="os-btn w-100" disabled={loading}>
          {loading ? "Signing in..." : "Login Now"}
        </button>

        <div className="or-divide"><span>or</span></div>

        {/* ── Social Login Buttons ─────────────────────────────────────────── */}
        <div className="social-login-btns">
          <button
            type="button"
            className="social-btn social-btn--google"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>


        </div>

        <div className="text-center mt-20">
          <p style={{ fontSize: 14, color: '#666' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;