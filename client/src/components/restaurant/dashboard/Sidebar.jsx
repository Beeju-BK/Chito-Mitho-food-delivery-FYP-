import { LayoutDashboard, UtensilsCrossed, ShoppingBag, BarChart2, Star, Settings, LogOut, ChevronLeft, Menu } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ active, onNav, collapsed, onToggle }) {
  const {logout,user} = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutVendor = ()=>{
    logout()
    navigate("/")
  }
  return (
    <aside
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b border-gray-50 ${collapsed ? "justify-center" : "gap-3"}`}>
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base">🍛</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user.restaurantName}</p>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Open</span>
            </div>
          </>
        )}
        {collapsed && <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base">🍛</div>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all group ${
                collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
              } ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              <item.icon size={18}  />
              {!collapsed && (
                <span className={`text-sm font-medium flex-1 text-left ${isActive ? "text-indigo-600" : ""}`}>{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-gray-50 space-y-1">
        <button
          className={`w-full flex items-center text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ${
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          }`}
          onClick={logoutVendor}
          
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
        <button
          onClick={onToggle}
          className={`w-full flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all ${
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          }`}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}


export default Sidebar;