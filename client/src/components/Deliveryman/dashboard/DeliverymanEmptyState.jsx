// src/components/deliveryman/dashboard/DeliverymanEmptyState.jsx

const DeliverymanEmptyState = ({ isAvailable }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-10 text-center mb-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-600">No active deliveries</h3>
      <p className="text-gray-400 text-sm mt-1">
        {isAvailable
          ? "Go to Order List to accept new orders"
          : "You are offline — go online to receive orders"}
      </p>
    </div>
  );
};

export default DeliverymanEmptyState;
