// src/components/deliveryman/orders/ActiveDeliveryCard.jsx

const DELIVERY_STEPS = [
  { status: "accepted",   label: "Accepted",   icon: "✅", nextLabel: "Mark Picked Up",  next: "picked_up"  },
  { status: "picked_up",  label: "Picked Up",  icon: "📦", nextLabel: "Mark On the Way", next: "on_the_way" },
  { status: "on_the_way", label: "On the Way", icon: "🚴", nextLabel: "Mark Delivered",  next: "delivered"  },
  { status: "delivered",  label: "Delivered",  icon: "🎉", nextLabel: null,               next: null         },
];

const ActiveDeliveryCard = ({ order, onUpdateStatus, updating }) => {
  const restaurant  = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;
  const customer    = order.user;
  const stepIndex   = DELIVERY_STEPS.findIndex((s) => s.status === order.deliveryStatus);
  const currentStep = DELIVERY_STEPS[stepIndex];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            #{order._id.toString().slice(-8).toUpperCase()}
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            {currentStep?.icon} {currentStep?.label}
          </span>
        </div>
        <span className="font-bold text-orange-600">NRS. {order.totalAmount?.toFixed(2)}</span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center">
          {DELIVERY_STEPS.map((step, i) => {
            const isDone = i <= stepIndex;
            return (
              <div key={step.status} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  isDone ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {isDone ? "✓" : i + 1}
                </div>
                {i < DELIVERY_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                    i < stepIndex ? "bg-orange-500" : "bg-gray-100"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {DELIVERY_STEPS.map((step) => (
            <span key={step.status} className="text-[9px] text-gray-400 text-center flex-1 leading-tight px-0.5">
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Restaurant + customer */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pick Up</p>
          <p className="font-semibold text-gray-800 text-sm">{restaurant?.restaurantName}</p>
          {restaurant?.address && <p className="text-xs text-gray-500">📍 {restaurant.address}</p>}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
          <p className="font-semibold text-gray-800 text-sm">{customer?.firstName} {customer?.lastName}</p>
          <p className="text-xs text-gray-500">📍 {order.shippingAddress?.address}</p>
          <p className="text-xs text-gray-500">📞 {order.shippingAddress?.phone}</p>
        </div>
      </div>

      {/* COD reminder */}
      {order.paymentInfo?.method === "cash" && (
        <div className="mx-5 mb-3 px-3 py-2 bg-yellow-50 rounded-xl text-sm text-yellow-700 font-medium border border-yellow-200">
          💵 Collect NRS. {order.totalAmount?.toFixed(0)} at the door
        </div>
      )}

      {/* Advance button */}
      {currentStep?.next && (
        <div className="px-5 pb-5">
          <button
            onClick={() => onUpdateStatus(order._id, currentStep.next)}
            disabled={updating === order._id}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {updating === order._id ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Updating...
              </span>
            ) : currentStep.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveryCard;
