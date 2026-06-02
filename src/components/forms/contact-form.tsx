'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../common/error-msg';

type FormData = {
  name: string;
  email: string;
  subject: string;
};

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  subject: yup.string().required().min(10).label("Subject"),
});


const ContactForm = () => {
  const {register,handleSubmit,reset,formState: { errors }} = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data))
    reset()
  });
  return (
    <>
      <form onSubmit={onSubmit} id="contact-form">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <div className="contact__input">
              <label>Name <span className="required">*</span></label>
              <input id='name' {...register("name")} placeholder='Name' type="text" />
              <ErrorMsg msg={errors.name?.message!} />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="contact__input">
              <label>Email <span className="required">*</span></label>
              <input id='email' {...register("email")} type="email" placeholder='Email' />
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="contact__input">
              <label>Subject <span className="required">*</span></label>
              <input id='subject' {...register("subject")} type="text" />
               <ErrorMsg msg={errors.subject?.message!} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="contact__input">
              <label>Message</label>
              <textarea cols={30} rows={10}></textarea>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="contact__submit">
              <button type="submit" className="os-btn os-btn-black">Send Message</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ContactForm;