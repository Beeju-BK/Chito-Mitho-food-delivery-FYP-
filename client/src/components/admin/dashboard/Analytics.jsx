import { TrendingUp, Users, ShoppingBag, Star } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 8200, orders: 110 },
  { month: "Feb", revenue: 9400, orders: 128 },
  { month: "Mar", revenue: 11200, orders: 150 },
  { month: "Apr", revenue: 10100, orders: 138 },
  { month: "May", revenue: 13400, orders: 182 },
  { month: "Jun", revenue: 15420, orders: 210 },
];

const categoryData = [
  { name: "Main Course", value: 42, color: "#6366f1" },
  { name: "Appetizers", value: 28, color: "#10b981" },
  { name: "Beverages", value: 18, color: "#f59e0b" },
  { name: "Desserts", value: 12, color: "#ec4899" },
];

const topItems = [
  { name: "Butter Chicken", orders: 210, revenue: 3045 },
  { name: "Chicken Momo", orders: 142, revenue: 1207 },
  { name: "Masala Chai", orders: 188, revenue: 470 },
  { name: "Veg Thali", orders: 98, revenue: 1176 },
  { name: "Mango Lassi", orders: 75, revenue: 300 },
];

const kpis = [
  { label: "Total Revenue", value: "$67,720", sub: "Last 6 months", icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
  { label: "Total Orders", value: "918", sub: "Last 6 months", icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
  { label: "Repeat Customers", value: "64%", sub: "Of all customers", icon: Users, color: "text-amber-600 bg-amber-50" },
  { label: "Avg. Rating", value: "4.8 / 5", sub: "Based on 312 reviews", icon: Star, color: "text-pink-600 bg-pink-50" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-medium text-gray-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.name === "revenue" ? `$${p.value}` : p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Performance overview for the last 6 months</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon size={16} />
            </div>
            <p className="text-xl font-bold text-gray-800">{k.value}</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Category Split */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {categoryData.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                {c.name} ({c.value}%)
              </span>
            ))}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 truncate">{item.name}</span>
                    <span className="text-gray-500 text-xs flex-shrink-0 ml-2">{item.orders} orders</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${(item.orders / 210) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 w-14 text-right">${item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
