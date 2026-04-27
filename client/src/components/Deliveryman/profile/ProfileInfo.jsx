// src/components/deliveryman/profile/ProfileInfo.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api";

const ProfileInfo = ({ profile, onUpdated }) => {
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [preview, setPreview]   = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    firstName: profile?.user?.firstName || "",
    lastName:  profile?.user?.lastName  || "",
    phone:     Array.isArray(profile?.user?.phone)
      ? profile.user.phone[0] : profile?.user?.phone || "",
    zone:     profile?.deliveryman?.zone     || "",
    vehicle:  profile?.deliveryman?.vehicle  || "",
    dutyTime: profile?.deliveryman?.dutyTime || "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("deliverymanImage", imageFile);

      const { data } = await axios.put(`${API}/deliveryman/profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated!");
      setEditing(false);
      setImageFile(null);
      setPreview(null);
      onUpdated(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const dm   = profile?.deliveryman;
  const user = profile?.user;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setPreview(null); setImageFile(null); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Profile image */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-100">
            <img
              src={preview || dm?.deliverymanImage || "/placeholder-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/placeholder-avatar.png"; }}
            />
          </div>
          {editing && (
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-all">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{dm?.zone} • {dm?.vehicle}</p>
        </div>
      </div>

      {/* Fields */}
      {editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "First Name", key: "firstName" },
            { label: "Last Name",  key: "lastName"  },
            { label: "Phone",      key: "phone"     },
            { label: "Zone",       key: "zone"      },
            { label: "Vehicle",    key: "vehicle"   },
            { label: "Duty Time",  key: "dutyTime"  },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: user?.firstName },
            { label: "Last Name",  value: user?.lastName  },
            { label: "Email",      value: user?.email     },
            { label: "Phone",      value: Array.isArray(user?.phone) ? user.phone[0] : user?.phone },
            { label: "Zone",       value: dm?.zone        },
            { label: "Vehicle",    value: dm?.vehicle     },
            { label: "Duty Time",  value: dm?.dutyTime || "—" },
            { label: "Status",     value: dm?.isAvailable ? "Online" : "Offline" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Documents (view only) */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Identity",   src: dm?.identityImage    },
            { label: "Bill Book",  src: dm?.billBookCopy     },
            { label: "Photo",      src: dm?.deliverymanImage },
          ].map(({ label, src }) => (
            <div key={label} className="rounded-xl overflow-hidden border border-gray-100">
              <div className="h-28 bg-gray-50 overflow-hidden">
                {src ? (
                  <img src={src} alt={label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 text-center py-2 bg-white">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
