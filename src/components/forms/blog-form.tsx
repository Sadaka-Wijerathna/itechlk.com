'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../common/error-msg';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  subject: yup.string().required().min(10).label("Subject"),
  message: yup.string().required().min(10).label("Message"),
});

const BlogForm = () => {
  const {register,handleSubmit,reset,formState: { errors }} = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data))
    reset()
  });
  return (
    <form onSubmit={onSubmit} id="contacts-form" className="conatct-post-form">
    <div className="row">
      <div className="col-xl-6 col-lg-6 col-md-6">
        <div className="contact-icon p-relative contacts-name">
          <input id='name' {...register("name")} type="text" placeholder="Name" />
          <ErrorMsg msg={errors.name?.message!} />
        </div>
      </div>
      <div className="col-xl-6 col-lg-6 col-md-6">
        <div className="contact-icon p-relative contacts-name">
          <input id='email' {...register("email")} type="email" placeholder="Email" />
           <ErrorMsg msg={errors.email?.message!} />
        </div>
      </div>
      <div className="col-xl-12">
        <div className="contact-icon p-relative contacts-email">
          <input id='subject' {...register("subject")} type="text" placeholder="Subject" />
          <ErrorMsg msg={errors.subject?.message!} />
        </div>
      </div>
      <div className="col-xl-12">
        <div className="contact-icon p-relative contacts-message">
          <textarea {...register("message")} id="message" cols={30} rows={10}
            placeholder="Comments"></textarea>
           <ErrorMsg msg={errors.message?.message!} />
        </div>
      </div>
      <div className="col-xl-12">
        <button className="os-btn os-btn-black" type="submit">Post comment</button>
      </div>
    </div>
  </form>
  );
};

export default BlogForm;