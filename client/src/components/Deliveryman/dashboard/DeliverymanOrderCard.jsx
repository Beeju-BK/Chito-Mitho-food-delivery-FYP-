// src/components/deliveryman/dashboard/DeliverymanOrderCard.jsx

const DELIVERY_STEPS = [
  { status: "accepted",   label: "Accepted",   nextLabel: "Mark Picked Up",  next: "picked_up"  },
  { status: "picked_up",  label: "Picked Up",  nextLabel: "Mark On the Way", next: "on_the_way" },
  { status: "on_the_way", label: "On the Way", nextLabel: "Mark Delivered",  next: "delivered"  },
  { status: "delivered",  label: "Delivered",  nextLabel: null,               next: null         },
];

const DeliverymanOrderCard = ({ order, onUpdateStatus, updating, completed }) => {
  const customer     = order.user;
  const restaurant   = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;
  const isUpdating   = updating === order._id;
  const stepIndex    = DELIVERY_STEPS.findIndex((s) => s.status === order.deliveryStatus);
  const currentStep  = DELIVERY_STEPS[stepIndex];

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden border ${
      completed ? "border-green-100" : "border-orange-100"
    }`}>

      {/* Header */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        completed ? "bg-green-50" : "bg-orange-50"
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900">
            Order #{order._id.toString().slice(-8).toUpperCase()}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            completed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
          }`}>
            {completed ? "✅ Delivered" : `🚴 ${currentStep?.label || "Out for Delivery"}`}
          </span>
        </div>
        <span className="font-bold text-orange-600">
          NRS. {order.totalAmount?.toFixed(0)}
        </span>
      </div>

      {/* Progress bar — active only */}
      {!completed && (
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
      )}

      {/* Customer + restaurant */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deliver To</p>
          <p className="font-semibold text-gray-800">{customer?.firstName} {customer?.lastName}</p>
          <p className="text-sm text-gray-500">
            📞 {Array.isArray(customer?.phone) ? customer.phone[0] : customer?.phone}
          </p>
          <p className="text-sm text-gray-600 mt-1">📍 {order.shippingAddress?.address}</p>
          {order.shippingAddress?.phone && (
            <p className="text-sm text-gray-500">📞 {order.shippingAddress.phone}</p>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pick Up From</p>
          <p className="font-semibold text-gray-800">{restaurant?.restaurantName}</p>
          {restaurant?.address && (
            <p className="text-sm text-gray-500">📍 {restaurant.address}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="px-5 pb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
        <div className="flex flex-wrap gap-2">
          {(order.items || []).map((item) => (
            <span key={item._id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              {item.menu?.name || "Item"} × {item.quantity}
            </span>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          order.paymentInfo?.method === "khalti"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {order.paymentInfo?.method === "khalti" ? "Khalti — Paid" : "Cash on Delivery"}
        </span>
        {order.paymentInfo?.method === "cash" && !completed && (
          <span className="text-orange-600 font-semibold text-sm">
            💵 Collect NRS. {order.totalAmount?.toFixed(0)} at door
          </span>
        )}
      </div>

      {/* Action button */}
      {!completed && currentStep?.next && (
        <div className="px-5 pb-5">
          <button
            onClick={() => onUpdateStatus(order._id, currentStep.next)}
            disabled={isUpdating}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {isUpdating ? (
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

export default DeliverymanOrderCard;
