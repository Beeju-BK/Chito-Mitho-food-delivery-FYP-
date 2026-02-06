import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiShoppingCart,FiMapPin } from 'react-icons/fi';
import {FaUser } from 'react-icons/fa';


const Navbar = () => {
  const [cartCount, setCartCount] = useState(1);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className=" max-w-7.2xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className=" flex justify-between items-center h-16 gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex shrink">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600 whitespace-nowrap">
              chito mitho
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center mr-18 gap-2 sm:gap-4 md:gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm sm:text-base transition-colors font-medium whitespace-nowrap ${isActive ? "text-orange-600 underline" : "text-gray-700 hover:text-orange-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `text-sm sm:text-base transition-colors font-medium whitespace-nowrap ${isActive ? "text-orange-600 underline" : "text-gray-700 hover:text-orange-600"
                }`
              }
            >
              Menu
            </NavLink>

            <NavLink
              to="/restaurant"
              className={({ isActive }) =>
                `text-sm sm:text-base transition-colors font-medium whitespace-nowrap ${isActive ? "text-orange-600 underline" : "text-gray-700 hover:text-orange-600"
                }`
              }
            >
              Restaurant
            </NavLink>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer">
            <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium whitespace-nowrap hidden md:inline">Location</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 text-sm rounded-full border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              <button className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Cart, My Orders & Signup */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <NavLink to={"/cart"}>
              <button className="relative cursor-pointer p-1.5 sm:p-2 text-gray-700 hover:text-orange-600 transition-colors">
                <FiShoppingCart className="w-5 h-5  sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </NavLink>


            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `text-sm sm:text-base transition-colors font-medium whitespace-nowrap hidden lg:inline ${isActive ? "text-orange-600 underline" : "text-gray-700 hover:text-orange-600"
                }`
              }
            >
              My Orders
            </NavLink>
            <NavLink to={"/customer-signup"}>
              <button className="flex items-center bg-orange-600 text-white gap-1 cursor-pointer sm:px-4 md:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-full hover:bg-orange-700 transition-colors font-medium whitespace-nowrap">
                <FaUser /> <span>Sign Up</span>
              </button>
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;