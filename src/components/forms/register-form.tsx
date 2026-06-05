'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMsg from '../common/error-msg';
import { signIn } from "next-auth/react";
import { COUNTRY_DATA } from "@/data/country-data";

type FormData = {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  firstName: yup.string().required().label("First Name"),
  lastName: yup.string().required().label("Last Name"),
  country: yup.string().required().label("Country"),
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required().label("Confirm Password"),
});

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          country: data.country,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
    } catch {
      setServerError("An unexpected error occurred.");
    }
    setLoading(false);
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className='mb-20'>
              <label htmlFor="firstName">First Name <span>**</span></label>
              <input id='firstName' {...register("firstName")} type="text" placeholder='First name...' />
              <ErrorMsg msg={errors.firstName?.message!} />
            </div>
          </div>
          <div className="col-md-6">
            <div className='mb-20'>
              <label htmlFor="lastName">Last Name <span>**</span></label>
              <input id='lastName' {...register("lastName")} type="text" placeholder='Last name...' />
              <ErrorMsg msg={errors.lastName?.message!} />
            </div>
          </div>
        </div>

        <div className='mb-20'>
          <label htmlFor="country">Country <span>**</span></label>
          <div className="country-select">
            <select 
              id='country' 
              {...register("country")} 
              style={{ height: '50px', border: '1px solid #eaedff', padding: '0 20px', borderRadius: '0', outline: 'none', width: '100%' }}
            >
              <option value="">-- Select Country --</option>
              {COUNTRY_DATA.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <ErrorMsg msg={errors.country?.message!} />
        </div>

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
              autoComplete="new-password"
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

        <div className='mb-20'>
          <label htmlFor="confirmPassword">Confirm Password <span>**</span></label>
          <div style={{ position: 'relative' }}>
            <input 
              id="confirmPassword" 
              {...register("confirmPassword")} 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm password..." 
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          <ErrorMsg msg={errors.confirmPassword?.message!} />
        </div>

        {serverError && <p style={{ color: "red", marginBottom: 15, fontWeight: 500 }}>{serverError}</p>}

        <button className="os-btn w-100" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Create Account"}
        </button>

        <div className="or-divide"><span>or</span></div>

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
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
              Login now
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;