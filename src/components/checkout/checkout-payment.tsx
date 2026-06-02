
const CheckoutPayment = () => {
  return (
    <div className="payment-method">
      <div className="accordion" id="accordionExample">
        <div className="card">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <button
                className="btn-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Cheque Payment
              </button>
            </h5>
          </div>
          <div
            id="collapseTwo"
            className="collapse show"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              Please send your cheque to Store Name, Store Street, Store Town,
              Store State / County, Store Postcode.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" id="headingThree">
            <h5 className="mb-0">
              <button
                className="btn-link collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                PayPal
              </button>
            </h5>
          </div>
          <div
            id="collapseThree"
            className="collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="card-body">
              Pay via PayPal; you can pay with your credit card if you don’t
              have a PayPal account.
            </div>
          </div>
        </div>
      </div>
      <div className="order-button-payment mt-20">
        <button type="submit" className="os-btn os-btn-black">
          Place order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
