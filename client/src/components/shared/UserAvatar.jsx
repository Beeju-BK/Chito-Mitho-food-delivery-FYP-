// import { useState, useRef, useEffect,useContext } from "react";
// import {
//   User,
//   ShoppingBag,
//   Settings,
//   HelpCircle,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import { AuthContext } from "../../contexts/AuthContext";



// export default function UserAvatar({ user, onLogout }) {
    
//   const [open, setOpen] = useState(false);
//   const {logout} = useContext(AuthContext)
//   const ref = useRef(null);
//   const navigate = useNavigate();


//   const initials = user?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase() || "U";

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

  
//   return (
//     <div className="p-8  min-h-screen flex items-center justify-center">
//       <div ref={ref} className="relative">
//         {/* Avatar Button - Only avatar + chevron */}
//         <button
//           onClick={() => setOpen(!open)}
//           className={`p-2 rounded-full border flex items-center gap-2 ${
//             open 
//               ? "border-violet-300 bg-violet-50 shadow-lg" 
//               : "border-slate-200 hover:border-violet-300 hover:shadow-md"
//           } transition-all`}
//         >
//           <div className="w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow">
//             {initials}
//           </div>
//           <ChevronDown 
//             className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} 
//           />
//         </button>

//         {/* Dropdown Menu */}
//         {open && (
//           <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50">
//             {/* User Info - Only shown in menu */}
//             <div className="p-5 border-b border-slate-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-violet-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg relative">
//                   {initials}
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-slate-800">{user?.name || "User"}</div>
//                   <div className="text-sm text-slate-500">{user?.email || "user@email.com"}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Menu Items */}
            
//                <div className="py-2">
//               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors"
                
//               >
//                 <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center" >
//                   <User size={16} />
//                 </div>
//                 <NavLink to={"/profile-settings"}>
//                     <span>Profile</span>
//                 </NavLink>
                
//               </button>
//               <NavLink to={"/orders"} >
//               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
//                 <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
//                   <ShoppingBag size={16} />
//                 </div>
//                 Orders 
//                 <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">3 new</span>
//               </button>
//               </NavLink>
//               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
//                 <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
//                   <Settings size={16} />
//                 </div>
//                 Settings
//               </button>

//               <div className="border-t border-slate-100 my-1"></div>

//               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
//                 <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
//                   <HelpCircle size={16} />
//                 </div>
//                 Help & Support
//               </button>

//               <div className="border-t border-slate-100 my-1"></div>

//               <button 
//                 onClick={() => {
//                   onLogout?.();
//                   setOpen(false);
//                   navigate("/");
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
//               >
//                 <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center"
//                 >
//                   <LogOut size={16} />

//                 </div>
//                 <span onClick={logout} >Logout</span>
              
//               </button>
//             </div>
            
           

//             {/* Footer */}
//             <div className="px-4 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
//               <div className="text-xs text-slate-500 text-center">
//                 Signed in as <span className="font-medium text-slate-700">{user?.email || "user@email.com"}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useRef, useEffect, useContext } from "react";
import {
  User,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
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

  // ✅ Role check
  const isVendor = user?.role === 'restaurant' || user?.role === 'vendor';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-8 min-h-screen flex items-center justify-center">
      <div ref={ref} className="relative">
        {/* ✅ CLEAN Avatar - NO border, NO chevron */}
        <button
          onClick={() => setOpen(!open)}
          className="p-3 rounded-full flex items-center gap-2 transition-all hover:shadow-lg "
        >
          <div className="w-11 h-11 bg-violet-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg">
            {initials}
          </div>
         
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-50">
            {/* User Info */}
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-600  text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg relative">
                  {initials}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-lg">
                    {user?.name || "User"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {isVendor ? 'Restaurant Owner' : user?.email || "user@email.com"}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {isVendor ? (
              /* ✅ VENDOR: Dashboard only */
              <div className="py-1">
                <NavLink 
                  to="/restaurant/dashboard" 
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  <button className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all">
                    <div className="w-9 h-9 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="font-medium">Go to Dashboard</span>
                  </button>
                </NavLink>
              </div>
            ) : (
              /* ✅ CUSTOMER: Full menu */
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
                    <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                      3 new
                    </span>
                  </button>
                </NavLink>

                <button className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-r from-slate-400 to-gray-500 text-white rounded-xl flex items-center justify-center shadow-md">
                    <Settings size={18} />
                  </div>
                  <span className="font-medium">Settings</span>
                </button>

                <div className="border-t border-slate-100 mx-5 my-2"></div>

                <button className="w-full flex items-center gap-3 px-5 py-4 text-sm hover:bg-slate-50 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl flex items-center justify-center shadow-md">
                    <HelpCircle size={18} />
                  </div>
                  <span className="font-medium">Help & Support</span>
                </button>

                <div className="border-t border-slate-100 mx-5 my-2"></div>
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
    </div>
  );
}