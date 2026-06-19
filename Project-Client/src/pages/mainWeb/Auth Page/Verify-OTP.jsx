import React, { useEffect, useRef, useState } from "react";
import Lock from "../../../assets/icons/Lock.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resendOTP, verifyOTP, verifyResetOTP, resendResetOTP } from "../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

function VerifyOTP() {
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [otptimer, setOtpTimer] = useState(60);
  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Identify whether this is for register or reset
  const email = location.state?.email || "";
  const type = location.state?.type || "register"; // default register

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpValues];
    next[index] = val;
    setOtpValues(next);
    if (val && index < 5) inputsRef.current[index + 1].focus();
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
    const next = new Array(6).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtpValues(next);
    const lastIndex = paste.length - 1;
    if (lastIndex < 5) inputsRef.current[lastIndex + 1].focus();
    else inputsRef.current[5].focus();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const code = otpValues.join("");
  if (code.length < 6) {
    setError("Please enter the 6-digit OTP");
    return;
  }
  setError("");

  try {
    if (location.state?.type === "reset") {
      await dispatch(verifyResetOTP({ email, otpCode: code })).unwrap();
      toast.success("OTP verified! You can now reset your password.");
      navigate("/reset-password", { state: { email } });
    } else {
      await dispatch(verifyOTP({ email, otpCode: code })).unwrap();
      toast.success("Email verified successfully!");
      navigate("/login");
    }
  } catch (error) {
    toast.error(error?.message || "OTP verification failed");
  }
};


  useEffect(() => {
    if (otptimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otptimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otptimer]);

  const handleResend = () => {
    if (type === "reset") {
      dispatch(resendResetOTP({ email }));
    } else {
      dispatch(resendOTP({ email }));
    }
    setOtpTimer(60);
  };

  return (
    <section className="flex flex-col justify-center items-center py-16 px-4">
      <div className="w-full md:w-82 max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <img src={Lock} alt="Lock Icon" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          {type === "register" ? "Verify Email OTP" : "Verify Reset OTP"}
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-xs mx-auto">
          Enter the 6-digit code sent to your email.
        </p>
        {email && (
          <p className="text-sm text-gray-600 mb-6 text-center">
            OTP sent to <b>{email}</b>
          </p>
        )}
        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <div className="flex justify-center gap-2 mb-4">
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
                className="w-10 h-10 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#02B290]"
              />
            ))}
          </div>

          <div
            className={`text-end text-sm ${
              otptimer > 0 ? "text-gray-400" : "text-[#02B290] cursor-pointer"
            } mb-2`}
            onClick={otptimer === 0 ? handleResend : undefined}
          >
            {otptimer > 0
              ? `Resend OTP in ${otptimer}s`
              : "Resend OTP"}
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
    </section>
  );
}

export default VerifyOTP;