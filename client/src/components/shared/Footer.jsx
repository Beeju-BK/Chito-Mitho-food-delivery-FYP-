import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Footer = ()=> {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mb-4">chito mitho</h2>
            <p className="text-sm mb-4">
              Delicious food delivered to your doorstep. Fresh, fast, and always satisfying.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-600 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-sm hover:text-orange-600 transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu" className="text-sm hover:text-orange-600 transition-colors">
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/restaurant" className="text-sm hover:text-orange-600 transition-colors">
                  Restaurant
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="text-sm hover:text-orange-600 transition-colors">
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/about-us" className="text-sm hover:text-orange-600 transition-colors">
                  About Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/help" className="text-sm hover:text-orange-600 transition-colors">
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="text-sm hover:text-orange-600 transition-colors">
                  FAQs
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="text-sm hover:text-orange-600 transition-colors">
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="text-sm hover:text-orange-600 transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/refund" className="text-sm hover:text-orange-600 transition-colors">
                  Refund Policy
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Partner With Us</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/register" className="text-sm hover:text-orange-600 transition-colors">
                  Become a Seller
                </NavLink>
              </li>
              <li>
                <NavLink to="/deliveryman/register" className="text-sm hover:text-orange-600 transition-colors">
                  Become a Delivery Partner
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FiMapPin className="w-5 h-5 mt-0.5 shrink-0 text-orange-600" />
                <span className="text-sm">123 Food Street, Pokhara, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="w-5 h-5 shrink-0 text-orange-600" />
                <a href="tel:+9779812345678" className="text-sm hover:text-orange-600 transition-colors">
                  +977 981-2345678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-5 h-5 shrink-0 text-orange-600" />
                <a href="mailto:info@chitomitho.com" className="text-sm hover:text-orange-600 transition-colors">
                  info@chitomitho.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Chito Mitho. All rights reserved.
            </p>
            <div className="flex gap-6">
              <NavLink to="/terms" className="text-sm text-gray-400 hover:text-orange-600 transition-colors">
                Terms
              </NavLink>
              <NavLink to="/privacy" className="text-sm text-gray-400 hover:text-orange-600 transition-colors">
                Privacy
              </NavLink>
              <NavLink to="/cookies" className="text-sm text-gray-400 hover:text-orange-600 transition-colors">
                Cookies
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;