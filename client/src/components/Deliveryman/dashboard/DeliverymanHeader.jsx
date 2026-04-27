// src/components/deliveryman/dashboard/DeliverymanHeader.jsx
import { useNavigate } from "react-router-dom";

const DeliverymanHeader = ({
  profile, isAvailable, togglingAvail, loading, onToggle, onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Deliveries</h1>
        {profile && (
          <p className="text-gray-500 mt-1">
            {profile.user?.firstName} {profile.user?.lastName}
            {profile.deliveryman?.zone    && ` • ${profile.deliveryman.zone}`}
            {profile.deliveryman?.vehicle && ` • ${profile.deliveryman.vehicle}`}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Online / Offline toggle */}
        <button
          onClick={onToggle}
          disabled={togglingAvail}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all disabled:opacity-60 ${
            isAvailable
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-gray-500"}`} />
          {togglingAvail ? "Updating..." : isAvailable ? "Online" : "Offline"}
        </button>

        {/* Orders page */}
        <button
          onClick={() => navigate("/deliveryman/orders")}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
        >
          Order List
        </button>

        {/* Profile page */}
        <button
          onClick={() => navigate("/deliveryman/profile")}
          className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm"
        >
          Profile
        </button>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DeliverymanHeader;
