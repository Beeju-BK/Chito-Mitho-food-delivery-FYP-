// src/pages/DeliverymanDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import DeliverymanHeader     from "../components/deliveryman/dashboard/DeliverymanHeader.jsx";
import DeliverymanStats      from "../components/deliveryman/dashboard/DeliverymanStats.jsx";
import DeliverymanOrderCard  from "../components/deliveryman/dashboard/DeliverymanOrderCard.jsx";
import DeliverymanEmptyState from "../components/deliveryman/dashboard/DeliverymanEmptyState.jsx";

const API = "http://localhost:3000/api";

const DeliverymanDashboard = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [updating, setUpdating]           = useState(null);
  const [isAvailable, setIsAvailable]     = useState(true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const [profile, setProfile]             = useState(null);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/deliveryman/profile`, { withCredentials: true });
      setProfile(data.data);
      setIsAvailable(data.data?.deliveryman?.isAvailable ?? true);
    } catch (error) {
      console.error("Profile error:", error.response?.data || error.message);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      // order.controller.js → GET /api/order/deliveryman/my-deliveries
      const { data } = await axios.get(`${API}/order/deliveryman/my-deliveries`, {
        withCredentials: true,
      });
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Deliveries error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  // PATCH /api/order/:orderId/delivery-status
  // accepted → picked_up → on_the_way → delivered
  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    if (deliveryStatus === "delivered") {
      if (!window.confirm("Mark this order as delivered?")) return;
    }
    try {
      setUpdating(orderId);
      await axios.patch(
        `${API}/order/${orderId}/delivery-status`,
        { deliveryStatus },
        { withCredentials: true }
      );
      if (deliveryStatus === "delivered") setIsAvailable(true);
      await fetchDeliveries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // PATCH /api/deliveryman/toggle-availability
  const toggleAvailability = async () => {
    try {
      setTogglingAvail(true);
      const { data } = await axios.patch(
        `${API}/deliveryman/toggle-availability`,
        {},
        { withCredentials: true }
      );
      setIsAvailable(data.isAvailable);
    } catch (error) {
      alert("Failed to update availability");
    } finally {
      setTogglingAvail(false);
    }
  };

  const activeOrders    = orders.filter((o) => o.status === "out_for_delivery");
  const completedOrders = orders.filter((o) => o.status === "delivered");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <DeliverymanHeader
          profile={profile}
          isAvailable={isAvailable}
          togglingAvail={togglingAvail}
          loading={loading}
          onToggle={toggleAvailability}
          onRefresh={fetchDeliveries}
        />

        <DeliverymanStats
          activeCount={activeOrders.length}
          completedCount={completedOrders.length}
          isAvailable={isAvailable}
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading deliveries...</p>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Active Deliveries
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {activeOrders.length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <DeliverymanOrderCard
                      key={order._id}
                      order={order}
                      onUpdateStatus={updateDeliveryStatus}
                      updating={updating}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <DeliverymanEmptyState isAvailable={isAvailable} />
            )}

            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Completed
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm">
                    {completedOrders.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {completedOrders.map((order) => (
                    <DeliverymanOrderCard
                      key={order._id}
                      order={order}
                      onUpdateStatus={updateDeliveryStatus}
                      updating={updating}
                      completed
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliverymanDashboard;
