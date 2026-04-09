import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/order/get-orders", {
        withCredentials: true,
      });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (!order || typeof order !== 'object') return false;
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const restaurantName = (order.restaurantId?.name || '').toLowerCase();
    const orderId = (order._id || '').toLowerCase();
    const createdDate = new Date(order.createdAt || '').toLocaleDateString();
    
    const matchesSearch = searchTerm === "" || 
      restaurantName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm.toLowerCase()) ||
      createdDate.includes(searchTerm);
      
    return matchesStatus && matchesSearch;
  });

  // Status config
  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-300" },
    preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800 border-orange-300" },
    "out-for-delivery": { label: "Out for Delivery", color: "bg-purple-100 text-purple-800 border-purple-300" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800 border-green-300" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300" }
  };

  const handleRefresh = () => fetchOrders();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
              <p className="text-gray-600">
                {filteredOrders.length} of {orders.length} orders shown
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center gap-2"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by restaurant, order ID, or date..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter" 
                : "You haven't placed any orders yet"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-gray-900">
                          Order #{(order._id || 'N/A').slice(-8)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          statusConfig[order?.status || 'pending']?.color || "bg-gray-100 text-gray-800 border-gray-300"
                        }`}>
                          {statusConfig[order?.status || 'pending']?.label || (order?.status || 'Unknown')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(order?.createdAt || Date.now()).toLocaleDateString()} 
                          {new Date(order?.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <span>•</span>
                        <span>{(order?.items || []).length} item{(order?.items || []).length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-900">
                        NRS. {((order?.totalAmount || order?.Total || 0)).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order?.paymentInfo?.method || 'Cash'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.051 20.488L8.512 9.468a3.07 3.07 0 012.976 0l5.461 11.02a3.07 3.07 0 01-.976 4.488h-9.982a3.07 3.07 0 01-.976-4.488zM20 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">
                        {order?.restaurant?.restaurantName || 'Unknown Restaurant'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {order?.shippingAddress?.address || 'Address not provided'}
                      </p>
                      {order?.phone && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {order.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ ENHANCED Items List with Images & Full Details */}
                <div className="p-6">
                  {(order?.items || []).length > 0 ? (
                    <div className="space-y-4">
                      {(order.items || []).map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
                          {/* Item Image */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-red-600 flex items-center justify-center group-hover:shadow-md transition-all">
                              {item?.menu?.menuImage? (
                                <img 
                                  src={item.menu.menuImage} 
                                  alt={item.menu.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null} 
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                                {(item?.menu?.name || 'Item').slice(0,2).toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-gray-900 text-lg leading-tight truncate pr-4">
                                {item?.menu?.name || 'Item'}
                              </h4>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-xl text-orange-600">
                                  NRS. {(item?.total || 0).toFixed(0)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  × {item?.quantity || 1}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            {item?.menu?.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                {item.menu.description}
                              </p>
                            )}

                            {/* Price & Notes */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span>Unit: NRS. {(item?.price || 0).toFixed(0)}</span>
                              {item?.notes && (
                                <span className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                      Items details not available
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
                      <span>Total Amount:</span>
                      <span className="text-2xl text-orange-600">
                        NRS. {((order?.totalAmount || order?.Total || 0)).toFixed(2)}
                      </span>
                    </div>
                    {order?.updatedAt && order.updatedAt !== order?.createdAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;