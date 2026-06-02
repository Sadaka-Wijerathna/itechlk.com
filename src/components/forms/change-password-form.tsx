'use client'
import React from "react";

const ChangePasswordForm = () => {
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="password__input">
        <p>Old Password</p>
        <input type="password" placeholder="Enter Old Password" />
      </div>
      <div className="password__input">
        <p>New Password</p>
        <input type="password" placeholder="Enter New Password" />
      </div>
      <div className="password__input">
        <p>Confirm Password</p>
        <input type="password" placeholder="Confirm Password" />
      </div>
      <div className="password__input">
        <button type="submit" className="os-btn os-btn-black">
          Update password
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
