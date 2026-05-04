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
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
// import { AuthContext } from "../../contexts/AuthContext";
const CustomerAuth = ({ open, onClose }) => {
  if (!open) return null;
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (isSignup) {
        const { data } = await axios.post("http://localhost:3000/api/customer/signup", {
          firstName,
          lastName,
          phone,
          address,
          email,
          password
        },{withCredentials: true})
        onClose();
        alert(data.message)
      }
      else if (!isSignup) {
        const { data } = await axios.post(
          "http://localhost:3000/api/customer/login",
          { email, password },
          { withCredentials: true }
        );

        alert(data.message);
        onClose();
      }
      else if(!isSignup && !isAdmin){
        const {data} = await axios.post("http://localhost:3000/api/admin/login",
          {email,password},
          {withCredentials: true}
        );
        alert(data.message);
        onClose();
        navigate("/admin/dashboard");
      }

    } catch (error) {
      console.log(error)
    }
  }


  




  return (
    <div className="fixed  inset-0 z-50 flex justify-center items-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"

      ></div>

      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative bg-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gray-50 px-8 py-4">
          <h2 className="text-2xl font-bold text-black text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-black text-center mt-2 text-sm">
            {isSignup ? "Sign up to get started" : "Sign in to continue"}
          </p>
        </div>

        <form className="px-8  space-y-4" onSubmit={submitHandler}>


          {isSignup && (
            <>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <FaLocationDot className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="street,pokhara-15"
                  />
                </div>
              </div>
            </>
          )}


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* Password (Always Visible) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            type="submit"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-orange-500 font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-orange-500 font-semibold cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerAuth;