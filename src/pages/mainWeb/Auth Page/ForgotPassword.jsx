import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Lock from "../../../assets/icons/Lock.png";
import Services from '../LandingPage/Components/Service'
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert(`Reset code sent to ${email}`);
  };
  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <img src={Lock} alt="Lock Icon" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-xs">
          Enter your registered email address and we"ll send you a One Time
          Password(OTP) To reset Your Password{" "}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter Your Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
          </div>
          <NavLink to="/verify-otp" state={email}>
            <button
              type="submit"
              className="w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300"
            >
              Send Reset Code
            </button>
          </NavLink>
          <div className="text-center text-sm text-gray-600 mt-4">
            <NavLink to="/login">
              ← Back To{" "}
              <span className="text-[#02B290] font-semibold">Login</span>
            </NavLink>
          </div>
        </form>
      </div>
      <Services />
    </section>
  );
}

export default ForgotPassword;
