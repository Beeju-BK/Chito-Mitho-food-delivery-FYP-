// src/components/deliveryman/dashboard/DeliverymanStats.jsx

const DeliverymanStats = ({ activeCount, completedCount, isAvailable }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <p className="text-3xl font-bold text-orange-600">{activeCount}</p>
        <p className="text-sm text-gray-500 mt-1">Active Deliveries</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        <p className="text-sm text-gray-500 mt-1">Completed Today</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 col-span-2 md:col-span-1">
        <p className={`text-3xl font-bold ${isAvailable ? "text-green-500" : "text-gray-400"}`}>
          {isAvailable ? "Online" : "Offline"}
        </p>
        <p className="text-sm text-gray-500 mt-1">Your Status</p>
      </div>
    </div>
  );
};

export default DeliverymanStats;
