
// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { CartCard } from "../components/cards/CartCard.jsx";
// import { AuthContext } from "../contexts/AuthContext.jsx";

// const Cart = () => {
//   const { user } = useContext(AuthContext);
//   const [carts, setCarts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [ordering, setOrdering] = useState(false);
//   const [selectedCart, setSelectedCart] = useState(null);
//   const [orderForm, setOrderForm] = useState({
//     address: "",
//     paymentMethod: "esewa",
//     phone: user?.phone || ""
//   });

//   // Fetch carts
//   const fetchCarts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("http://localhost:3000/api/cart/get", {
//         withCredentials: true,
//       });
//       const allCarts = data.carts || [data] || [];
//       const filteredCarts = allCarts.filter(cart => cart.items?.length > 0);
//       setCarts(filteredCarts);

//       // ✅ FIXED: Reset selectedCart if no carts or if selected cart is empty
//       if (filteredCarts.length === 0) {
//         setSelectedCart(null);
//       } else if (!filteredCarts.find(c => c._id === selectedCart?._id)) {
//         setSelectedCart(filteredCarts[0]); // Select first available cart
//       }
//     } catch (error) {
//       console.error("Failed to fetch carts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchCarts();
//   }, [user]);

//   // Show only items from SELECTED cart
//   const selectedCartItems = selectedCart?.items?.filter(item => item) || [];

//   const handleUpdate = () => fetchCarts();
//   const handleRemove = () => fetchCarts();

//   // Select restaurant cart
//   const selectCart = (cart) => {
//     setSelectedCart(cart);
//   };

//   // Place order
//   // ── ADD this helper function above placeOrder ──
// const initiateKhaltiPayment = async () => {
//   if (!selectedCart || selectedCartItems.length === 0) return;
//   if (!orderForm.address) return alert("Please enter delivery address");

//   try {
//     setOrdering(true);

//     // Step 1: Initiate payment on backend
//     const { data } = await axios.post(
//       "http://localhost:3000/api/order/khalti-initiate",
//       {
//         cartId: selectedCart._id,
//         shippingAddress: { address: orderForm.address },
//         phone: orderForm.phone,
//       },
//       { withCredentials: true }
//     );

//     if (data.success) {
//       // Save pending info before redirect
//       localStorage.setItem(
//         "khaltiPending",
//         JSON.stringify({
//           pidx: data.pidx,
//           cartId: data.cartId,
//           shippingAddress: data.shippingAddress,
//           purchase_order_id: data.purchase_order_id,
//         })
//       );

//       // Step 2: Redirect to Khalti payment page
//       window.location.href = data.payment_url;
//     } else {
//       alert("Payment initiation failed");
//     }
//   } catch (error) {
//     console.error("Khalti initiate error:", error);
//     alert("Failed to initiate payment: " + (error.response?.data?.message || error.message));
//   } finally {
//     setOrdering(false);
//   }
// };

// // ── KEEP your existing placeOrder for COD if needed ──
// const placeOrder = async () => {
//   if (!selectedCart || selectedCartItems.length === 0) return;

//   // If khalti selected, use khalti flow
//   if (orderForm.paymentMethod === "khalti") {
//     return initiateKhaltiPayment();
//   }

//   // Existing cash/esewa flow unchanged
//   try {
//     setOrdering(true);
//     const { data } = await axios.post(
//       "http://localhost:3000/api/order/place",
//       {
//         cartId: selectedCart._id,
//         shippingAddress: { address: orderForm.address },
//         paymentInfo: { method: orderForm.paymentMethod },
//       },
//       { withCredentials: true }
//     );

//     alert(`✅ Order #${data.orderId?.slice(-6) || "XXXXXX"} placed with ${selectedCart.restaurantId?.name || selectedCart.restaurantId?.restaurantName}!`);
//     setOrderForm({ address: "", paymentMethod: "esewa", phone: user?.phone || "" });
//     await fetchCarts();
//   } catch (error) {
//     console.error("Order error:", error);
//     alert("Order failed: " + (error.response?.data?.message || error.message));
//   } finally {
//     setOrdering(false);
//   }
// };

//   // ✅ FIXED: Calculate totals correctly
//   const selectedCartTotal = selectedCart?.Total || 
//                            selectedCartItems.reduce((sum, item) => sum + (item.subTotal || 0), 0) || 0;
//   const totalItemsCount = carts.reduce((sum, cart) => sum + (cart.items?.length || 0), 0);
//   const hasActiveCarts = carts.length > 0 && totalItemsCount > 0;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
//           <p className="text-gray-600">
//             {totalItemsCount} items across {carts.length} restaurants
//           </p>
//         </div>

//         {loading ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <p className="text-gray-500">Loading cart...</p>
//           </div>
//         ) : !hasActiveCarts ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="text-center py-12">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5M16 13l-1.5 6.5M16 13l2.5 6.5" />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
//               <p className="text-gray-500 mb-6">
//                 You have successfully placed your order! 
//                 Continue shopping to add more items.
//               </p>
//               <a 
//                 href="/restaurants" 
//                 className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
//               >
//                 Continue Shopping
//               </a>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Items Table */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Restaurant Cart Selector */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="font-semibold mb-4">Select Restaurant ({carts.length})</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                   {carts.map((cart) => (
//                     <button
//                       key={cart._id}
//                       onClick={() => selectCart(cart)}
//                       className={`p-3 rounded-lg text-sm font-medium transition-all ${
//                         selectedCart?._id === cart._id
//                           ? "bg-orange-600 text-white shadow-lg"
//                           : "bg-gray-100 hover:bg-gray-200"
//                       }`}
//                     >
//                       <div className="font-bold">{cart.restaurantId?.name || cart.restaurantId?.restaurantName}</div>
//                       <div className="text-xs opacity-75">
//                         {cart.items?.length || 0} items
//                       </div>
//                       <div className="text-xs font-bold mt-1">
//                         NRS. {(cart.Total || 0).toFixed(0)}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Items Table - Only Selected Cart Items */}
//               {selectedCart && selectedCartItems.length > 0 ? (
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                   <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 bg-gray-100 border-b md:grid">
//                     <div className="font-semibold text-sm text-gray-700">Menu Item</div>
//                     <div className="font-semibold text-sm text-gray-700 text-center">Quantity</div>
//                     <div className="font-semibold text-sm text-gray-700">Total</div>
//                     <div className="font-semibold text-sm text-gray-700">Action</div>
//                   </div>

//                   {selectedCartItems.map((item) => (
//                     <CartCard
//                       key={`${item.cartId}-${item.menu?._id}`}
//                       item={item}
//                       restaurantId={item.restaurantId}
//                       restaurantName={item.restaurantName}
//                       onUpdate={handleUpdate}
//                       onRemove={handleRemove}
//                     />
//                   ))}
//                 </div>
//               ) : selectedCart ? (
//                 <div className="bg-white rounded-lg shadow-md p-8 text-center border-2 border-dashed border-gray-200">
//                   <p className="text-gray-500">No items in selected cart</p>
//                   <p className="text-sm text-gray-400 mt-1">Select another restaurant</p>
//                 </div>
//               ) : null}
//             </div>

//             {/* Order Form */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Selected Cart Summary */}
//               {selectedCart && selectedCartItems.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h3 className="font-bold text-lg mb-3">
//                     {selectedCart.restaurantId?.name || selectedCart.restaurantId?.restaurantName}
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Items:</span>
//                       <span>{selectedCartItems.length}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-lg">
//                       <span>Total:</span>
//                       <span className="text-orange-600">NRS. {selectedCartTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Order Form */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">
//                   Checkout
//                 </h2>

//                 {(!selectedCart || selectedCartItems.length === 0) ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500 mb-4">
//                       {selectedCart ? "No items in selected cart" : "Please select a restaurant"}
//                     </p>
//                     <button
//                       onClick={() => carts[0] && selectCart(carts[0])}
//                       disabled={!carts[0]}
//                       className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//                     >
//                       Select First Restaurant
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Address */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2 text-gray-700">
//                         Delivery Address *
//                       </label>
//                       <textarea
//                         value={orderForm.address}
//                         onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
//                         placeholder="Enter full address"
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         rows="3"
//                       />
//                     </div>

//                     {/* Phone */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2 text-gray-700">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         value={orderForm.phone}
//                         onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//                         placeholder="9841234567"
//                       />
//                     </div>

//                     {/* Payment Method */}
//                     <div className="mb-8">
//                       <label className="block text-sm font-medium mb-3 text-gray-700">
//                         Payment Method *
//                       </label>
//                       <div className="space-y-2">
//                         <label className="flex items-center p-2 rounded-lg hover:bg-gray-50">
//                           <input
//                             type="radio"
//                             name="payment"
//                             value="esewa"
//                             checked={orderForm.paymentMethod === "esewa"}
//                             onChange={(e) => setOrderForm({...orderForm, paymentMethod: e.target.value})}
//                             className="mr-3 w-4 h-4 text-orange-600"
//                           />
//                           <span>Cash On Delivery</span>
//                         </label>
//                         <label className="flex items-center p-2 rounded-lg hover:bg-gray-50">
//                           <input
//                             type="radio"
//                             name="payment"
//                             value="khalti"
//                             checked={orderForm.paymentMethod === "khalti"}
//                             onChange={(e) => setOrderForm({...orderForm, paymentMethod: e.target.value})}
//                             className="mr-3 w-4 h-4 text-orange-600"
//                           />
//                           <span>Khalti</span>
//                         </label>
//                       </div>
//                     </div>

//                     {/* Order Button */}
//                     <button
//                       onClick={placeOrder}
//                       disabled={!orderForm.address || ordering}
//                       className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
//                     >
//                       {ordering 
//                         ? "Placing Order..." 
//                         : `Order Now - NRS. ${selectedCartTotal.toFixed(2)}`
//                       }
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { CartCard } from "../components/cards/CartCard.jsx";
// import { AuthContext } from "../contexts/AuthContext.jsx";
// import { CartContext } from "../contexts/CartContext";

// const API = "http://localhost:3000/api";

// const Cart = () => {
//   const { user } = useContext(AuthContext);
//   const [carts, setCarts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [ordering, setOrdering] = useState(false);
//   const [orderForm, setOrderForm] = useState({
//     address: "",
//     paymentMethod: "cash", // ✅ FIXED: was "esewa" — backend only accepts "cash" | "khalti"
//     phone: String(user?.phone || ""),
//   });

//   const { fetchCartCount } = useContext(CartContext);

//   const fetchCarts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${API}/cart/get`, {
//         withCredentials: true,
//       });
//       setCarts(data.carts || []);
//       await fetchCartCount();
//     } catch (error) {
//       console.error("Failed to fetch carts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchCarts();
//   }, [user]);

//   const allItems = carts.flatMap((cart) =>
//     (cart.items || []).map((item) => ({
//       ...item,
//       restaurantId: cart.restaurantId,
//     }))
//   );

//   // ✅ FIXED: cart model uses capital "Total", not lowercase "total"
//   const grandTotal = carts.reduce((sum, cart) => sum + (cart.Total || cart.total || 0), 0);
//   const totalItemsCount = allItems.length;

//   // ── Shared validation ─────────────────────────────────────────────────────
//   const validate = () => {
//     if (!orderForm.address.trim()) {
//       alert("Please enter a delivery address");
//       return false;
//     }
//     if (!String(orderForm.phone || "").trim()) {
//       alert("Please enter a phone number");
//       return false;
//     }
//     if (carts.length === 0) {
//       alert("Your cart is empty");
//       return false;
//     }
//     return true;
//   };

//   // ── Cash / COD order ──────────────────────────────────────────────────────
//   const placeCashOrder = async () => {
//     if (!validate()) return;

//     try {
//       setOrdering(true);
//       const results = await Promise.all(
//         carts.map((cart) =>
//           axios.post(
//             `${API}/order/place`,
//             {
//               cartId: cart._id,
//               shippingAddress: {
//                 address: orderForm.address,
//                 phone: orderForm.phone,   // ✅ FIXED: was missing phone
//               },
//               paymentInfo: { method: "cash" }, // ✅ FIXED: backend enum is "cash"
//             },
//             { withCredentials: true }
//           )
//         )
//       );

//       const orderIds = results
//         .map((r) => r.data.orderId?.slice(-6))
//         .filter(Boolean)
//         .join(", ");

//       alert(`✅ ${results.length} order(s) placed! IDs: #${orderIds}`);
//       setOrderForm({ address: "", paymentMethod: "cash", phone: String(user?.phone || "") });
//       await fetchCarts();
//     } catch (error) {
//       console.error("Order error:", error);
//       alert("Order failed: " + (error.response?.data?.message || error.message));
//     } finally {
//       setOrdering(false);
//     }
//   };

//   // ── Khalti payment ────────────────────────────────────────────────────────
//   // ✅ FIXED: initiates payment for ALL carts, not just carts[0]
//   // Since Khalti is one redirect per session, we initiate for the first cart
//   // and store remaining cartIds to handle after verification if needed.
//   // Most food apps do one payment for the whole basket — adjust if needed.
//   const initiateKhaltiPayment = async () => {
//     if (!validate()) return;

//     if (carts.length > 1) {
//       const confirmed = window.confirm(
//         `You have ${carts.length} carts. Khalti will process the first restaurant's order. Continue?`
//       );
//       if (!confirmed) return;
//     }

//     try {
//       setOrdering(true);
//       const cart = carts[0]; // Khalti: one payment session at a time

//       const { data } = await axios.post(
//         `${API}/order/khalti-initiate`,
//         {
//           cartId: cart._id,
//           shippingAddress: {
//             address: orderForm.address,
//             phone: orderForm.phone,         // ✅ FIXED: was missing phone
//           },
//           phone: orderForm.phone,
//         },
//         { withCredentials: true }
//       );

//       if (data.success) {
//         localStorage.setItem(
//           "khaltiPending",
//           JSON.stringify({
//             pidx: data.pidx,
//             cartId: data.cartId,
//             shippingAddress: {
//               address: orderForm.address,
//               phone: orderForm.phone,       // ✅ FIXED: persist phone for verify step
//             },
//             purchase_order_id: data.purchase_order_id,
//           })
//         );
//         window.location.href = data.payment_url;
//       } else {
//         alert("Payment initiation failed");
//       }
//     } catch (error) {
//       alert(
//         "Failed to initiate payment: " +
//           (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setOrdering(false);
//     }
//   };

//   // ── Unified place order handler ───────────────────────────────────────────
//   const placeOrder = () => {
//     if (orderForm.paymentMethod === "khalti") {
//       return initiateKhaltiPayment();
//     }
//     return placeCashOrder();
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
//           <p className="text-gray-600">
//             {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""} from{" "}
//             {carts.length} restaurant{carts.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         {loading ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <p className="text-gray-500">Loading cart...</p>
//           </div>
//         ) : allItems.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="text-center py-12">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-12 h-12 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1}
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5M16 13l-1.5 6.5M16 13l2.5 6.5"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Your cart is empty
//               </h2>
//               <p className="text-gray-500 mb-6">
//                 Continue shopping to add more items.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//             {/* Items table */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 bg-gray-100 border-b">
//                   <div className="font-semibold text-sm text-gray-700">Menu Item</div>
//                   <div className="font-semibold text-sm text-gray-700 text-center">Quantity</div>
//                   <div className="font-semibold text-sm text-gray-700">Total</div>
//                   <div className="font-semibold text-sm text-gray-700">Action</div>
//                 </div>

//                 {carts.map((cart) => (
//                   <div key={cart._id}>
//                     <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 text-sm font-semibold text-orange-700">
//                       {cart.restaurantId?.restaurantName || cart.restaurantId?.name}
//                     </div>
//                     {cart.items.map((item) => (
//                       <CartCard
//                         key={`${cart._id}-${item.menu?._id}`}
//                         item={{ ...item, restaurantId: cart.restaurantId }}
//                         onUpdate={fetchCarts}
//                         onRemove={fetchCarts}
//                       />
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Order summary + checkout */}
//             <div className="lg:col-span-1 space-y-6">
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="font-bold text-lg mb-3">Order Summary</h3>
//                 <div className="space-y-2 text-sm">
//                   {carts.map((cart) => (
//                     <div key={cart._id} className="flex justify-between text-gray-600">
//                       <span>
//                         {cart.restaurantId?.restaurantName || cart.restaurantId?.name}
//                       </span>
//                       {/* ✅ FIXED: use cart.Total (capital T) with fallback */}
//                       <span>NPR. {(cart.Total || cart.total || 0).toFixed(0)}</span>
//                     </div>
//                   ))}
//                   <div className="border-t pt-2 flex justify-between font-bold text-lg">
//                     <span>Grand Total</span>
//                     <span className="text-orange-600">
//                       NPR. {grandTotal.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Checkout form */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">
//                   Checkout
//                 </h2>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">
//                     Delivery Address *
//                   </label>
//                   <textarea
//                     value={orderForm.address}
//                     onChange={(e) =>
//                       setOrderForm({ ...orderForm, address: e.target.value })
//                     }
//                     placeholder="Enter full address"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     rows="3"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     value={orderForm.phone}
//                     onChange={(e) =>
//                       setOrderForm({ ...orderForm, phone: e.target.value })
//                     }
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//                     placeholder="9841234567"
//                   />
//                 </div>

//                 <div className="mb-8">
//                   <label className="block text-sm font-medium mb-3 text-gray-700">
//                     Payment Method *
//                   </label>
//                   <div className="space-y-2">
//                     {/* ✅ FIXED: value changed from "esewa" to "cash" */}
//                     <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="cash"
//                         checked={orderForm.paymentMethod === "cash"}
//                         onChange={(e) =>
//                           setOrderForm({ ...orderForm, paymentMethod: e.target.value })
//                         }
//                         className="mr-3 w-4 h-4 text-orange-600"
//                       />
//                       <span>Cash On Delivery</span>
//                     </label>
//                     <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="khalti"
//                         checked={orderForm.paymentMethod === "khalti"}
//                         onChange={(e) =>
//                           setOrderForm({ ...orderForm, paymentMethod: e.target.value })
//                         }
//                         className="mr-3 w-4 h-4 text-orange-600"
//                       />
//                       <span>Khalti</span>
//                     </label>
//                   </div>
//                 </div>

//                 <button
//                   onClick={placeOrder}
//                   disabled={!orderForm.address || !orderForm.phone || ordering}
//                   className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
//                 >
//                   {ordering
//                     ? "Placing Order..."
//                     : `Order Now — NRS. ${grandTotal.toFixed(2)}`}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;



////////////////////////////////////////////////////////////////////////////////////


import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartCard } from "../components/cards/CartCard.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { CartContext } from "../contexts/CartContext";

const API = "http://localhost:3000/api";

// ✅ FIX: User.phone is [String] array in schema — always coerce to string
const safePhone = (phone) => {
  if (!phone) return "";
  if (Array.isArray(phone)) return String(phone[0] || "");
  return String(phone);
};

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { fetchCartCount } = useContext(CartContext);

  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderForm, setOrderForm] = useState({
    address: "",
    paymentMethod: "cash",            // ✅ FIX: was "esewa" — backend enum is "cash"|"khalti"
    phone: safePhone(user?.phone),    // ✅ FIX: phone is array in DB
  });

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/cart/get`, { withCredentials: true });
      setCarts(data.carts || []);
      await fetchCartCount();
    } catch (error) {
      console.error("Failed to fetch carts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCarts();
  }, [user]);

  // ✅ FIX: cart model uses "Total" (capital T) — the pre-save hook writes to this.Total
  const grandTotal = carts.reduce((sum, cart) => sum + (cart.Total || cart.total || 0), 0);
  const allItems   = carts.flatMap((cart) =>
    (cart.items || []).map((item) => ({ ...item, restaurantId: cart.restaurantId }))
  );
  const totalItemsCount = allItems.length;

  // ── Shared validation ─────────────────────────────────────────────────────
  const validate = () => {
    if (!String(orderForm.address || "").trim()) {
      alert("Please enter a delivery address");
      return false;
    }
    if (!String(orderForm.phone || "").trim()) {
      alert("Please enter a phone number");
      return false;
    }
    if (carts.length === 0) {
      alert("Your cart is empty");
      return false;
    }
    return true;
  };

  // ── Cash / COD: place one order per cart (one per restaurant) ─────────────
  const placeCashOrder = async () => {
    if (!validate()) return;
    try {
      setOrdering(true);
      const results = await Promise.all(
        carts.map((cart) =>
          axios.post(
            `${API}/order/place`,
            {
              cartId: cart._id,
              shippingAddress: {
                address: orderForm.address,
                phone:   String(orderForm.phone),  // ✅ always string
              },
              paymentInfo: { method: "cash" },
            },
            { withCredentials: true }
          )
        )
      );

      const orderIds = results
        .map((r) => r.data.orderId?.slice(-6))
        .filter(Boolean)
        .join(", ");

      alert(`✅ ${results.length} order(s) placed! IDs: #${orderIds}`);
      setOrderForm({ address: "", paymentMethod: "cash", phone: safePhone(user?.phone) });
      await fetchCarts();
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed: " + (error.response?.data?.message || error.message));
    } finally {
      setOrdering(false);
    }
  };

  // ── Khalti: one payment session for the first cart ────────────────────────
  // Khalti supports a single redirect — initiate for first cart only.
  // Remaining carts remain until customer pays separately.
  const initiateKhaltiPayment = async () => {
    if (!validate()) return;

    if (carts.length > 1) {
      const ok = window.confirm(
        `You have items from ${carts.length} restaurants. Khalti will process the first restaurant's order. Proceed?`
      );
      if (!ok) return;
    }

    try {
      setOrdering(true);
      const cart = carts[0];
      const { data } = await axios.post(
        `${API}/order/khalti-initiate`,
        {
          cartId: cart._id,
          shippingAddress: {
            address: orderForm.address,
            phone:   String(orderForm.phone),  // ✅ always string
          },
          phone: String(orderForm.phone),
        },
        { withCredentials: true }
      );

      if (data.success) {
        // Persist everything needed for verify step after redirect
        localStorage.setItem(
          "khaltiPending",
          JSON.stringify({
            pidx:            data.pidx,
            cartId:          data.cartId,
            shippingAddress: {
              address: orderForm.address,
              phone:   String(orderForm.phone),  // ✅ phone persisted for verify
            },
            purchase_order_id: data.purchase_order_id,
          })
        );
        window.location.href = data.payment_url;
      } else {
        alert("Payment initiation failed");
      }
    } catch (error) {
      alert("Failed to initiate payment: " + (error.response?.data?.message || error.message));
    } finally {
      setOrdering(false);
    }
  };

  const placeOrder = () => {
    if (orderForm.paymentMethod === "khalti") return initiateKhaltiPayment();
    return placeCashOrder();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""} from{" "}
            {carts.length} restaurant{carts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5 6.5M16 13l-1.5 6.5M16 13l2.5 6.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500">Continue shopping to add more items.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 bg-gray-100 border-b">
                  <div className="font-semibold text-sm text-gray-700">Menu Item</div>
                  <div className="font-semibold text-sm text-gray-700 text-center">Quantity</div>
                  <div className="font-semibold text-sm text-gray-700">Total</div>
                  <div className="font-semibold text-sm text-gray-700">Action</div>
                </div>

                {carts.map((cart) => (
                  <div key={cart._id}>
                    <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 text-sm font-semibold text-orange-700">
                      {/* ✅ restaurantName is the correct field name in Restaurant schema */}
                      {cart.restaurantId?.restaurantName || cart.restaurantId?.name}
                    </div>
                    {cart.items.map((item) => (
                      <CartCard
                        key={`${cart._id}-${item.menu?._id}`}
                        item={{ ...item, restaurantId: cart.restaurantId }}
                        onUpdate={fetchCarts}
                        onRemove={fetchCarts}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary + checkout */}
            <div className="lg:col-span-1 space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {carts.map((cart) => (
                    <div key={cart._id} className="flex justify-between text-gray-600">
                      <span>{cart.restaurantId?.restaurantName || cart.restaurantId?.name}</span>
                      {/* ✅ FIX: cart.Total (capital T) */}
                      <span>NPR. {(cart.Total || cart.total || 0).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span className="text-orange-600">NPR. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">Checkout</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Delivery Address *
                  </label>
                  <textarea
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    placeholder="Enter full address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="9841234567"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio" name="payment" value="cash"
                        checked={orderForm.paymentMethod === "cash"}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                        className="mr-3 w-4 h-4 text-orange-600"
                      />
                      <span>Cash On Delivery</span>
                    </label>
                    <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio" name="payment" value="khalti"
                        checked={orderForm.paymentMethod === "khalti"}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                        className="mr-3 w-4 h-4 text-orange-600"
                      />
                      <span>Khalti</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!orderForm.address || !orderForm.phone || ordering}
                  className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
                >
                  {ordering ? "Placing Order..." : `Order Now — NRS. ${grandTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;