import { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function UserSignin() {
   
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50 " 
      
      ></div>

      {/* Modal box */}
      <div className="relative w-full max-w-md rounded-md shadow-xl bg-white z-50">
        {/* Close button */}
        <button
          className="cursor-pointer absolute top-3 right-3 text-white hover:text-gray-300"
          //  onClick={onClose}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-blue-600 px-8 py-6 text-center rounded-t-md">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-100 mt-2 text-sm">Sign in to get started</p>
        </div>

        {/* Form */}
        <form className="px-8 py-6 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center rounded-b-md">
          <p className="text-sm text-gray-600 ">
            Don't have an account?{' '}
            <NavLink
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}