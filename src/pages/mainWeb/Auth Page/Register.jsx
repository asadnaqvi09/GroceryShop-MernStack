import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../../../redux/features/auth/authSlice";
import Services from "../LandingPage/Components/Service";

function Register() {
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  })
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const {name,email,password,confirmPassword} = formData;
  if (!name || !email || !password || !confirmPassword) {
    toast.error("Please fill all required fields");
    return;
  }
  if (!validateEmail(email)) {
    toast.error("Please enter a valid email address");
    return;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return;
  }
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }
  try {
    const response = await dispatch(
      registerUser({ name, email, password, confirmPassword })
    ).unwrap();
    toast.success(response?.message || "Registration successful!");
    setFormData({
      name:"",
      email:"",
      password:"",
      confirmPassword:"",
    })
    navigate("/");
  } catch (err) {
    toast.error(
      typeof err === "string" ? err : err?.message || "Registration failed"
    );
    console.log(err);
  }
};


  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Register Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Your Name..."
              value={formData.name}
              onChange={(e) => setFormData({...formData,name:e.target.value})}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter Your Email..."
              value={formData.email}
              onChange={(e) => setFormData({...formData,email:e.target.value})}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter Your Password..."
              value={formData.password}
              onChange={(e) => setFormData({...formData,password:e.target.value})}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm Your Password..."
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData,confirmPassword:e.target.value})}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#02B290]"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <NavLink to="/login">
              Already Registered?{" "}
              <span className="text-[#02B290] font-semibold">Login Now</span>
            </NavLink>
          </div>
        </form>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
      <Services />
    </section>
  );
}

export default Register;