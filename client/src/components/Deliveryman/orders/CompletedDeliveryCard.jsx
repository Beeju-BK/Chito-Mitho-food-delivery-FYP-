// src/components/deliveryman/orders/CompletedDeliveryCard.jsx

const CompletedDeliveryCard = ({ order }) => {
  const restaurant = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
      <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            #{order._id.toString().slice(-8).toUpperCase()}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            ✅ Delivered
          </span>
        </div>
        <span className="font-bold text-green-600">NRS. {order.totalAmount?.toFixed(2)}</span>
      </div>
      <div className="px-5 py-3 flex items-center justify-between text-sm text-gray-500">
        <span>{restaurant?.restaurantName || "Restaurant"}</span>
        <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
      </div>
      <div className="px-5 pb-3 text-xs text-gray-400">
        📍 {order.shippingAddress?.address}
      </div>
    </div>
  );
};

export default CompletedDeliveryCard;
