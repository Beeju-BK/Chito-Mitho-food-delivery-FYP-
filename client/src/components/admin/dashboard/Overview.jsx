import { TrendingUp, ShoppingBag, Star, Clock, ArrowUpRight, ArrowDownRight, Bike } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { day: "Mon", revenue: 1200, orders: 18 },
  { day: "Tue", revenue: 1800, orders: 24 },
  { day: "Wed", revenue: 1400, orders: 20 },
  { day: "Thu", revenue: 2200, orders: 31 },
  { day: "Fri", revenue: 2800, orders: 38 },
  { day: "Sat", revenue: 3400, orders: 45 },
  { day: "Sun", revenue: 2600, orders: 34 },
];

const stats = [
  { label: "Total Revenue", value: "$15,420", change: "+12.5%", up: true, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
  { label: "Total Orders", value: "210", change: "+8.2%", up: true, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "Avg. Rating", value: "4.8", change: "+0.3", up: true, icon: Star, color: "bg-amber-50 text-amber-600" },
  { label: "Avg. Prep Time", value: "22 min", change: "-3 min", up: false, icon: Clock, color: "bg-purple-50 text-purple-600" },
];

const recentOrders = [
  { id: "#3421", customer: "Aarav Sharma", items: "2x Burger, 1x Fries", total: "$18.50", status: "Preparing", time: "2 min ago" },
  { id: "#3420", customer: "Priya Thapa", items: "1x Pizza Margherita", total: "$14.00", status: "Ready", time: "8 min ago" },
  { id: "#3419", customer: "Rohit Manandhar", items: "3x Momo, 2x Drinks", total: "$22.00", status: "Delivered", time: "15 min ago" },
  { id: "#3418", customer: "Sita Rai", items: "1x Pasta, 1x Salad", total: "$16.75", status: "Delivered", time: "22 min ago" },
];

const statusColors = {
  Preparing: "bg-amber-100 text-amber-700",
  Ready: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
};

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your restaurant today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <span className={`p-2 rounded-xl ${s.color}`}>
                <s.icon size={16} />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800">{s.value}</span>
              <span className={`flex items-center text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Orders per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Recent Orders</h3>
          <button className="text-xs text-indigo-500 font-medium hover:underline">View all</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Bike size={14} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{o.customer}</span>
                  <span className="text-xs text-gray-400">{o.id}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{o.items}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{o.total}</p>
                <p className="text-xs text-gray-400">{o.time}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
