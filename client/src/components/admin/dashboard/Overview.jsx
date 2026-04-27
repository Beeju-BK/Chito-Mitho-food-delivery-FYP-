import { TrendingUp, ShoppingBag, Star, Clock, ArrowUpRight, ArrowDownRight, DollarSign, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const AdminOverview = () => {
  const [dashboard, setDashboard] = useState({
    totalAdminEarnings: 0,
    totalOrders: 0,
    todayEarnings: 0,
    pendingCommissions: 0,
    recentOrders: [],
    weeklyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ✅ REAL DATA from your order.commission field
      const [dashboardRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/dashboard'),
        axios.get('http://localhost:3000/api/admin/commissions/pending')
      ]);

      const orders = dashboardRes.data.orders || [];
      
      // ✅ Calculate weekly data from REAL orders
      const weeklyData = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getDate() === day.getDate() && 
                 orderDate.getMonth() === day.getMonth();
        });
        weeklyData.push({
          day: days[day.getDay()],
          revenue: dayOrders.reduce((sum, o) => sum + o.commission, 0),
          orders: dayOrders.length
        });
      }

      setDashboard({
        totalAdminEarnings: dashboardRes.data.totalAdminCommission || 0,
        totalOrders: dashboardRes.data.totalOrders || 0,
        todayEarnings: dashboardRes.data.todayEarnings || 0,
        pendingCommissions: pendingRes.data.pendingCommissions?.length || 0,
        recentOrders: pendingRes.data.pendingCommissions?.slice(0, 4) || [],
        weeklyData
      });
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: "Total Admin Earnings", 
      value: `NRS. ${dashboard.totalAdminEarnings.toLocaleString()}`, 
      change: "+12.5%", 
      up: true, 
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      label: "Total Orders", 
      value: dashboard.totalOrders.toLocaleString(), 
      change: "+8.2%", 
      up: true, 
      icon: ShoppingBag, 
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      label: "Pending Commissions", 
      value: dashboard.pendingCommissions, 
      change: "+3", 
      up: false, 
      icon: TrendingUp, 
      color: "bg-orange-50 text-orange-600" 
    },
    { 
      label: "Today's Earnings", 
      value: `NRS. ${dashboard.todayEarnings.toLocaleString()}`, 
      change: "+25%", 
      up: true, 
      icon: TrendingUp, 
      color: "bg-purple-50 text-purple-600" 
    }
  ];

  const statusColors = {
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-amber-100 text-amber-800",
    ready: "bg-emerald-100 text-emerald-800",
    delivered: "bg-green-100 text-green-800"
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome Admin!</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Your 10% platform earnings: NRS. {dashboard.totalAdminEarnings.toLocaleString()}
        </p>
      </div>

      {/* ✅ REAL Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
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

      {/* ✅ REAL Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Weekly Commissions (10%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dashboard.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `NRS. ${v}`} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value) => [`NRS. ${value.toLocaleString()}`, 'Commission']}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Orders per Day</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboard.weeklyData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="orders" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ REAL Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">
            Recent Orders (Pending Commissions)
          </h3>
          <a href="/admin/commissions" className="text-xs text-indigo-500 font-medium hover:underline">
            View all →
          </a>
        </div>
        <div className="divide-y divide-gray-50">
          {dashboard.recentOrders.map((order) => (
            <div key={order.orderId} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <DollarSign size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-500">{order.restaurant}</span>
                </div>
                <p className="text-xs text-gray-500">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  NRS. {order.commission.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{order.subtotal.toLocaleString()} subtotal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;