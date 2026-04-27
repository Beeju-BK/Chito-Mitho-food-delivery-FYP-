import { Bell, Search } from "lucide-react";

const pageLabels = {
  overview: "Overview",
  menu: "Menu Management",
  orders: "Orders",
  analytics: "Analytics",
  reviews: "Reviews",
  settings: "Settings",
};

export default function Topbar({ page }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 px-5 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        <span className="text-gray-400">Vendor Dashboard</span>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{pageLabels[page]}</span>
      </div>
      {/* <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">TN</div>
      </div> */}
    </header>
  );
}
