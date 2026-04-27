
// // import { useState, useEffect, useCallback } from "react";
// // import { Search, ChevronDown, MapPin, Phone, Package, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
// // import axios from "axios";

// // const statusConfig = {
// //   pending: { 
// //     color: "bg-amber-100 text-amber-700 border-amber-300", 
// //     dot: "bg-amber-500", 
// //     next: null,
// //     actions: ["confirm", "cancel"] // Custom actions for pending orders
// //   },
// //   confirmed: { color: "bg-blue-100 text-blue-700 border-blue-300", dot: "bg-blue-500", next: "Start Preparing" },
// //   preparing: { color: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-500", next: "Mark Ready" },
// //   ready: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500", next: "Send for Delivery" },
// //   out_for_delivery: { color: "bg-indigo-100 text-indigo-700 border-indigo-300", dot: "bg-indigo-500", next: "Mark Delivered" },
// //   delivered: { color: "bg-green-100 text-green-700 border-green-300", dot: "bg-green-500", next: null },
// //   cancelled: { color: "bg-red-100 text-red-700 border-red-300", dot: "bg-red-500", next: null },
// // };

// // const flow = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

// // export default function RestaurantOrders() {
// //   const [data, setData] = useState({
// //     orders: [],
// //     pagination: { current: 1, pages: 1, total: 0, limit: 10 },
// //     stats: { pending: 0, confirmed: 0, preparing: 0, ready: 0, out_for_delivery: 0, delivered: 0, cancelled: 0 }
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [expanded, setExpanded] = useState(null);

// //   const fetchOrders = useCallback(async (page = 1, status = "all") => {
// //     try {
// //       setLoading(true);
// //       const params = new URLSearchParams();
// //       if (status !== "all") params.append("status", status);
// //       params.append("page", page.toString());
// //       params.append("limit", "10");

// //       const { data: response } = await axios.get(
// //         `http://localhost:3000/api/order/restaurant/orders?${params.toString()}`,
// //         { withCredentials: true }
// //       );
      
// //       setData({
// //         orders: response.orders || response.data?.orders || [],
// //         pagination: response.pagination || {
// //           current: page,
// //           pages: 1,
// //           total: response.count || response.orders?.length || 0,
// //           limit: 10
// //         },
// //         stats: response.stats || {
// //           pending: response.pending || 0,
// //           confirmed: 0, preparing: 0, ready: 0, 
// //           out_for_delivery: 0, delivered: 0, cancelled: 0
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Failed to fetch orders:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const updateOrderStatus = async (orderId, newStatus) => {
// //     try {
// //       await axios.patch(`http://localhost:3000/api/order/${orderId}/status`, { 
// //         status: newStatus 
// //       }, { withCredentials: true });
// //       fetchOrders(data.pagination.current, statusFilter);
// //     } catch (error) {
// //       console.error('Status update failed:', error);
// //       alert(`Failed to update order status to ${newStatus}`);
// //     }
// //   };

// //   const advanceOrderStatus = async (orderId) => {
// //     const order = data.orders.find(o => o._id === orderId);
// //     const currentIndex = flow.indexOf(order?.status);
// //     const nextStatus = flow[currentIndex + 1];
    
// //     if (nextStatus) {
// //       await updateOrderStatus(orderId, nextStatus);
// //     }
// //   };

// //   const handlePendingAction = async (orderId, action) => {
// //     if (action === 'confirm') {
// //       await updateOrderStatus(orderId, 'confirmed');
// //     } else if (action === 'cancel') {
// //       if (confirm('Are you sure you want to cancel this order?')) {
// //         await updateOrderStatus(orderId, 'cancelled');
// //       }
// //     }
// //   };

// //   const goToPage = (page) => {
// //     fetchOrders(page, statusFilter);
// //   };

// //   useEffect(() => {
// //     fetchOrders(1, statusFilter);
// //   }, [statusFilter, fetchOrders]);

// //   const statuses = ["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

// //   if (loading) {
// //     return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
// //   }

// //   return (
// //     <div className="space-y-5 p-6 md:p-8">
// //       <div>
// //         <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Restaurant Orders</h2>
// //         <p className="text-sm text-gray-500 mt-1">
// //           {data.pagination.total} total orders | Page {data.pagination.current} of {data.pagination.pages}
// //         </p>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// //         {statuses.slice(1).map((status) => (
// //           <div key={status} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
// //             <div className="flex items-center justify-between">
// //               <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[status]?.color || 'bg-gray-100 text-gray-700'}`}>
// //                 {status.replace('_', ' ').toUpperCase()}
// //               </span>
// //               <span className="text-2xl font-bold text-gray-900">{data.stats[status] || 0}</span>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Controls */}
// //       <div className="flex flex-col lg:flex-row gap-4">
// //         <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 flex-1">
// //           {statuses.map((s) => (
// //             <button
// //               key={s}
// //               onClick={() => setStatusFilter(s)}
// //               className={`flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-2xl font-medium whitespace-nowrap transition-all shadow-sm ${
// //                 statusFilter === s 
// //                   ? "bg-indigo-600 text-white shadow-indigo-300" 
// //                   : "bg-white border-2 border-gray-100 hover:border-indigo-200 hover:shadow-md"
// //               }`}
// //             >
// //               {s.replace('_', ' ').toUpperCase()}
// //               <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
// //                 statusFilter === s ? "bg-white/30" : "bg-gray-100 text-gray-700"
// //               }`}>
// //                 {data.stats[s] || 0}
// //               </span>
// //             </button>
// //           ))}
// //         </div>

// //         <div className="relative max-w-md">
// //           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
// //           <input
// //             type="text"
// //             placeholder="Search by customer or order ID..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 shadow-sm"
// //           />
// //         </div>
// //       </div>

// //       {/* Orders List */}
// //       <div className="space-y-4">
// //         {data.orders.length === 0 ? (
// //           <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
// //             <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //             <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
// //             <p className="text-gray-500">{statusFilter !== 'all' ? `No ${statusFilter} orders.` : 'No orders yet.'}</p>
// //           </div>
// //         ) : (
// //           data.orders.map((order) => {
// //             const cfg = statusConfig[order.status] || statusConfig.cancelled;
// //             const isExpanded = expanded === order._id;
            
// //             return (
// //               <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
// //                 <div
// //                   className="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50"
// //                   onClick={() => setExpanded(isExpanded ? null : order._id)}
// //                 >
// //                   <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  
// //                   <div className="flex-1 min-w-0">
// //                     <div className="flex items-center gap-3 mb-1">
// //                       <span className="font-bold text-lg text-gray-800">#{order._id?.slice(-6).toUpperCase()}</span>
// //                       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
// //                         {order.status?.replace('_', ' ').toUpperCase() || 'Unknown'}
// //                       </span>
// //                     </div>
// //                     <p className="text-sm text-gray-600 truncate">
// //                       {order.items?.[0]?.menu?.name || 'Order items'}
// //                       {order.items?.length > 1 && ` +${order.items.length - 1} more`}
// //                     </p>
// //                   </div>
                  
// //                   <div className="text-right flex-shrink-0 ml-4">
// //                     <p className="font-bold text-xl text-gray-900">
// //                       NRS. {order.totalAmount?.toLocaleString('en-IN') || '0'}
// //                     </p>
// //                     <p className="text-xs text-gray-500">
// //                       {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                     </p>
// //                   </div>
                  
// //                   <ChevronDown size={20} className={`text-gray-400 transition-transform ml-2 ${isExpanded ? "rotate-180" : ""}`} />
// //                 </div>

// //                 {isExpanded && (
// //                   <div className="px-6 pb-6 pt-2 border-t border-gray-100">
// //                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// //                       <div>
// //                         <h4 className="font-semibold text-gray-800 mb-3">
// //                           Items ({order.items?.length || 0})
// //                         </h4>
// //                         <div className="space-y-2 max-h-48 overflow-y-auto">
// //                           {order.items?.map((item, index) => (
// //                             <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
// //                               <div className="flex-1 min-w-0">
// //                                 <p className="font-medium text-gray-900 truncate">{item.menu?.name}</p>
// //                                 <p className="text-sm text-gray-500">
// //                                   Qty: {item.quantity} × NRS. {item.price?.toLocaleString('en-IN')}
// //                                 </p>
// //                               </div>
// //                               <div className="text-right">
// //                                 <p className="font-semibold">NRS. {item.total?.toLocaleString('en-IN') || '0'}</p>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>

// //                       <div className="space-y-4">
// //                         <div>
// //                           <h4 className="font-semibold text-gray-800 mb-3">Customer</h4>
// //                           <p className="font-medium text-gray-900">
// //                             {order.user?.name || order.user?.email || 'Customer'}
// //                           </p>
// //                           <p className="text-sm text-gray-600 flex items-center gap-1">
// //                             <Phone size={14} />{' '}
// //                             {Array.isArray(order.user?.phone) ? order.user.phone[0] : order.user?.phone || order.shippingAddress?.phone || 'N/A'}
// //                           </p>
// //                         </div>
                        
// //                         <div>
// //                           <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
// //                           <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
// //                             <MapPin size={14} /> {order.shippingAddress?.address || 'N/A'}
// //                           </p>
// //                           <p className="text-xs text-gray-500">Payment: {order.paymentInfo?.method || 'N/A'}</p>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     {cfg.actions ? (
// //                       // Pending orders - show Confirm/Cancel buttons
// //                       <div className="flex gap-3">
// //                         <button
// //                           onClick={() => handlePendingAction(order._id, 'confirm')}
// //                           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
// //                         >
// //                           <CheckCircle size={20} />
// //                           Confirm Order
// //                         </button>
// //                         <button
// //                           onClick={() => handlePendingAction(order._id, 'cancel')}
// //                           className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
// //                         >
// //                           <XCircle size={20} />
// //                           Cancel
// //                         </button>
// //                       </div>
// //                     ) : cfg.next ? (
// //                       // Other orders - single next button
// //                       <button
// //                         onClick={() => advanceOrderStatus(order._id)}
// //                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
// //                       >
// //                         {cfg.next}
// //                       </button>
// //                     ) : null}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })
// //         )}
// //       </div>

// //       {data.pagination.pages > 1 && (
// //         <div className="flex items-center justify-between pt-6 border-t border-gray-100">
// //           <div className="text-sm text-gray-600">
// //             Showing {((data.pagination.current - 1) * data.pagination.limit) + 1} to{' '}
// //             {Math.min(data.pagination.current * data.pagination.limit, data.pagination.total)} of{' '}
// //             {data.pagination.total} orders
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={() => goToPage(data.pagination.current - 1)}
// //               disabled={data.pagination.current === 1}
// //               className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <ChevronLeft size={20} />
// //             </button>
// //             <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
// //               Page {data.pagination.current} of {data.pagination.pages}
// //             </span>
// //             <button
// //               onClick={() => goToPage(data.pagination.current + 1)}
// //               disabled={data.pagination.current === data.pagination.pages}
// //               className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <ChevronRight size={20} />
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }




// import { useState, useEffect } from "react";
// import axios from "axios";

// const API = "http://localhost:3000/api";

// const STATUS_CONFIG = {
//   pending:          { label: "Pending",          color: "bg-yellow-100 text-yellow-800 border-yellow-300",  next: "confirmed",        nextLabel: "Confirm Order",  nextColor: "bg-green-600 hover:bg-green-700" },
//   confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-800 border-blue-300",        next: "preparing",        nextLabel: "Start Preparing",nextColor: "bg-blue-600 hover:bg-blue-700"  },
//   preparing:        { label: "Preparing",         color: "bg-orange-100 text-orange-800 border-orange-300",  next: "ready",            nextLabel: "Mark as Ready", nextColor: "bg-purple-600 hover:bg-purple-700"},
//   ready:            { label: "Ready",             color: "bg-purple-100 text-purple-800 border-purple-300",  next: "out_for_delivery", nextLabel: "Out for Delivery",nextColor:"bg-indigo-600 hover:bg-indigo-700"},
//   out_for_delivery: { label: "Out for Delivery",  color: "bg-indigo-100 text-indigo-800 border-indigo-300",  next: "delivered",        nextLabel: "Mark Delivered", nextColor: "bg-green-700 hover:bg-green-800"},
//   delivered:        { label: "Delivered",         color: "bg-green-100 text-green-800 border-green-300",     next: null,               nextLabel: null,             nextColor: null },
//   cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-800 border-red-300",           next: null,               nextLabel: null,             nextColor: null },
// };

// const VendorOrders = () => {
//   const [orders, setOrders]           = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [filterStatus, setFilterStatus] = useState("pending");
//   const [updating, setUpdating]       = useState(null); // orderId being updated

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${API}/order/restaurant/orders`, {
//         withCredentials: true,
//       });
//       setOrders(Array.isArray(data.orders) ? data.orders : []);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     // Auto-refresh every 30 seconds so vendor sees new orders without manual refresh
//     const interval = setInterval(fetchOrders, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const updateStatus = async (orderId, newStatus) => {
//     try {
//       setUpdating(orderId);
//       await axios.patch(
//         `${API}/order/${orderId}/status`,
//         { status: newStatus },
//         { withCredentials: true }
//       );
//       // Update locally — no full re-fetch needed
//       setOrders((prev) =>
//         prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
//       );
//     } catch (error) {
//       alert("Failed to update status: " + (error.response?.data?.message || error.message));
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const cancelOrder = (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;
//     updateStatus(orderId, "cancelled");
//   };

//   const filteredOrders = filterStatus === "all"
//     ? orders
//     : orders.filter((o) => o.status === filterStatus);

//   const pendingCount = orders.filter((o) => o.status === "pending").length;

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Incoming Orders</h1>
//             <p className="text-gray-500 mt-1">
//               {pendingCount > 0 ? (
//                 <span className="text-orange-600 font-semibold">{pendingCount} order{pendingCount !== 1 ? "s" : ""} waiting for confirmation</span>
//               ) : (
//                 "No pending orders"
//               )}
//             </p>
//           </div>
//           <button
//             onClick={fetchOrders}
//             disabled={loading}
//             className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
//           >
//             <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Refresh
//           </button>
//         </div>

//         {/* Status filter tabs */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {[
//             { key: "pending",  label: "Pending",    count: orders.filter((o) => o.status === "pending").length },
//             { key: "confirmed",label: "Confirmed",   count: orders.filter((o) => o.status === "confirmed").length },
//             { key: "preparing",label: "Preparing",   count: orders.filter((o) => o.status === "preparing").length },
//             { key: "ready",    label: "Ready",       count: orders.filter((o) => o.status === "ready").length },
//             { key: "out_for_delivery", label: "Out for Delivery", count: orders.filter((o) => o.status === "out_for_delivery").length },
//             { key: "delivered",label: "Delivered",   count: orders.filter((o) => o.status === "delivered").length },
//             { key: "cancelled",label: "Cancelled",   count: orders.filter((o) => o.status === "cancelled").length },
//             { key: "all",      label: "All",         count: orders.length },
//           ].map(({ key, label, count }) => (
//             <button
//               key={key}
//               onClick={() => setFilterStatus(key)}
//               className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
//                 filterStatus === key
//                   ? "bg-orange-600 text-white shadow-md"
//                   : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
//               }`}
//             >
//               {label}
//               {count > 0 && (
//                 <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
//                   filterStatus === key ? "bg-orange-500" : "bg-gray-100 text-gray-500"
//                 }`}>
//                   {count}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Orders */}
//         {loading ? (
//           <div className="text-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
//             <p className="text-gray-500">Loading orders...</p>
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-md p-12 text-center">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                   d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-1">No {filterStatus === "all" ? "" : filterStatus} orders</h3>
//             <p className="text-gray-400">New orders will appear here automatically</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map((order) => {
//               const cfg     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
//               const isUpdating = updating === order._id;
//               const customer = order.user;

//               return (
//                 <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

//                   {/* Order header */}
//                   <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b ${
//                     order.status === "pending" ? "bg-yellow-50 border-yellow-100" : "bg-gray-50 border-gray-100"
//                   }`}>
//                     <div className="flex items-center gap-3">
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <span className="font-bold text-gray-900 text-lg">
//                             Order #{order._id.toString().slice(-8).toUpperCase()}
//                           </span>
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
//                             {cfg.label}
//                           </span>
//                           {order.paymentInfo?.method === "khalti" && (
//                             <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
//                               Khalti • Paid
//                             </span>
//                           )}
//                           {order.paymentInfo?.method === "cash" && (
//                             <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
//                               Cash on Delivery
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-500 mt-0.5">
//                           {new Date(order.createdAt).toLocaleDateString()} at{" "}
//                           {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-2xl text-orange-600">
//                         NRS. {order.totalAmount?.toFixed(2)}
//                       </div>
//                       <div className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</div>
//                     </div>
//                   </div>

//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                       {/* Customer info */}
//                       <div>
//                         <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</h4>
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
//                             {(customer?.firstName || "?").charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900">
//                               {customer?.firstName} {customer?.lastName}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {/* ✅ phone is [String] array */}
//                               {Array.isArray(customer?.phone) ? customer.phone[0] : customer?.phone || "N/A"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
//                           <span className="font-medium">Deliver to: </span>
//                           {order.shippingAddress?.address || "Not provided"}
//                           {order.shippingAddress?.phone && (
//                             <span className="block text-gray-500 mt-0.5">📞 {order.shippingAddress.phone}</span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Order items */}
//                       <div>
//                         <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
//                         <div className="space-y-2">
//                           {(order.items || []).map((item) => (
//                             <div key={item._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
//                               <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-orange-100">
//                                 {item.menu?.menuImage ? (
//                                   <img src={item.menu.menuImage} alt={item.menu?.name} className="w-full h-full object-cover" />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-xs font-bold text-orange-600">
//                                     {(item.menu?.name || "?").slice(0, 2).toUpperCase()}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-semibold text-gray-800 text-sm truncate">{item.menu?.name || "Item"}</p>
//                                 <p className="text-xs text-gray-500">NRS. {item.price} × {item.quantity}</p>
//                                 {item.notes && (
//                                   <p className="text-xs text-orange-600 mt-0.5">Note: {item.notes}</p>
//                                 )}
//                               </div>
//                               <span className="font-bold text-gray-800 text-sm flex-shrink-0">
//                                 NRS. {item.total?.toFixed(0)}
//                               </span>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Price summary */}
//                         <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
//                           <div className="flex justify-between text-gray-500">
//                             <span>Subtotal</span><span>NRS. {order.subtotal?.toFixed(0)}</span>
//                           </div>
//                           <div className="flex justify-between text-gray-500">
//                             <span>Tax (13%)</span><span>NRS. {order.tax?.toFixed(0)}</span>
//                           </div>
//                           <div className="flex justify-between text-gray-500">
//                             <span>Delivery</span><span>NRS. {order.deliveryFee?.toFixed(0)}</span>
//                           </div>
//                           {order.commission > 0 && (
//                             <div className="flex justify-between text-gray-400 text-xs">
//                               <span>Platform fee (10%)</span>
//                               <span>NRS. {order.commission?.toFixed(0)}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
//                             <span>Total</span>
//                             <span className="text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action buttons */}
//                     {!["delivered", "cancelled"].includes(order.status) && (
//                       <div className="mt-6 flex flex-wrap gap-3">
//                         {/* Advance to next status */}
//                         {cfg.next && (
//                           <button
//                             onClick={() => updateStatus(order._id, cfg.next)}
//                             disabled={isUpdating}
//                             className={`flex-1 min-w-[160px] py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 ${cfg.nextColor}`}
//                           >
//                             {isUpdating ? (
//                               <span className="flex items-center justify-center gap-2">
//                                 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                                 </svg>
//                                 Updating...
//                               </span>
//                             ) : cfg.nextLabel}
//                           </button>
//                         )}

//                         {/* Cancel button — only for pending/confirmed */}
//                         {["pending", "confirmed"].includes(order.status) && (
//                           <button
//                             onClick={() => cancelOrder(order._id)}
//                             disabled={isUpdating}
//                             className="px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50"
//                           >
//                             Cancel Order
//                           </button>
//                         )}
//                       </div>
//                     )}

//                     {/* Terminal states */}
//                     {order.status === "delivered" && (
//                       <div className="mt-4 py-3 px-4 bg-green-50 rounded-xl text-green-700 font-semibold text-center border border-green-200">
//                         ✅ Order delivered successfully
//                       </div>
//                     )}
//                     {order.status === "cancelled" && (
//                       <div className="mt-4 py-3 px-4 bg-red-50 rounded-xl text-red-600 font-semibold text-center border border-red-200">
//                         ❌ Order was cancelled
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VendorOrders;


import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

// What action button shows + what status it moves to
const STATUS_ACTIONS = {
  pending:   [
    { label: "Confirm Order",    next: "confirmed", color: "bg-green-600 hover:bg-green-700" },
    { label: "Cancel Order",     next: "cancelled", color: "bg-red-100 text-red-600 border border-red-200 hover:bg-red-200", outline: true },
  ],
  confirmed: [
    { label: "Start Preparing",  next: "preparing", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Cancel Order",     next: "cancelled", color: "bg-red-100 text-red-600 border border-red-200 hover:bg-red-200", outline: true },
  ],
  preparing: [
    { label: "Mark as Ready",    next: "ready",     color: "bg-purple-600 hover:bg-purple-700" },
    // NO cancel once preparing
  ],
  ready:     [], // deliveryman takes over
};

const STATUS_CONFIG = {
  pending:          { label: "Pending",          color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-800 border-blue-200" },
  preparing:        { label: "Preparing",         color: "bg-orange-100 text-orange-800 border-orange-200" },
  ready:            { label: "Ready for Pickup",  color: "bg-purple-100 text-purple-800 border-purple-200" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered:        { label: "Delivered",         color: "bg-green-100 text-green-800 border-green-200" },
  cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-800 border-red-200" },
};

const VendorOrders = () => {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [updating, setUpdating]         = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/order/restaurant/orders`, {
        withCredentials: true,
      });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    if (status === "cancelled" && !window.confirm("Cancel this order?")) return;
    try {
      setUpdating(orderId + status);
      await axios.patch(`${API}/order/${orderId}/status`, { status }, { withCredentials: true });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const TAB_COUNTS = {
    pending:   orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready:     orders.filter((o) => o.status === "ready").length,
    out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    all:       orders.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incoming Orders</h1>
            {pendingCount > 0 && (
              <p className="text-orange-600 font-semibold mt-1">
                🔔 {pendingCount} order{pendingCount !== 1 ? "s" : ""} waiting for confirmation
              </p>
            )}
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm disabled:opacity-50 flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TAB_COUNTS).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                filterStatus === key
                  ? "bg-orange-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {key.replace("_", " ")}
              {count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  filterStatus === key ? "bg-orange-500" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-400 text-lg">No {filterStatus === "all" ? "" : filterStatus} orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const cfg     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const actions = STATUS_ACTIONS[order.status] || [];
              const customer = order.user;

              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* Header */}
                  <div className={`px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    order.status === "pending" ? "bg-yellow-50 border-yellow-100" : "bg-gray-50 border-gray-100"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentInfo?.method === "khalti"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {order.paymentInfo?.method === "khalti" ? "Khalti · Paid" : "Cash on Delivery"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString([], {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="font-bold text-xl text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</p>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Customer + delivery */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                          {(customer?.firstName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {customer?.firstName} {customer?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Array.isArray(customer?.phone) ? customer.phone[0] : customer?.phone}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm">
                        <p className="text-gray-600">📍 {order.shippingAddress?.address}</p>
                        {order.shippingAddress?.phone && (
                          <p className="text-gray-500 text-xs mt-1">📞 {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Items ({order.items?.length})
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {(order.items || []).map((item) => (
                          <div key={item._id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                              {item.menu?.menuImage
                                ? <img src={item.menu.menuImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-orange-500">
                                    {(item.menu?.name || "?").slice(0, 2).toUpperCase()}
                                  </div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.menu?.name}</p>
                              <p className="text-xs text-gray-400">NRS. {item.price} × {item.quantity}</p>
                              {item.notes && <p className="text-xs text-orange-600">Note: {item.notes}</p>}
                            </div>
                            <p className="text-sm font-bold text-gray-700 flex-shrink-0">
                              NRS. {item.total?.toFixed(0)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Price summary */}
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between"><span>Subtotal</span><span>NRS. {order.subtotal?.toFixed(0)}</span></div>
                        <div className="flex justify-between"><span>Tax (13%)</span><span>NRS. {order.tax?.toFixed(0)}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span>NRS. {order.deliveryFee?.toFixed(0)}</span></div>
                        {order.commission > 0 && (
                          <div className="flex justify-between text-gray-400"><span>Platform fee</span><span>NRS. {order.commission?.toFixed(0)}</span></div>
                        )}
                        <div className="flex justify-between font-bold text-sm text-gray-800 border-t pt-1">
                          <span>Total</span><span className="text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {actions.length > 0 && (
                    <div className="px-5 pb-5 flex flex-wrap gap-3">
                      {actions.map((action) => {
                        const key = order._id + action.next;
                        return (
                          <button
                            key={action.next}
                            onClick={() => updateStatus(order._id, action.next)}
                            disabled={updating === key}
                            className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                              action.outline ? action.color : `${action.color} text-white`
                            }`}
                          >
                            {updating === key ? "Updating..." : action.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Terminal states */}
                  {order.status === "ready" && (
                    <div className="px-5 pb-5">
                      <div className="py-3 px-4 bg-purple-50 rounded-xl text-purple-700 text-sm font-semibold text-center border border-purple-200">
                        ✅ Order is ready — waiting for deliveryman to accept
                      </div>
                    </div>
                  )}
                  {order.status === "out_for_delivery" && (
                    <div className="px-5 pb-5">
                      <div className="py-3 px-4 bg-indigo-50 rounded-xl text-indigo-700 text-sm font-semibold text-center border border-indigo-200">
                        🚴 Out for delivery
                        {order.deliveryman?.userId && (
                          <span className="text-indigo-500 font-normal ml-1">
                            — {order.deliveryman.userId.firstName} {order.deliveryman.userId.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {order.status === "delivered" && (
                    <div className="px-5 pb-5">
                      <div className="py-3 px-4 bg-green-50 rounded-xl text-green-700 text-sm font-semibold text-center border border-green-200">
                        ✅ Delivered successfully
                      </div>
                    </div>
                  )}
                  {order.status === "cancelled" && (
                    <div className="px-5 pb-5">
                      <div className="py-3 px-4 bg-red-50 rounded-xl text-red-600 text-sm font-semibold text-center border border-red-200">
                        ❌ Order cancelled
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;