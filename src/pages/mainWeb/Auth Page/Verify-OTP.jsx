import React, { useRef, useState } from "react";
import Lock from "../../../assets/icons/Lock.png";
import { useLocation } from "react-router-dom";
import Services from '../LandingPage/Components/Service'

function VerifyOTP() {
  const [otpValues, setOtpValues] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const location = useLocation();
  const email = location.state?.email || "";
  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpValues];
    next[index] = val;
    setOtpValues(next);
    if (val && index < 3) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prev = [...otpValues];
      prev[index - 1] = "";
      setOtpValues(prev);
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (paste.length === 0) return;
    const next = new Array(4).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtpValues(next);
    const lastIndex = paste.length - 1;
    if (lastIndex < 3) inputsRef.current[lastIndex + 1].focus();
    else inputsRef.current[3].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otpValues.join("");
    if (code.length < 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    setError("");
    console.log(code);
  };

  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <img src={Lock} alt="Lock Icon" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-xs mx-auto">
          Enter the 6-digit code sent to your email to reset your password
        </p>

        {email && <p className="text-sm text-gray-600 mb-6 text-center max-w-xs mx-auto">
          OTP sent to {email}
        </p>}

        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <div className="flex justify-center gap-3 mb-6">
            {otpValues.map((value, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#02B290]"
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#02B290] hover:bg-[#029c7d] px-4 py-2 text-white rounded-md font-medium transition duration-300"
          >
            Verify OTP
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        
      </div>
      <Services />
    </section>
  );
}

export default VerifyOTP;