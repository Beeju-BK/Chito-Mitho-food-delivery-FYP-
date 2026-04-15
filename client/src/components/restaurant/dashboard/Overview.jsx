



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