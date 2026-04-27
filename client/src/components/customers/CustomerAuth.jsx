


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerAuth = ({ open, onClose }) => {
  if (!open) return null;

  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Validate fields and show toastify for empty ones
  const validateFields = () => {
    if (showForgotPassword) {
      if (!resetEmail.trim()) {
        toast.error("Please enter your email address.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(resetEmail.trim())) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      return true;
    }

    if (isSignup) {
      if (!firstName.trim()) {
        toast.error("First name is required.");
        return false;
      }
      if (!lastName.trim()) {
        toast.error("Last name is required.");
        return false;
      }
      if (!phone.trim()) {
        toast.error("Phone number is required.");
        return false;
      }
      if (!/^\d{10}$/.test(phone.trim())) {
        toast.error("Phone number must be 10 digits.");
        return false;
      }
    }

    if (!email.trim()) {
      toast.error("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Run validation before proceeding
    if (!validateFields()) return;

    setLoading(true);

    try {
      if (isSignup) {
        // ✅ SIGNUP - FIXED: Show toast THEN close modal
        const { data } = await axios.post(
          "http://localhost:3000/api/customer/signup",
          { firstName, lastName, phone, email, password },
          { withCredentials: true }
        );

        toast.success(data.message || `Welcome ${firstName}! Account created successfully! 🎉`, {
          autoClose: 3000
        });

        // ✅ Delay close to show toast
        setTimeout(() => {
          onClose();
          // Reset form
          setFirstName("");
          setLastName("");
          setPhone("");
          setEmail("");
          setPassword("");
          setIsSignup(false);
        }, 3000);
        return; // Exit early

      } else if (showForgotPassword) {
        // ✅ FORGOT PASSWORD
        const { data } = await axios.post(
          "http://localhost:3000/api/customer/forgot-password",
          { email: resetEmail },
          { withCredentials: true }
        );

        toast.success(data.message || "✅ Reset link sent! Check your email (including spam folder).");
        setShowForgotPassword(false);
        setResetEmail("");

      } else {
        // ✅ LOGIN - FIXED: Show toast THEN close modal
        const { data } = await axios.post(
          "http://localhost:3000/api/customer/login",
          { email, password },
          { withCredentials: true }
        );

        toast.success(data.message || "🎉 Welcome back! Signed in successfully!", {
          autoClose: 3000
        });

        // ✅ Delay close to show toast
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail("");
          setPassword("");
        }, 3000);
        return; // Exit early
      }
    } catch (error) {
      console.error("Auth error:", error);

      let message = "Something went wrong! Please try again.";

      if (error.response?.status === 403) {
        message = error.response?.data?.message || "Your account has been suspended. Please contact support.";
      } else if (error.response?.status === 401) {
        message = "❌ Invalid email or password.";
      } else if (error.response?.status === 409) {
        message = "⚠️ Email or phone number already exists.";
      } else if (error.response?.status === 400) {
        message = "Invalid data provided.";
      } else if (error.response?.status === 500) {
        message = "Server error. Please try again later.";
      } else {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Enhanced ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }} // Ensure it's above modal
      />

      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
        {/* Modal */}
        <div className="w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 text-center">
            <h2 className="text-2xl font-bold">
              {isSignup
                ? "Create Account"
                : showForgotPassword
                  ? "Reset Password"
                  : "Welcome Back"}
            </h2>
            <p className="mt-1 opacity-90 text-sm">
              {isSignup
                ? "Join us today"
                : showForgotPassword
                  ? "Enter your email to reset password"
                  : "Sign in to your account"}
            </p>
          </div>

          {/* Form */}
          <form className="p-6 space-y-3" onSubmit={submitHandler}>
            {isSignup && (
              <>
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email - Always visible */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {showForgotPassword ? "Email Address *" : "Email Address"}
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  type="email"
                  placeholder="john@example.com"
                  value={showForgotPassword ? resetEmail : email}
                  onChange={(e) =>
                    showForgotPassword
                      ? setResetEmail(e.target.value)
                      : setEmail(e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password - Hidden in forgot password mode */}
            {!showForgotPassword && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Forgot Password link */}
                {!isSignup && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 justify-end w-full transition-colors"
                      disabled={loading}
                    >
                      <FaKey className="w-3.5 h-3.5" />
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              type="submit"
            >
              {loading
                ? "Processing..."
                : isSignup
                  ? "Create Account"
                  : showForgotPassword
                    ? "Send Reset Link"
                    : "Sign In"}
            </button>
          </form>

          {/* Back to Login - Forgot Password Mode */}
          {showForgotPassword && (
            <div className="px-8 pb-6 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                disabled={loading}
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Toggle Signup/Login */}
          {!showForgotPassword && (
            <div className="px-6 pb-4 pt-3 bg-gray-50 border-t border-gray-200 text-center text-sm">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                    disabled={loading}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerAuth;