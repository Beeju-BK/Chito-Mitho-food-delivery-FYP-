// src/pages/DeliverymanOrders.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import AvailableOrderCard    from "../components/deliveryman/orders/AvailableOrderCard.jsx";
import ActiveDeliveryCard    from "../components/deliveryman/orders/ActiveDeliveryCard.jsx";
import CompletedDeliveryCard from "../components/deliveryman/orders/CompletedDeliveryCard.jsx";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

const DeliverymanOrders = () => {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [accepting, setAccepting]             = useState(null);
  const [updating, setUpdating]               = useState(null);
  const [tab, setTab]                         = useState("available");
  const [isAvailable, setIsAvailable]         = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [avRes, myRes, profileRes] = await Promise.all([
        axios.get(`${API}/order/deliveryman/available`,     { withCredentials: true }),
        axios.get(`${API}/order/deliveryman/my-deliveries`, { withCredentials: true }),
        axios.get(`${API}/deliveryman/profile`,             { withCredentials: true }),
      ]);
      setAvailableOrders(Array.isArray(avRes.data.orders) ? avRes.data.orders : []);
      setMyDeliveries(Array.isArray(myRes.data.orders) ? myRes.data.orders : []);
      setIsAvailable(profileRes.data.data?.deliveryman?.isAvailable ?? true);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 20000);
    return () => clearInterval(interval);
  }, []);

  // PATCH /api/order/:orderId/accept
  const acceptOrder = async (orderId) => {
    try {
      setAccepting(orderId);
      await axios.patch(`${API}/order/${orderId}/accept`, {}, { withCredentials: true });
      setIsAvailable(false);
      setTab("active");
      await fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept order");
    } finally {
      setAccepting(null);
    }
  };

  // PATCH /api/order/:orderId/delivery-status
  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      setUpdating(orderId);
      await axios.patch(
        `${API}/order/${orderId}/delivery-status`,
        { deliveryStatus },
        { withCredentials: true }
      );
      if (deliveryStatus === "delivered") {
        setIsAvailable(true);
        setTab("completed");
      }
      await fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // PATCH /api/deliveryman/toggle-availability
  const toggleAvailability = async () => {
    try {
      const { data } = await axios.patch(
        `${API}/deliveryman/toggle-availability`,
        {},
        { withCredentials: true }
      );
      setIsAvailable(data.isAvailable);
    } catch (error) {
      alert("Failed to update availability");
    }
  };

  const activeDeliveries    = myDeliveries.filter((o) => o.status === "out_for_delivery");
  const completedDeliveries = myDeliveries.filter((o) => o.status === "delivered");

  const TABS = [
    { key: "available", label: "Available",  count: availableOrders.length   },
    { key: "active",    label: "My Active",  count: activeDeliveries.length  },
    { key: "completed", label: "Completed",  count: completedDeliveries.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/deliveryman/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order List</h1>
              <p className="text-gray-500 mt-1 text-sm">
                {activeDeliveries.length > 0
                  ? `${activeDeliveries.length} active delivery`
                  : "No active deliveries"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                isAvailable
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-gray-400"}`} />
              {isAvailable ? "Online" : "Offline"}
            </button>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-orange-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  tab === key ? "bg-orange-500" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Available */}
            {tab === "available" && (
              <div className="space-y-4">
                {!isAvailable && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700 font-medium">
                    ⚠️ You are offline or on a delivery. Go online to accept new orders.
                  </div>
                )}
                {availableOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-4xl mb-3">🚴</p>
                    <p className="text-gray-500 font-medium">No orders available right now</p>
                    <p className="text-gray-400 text-sm mt-1">Refreshes automatically every 20 seconds</p>
                  </div>
                ) : (
                  availableOrders.map((order) => (
                    <AvailableOrderCard
                      key={order._id}
                      order={order}
                      onAccept={acceptOrder}
                      accepting={accepting}
                      canAccept={isAvailable}
                    />
                  ))
                )}
              </div>
            )}

            {/* Active */}
            {tab === "active" && (
              <div className="space-y-4">
                {activeDeliveries.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-400">No active deliveries — accept an order first</p>
                  </div>
                ) : (
                  activeDeliveries.map((order) => (
                    <ActiveDeliveryCard
                      key={order._id}
                      order={order}
                      onUpdateStatus={updateDeliveryStatus}
                      updating={updating}
                    />
                  ))
                )}
              </div>
            )}

            {/* Completed */}
            {tab === "completed" && (
              <div className="space-y-4">
                {completedDeliveries.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-400">No completed deliveries yet</p>
                  </div>
                ) : (
                  completedDeliveries.map((order) => (
                    <CompletedDeliveryCard key={order._id} order={order} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliverymanOrders;
