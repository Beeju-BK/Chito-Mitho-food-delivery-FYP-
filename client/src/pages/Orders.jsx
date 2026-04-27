

// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../contexts/AuthContext.jsx";

// const Orders = () => {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders]           = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [filterStatus, setFilterStatus] = useState("active"); // ✅ default: active orders
//   const [searchTerm, setSearchTerm]   = useState("");

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("http://localhost:3000/api/order/get-orders", {
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
//     if (user) fetchOrders();
//   }, [user]);

//   // ✅ FIX: restaurant is now a single object (not array) — no more [0] needed
//   // but keep a safe getter in case old orders still exist with array format
//   const getRestaurant = (order) => {
//     if (Array.isArray(order.restaurant)) return order.restaurant[0] || null;
//     return order.restaurant || null;
//   };

//   const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "ready", "out_for_delivery"];

//   const filteredOrders = orders.filter((order) => {
//     if (!order || typeof order !== "object") return false;

//     let matchesStatus;
//     if (filterStatus === "active") {
//       matchesStatus = ACTIVE_STATUSES.includes(order.status);
//     } else if (filterStatus === "all") {
//       matchesStatus = true;
//     } else {
//       matchesStatus = order.status === filterStatus;
//     }

//     const restaurant    = getRestaurant(order);
//     const restaurantName = (restaurant?.restaurantName || "").toLowerCase();
//     const orderId       = (order._id || "").toLowerCase();
//     const createdDate   = new Date(order.createdAt || "").toLocaleDateString();

//     const matchesSearch =
//       searchTerm === "" ||
//       restaurantName.includes(searchTerm.toLowerCase()) ||
//       orderId.includes(searchTerm.toLowerCase()) ||
//       createdDate.includes(searchTerm);

//     return matchesStatus && matchesSearch;
//   });

//   const statusConfig = {
//     pending:          { label: "Pending",          color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
//     confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-800 border-blue-300" },
//     preparing:        { label: "Preparing",         color: "bg-orange-100 text-orange-800 border-orange-300" },
//     ready:            { label: "Ready",             color: "bg-purple-100 text-purple-800 border-purple-300" },
//     out_for_delivery: { label: "Out for Delivery",  color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
//     delivered:        { label: "Delivered",         color: "bg-green-100 text-green-800 border-green-300" },
//     cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-800 border-red-300" },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
//           <p className="text-gray-500">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-1">Your Orders</h1>
//             <p className="text-gray-600">{filteredOrders.length} of {orders.length} orders shown</p>
//           </div>
//           <button
//             onClick={fetchOrders}
//             disabled={loading}
//             className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center gap-2"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Refresh
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//             <div className="lg:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by restaurant, order ID, or date..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//                 <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 {/* ✅ "Active" default shows all in-progress orders */}
//                 <option value="active">Active Orders</option>
//                 <option value="all">All Orders</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="preparing">Preparing</option>
//                 <option value="ready">Ready</option>
//                 <option value="out_for_delivery">Out for Delivery</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Orders List */}
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-12 text-center">
//             <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//               <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
//                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">
//               {searchTerm || filterStatus !== "active"
//                 ? "Try adjusting your search or filter"
//                 : "You have no active orders right now"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map((order) => {
//               // ✅ FIX: restaurant is a single object now
//               const restaurant  = getRestaurant(order);
//               const subtotal    = order.subtotal    ?? 0;
//               const tax         = order.tax         ?? 0;
//               const deliveryFee = order.deliveryFee ?? 0;
//               const commission  = order.commission  ?? 0;
//               const totalAmount = order.totalAmount ?? (subtotal + tax + deliveryFee + commission);

//               return (
//                 <div key={order._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">

//                   {/* Order Header */}
//                   <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                       <div>
//                         <div className="flex items-center gap-3 mb-1">
//                           <span className="font-bold text-lg text-gray-900">
//                             Order #{order._id.toString().slice(-8)}
//                           </span>
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
//                             statusConfig[order.status]?.color || "bg-gray-100 text-gray-800 border-gray-300"
//                           }`}>
//                             {statusConfig[order.status]?.label || order.status}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <span>
//                             {new Date(order.createdAt).toLocaleDateString()}{" "}
//                             {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                           </span>
//                           <span>•</span>
//                           <span>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-bold text-2xl text-orange-600">
//                           NRS. {totalAmount.toFixed(2)}
//                         </div>
//                         <div className="text-xs text-gray-500 capitalize">
//                           {order.paymentInfo?.method || order.paymentMethod || "cash"} •{" "}
//                           <span className={order.paymentStatus === "completed" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
//                             {order.paymentStatus === "completed" ? "Paid" : "Unpaid"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Restaurant */}
//                   <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
//                       {restaurant?.restaurantImage ? (
//                         <img
//                           src={restaurant.restaurantImage}
//                           alt={restaurant.restaurantName}
//                           className="w-full h-full object-cover"
//                           onError={(e) => (e.target.style.display = "none")}
//                         />
//                       ) : (
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 9h18M9 9v12M15 9v12" />
//                         </svg>
//                       )}
//                     </div>
//                     <div>
//                       {/* ✅ restaurantName is correct field from Restaurant schema */}
//                       <h3 className="font-bold text-gray-900">
//                         {restaurant?.restaurantName || "Unknown Restaurant"}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Deliver to: {order.shippingAddress?.address || "Address not provided"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div className="p-6 border-b border-gray-100">
//                     {(order.items || []).length > 0 ? (
//                       <div className="space-y-3">
//                         {order.items.map((item) => (
//                           <div key={item._id} className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
//                             <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-orange-500">
//                               {item.menu?.menuImage ? (
//                                 <img
//                                   src={item.menu.menuImage}
//                                   alt={item.menu?.name}
//                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center">
//                                   <span className="text-xs font-bold text-white">
//                                     {(item.menu?.name || "?").slice(0, 2).toUpperCase()}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0 flex items-center justify-between">
//                               <div>
//                                 <p className="font-semibold text-gray-900 truncate">{item.menu?.name || "Item"}</p>
//                                 <p className="text-sm text-gray-500">NRS. {item.price?.toFixed(0)} × {item.quantity}</p>
//                                 {item.notes && (
//                                   <p className="text-xs text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-1 inline-block">
//                                     {item.notes}
//                                   </p>
//                                 )}
//                               </div>
//                               <p className="font-bold text-orange-600 text-lg flex-shrink-0 ml-4">
//                                 NRS. {item.total?.toFixed(0)}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-400 text-center py-4">No items</p>
//                     )}
//                   </div>

//                   {/* Price Breakdown */}
//                   <div className="px-6 py-4 bg-gray-50">
//                     <div className="max-w-xs ml-auto space-y-1 text-sm">
//                       <div className="flex justify-between text-gray-600">
//                         <span>Subtotal</span>
//                         <span>NRS. {subtotal.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-gray-600">
//                         <span>Tax (13%)</span>
//                         <span>NRS. {tax.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-gray-600">
//                         <span>Delivery Fee</span>
//                         <span>NRS. {deliveryFee.toFixed(2)}</span>
//                       </div>
//                       {commission > 0 && (
//                         <div className="flex justify-between text-gray-600">
//                           <span>Service Fee (10%)</span>
//                           <span>NRS. {commission.toFixed(2)}</span>
//                         </div>
//                       )}
//                       <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2 mt-1">
//                         <span>Total</span>
//                         <span className="text-orange-600">NRS. {totalAmount.toFixed(2)}</span>
//                       </div>
//                     </div>
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

// export default Orders;




import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

const API = "http://localhost:3000/api";

const STATUS_CONFIG = {
  pending:          { label: "Pending",           color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  confirmed:        { label: "Confirmed",          color: "bg-blue-100 text-blue-800 border-blue-300" },
  preparing:        { label: "Preparing",          color: "bg-orange-100 text-orange-800 border-orange-300" },
  ready:            { label: "Ready for Pickup",   color: "bg-purple-100 text-purple-800 border-purple-300" },
  out_for_delivery: { label: "Out for Delivery",   color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  delivered:        { label: "Delivered",          color: "bg-green-100 text-green-800 border-green-300" },
  cancelled:        { label: "Cancelled",          color: "bg-red-100 text-red-800 border-red-300" },
};

const DELIVERY_STATUS_CONFIG = {
  accepted:   { label: "Deliveryman Assigned",  color: "text-indigo-600",  dot: "bg-indigo-400" },
  picked_up:  { label: "Order Picked Up",        color: "text-blue-600",    dot: "bg-blue-400" },
  on_the_way: { label: "On the Way",             color: "text-orange-600",  dot: "bg-orange-400 animate-pulse" },
  delivered:  { label: "Delivered",              color: "text-green-600",   dot: "bg-green-400" },
};

const Orders = () => {
  const { user }                        = useContext(AuthContext);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterStatus, setFilterStatus] = useState("active");
  const [searchTerm, setSearchTerm]     = useState("");
  const [cancelling, setCancelling]     = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/order/get-orders`, { withCredentials: true });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (orderId, status) => {
    if (!["pending", "confirmed"].includes(status)) {
      alert("This order can no longer be cancelled — preparation has already started.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(orderId);
      await axios.patch(`${API}/order/${orderId}/cancel`, {}, { withCredentials: true });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  const getRestaurant = (order) =>
    Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;

  const ACTIVE = ["pending", "confirmed", "preparing", "ready", "out_for_delivery"];

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;
    const matchStatus =
      filterStatus === "all"       ? true :
      filterStatus === "active"    ? ACTIVE.includes(order.status) :
      filterStatus === "completed" ? ["delivered", "cancelled"].includes(order.status) :
      order.status === filterStatus;

    const r    = getRestaurant(order);
    const name = (r?.restaurantName || "").toLowerCase();
    const id   = (order._id || "").toLowerCase();
    const matchSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">{filteredOrders.length} of {orders.length} orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by restaurant or order ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400"
          >
            <option value="active">Active Orders</option>
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600">No orders found</h3>
            <p className="text-gray-400 text-sm mt-1">
              {filterStatus === "active" ? "You have no active orders right now" : "Try a different filter"}
            </p>
          </div>
        )}

        {/* Order cards */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const restaurant      = getRestaurant(order);
            const cfg             = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const deliveryCfg     = order.deliveryStatus ? DELIVERY_STATUS_CONFIG[order.deliveryStatus] : null;
            const canCancel       = ["pending", "confirmed"].includes(order.status);
            const isCancelling    = cancelling === order._id;
            const dm              = order.deliveryman;
            const dmUser          = dm?.userId;

            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-4 border-b border-orange-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">
                          Order #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {order.paymentInfo?.method || "cash"} •{" "}
                        <span className={order.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"}>
                          {order.paymentStatus === "completed" ? "Paid" : "Unpaid"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Restaurant */}
                <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                    {restaurant?.restaurantImage
                      ? <img src={restaurant.restaurantImage} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-orange-500 font-bold text-sm">🍽</div>
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{restaurant?.restaurantName || "Restaurant"}</p>
                    <p className="text-xs text-gray-400">📍 {order.shippingAddress?.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-3 border-b border-gray-50">
                  <div className="space-y-2">
                    {(order.items || []).map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.menu?.menuImage
                            ? <img src={item.menu.menuImage} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                {(item.menu?.name || "?").slice(0, 2).toUpperCase()}
                              </div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.menu?.name || "Item"}</p>
                          <p className="text-xs text-gray-400">NRS. {item.price} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">NRS. {item.total?.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                  <div className="max-w-xs ml-auto space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Subtotal</span><span>NRS. {order.subtotal?.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax (13%)</span><span>NRS. {order.tax?.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery Fee</span><span>NRS. {order.deliveryFee?.toFixed(2)}</span></div>
                    {order.commission > 0 && (
                      <div className="flex justify-between"><span>Service Fee</span><span>NRS. {order.commission?.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-gray-800 border-t pt-1 mt-1">
                      <span>Total</span>
                      <span className="text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery tracking */}
                {order.status === "out_for_delivery" && (
                  <div className="px-5 py-3 border-b border-gray-50 bg-indigo-50/40">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery Tracking</p>
                    {deliveryCfg && (
                      <div className={`flex items-center gap-2 text-sm font-semibold ${deliveryCfg.color}`}>
                        <span className={`w-2 h-2 rounded-full ${deliveryCfg.dot}`} />
                        {deliveryCfg.label}
                      </div>
                    )}
                    {dm && dmUser && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                          {(dmUser.firstName || "D").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{dmUser.firstName} {dmUser.lastName}</p>
                          <p>{Array.isArray(dmUser.phone) ? dmUser.phone[0] : dmUser.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancel button */}
                {canCancel && order.status !== "cancelled" && (
                  <div className="px-5 py-4">
                    <button
                      onClick={() => handleCancel(order._id, order.status)}
                      disabled={isCancelling}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {order.status === "confirmed"
                        ? "⚠️ You can still cancel — preparation hasn't started yet"
                        : "You can cancel this order"}
                    </p>
                  </div>
                )}

                {/* Cannot cancel notice */}
                {!canCancel && !["delivered", "cancelled"].includes(order.status) && (
                  <div className="px-5 py-3">
                    <p className="text-xs text-gray-400">
                      🔒 Order cannot be cancelled — preparation has started
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;