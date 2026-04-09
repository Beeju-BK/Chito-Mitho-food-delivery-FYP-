import { NavLink } from 'react-router-dom';
import { useState, useContext } from 'react';
import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import CustomerAuth from '../customers/CustomerAuth';
import { AuthContext } from '../../contexts/AuthContext';
import UserAvatar from './UserAvatar';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-orange-600 underline' : 'text-gray-700 hover:text-orange-600'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <div className="shrink-0">
            <h1 className="text-xl font-bold text-orange-600 whitespace-nowrap">
              Chito Mitho
            </h1>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
            <NavLink to="/restaurant" className={navLinkClass}>Restaurant</NavLink>
          </div>


          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart */}
            <NavLink to="/cart" >
              <button className="relative p-1.5 text-gray-700 hover:text-orange-600 transition-colors">
                <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </NavLink>

            {/* Sign In Button */}
            {user ? (
              <UserAvatar user={user} onLogout={logout} />
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1 bg-orange-600 text-white px-3 py-1.5 text-sm rounded-full hover:bg-orange-700 transition-colors font-medium whitespace-nowrap"
              >
                <FaUser className="w-3 h-3" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Hamburger - mobile only */}
            <button className="md:hidden p-1.5 text-gray-700 hover:text-orange-600 transition-colors">
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {open && <CustomerAuth open={open} onClose={() => setOpen(false)} />}
    </nav>
  );
};

export default Navbar;




