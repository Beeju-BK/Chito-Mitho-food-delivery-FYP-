// src/components/deliveryman/orders/AvailableOrderCard.jsx

const AvailableOrderCard = ({ order, onAccept, accepting, canAccept }) => {
  const restaurant = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-900">
            #{order._id.toString().slice(-8).toUpperCase()}
          </span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            Ready for Pickup
          </span>
        </div>
        <span className="font-bold text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</span>
      </div>

      {/* Restaurant + address */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pick Up From</p>
          <p className="font-semibold text-gray-800">{restaurant?.restaurantName}</p>
          {restaurant?.address && (
            <p className="text-sm text-gray-500 mt-0.5">📍 {restaurant.address}</p>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deliver To</p>
          <p className="text-sm text-gray-700">📍 {order.shippingAddress?.address}</p>
          <p className="text-sm text-gray-500">📞 {order.shippingAddress?.phone}</p>
        </div>
      </div>

      {/* Items count + payment + accept */}
      <div className="px-5 pb-5">
        <p className="text-xs text-gray-400 mb-3">
          {order.items?.length} item(s) •{" "}
          {order.paymentInfo?.method === "cash"
            ? `Collect NRS. ${order.totalAmount?.toFixed(0)} at door`
            : "Khalti — Already Paid"}
        </p>
        <button
          onClick={() => onAccept(order._id)}
          disabled={accepting === order._id || !canAccept}
          className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
        >
          {accepting === order._id
            ? "Accepting..."
            : canAccept
            ? "Accept Order"
            : "Complete current delivery first"}
        </button>
      </div>
    </div>
  );
};

export default AvailableOrderCard;
