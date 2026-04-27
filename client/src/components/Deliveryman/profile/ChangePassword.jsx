// src/components/deliveryman/profile/ChangePassword.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api";

const ChangePassword = () => {
  const [form, setForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [show, setShow]     = useState({ current: false, new: false, confirm: false });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setSaving(true);
      await axios.put(`${API}/deliveryman/change-password`, form, { withCredentials: true });
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "currentPassword", label: "Current Password", showKey: "current" },
    { name: "newPassword",     label: "New Password",     showKey: "new"     },
    { name: "confirmPassword", label: "Confirm Password", showKey: "confirm" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {fields.map(({ name, label, showKey }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
            <div className="relative">
              <input
                type={show[showKey] ? "text" : "password"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[showKey] ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50 mt-2"
        >
          {saving ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
