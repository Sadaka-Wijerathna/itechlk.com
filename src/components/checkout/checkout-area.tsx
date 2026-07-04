'use client'
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from 'next-auth/react';
import ErrorMsg from '../common/error-msg';
import CheckoutOrders from './checkout-orders';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getCartProducts, clearCartSilently } from '@/redux/features/cart';
import Link from 'next/link';
import { useGeoLocation } from '@/hooks/use-geo-location';
import useCartInfo from '@/hooks/use-cart-info';

const COUNTRY_DATA = [
  { name: "Afghanistan", code: "+93" }, { name: "Albania", code: "+355" }, { name: "Algeria", code: "+213" },
  { name: "Andorra", code: "+376" }, { name: "Angola", code: "+244" }, { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" }, { name: "Australia", code: "+61" }, { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" }, { name: "Bahamas", code: "+1" }, { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" }, { name: "Belarus", code: "+375" }, { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" }, { name: "Benin", code: "+229" }, { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" }, { name: "Bosnia and Herzegovina", code: "+387" }, { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" }, { name: "Brunei", code: "+673" }, { name: "Bulgaria", code: "+359" },
  { name: "Burundi", code: "+257" }, { name: "Cambodia", code: "+855" }, { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" }, { name: "Chile", code: "+56" }, { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" }, { name: "Costa Rica", code: "+506" }, { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" }, { name: "Cyprus", code: "+357" }, { name: "Czechia", code: "+420" },
  { name: "Denmark", code: "+45" }, { name: "Dominican Republic", code: "+1" }, { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" }, { name: "El Salvador", code: "+503" }, { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" }, { name: "Fiji", code: "+679" }, { name: "Finland", code: "+358" },
  { name: "France", code: "+33" }, { name: "Georgia", code: "+995" }, { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" }, { name: "Greece", code: "+30" }, { name: "Guatemala", code: "+502" },
  { name: "Haiti", code: "+509" }, { name: "Honduras", code: "+504" }, { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" }, { name: "Iceland", code: "+354" }, { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" }, { name: "Iran", code: "+98" }, { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" }, { name: "Israel", code: "+972" }, { name: "Italy", code: "+39" },
  { name: "Jamaica", code: "+1" }, { name: "Japan", code: "+81" }, { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" }, { name: "Kenya", code: "+254" }, { name: "Kuwait", code: "+965" },
  { name: "Laos", code: "+856" }, { name: "Latvia", code: "+371" }, { name: "Lebanon", code: "+961" },
  { name: "Libya", code: "+218" }, { name: "Liechtenstein", code: "+423" }, { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" }, { name: "Macao", code: "+853" }, { name: "Madagascar", code: "+261" },
  { name: "Malaysia", code: "+60" }, { name: "Maldives", code: "+960" }, { name: "Malta", code: "+356" },
  { name: "Mexico", code: "+52" }, { name: "Moldova", code: "+373" }, { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" }, { name: "Montenegro", code: "+382" }, { name: "Morocco", code: "+212" },
  { name: "Myanmar", code: "+95" }, { name: "Nepal", code: "+977" }, { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" }, { name: "Nicaragua", code: "+505" }, { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" }, { name: "Oman", code: "+968" }, { name: "Pakistan", code: "+92" },
  { name: "Panama", code: "+507" }, { name: "Paraguay", code: "+595" }, { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" }, { name: "Poland", code: "+48" }, { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" }, { name: "Romania", code: "+40" }, { name: "Russia", code: "+7" },
  { name: "Saudi Arabia", code: "+966" }, { name: "Serbia", code: "+381" }, { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" }, { name: "Slovenia", code: "+386" }, { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" }, { name: "Spain", code: "+34" }, { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" }, { name: "Sweden", code: "+46" }, { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" }, { name: "Taiwan", code: "+886" }, { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" }, { name: "Thailand", code: "+66" }, { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" }, { name: "Uganda", code: "+256" }, { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" }, { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" }, { name: "Uruguay", code: "+598" }, { name: "Uzbekistan", code: "+998" },
  { name: "Venezuela", code: "+58" }, { name: "Vietnam", code: "+84" }, { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" }, { name: "Zimbabwe", code: "+263" }
];

type FormData = {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  phoneCode: string;
  phone: string;
};

const schema = yup.object().shape({
  country: yup.string().required().label("Country"),
  firstName: yup.string().required().label("First Name"),
  lastName: yup.string().required().label("Last Name"),
  email: yup.string().required().email().label("Email"),
  phoneCode: yup.string().required().label("Country Code"),
  phone: yup.string().required().min(4).label("WhatsApp Number"),
});

const CheckoutArea = () => {
  const { cart_products } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const { data: session, update } = useSession();
  const { total } = useCartInfo();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { geo } = useGeoLocation();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountAmount: number} | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  const [bankSettings, setBankSettings] = useState({
    bankName1: "People's Bank",
    bankBranch1: "Morawaka",
    bankAccountName1: "P.A.Indira Umanga",
    bankAccountNo1: "060200160094469",
    bankName2: "Bank of Ceylon (BOC)",
    bankBranch2: "Morawaka",
    bankAccountName2: "Anuhas P A I U",
    bankAccountNo2: "72790749",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBankSettings({
            bankName1: data.bankName1 || "People's Bank",
            bankBranch1: data.bankBranch1 || "Morawaka",
            bankAccountName1: data.bankAccountName1 || "P.A.Indira Umanga",
            bankAccountNo1: data.bankAccountNo1 || "060200160094469",
            bankName2: data.bankName2 || "Bank of Ceylon (BOC)",
            bankBranch2: data.bankBranch2 || "Morawaka",
            bankAccountName2: data.bankAccountName2 || "Anuhas P A I U",
            bankAccountNo2: data.bankAccountNo2 || "72790749",
          });
        }
      })
      .catch((err) => console.error("Error fetching settings in checkout:", err));
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: total })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon({ code: data.coupon.code, discountAmount: data.discountAmount });
        setCouponMessage({ type: 'success', text: `Coupon applied successfully!` });
      } else {
        setCouponMessage({ type: 'error', text: data.error || "Invalid coupon" });
      }
    } catch (err) {
      setCouponMessage({ type: 'error', text: "Error validating coupon" });
    }
    setCouponLoading(false);
  };

  const handleFileChange = (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setReceiptFile(file);
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      dispatch(getCartProducts());
    }
  }, [dispatch]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", country: "", phoneCode: "", phone: "" },
  });

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      const dbFirstName = u.firstName;
      const dbLastName = u.lastName;
      const fullName = u.name || "";
      
      reset({
        firstName: dbFirstName || fullName.split(" ")[0] || "",
        lastName: dbLastName || fullName.split(" ").slice(1).join(" ") || "",
        email: u.email || "",
        // If user already has country/phone set, use those; otherwise fall back to geo
        country: u.country || (geo?.countryName ?? ""),
        phoneCode: u.phoneCode || (geo?.callingCode ?? ""),
        phone: u.phone || "",
      });
    } else if (geo) {
      // Not logged in — pre-fill from geo detection only
      setValue("country", geo.countryName);
      setValue("phoneCode", geo.callingCode);
    }
  }, [session, geo, reset, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (!receiptFile) {
      alert("Please upload the transaction receipt to complete the order.");
      return;
    }
    setPlacingOrder(true);
    let uploadedReceiptUrl = "";
    try {
      const formData = new FormData();
      formData.append("file", receiptFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Receipt upload failed");
      const uploadData = await uploadRes.json();
      uploadedReceiptUrl = uploadData.url;
    } catch (e) {
      alert("Error uploading receipt.");
      setPlacingOrder(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          receiptUrl: uploadedReceiptUrl,
          cart_products,
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.discountAmount
        }),
      });
      if (res.ok) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setOrderPlaced(true);
        reset();
        setReceiptFile(null);
        setPreviewUrl(null);
        dispatch(clearCartSilently());
        
        // Update local session so it fetches latest DB changes (profile overrides from billing)
        if (session?.user) {
          await update();
        }
      } else {
        const d = await res.json();
        alert(d.error || "Order failed");
      }
    } catch (e) {
      alert("Error placing order.");
    }
    setPlacingOrder(false);
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .coupon-remove-btn {
          transition: all 0.3s ease !important;
        }
        .coupon-remove-btn::after {
          background: #dc3545 !important;
        }
        .coupon-remove-btn:hover {
          color: #fff !important;
          border-color: #dc3545 !important;
        }
      ` }} />
      <section className="checkout-area pb-70">
        <div className="container">

          {orderPlaced && (
            <div className="text-center pt-100 pb-100">
              <h3 style={{ fontSize: 32, marginBottom: 20 }}>Order placed, our admins will contact you soon <i className="fa fa-check-circle text-success ms-2"></i></h3>
              <div className="mt-30 d-flex gap-3 justify-content-center">
                <Link href="/" className="os-btn os-btn-black">Go to Homepage</Link>
                <Link href="/account" className="os-btn os-btn-2">Go to My Orders</Link>
              </div>
            </div>
          )}

          {!orderPlaced && cart_products.length === 0 && (
            <div className="text-center pt-100">
              <h3>Your cart is empty</h3>
              <Link href="/shop" className="os-btn os-btn-2 mt-30">Return to shop</Link>
            </div>
          )}

          {!orderPlaced && cart_products.length > 0 && (
            <form onSubmit={onSubmit}>
              <div className="row">

                {/* Left column: Billing + Bank Transfer */}
                <div className="col-lg-6">
                  <div className="checkbox-form mt-40">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="country-select">
                          <label>Country <span className="required">*</span></label>
                          <select id="country" {...register("country")} onChange={(e) => {
                            const countryName = e.target.value;
                            const country = COUNTRY_DATA.find(c => c.name === countryName);
                            if (country) {
                              setValue("phoneCode", country.code);
                            }
                            register("country").onChange(e);
                          }}>
                            <option value="">-- Select Country --</option>
                            {COUNTRY_DATA.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                          <ErrorMsg msg={errors.country?.message!} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="checkout-form-list">
                          <label>First Name <span className="required">*</span></label>
                          <input type="text" id="firstName" {...register("firstName")} placeholder="First Name" />
                          <ErrorMsg msg={errors.firstName?.message!} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="checkout-form-list">
                          <label>Last Name <span className="required">*</span></label>
                          <input type="text" id="lastName" {...register("lastName")} placeholder="Last Name" />
                          <ErrorMsg msg={errors.lastName?.message!} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="checkout-form-list">
                          <label>Email Address <span className="required">*</span></label>
                          <input type="email" id="email" {...register("email")} placeholder="Your Email" />
                          <ErrorMsg msg={errors.email?.message!} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="checkout-form-list">
                          <label>WhatsApp Number <span className="required">*</span></label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: '0 0 100px' }}>
                              <input type="text" id="phoneCode" {...register("phoneCode")} placeholder="+1" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <input type="text" id="phone" {...register("phone")} />
                            </div>
                          </div>
                          {(errors.phoneCode || errors.phone) && (
                            <ErrorMsg msg={errors.phoneCode?.message || errors.phone?.message || ""} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="checkbox-form mt-40">
                    <h3>Bank Transfer Details</h3>
                    <p style={{ marginBottom: 20, color: '#6b7280' }}>
                      Please transfer the total amount to one of the following bank accounts, then upload your receipt below.
                    </p>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="checkout-form-list">
                          <div style={{ background: '#ffffff', border: '1px solid #eaedff', borderRadius: 0, padding: '15px 10px', width: '100%' }}>
                            <ul style={{ color: '#111827', fontSize: 15, lineHeight: '1.8', margin: 0, padding: 0, listStyle: 'none' }}>
                              <li><strong>Bank Name:</strong> {bankSettings.bankName1}</li>
                              <li><strong>Branch:</strong> {bankSettings.bankBranch1}</li>
                              <li><strong>Account Name:</strong> {bankSettings.bankAccountName1}</li>
                              <li><strong>Account No:</strong> {bankSettings.bankAccountNo1}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="checkout-form-list">
                          <div style={{ background: '#ffffff', border: '1px solid #eaedff', borderRadius: 0, padding: '15px 10px', width: '100%' }}>
                            <ul style={{ color: '#111827', fontSize: 15, lineHeight: '1.8', margin: 0, padding: 0, listStyle: 'none' }}>
                              <li><strong>Bank Name:</strong> {bankSettings.bankName2}</li>
                              <li><strong>Branch:</strong> {bankSettings.bankBranch2}</li>
                              <li><strong>Account Name:</strong> {bankSettings.bankAccountName2}</li>
                              <li><strong>Account No:</strong> {bankSettings.bankAccountNo2}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="checkout-form-list mb-0">
                      <label style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12, display: 'block' }}>
                        Upload Receipt <span className="required">*</span>
                      </label>
                      <div
                        style={{
                          border: '2px dashed #d1d5db',
                          borderRadius: 8,
                          padding: '32px 20px',
                          textAlign: 'center',
                          background: receiptFile ? '#f8fafc' : '#fff',
                          transition: 'border-color 0.2s ease, background 0.2s ease',
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = '#21a8c9')}
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                      >
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          {receiptFile ? (
                            <>
                              {previewUrl ? (
                                <img src={previewUrl} alt="Receipt Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                              ) : receiptFile.type === 'application/pdf' ? (
                                <i className="fa fa-file-pdf" style={{ fontSize: '48px', color: '#dc3545' }}></i>
                              ) : (
                                <svg style={{ width: 40, height: 40, color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              <div>
                                <span style={{ display: 'block', fontWeight: 600, color: '#111827', fontSize: 15 }}>{receiptFile.name}</span>
                                <span style={{ color: '#6b7280', fontSize: 13, marginTop: 4, display: 'block' }}>Click or drag to change file</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <svg style={{ width: 40, height: 40, color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <div>
                                <span style={{ display: 'block', fontWeight: 600, color: '#374151', fontSize: 15 }}>Click to upload receipt</span>
                                <span style={{ color: '#6b7280', fontSize: 13 }}>or drag and drop here</span>
                                <span style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginTop: 4 }}>Supports PNG, JPG, or PDF</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: Order summary */}
                <div className="col-lg-6">
                  <div className="your-order mb-30 mt-40" style={{ maxWidth: '450px', marginLeft: 'auto' }}>
                    <h3>Your order</h3>
                    <CheckoutOrders cart_products={cart_products} discountAmount={appliedCoupon?.discountAmount} />
                    
                    {/* Coupon Section */}
                    <div className="checkout-coupon-area" style={{ marginTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #eaedff' }}>
                      <label style={{ fontSize: '14px', color: '#6f7172', display: 'block', marginBottom: '10px' }}>If you have a coupon code, please apply it below.</label>
                      <div style={{ display: 'flex' }}>
                        <input 
                          type="text" 
                          placeholder="Coupon Code" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          disabled={!!appliedCoupon}
                          style={{ flex: 1, background: '#ffffff', border: '1px solid #eaedff', height: '45px', padding: '0 15px', outline: 'none' }} 
                        />
                        {!appliedCoupon ? (
                          <button 
                            type="button" 
                            className="os-btn os-btn-black" 
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode}
                            style={{ height: '45px', lineHeight: '41px', padding: '0 20px', marginLeft: '10px', border: '2px solid #111' }}
                          >
                            {couponLoading ? "Applying..." : "Apply"}
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="os-btn coupon-remove-btn" 
                            onClick={() => {
                              setAppliedCoupon(null);
                              setCouponCode("");
                              setCouponMessage(null);
                            }}
                            style={{ height: '45px', lineHeight: '41px', padding: '0 20px', marginLeft: '10px', border: '1px solid #dc3545', color: '#dc3545', background: 'transparent' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {couponMessage && (
                        <div style={{ marginTop: '10px', fontSize: '14px', color: couponMessage.type === 'error' ? '#dc3545' : '#10b981' }}>
                          {couponMessage.text}
                        </div>
                      )}
                    </div>

                    <div className="payment-method">
                      <div className="order-button-payment mt-20">
                        <button
                          type="submit"
                          className="os-btn os-btn-black w-100"
                          disabled={!isValid || !receiptFile || placingOrder}
                          style={(!isValid || !receiptFile || placingOrder) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          {placingOrder ? "Placing Order..." : "Place order"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          )}

        </div>
      </section>
    </div>
  );
};

export default CheckoutArea;
