
import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, MapPin, Phone, Package, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const statusConfig = {
  pending: { 
    color: "bg-amber-100 text-amber-700 border-amber-300", 
    dot: "bg-amber-500", 
    next: null,
    actions: ["confirm", "cancel"] // Custom actions for pending orders
  },
  confirmed: { color: "bg-blue-100 text-blue-700 border-blue-300", dot: "bg-blue-500", next: "Start Preparing" },
  preparing: { color: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-500", next: "Mark Ready" },
  ready: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500", next: "Send for Delivery" },
  out_for_delivery: { color: "bg-indigo-100 text-indigo-700 border-indigo-300", dot: "bg-indigo-500", next: "Mark Delivered" },
  delivered: { color: "bg-green-100 text-green-700 border-green-300", dot: "bg-green-500", next: null },
  cancelled: { color: "bg-red-100 text-red-700 border-red-300", dot: "bg-red-500", next: null },
};

const flow = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

export default function RestaurantOrders() {
  const [data, setData] = useState({
    orders: [],
    pagination: { current: 1, pages: 1, total: 0, limit: 10 },
    stats: { pending: 0, confirmed: 0, preparing: 0, ready: 0, out_for_delivery: 0, delivered: 0, cancelled: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = useCallback(async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      params.append("page", page.toString());
      params.append("limit", "10");

      const { data: response } = await axios.get(
        `http://localhost:3000/api/order/restaurant/orders?${params.toString()}`,
        { withCredentials: true }
      );
      
      setData({
        orders: response.orders || response.data?.orders || [],
        pagination: response.pagination || {
          current: page,
          pages: 1,
          total: response.count || response.orders?.length || 0,
          limit: 10
        },
        stats: response.stats || {
          pending: response.pending || 0,
          confirmed: 0, preparing: 0, ready: 0, 
          out_for_delivery: 0, delivered: 0, cancelled: 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/order/${orderId}/status`, { 
        status: newStatus 
      }, { withCredentials: true });
      fetchOrders(data.pagination.current, statusFilter);
    } catch (error) {
      console.error('Status update failed:', error);
      alert(`Failed to update order status to ${newStatus}`);
    }
  };

  const advanceOrderStatus = async (orderId) => {
    const order = data.orders.find(o => o._id === orderId);
    const currentIndex = flow.indexOf(order?.status);
    const nextStatus = flow[currentIndex + 1];
    
    if (nextStatus) {
      await updateOrderStatus(orderId, nextStatus);
    }
  };

  const handlePendingAction = async (orderId, action) => {
    if (action === 'confirm') {
      await updateOrderStatus(orderId, 'confirmed');
    } else if (action === 'cancel') {
      if (confirm('Are you sure you want to cancel this order?')) {
        await updateOrderStatus(orderId, 'cancelled');
      }
    }
  };

  const goToPage = (page) => {
    fetchOrders(page, statusFilter);
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter, fetchOrders]);

  const statuses = ["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-5 p-6 md:p-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Restaurant Orders</h2>
        <p className="text-sm text-gray-500 mt-1">
          {data.pagination.total} total orders | Page {data.pagination.current} of {data.pagination.pages}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statuses.slice(1).map((status) => (
          <div key={status} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[status]?.color || 'bg-gray-100 text-gray-700'}`}>
                {status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-2xl font-bold text-gray-900">{data.stats[status] || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 flex-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-2xl font-medium whitespace-nowrap transition-all shadow-sm ${
                statusFilter === s 
                  ? "bg-indigo-600 text-white shadow-indigo-300" 
                  : "bg-white border-2 border-gray-100 hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              {s.replace('_', ' ').toUpperCase()}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                statusFilter === s ? "bg-white/30" : "bg-gray-100 text-gray-700"
              }`}>
                {data.stats[s] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 shadow-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {data.orders.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">{statusFilter !== 'all' ? `No ${statusFilter} orders.` : 'No orders yet.'}</p>
          </div>
        ) : (
          data.orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.cancelled;
            const isExpanded = expanded === order._id;
            
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div
                  className="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isExpanded ? null : order._id)}
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-gray-800">#{order._id?.slice(-6).toUpperCase()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                        {order.status?.replace('_', ' ').toUpperCase() || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {order.items?.[0]?.menu?.name || 'Order items'}
                      {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-xl text-gray-900">
                      NRS. {order.totalAmount?.toLocaleString('en-IN') || '0'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ml-2 ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Items ({order.items?.length || 0})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{item.menu?.name}</p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × NRS. {item.price?.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">NRS. {item.total?.toLocaleString('en-IN') || '0'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Customer</h4>
                          <p className="font-medium text-gray-900">
                            {order.user?.name || order.user?.email || 'Customer'}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone size={14} />{' '}
                            {Array.isArray(order.user?.phone) ? order.user.phone[0] : order.user?.phone || order.shippingAddress?.phone || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <MapPin size={14} /> {order.shippingAddress?.address || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">Payment: {order.paymentInfo?.method || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {cfg.actions ? (
                      // Pending orders - show Confirm/Cancel buttons
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePendingAction(order._id, 'confirm')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handlePendingAction(order._id, 'cancel')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <XCircle size={20} />
                          Cancel
                        </button>
                      </div>
                    ) : cfg.next ? (
                      // Other orders - single next button
                      <button
                        onClick={() => advanceOrderStatus(order._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                      >
                        {cfg.next}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {data.pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {((data.pagination.current - 1) * data.pagination.limit) + 1} to{' '}
            {Math.min(data.pagination.current * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(data.pagination.current - 1)}
              disabled={data.pagination.current === 1}
              className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
              Page {data.pagination.current} of {data.pagination.pages}
            </span>
            <button
              onClick={() => goToPage(data.pagination.current + 1)}
              disabled={data.pagination.current === data.pagination.pages}
              className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}