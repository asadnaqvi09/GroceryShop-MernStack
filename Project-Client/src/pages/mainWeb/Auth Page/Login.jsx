import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../../redux/features/auth/authSlice";
import { fetchCart } from "../../../redux/features/cart/cartSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchCart()).unwrap();
      toast.success(result?.message || "Welcome back!");
      setFormData({ email: "", password: "" });
      setFieldErrors({});
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Invalid email or password");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02B290] transition ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02B290] transition ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div className="text-right">
            <NavLink
              to="/forgot-password"
              className="text-sm text-[#02B290] font-medium hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-[#029c7d] cursor-not-allowed opacity-90"
                : "bg-[#02B290] hover:bg-[#029c7d] shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="text-[#02B290] font-semibold hover:underline"
            >
              Register Now
            </NavLink>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;