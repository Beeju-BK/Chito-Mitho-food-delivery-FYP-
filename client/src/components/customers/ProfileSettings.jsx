

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ AXIOS DEFAULT CONFIG
  const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
  });

  // ✅ LOAD USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/customer/profile");

        const user = data.user;

        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");
      } catch (error) {
        console.log("Fetch error:", error.response?.data || error.message);
        toast.error("Failed to load profile. Please refresh the page.");
      }
    };

    fetchUser();
  }, []);

  // ✅ UPDATE PROFILE
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const { data } = await API.put("/customer/update", {
        firstName,
        lastName,
        phone,
        address,
      });

      toast.success(data.message || "Profile updated successfully! 🎉");
    } catch (error) {
      console.log(error.response?.data || error.message);
      
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      // ✅ Client-side validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All password fields are required!");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters!");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      setLoading(true);

      const { data } = await API.put("/customer/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(data.message || "Password changed successfully! 🔒");

      // ✅ Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.response?.data || error.message);
      
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "⚠️ Are you absolutely sure? This action cannot be undone!\n\nAll your data will be permanently deleted."
      );

      if (!confirmDelete) return;

      setLoading(true);

      const { data } = await API.delete("/customer/delete");

      toast.success(data.message || "Account deleted successfully!", {
        onClose: () => {
          window.location.href = "/";
        }
      });
    } catch (error) {
      console.log(error.response?.data || error.message);
      
      const message = error.response?.data?.message || "Delete failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      <div className="flex h-full w-full flex-col bg-white p-8 shadow-sm">
        <div className="max-w-4xl mx-auto w-full">

          {/* Header */}
          <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
          <p className="text-gray-600 mb-8">
            Update your profile information and manage your account
          </p>

          {/* Profile Section */}
          <section className="mb-10 p-6 border rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Profile Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-indigo-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Updating Profile..." : "💾 Update Profile"}
            </button>
          </section>

          {/* Password Section */}
          <section className="mb-10 p-6 border rounded-xl bg-blue-50">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Changing Password..." : "🔒 Change Password"}
            </button>
          </section>

          {/* Danger Zone */}
          <section className="p-6 border-2 border-red-200 bg-red-50 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              ⚠️ Danger Zone
            </h3>

            <div className="bg-red-100 border border-red-300 p-6 rounded-xl">
              <p className="text-sm text-red-700 mb-4 font-medium">
                Permanently delete your account and all associated data. 
                <strong className="block mt-1">This action cannot be undone!</strong>
              </p>

              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {loading ? "Deleting Account..." : "🗑️ Delete My Account"}
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

export default ProfileSettings;