"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // ✅ AXIOS DEFAULT CONFIG (important)
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
        alert("Failed to load profile");
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

      alert(data.message || "Profile updated!");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return alert("All fields are required");
      }

      if (newPassword !== confirmPassword) {
        return alert("Passwords do not match!");
      }

      setLoading(true);

      const { data } = await API.put("/customer/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      alert(data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure? This cannot be undone!"
      );

      if (!confirmDelete) return;

      setLoading(true);

      const { data } = await API.delete("/customer/delete");

      alert(data.message || "Account deleted");

      window.location.href = "/";
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-8 shadow-sm">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Account</h2>
        <p className="text-gray-600 mb-8">
          Update your profile and personal details
        </p>

        {/* Profile Section */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <input
            type="email"
            value={email}
            disabled
            className="border p-2 rounded w-full mb-4 bg-gray-100"
          />

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </section>

        {/* Password Section */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Danger Zone
          </h3>

          <div className="border border-red-400 bg-red-50 p-4 rounded">
            <p className="text-sm text-red-600 mb-4">
              Permanently delete your account. This action cannot be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default ProfileSettings;