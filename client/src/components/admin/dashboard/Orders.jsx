import { useState } from "react";
import { Search, Filter, ChevronDown, Clock, MapPin, Phone } from "lucide-react";

const allOrders = [
  { id: "#3421", customer: "Aarav Sharma", phone: "+977 9841234567", items: ["2x Chicken Momo", "1x Masala Chai"], total: 19.5, status: "Preparing", address: "Thamel, Kathmandu", time: "12:34 PM", eta: "12 min" },
  { id: "#3420", customer: "Priya Thapa", phone: "+977 9800112233", items: ["1x Veg Thali", "1x Mango Lassi"], total: 16.0, status: "Ready", address: "Lazimpat, Kathmandu", time: "12:28 PM", eta: "Ready" },
  { id: "#3419", customer: "Rohit Manandhar", phone: "+977 9851234000", items: ["1x Butter Chicken", "2x Garlic Naan"], total: 22.0, status: "Out for Delivery", address: "Baluwatar, Kathmandu", time: "12:10 PM", eta: "5 min" },
  { id: "#3418", customer: "Sita Rai", phone: "+977 9812345678", items: ["1x Gulab Jamun", "1x Masala Chai"], total: 8.0, status: "Delivered", address: "Baneshwor, Kathmandu", time: "11:55 AM", eta: "Done" },
  { id: "#3417", customer: "Bikash Gurung", phone: "+977 9871234567", items: ["3x Chicken Momo", "2x Mango Lassi"], total: 33.5, status: "Delivered", address: "Patan, Lalitpur", time: "11:40 AM", eta: "Done" },
  { id: "#3416", customer: "Anita Shrestha", phone: "+977 9840000111", items: ["1x Veg Thali"], total: 12.0, status: "Cancelled", address: "New Road, Kathmandu", time: "11:20 AM", eta: "—" },
];

const statusConfig = {
  Preparing: { color: "bg-amber-100 text-amber-700", dot: "bg-amber-500", next: "Mark Ready" },
  Ready: { color: "bg-blue-100 text-blue-700", dot: "bg-blue-500", next: "Send for Delivery" },
  "Out for Delivery": { color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", next: "Mark Delivered" },
  Delivered: { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", next: null },
  Cancelled: { color: "bg-red-100 text-red-500", dot: "bg-red-400", next: null },
};

const flow = ["Preparing", "Ready", "Out for Delivery", "Delivered"];

export default function Orders() {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const statuses = ["All", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];
  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const advance = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = flow.indexOf(o.status);
        return idx < flow.length - 1 ? { ...o, status: flow[idx + 1] } : o;
      })
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage and track all incoming orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
              filter === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
            }`}
          >
            {s}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        />
      </div>

      {/* Order Cards */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const cfg = statusConfig[order.status];
          const isExpanded = expanded === order.id;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{order.id}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-sm text-gray-600">{order.customer}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{order.items.join(", ")}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{order.time}</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>

              {isExpanded && (
                <div className="px-5 pb-4 border-t border-gray-50 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Items</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-gray-700">{item}</p>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Info</p>
                      <p className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{order.address}</p>
                      <p className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.phone}</p>
                      <p className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" />ETA: {order.eta}</p>
                    </div>
                  </div>
                  {cfg.next && (
                    <button
                      onClick={() => advance(order.id)}
                      className="w-full mt-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {cfg.next}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
