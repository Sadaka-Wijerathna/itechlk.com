"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from "../common/error-msg";

// coupon form
function CouponForm() {
  type ICoupon = {
    coupon: string;
  };
  const couponSchema = yup.object().shape({
    coupon: yup.string().required().label("Coupon"),
  });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ICoupon>({
    resolver: yupResolver(couponSchema),
  });
  const onCouponSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data));
    reset();
  });
  return (
    <form onSubmit={onCouponSubmit}>
      <div className="checkout-coupon">
        <input id="coupon" {...register("coupon")} type="text" placeholder="Coupon Code" />
        <ErrorMsg msg={errors.coupon?.message!} />
        <button className="os-btn os-btn-black" type="submit">
          Apply Coupon
        </button>
      </div>
    </form>
  );
}

const CouponArea = () => {
  return (
    <>
      <section className="coupon-area pt-100 pb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 ms-auto">
              <div className="coupon-accordion">
                <div id="checkout_coupon" className="coupon-checkout-content">
                  <div className="coupon-info">
                    <CouponForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CouponArea;

