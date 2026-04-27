// src/pages/DeliverymanProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileInfo   from "../components/deliveryman/profile/ProfileInfo.jsx";
import ChangePassword from "../components/deliveryman/profile/ChangePassword.jsx";

const API = "http://localhost:3000/api";

const DeliverymanProfile = () => {
  const navigate             = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("info"); // "info" | "password"
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/deliveryman/profile`, { withCredentials: true });
      setProfile(data.data);
    } catch (error) {
      console.error("Profile error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.post(`${API}/deliveryman/logout`, {}, { withCredentials: true });
      navigate("/deliveryman/register"); // redirect to auth page
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/deliveryman/register");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/deliveryman/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Approval status banner */}
        {profile?.deliveryman && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
            profile.deliveryman.isApproved
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}>
            {profile.deliveryman.isApproved
              ? "✅ Account approved — you can accept deliveries"
              : "⏳ Account pending admin approval"}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "info",     label: "Personal Info"    },
            { key: "password", label: "Change Password"  },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-orange-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "info" && (
          <ProfileInfo
            profile={profile}
            onUpdated={(updated) => setProfile(updated)}
          />
        )}
        {tab === "password" && <ChangePassword />}
      </div>
    </div>
  );
};

export default DeliverymanProfile;
