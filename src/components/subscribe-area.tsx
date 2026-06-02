'use client'
// props type
type IProps = {
  style_2?: boolean;
  style_3?: boolean;
};

const SubscribeArea = ({ style_2, style_3 }: IProps) => {
  
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <>
      <section className={`subscribe__area pb-100 grey-bg ${style_2 ? 'box-m-15' : ''} ${style_3 ? 'position-relative' : ''}`}>
        <div className={`container ${style_3 ? 'custom-container' : ''}`}>
          <div className={`subscribe__inner ${style_2 ? 'subscribe__inner-2 pt-120' : 'pt-95'}`}>
            <div className="row">
              <div className="col-xl-8 offset-xl-2 col-lg-8 offset-lg-2">
                <div className="subscribe__content text-center">
                  <h2>Get Discount Info</h2>
                  <p>Subscribe to the ITechLK mailing list to receive updates on new arrivals, special offers and other
                    discount information.</p>
                  <div className="subscribe__form">
                    <form onSubmit={handleSubmit}>
                      <input type="email" placeholder="Subscribe to our newsletter..." />
                      <button className="os-btn os-btn-2 os-btn-3">subscribe</button>
                    </form>
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

export default SubscribeArea;