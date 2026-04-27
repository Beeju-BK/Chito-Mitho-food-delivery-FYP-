// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";

// const VerifyPayment = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("Verifying your payment...");
//   const [success, setSuccess] = useState(null);

//   useEffect(() => {
//     const verify = async () => {
//       const pidx   = searchParams.get("pidx");
//       const status = searchParams.get("status");

//       // Khalti canceled
//       if (status === "User canceled") {
//         setSuccess(false);
//         setMessage("Payment was canceled. Redirecting to cart...");
//         setTimeout(() => navigate("/cart"), 2500);
//         return;
//       }

//       // Get saved pending order data
//       const pending = JSON.parse(localStorage.getItem("khaltiPending") || "{}");

//       if (!pending.pidx || !pending.cartId) {
//         setSuccess(false);
//         setMessage("Order data missing. Please try again.");
//         setTimeout(() => navigate("/cart"), 2500);
//         return;
//       }

//       try {
//         const { data } = await axios.post(
//           "http://localhost:3000/api/order/khalti-verify",
//           {
//             pidx: pending.pidx,
//             cartId: pending.cartId,
//             shippingAddress: pending.shippingAddress,
//             purchase_order_id: pending.purchase_order_id,
//           },
//           { withCredentials: true }
//         );

//         if (data.success) {
//           localStorage.removeItem("khaltiPending");
//           setSuccess(true);
//           setMessage(`✅ Order #${data.orderId?.slice(-6)} placed successfully! Redirecting...`);
//           setTimeout(() => navigate("/orders"), 2500);
//         } else {
//           setSuccess(false);
//           setMessage(data.message || "Payment verification failed.");
//           setTimeout(() => navigate("/cart"), 3000);
//         }
//       } catch (error) {
//         setSuccess(false);
//         setMessage("Verification failed: " + (error.response?.data?.message || error.message));
//         setTimeout(() => navigate("/cart"), 3000);
//       }
//     };

//     verify();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-md">
//         {success === null && (
//           <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
//         )}
//         {success === true && (
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//         )}
//         {success === false && (
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//         )}
//         <h2 className="text-xl font-bold text-gray-800 mb-2">{message}</h2>
//       </div>
//     </div>
//   );
// };

// export default VerifyPayment;




import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000/api";

// Khalti redirects to /verify-payment?pidx=...&status=Completed&...
// We read localStorage.khaltiPending (set before redirect) + URL params,
// then call /khalti-verify to place the order.

const VerifyPayment = () => {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const [status, setStatus]     = useState("verifying"); // "verifying" | "success" | "failed"
  const [message, setMessage]   = useState("Verifying your payment...");
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // 1. Read URL params from Khalti redirect
      const pidx          = searchParams.get("pidx");
      const khaltiStatus  = searchParams.get("status");
      const txnId         = searchParams.get("transaction_id");

      if (!pidx) {
        setStatus("failed");
        setMessage("Invalid payment session. No pidx found.");
        return;
      }

      // Khalti can redirect with status=User canceled
      if (khaltiStatus && khaltiStatus !== "Completed") {
        setStatus("failed");
        setMessage(`Payment was not completed. Status: ${khaltiStatus}`);
        localStorage.removeItem("khaltiPending");
        return;
      }

      // 2. Read pending order data stored before redirect
      const raw = localStorage.getItem("khaltiPending");
      if (!raw) {
        setStatus("failed");
        setMessage("Payment session expired. Please try ordering again.");
        return;
      }

      const pending = JSON.parse(raw);
      const { cartId, shippingAddress, purchase_order_id } = pending;

      if (!cartId || !shippingAddress) {
        setStatus("failed");
        setMessage("Incomplete order data. Please try again.");
        localStorage.removeItem("khaltiPending");
        return;
      }

      // 3. Call backend to verify + place order
      const { data } = await axios.post(
        `${API}/order/khalti-verify`,
        { pidx, cartId, shippingAddress, purchase_order_id },
        { withCredentials: true }
      );

      if (data.success) {
        localStorage.removeItem("khaltiPending");
        setStatus("success");
        setMessage(data.message || "Order placed successfully!");
        setOrderInfo(data.order);
      } else {
        setStatus("failed");
        setMessage(data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("VERIFY_PAYMENT_ERROR:", error);
      setStatus("failed");
      setMessage(error.response?.data?.message || "Payment verification failed. Please contact support.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        {/* Verifying */}
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your payment with Khalti...</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">{message}</p>

            {orderInfo && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-orange-700 mb-2">Order Summary</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Order ID</span>
                    <span className="font-mono font-bold">#{orderInfo._id?.toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurant</span>
                    <span>
                      {Array.isArray(orderInfo.restaurant)
                        ? orderInfo.restaurant[0]?.restaurantName
                        : orderInfo.restaurant?.restaurantName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Paid</span>
                    <span className="text-orange-600">NRS. {orderInfo.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 pt-1 border-t">
                    <span>Status</span>
                    <span className="capitalize bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                      {orderInfo.status} — waiting for vendor confirmation
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        {/* Failed */}
        {status === "failed" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-6">{message}</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                Back to Cart
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;