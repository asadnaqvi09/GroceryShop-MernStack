import React, { useState } from 'react'
import { FaEye , FaEyeSlash } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Services from '../LandingPage/Components/Service'
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }
    setError("");
    console.log(email, password);
  };

  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Login Your Account
        </h2>
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
          <div className="mb-4 relative">
            <input
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter Your Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="text-right text-sm text-[#02B290] cursor-pointer mb-4">
            <NavLink to="/forgot-password">
              Forgot Password?
            </NavLink>
          </div>
          <button
            type="submit"
            className="w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300"
          >
            Login
          </button>
          <div className="text-center text-sm text-gray-600 mt-4">
            <NavLink to="/register">
              Don't have an account?{" "}
              <span className="text-[#02B290] font-semibold">Register Now</span>
            </NavLink>
          </div>
        </form>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
      <Services />
    </section>
  );
}

export default Login
