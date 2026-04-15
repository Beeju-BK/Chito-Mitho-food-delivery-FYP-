import { useState } from "react";
import { Store, Clock, Bell, CreditCard, Shield, ChevronRight, Save } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Taste of Nepal",
    description: "Authentic Nepali & Indian cuisine in the heart of Kathmandu.",
    phone: "+977 9841234567",
    email: "info@tasteofnepal.com",
    address: "Thamel-29, Kathmandu, Nepal",
    minOrder: "5",
    deliveryFee: "2",
    deliveryRadius: "5",
  });

  const [hours, setHours] = useState(
    days.reduce((acc, d) => ({ ...acc, [d]: { open: true, from: "09:00", to: "22:00" } }), {})
  );

  const [notif, setNotif] = useState({ newOrder: true, orderReady: true, reviews: false, promo: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your restaurant profile and preferences</p>
      </div>

      {/* Restaurant Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Store size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-gray-700 text-sm">Restaurant Profile</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">🍛</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Restaurant Logo</p>
              <button className="text-xs text-indigo-500 mt-1 hover:underline">Change photo</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Restaurant Name", key: "name" },
              { label: "Phone", key: "phone" },
              { label: "Email", key: "email" },
              { label: "Address", key: "address" },
              { label: "Min. Order ($)", key: "minOrder" },
              { label: "Delivery Fee ($)", key: "deliveryFee" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input
                  value={profile[f.key]}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Clock size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-gray-700 text-sm">Business Hours</h3>
        </div>
        <div className="p-5 space-y-3">
          {days.map((d) => (
            <div key={d} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-8">{d}</span>
              <button
                onClick={() => setHours({ ...hours, [d]: { ...hours[d], open: !hours[d].open } })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${hours[d].open ? "bg-indigo-500" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${hours[d].open ? "translate-x-4" : "translate-x-1"}`} />
              </button>
              {hours[d].open ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={hours[d].from} onChange={(e) => setHours({ ...hours, [d]: { ...hours[d], from: e.target.value } })}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                  <span className="text-gray-400 text-xs">to</span>
                  <input type="time" value={hours[d].to} onChange={(e) => setHours({ ...hours, [d]: { ...hours[d], to: e.target.value } })}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>
              ) : (
                <span className="text-xs text-gray-400">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Bell size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: "newOrder", label: "New order received", desc: "Get notified when a new order comes in" },
            { key: "orderReady", label: "Order status updates", desc: "Alerts for order status changes" },
            { key: "reviews", label: "New reviews", desc: "When a customer leaves a review" },
            { key: "promo", label: "Promotional updates", desc: "Platform offers and promotions" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-700">{n.label}</p>
                <p className="text-xs text-gray-400">{n.desc}</p>
              </div>
              <button
                onClick={() => setNotif({ ...notif, [n.key]: !notif[n.key] })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notif[n.key] ? "bg-indigo-500" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${notif[n.key] ? "translate-x-4" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        <Save size={15} />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
