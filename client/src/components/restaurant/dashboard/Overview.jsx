// import { TrendingUp, ShoppingBag, Star, Clock, ArrowUpRight, ArrowDownRight, Bike } from "lucide-react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// const revenueData = [
//   { day: "Mon", revenue: 1200, orders: 18 },
//   { day: "Tue", revenue: 1800, orders: 24 },
//   { day: "Wed", revenue: 1400, orders: 20 },
//   { day: "Thu", revenue: 2200, orders: 31 },
//   { day: "Fri", revenue: 2800, orders: 38 },
//   { day: "Sat", revenue: 3400, orders: 45 },
//   { day: "Sun", revenue: 2600, orders: 34 },
// ];

// const stats = [
//   { label: "Total Revenue", value: "$15,420", change: "+12.5%", up: true, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
//   { label: "Total Orders", value: "210", change: "+8.2%", up: true, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
//   { label: "Avg. Rating", value: "4.8", change: "+0.3", up: true, icon: Star, color: "bg-amber-50 text-amber-600" },
//   { label: "Avg. Prep Time", value: "22 min", change: "-3 min", up: false, icon: Clock, color: "bg-purple-50 text-purple-600" },
// ];

// const recentOrders = [
//   { id: "#3421", customer: "Aarav Sharma", items: "2x Burger, 1x Fries", total: "$18.50", status: "Preparing", time: "2 min ago" },
//   { id: "#3420", customer: "Priya Thapa", items: "1x Pizza Margherita", total: "$14.00", status: "Ready", time: "8 min ago" },
//   { id: "#3419", customer: "Rohit Manandhar", items: "3x Momo, 2x Drinks", total: "$22.00", status: "Delivered", time: "15 min ago" },
//   { id: "#3418", customer: "Sita Rai", items: "1x Pasta, 1x Salad", total: "$16.75", status: "Delivered", time: "22 min ago" },
// ];

// const statusColors = {
//   Preparing: "bg-amber-100 text-amber-700",
//   Ready: "bg-blue-100 text-blue-700",
//   Delivered: "bg-emerald-100 text-emerald-700",
// };

// export default function Overview() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-xl font-semibold text-gray-800">Good morning, Taste of Nepal 👋</h2>
//         <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your restaurant today.</p>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         {stats.map((s) => (
//           <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">{s.label}</span>
//               <span className={`p-2 rounded-xl ${s.color}`}>
//                 <s.icon size={16} />
//               </span>
//             </div>
//             <div className="flex items-end justify-between">
//               <span className="text-2xl font-bold text-gray-800">{s.value}</span>
//               <span className={`flex items-center text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>
//                 {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
//                 {s.change}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//         <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
//           <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue This Week</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={revenueData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
//               <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
//           <h3 className="text-sm font-semibold text-gray-700 mb-4">Orders per Day</h3>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={revenueData} barSize={18}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//               <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
//               <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
//               <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
//           <h3 className="text-sm font-semibold text-gray-700">Recent Orders</h3>
//           <button className="text-xs text-indigo-500 font-medium hover:underline">View all</button>
//         </div>
//         <div className="divide-y divide-gray-50">
//           {recentOrders.map((o) => (
//             <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
//               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
//                 <Bike size={14} className="text-gray-500" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium text-gray-800">{o.customer}</span>
//                   <span className="text-xs text-gray-400">{o.id}</span>
//                 </div>
//                 <p className="text-xs text-gray-400 truncate">{o.items}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-semibold text-gray-800">{o.total}</p>
//                 <p className="text-xs text-gray-400">{o.time}</p>
//               </div>
//               <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { ShoppingBag, Bike, Users, Clock } from "lucide-react";
import axios from "axios";

export default function Overview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Get ALL orders for totals + recent 4
        const ordersRes = await axios.get(
          `http://localhost:3000/api/order/restaurant/orders?limit=100`, // Get more for totals
          { withCredentials: true }
        );

        const orders = ordersRes.data.orders || [];
        
        // Calculate REAL totals from ALL orders
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = ordersRes.data.pagination?.total || orders.length;
        const pendingOrders = ordersRes.data.stats?.pending || orders.filter(o => o.status === 'pending').length;

        // Format recent orders (last 4)
        const recentOrders = orders.slice(0, 4).map(order => ({
          id: `#${order._id.slice(-4).toUpperCase()}`,
          customer: order.user?.name || order.user?.email?.split('@')[0] || 'Customer',
          items: `${order.items?.[0]?.menu?.name || 'Items'} ${order.items?.length > 1 ? `+${order.items.length - 1}` : ''}`,
          total: `NRS. ${order.totalAmount?.toLocaleString('en-IN') || 0}`,
          status: (order.status || 'pending').replace('_', ' ').toUpperCase(),
          time: new Date(order.createdAt).toLocaleString([], { 
            minute: '2-digit', 
            hour: '2-digit', 
            hour12: true 
          })
        }));

        setStats({
          totalRevenue,
          totalOrders,
          pendingOrders,
          recentOrders
        });

      } catch (error) {
        console.error('Analytics fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusColors = {
    'Pending': "bg-amber-100 text-amber-700",
    'Confirmed': "bg-blue-100 text-blue-700",
    'Preparing': "bg-orange-100 text-orange-700",
    'Ready': "bg-emerald-100 text-emerald-700",
    'Out For Delivery': "bg-indigo-100 text-indigo-700",
    'Delivered': "bg-green-100 text-green-700",
    'Cancelled': "bg-red-100 text-red-700"
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-80"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          {stats.totalOrders} total orders | NRS. {stats.totalRevenue.toLocaleString('en-IN')} revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Total Revenue</span>
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">
              NRS. {stats.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-emerald-700 font-medium">+12.5% from last month</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Total Orders</span>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
            <p className="text-sm text-blue-700 font-medium">{stats.pendingOrders} pending</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Recent Activity</span>
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stats.recentOrders.length}</p>
            <p className="text-sm text-indigo-700 font-medium">orders in last hour</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <a href="/orders" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors">View All →</a>
        </div>
        
        <div className="divide-y divide-gray-50">
          {stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                  <Bike className="w-5 h-5 text-indigo-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 truncate">{order.customer}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                      {order.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{order.items}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{order.total}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
                
                <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bike className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium mb-1">No recent orders</h4>
              <p className="text-sm">Orders will appear here when customers place them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}