
import { useState, useRef, useEffect, useContext } from "react";
import {
  User,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function UserAvatar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const ref = useRef(null);
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const isCustomer = user?.role === "customer";

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap- transition-all hover:opacity-80"
      >
        <div className="w-9 h-9 bg-violet-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-50">
          {/* User Info */}
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg relative">
                {initials}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-lg">
                  {user?.name || "User"}
                </div>
                <div className="text-sm text-slate-500">
                  {user?.email || "user@email.com"}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          {!isCustomer ? (
            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);

                  // Role-based dashboard routing
                  if (user?.role === "vendor") {
                    navigate("/restaurant/dashboard");
                  } else if (user?.role === "deliveryman") {
                    navigate("/deliveryman/dashboard");
                  } else if (user?.role === "admin") {
                    navigate("/admin/dashboard");
                  }
                }}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all"
              >
                <div className="w-9 h-9 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <LayoutDashboard size={18} />
                </div>
                <span className="font-medium">Go to Dashboard</span>
              </button>
              <div className="border-t border-slate-100 mx-5 my-2" />
            </div>
          ) : (
            // CUSTOMER ONLY
            <div className="py-1">
              <NavLink to="/profile-settings" onClick={() => setOpen(false)}>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-r from-violet-400 to-pink-400 text-white rounded-xl flex items-center justify-center shadow-md">
                    <User size={18} />
                  </div>
                  <span className="font-medium">Profile</span>
                </button>
              </NavLink>

              <NavLink to="/orders" onClick={() => setOpen(false)}>
                <button className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-xl flex items-center justify-center shadow-md">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="font-medium">Orders</span>
                </button>
              </NavLink>

              <div className="border-t border-slate-100 mx-5 my-2" />
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onLogout?.();
              setOpen(false);
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-600 hover:bg-red-50 transition-all rounded-b-2xl"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl flex items-center justify-center shadow-md">
              <LogOut size={18} />
            </div>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}