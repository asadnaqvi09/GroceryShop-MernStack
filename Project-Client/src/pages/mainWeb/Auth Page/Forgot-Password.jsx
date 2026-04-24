import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Lock from "../../../assets/icons/Lock.png";
import { forgotPassword } from "../../../redux/features/auth/authSlice";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();
      toast.success( result?.message ||"Reset code sent successfully");
      // Navigate to verify OTP page with email in state
      navigate("/verify-otp", { state: { email, type: "reset" } });
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <img src={Lock} alt="Lock Icon" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-xs mx-auto">
          Enter your registered email address. We'll send you a one-time password (OTP) to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <NavLink to="/login">
              ← Back to{" "}
              <span className="text-[#02B290] font-semibold">Login</span>
            </NavLink>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;