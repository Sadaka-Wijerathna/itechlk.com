'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../common/error-msg';
import { toast } from 'react-toastify';
import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  comment: string;
};

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  comment: yup.string().required().min(5).label("Comment"),
});

interface BlogFormProps {
  blogId: string;
  onCommentSubmitted?: () => void;
}

const BlogForm = ({ blogId, onCommentSubmitted }: BlogFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          comment: data.comment
        })
      });

      if (res.ok) {
        toast.success("Comment submitted! It will appear once approved by an admin.");
        reset();
        if (onCommentSubmitted) {
          onCommentSubmitted();
        }
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to submit comment.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting your comment.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} id="contacts-form" className="conatct-post-form">
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="contact-icon p-relative contacts-name mb-20">
            <input id='name' {...register("name")} type="text" placeholder="Your Name" />
            <ErrorMsg msg={errors.name?.message!} />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="contact-icon p-relative contacts-name mb-20">
            <input id='email' {...register("email")} type="email" placeholder="Your Email" />
            <ErrorMsg msg={errors.email?.message!} />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="contact-icon p-relative contacts-message mb-20">
            <textarea {...register("comment")} id="comment" cols={30} rows={6} placeholder="Your Comment..."></textarea>
            <ErrorMsg msg={errors.comment?.message!} />
          </div>
        </div>
        <div className="col-xl-12">
          <button className="os-btn os-btn-black" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;