import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Lock from "../../../assets/icons/Lock.png";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../redux/features/auth/authSlice";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password:"",
    confirmPassword:"",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const { resetToken } = useSelector((state) => state.auth);
  const token = resetToken || location.state?.resetToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // 🧠 Validation
    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      const response = await dispatch(
        resetPassword({ formData: {...formData,email}, token })
      ).unwrap();

      toast.success(response?.message || "Password reset successful!");
      setFormData({ password: "", confirmPassword: "" });
      navigate("/login");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Password reset failed."
      );
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <img src={Lock} alt="Lock Icon" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Enter New Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#02B290]"
              disabled
            />
          </div>
          {/* New Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter your new password..."
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => ({
                ...prev,
                password: !prev.password,
              }))}
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="Confirm password..."
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => ({
                ...prev,
                confirmPassword: !prev.confirmPassword,
              }))}
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300"
          >
            Change Password
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <NavLink to="/login">
              ← Back To{" "}
              <span className="text-[#02B290] font-semibold">Login</span>
            </NavLink>
          </div>
        </form>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </section>
  );
}

export default ResetPassword;