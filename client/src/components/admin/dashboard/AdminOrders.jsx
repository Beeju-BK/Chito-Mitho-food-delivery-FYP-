

import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

const STATUS_CONFIG = {
  pending:          { label: "Pending",          color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-800 border-blue-200" },
  preparing:        { label: "Preparing",         color: "bg-orange-100 text-orange-800 border-orange-200" },
  ready:            { label: "Ready",             color: "bg-purple-100 text-purple-800 border-purple-200" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered:        { label: "Delivered",         color: "bg-green-100 text-green-800 border-green-200" },
  cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-800 border-red-200" },
};

const DELIVERY_STATUS_LABELS = {
  accepted:   "Accepted",
  picked_up:  "Picked Up",
  on_the_way: "On the Way",
  delivered:  "Delivered",
};

const AdminOrders = () => {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm]     = useState("");
  const [expandedId, setExpandedId]     = useState(null);
  const [stats, setStats]               = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const { data } = await axios.get(`${API}/order/admin/all${params}`, { withCredentials: true });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const getRestaurant = (order) =>
    Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const q          = searchTerm.toLowerCase();
    const restaurant = getRestaurant(order);
    return (
      order._id.toLowerCase().includes(q) ||
      (restaurant?.restaurantName || "").toLowerCase().includes(q) ||
      (`${order.user?.firstName} ${order.user?.lastName}`).toLowerCase().includes(q) ||
      (order.user?.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-0 font-sans">

      {/* Header */}
      <div className="pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-500 mb-1">Admin Panel</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h2>
          </div>

          {/* Stats */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Total",     value: stats.total,      bg: "bg-gray-50 border-gray-100",       text: "text-gray-700" },
              { label: "Pending",   value: stats.pending,    bg: "bg-yellow-50 border-yellow-100",   text: "text-yellow-700" },
              { label: "Active",    value: stats.active,     bg: "bg-blue-50 border-blue-100",       text: "text-blue-700" },
              { label: "Delivered", value: stats.delivered,  bg: "bg-green-50 border-green-100",     text: "text-green-700" },
              { label: "Cancelled", value: stats.cancelled,  bg: "bg-red-50 border-red-100",         text: "text-red-600" },
            ].map(({ label, value, bg, text }) => (
              <div key={label} className={`text-center px-3 py-2 border rounded-xl ${bg}`}>
                <p className={`text-lg font-bold leading-none ${text}`}>{value ?? 0}</p>
                <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
            <div className="text-center px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-lg font-bold leading-none text-emerald-700">
                NRS. {Math.round(stats.todayRevenue || 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-medium text-emerald-500 mt-0.5 uppercase tracking-wider">Today Revenue</p>
            </div>
            <div className="text-center px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl">
              <p className="text-lg font-bold leading-none text-purple-700">
                NRS. {Math.round(stats.totalCommission || 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-medium text-purple-500 mt-0.5 uppercase tracking-wider">Commission</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, restaurant..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Status</option>
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-2.5 mt-3 bg-gray-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>Order / Date</span>
        <span>Customer</span>
        <span>Restaurant</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Detail</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No orders found</div>
      ) : (
        <div className="space-y-1.5 mt-1">
          {filteredOrders.map((order) => {
            const restaurant = getRestaurant(order);
            const cfg        = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const dm         = order.deliveryman;
            const dmUser     = dm?.userId;
            const isExpanded = expandedId === order._id;

            return (
              <div key={order._id} className="rounded-xl border border-gray-100 overflow-hidden">

                {/* Summary row */}
                <div className={`grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-3 items-center px-4 py-3.5 transition-all ${
                  isExpanded ? "bg-indigo-50" : "bg-white hover:bg-gray-50"
                }`}>

                  {/* Order + date */}
                  <div>
                    <p className="text-sm font-bold text-gray-800 font-mono">
                      #{order._id.toString().slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                      {order.paymentInfo?.method} ·{" "}
                      <span className={order.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{order.user?.email}</p>
                    <p className="text-xs text-gray-400">
                      {Array.isArray(order.user?.phone) ? order.user.phone[0] : order.user?.phone}
                    </p>
                  </div>

                  {/* Restaurant */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                      {restaurant?.restaurantImage
                        ? <img src={restaurant.restaurantImage} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-orange-500">🍽</div>
                      }
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {restaurant?.restaurantName || "N/A"}
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-sm font-bold text-gray-800">NRS. {order.totalAmount?.toFixed(0)}</p>
                    {order.commission > 0 && (
                      <p className="text-xs text-purple-600 font-medium">+NRS. {order.commission} fee</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {order.deliveryStatus && (
                      <p className="text-[10px] text-indigo-600 font-medium">
                        🚴 {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                      </p>
                    )}
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-indigo-100 bg-white px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Menu Items ({order.items?.length})
                      </p>
                      <div className="space-y-2">
                        {(order.items || []).map((item) => (
                          <div key={item._id} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.menu?.menuImage
                                ? <img src={item.menu.menuImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-bold">
                                    {(item.menu?.name || "?").slice(0, 2).toUpperCase()}
                                  </div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{item.menu?.name}</p>
                              <p className="text-[10px] text-gray-400">NRS. {item.price} × {item.quantity}</p>
                            </div>
                            <p className="text-xs font-bold text-gray-700">NRS. {item.total}</p>
                          </div>
                        ))}
                      </div>

                      {/* Price breakdown */}
                      <div className="mt-3 pt-2 border-t border-gray-100 space-y-0.5 text-xs text-gray-500">
                        <div className="flex justify-between"><span>Subtotal</span><span>NRS. {order.subtotal}</span></div>
                        <div className="flex justify-between"><span>Tax (13%)</span><span>NRS. {order.tax}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span>NRS. {order.deliveryFee}</span></div>
                        {order.commission > 0 && (
                          <div className="flex justify-between text-purple-600"><span>Commission</span><span>NRS. {order.commission}</span></div>
                        )}
                        <div className="flex justify-between font-bold text-gray-800 border-t pt-1">
                          <span>Total</span><span>NRS. {order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer + Delivery address */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                        <p className="font-semibold text-gray-800">{order.user?.firstName} {order.user?.lastName}</p>
                        <p className="text-gray-500 text-xs">{order.user?.email}</p>
                        <p className="text-gray-500 text-xs">
                          {Array.isArray(order.user?.phone) ? order.user.phone[0] : order.user?.phone}
                        </p>
                      </div>

                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-3">Delivery Address</p>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm">
                        <p className="text-gray-700">📍 {order.shippingAddress?.address}</p>
                        <p className="text-gray-500 text-xs mt-0.5">📞 {order.shippingAddress?.phone}</p>
                      </div>
                    </div>

                    {/* Deliveryman */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deliveryman</p>
                      {dmUser ? (
                        <div className="bg-indigo-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                              {(dmUser.firstName || "D").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{dmUser.firstName} {dmUser.lastName}</p>
                              <p className="text-xs text-gray-500">
                                {Array.isArray(dmUser.phone) ? dmUser.phone[0] : dmUser.phone}
                              </p>
                            </div>
                          </div>
                          {dm?.zone && <p className="text-xs text-gray-500">📍 Zone: {dm.zone}</p>}
                          {dm?.vehicle && <p className="text-xs text-gray-500">🚗 {dm.vehicle}</p>}
                          {order.deliveryStatus && (
                            <div className="mt-2 px-2 py-1 bg-white rounded-lg">
                              <p className="text-xs font-semibold text-indigo-600">
                                🚴 {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-400">
                            {["ready", "pending", "confirmed", "preparing"].includes(order.status)
                              ? "Not yet assigned"
                              : "No deliveryman"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;