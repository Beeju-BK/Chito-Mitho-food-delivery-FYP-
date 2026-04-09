import { useState, useEffect } from "react";
import axios from "axios";
import { Store, Save, Trash2, Loader2 } from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
  });

  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    restaurantType: "",
    openingTime: "09:00",
    closingTime: "22:00",
    restaurantImage: null,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔥 FIXED: Fetch profile with CLEAN phone display
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/restaurant/profile", {
          withCredentials: true,
        });
        
        const userData = res.data.data.user;
        
        // 🆕 CLEAN PHONE DISPLAY - NO BRACKETS!
        let cleanPhone = "";
        if (Array.isArray(userData.phone) && userData.phone.length > 0) {
          cleanPhone = userData.phone.join(", ");
        } else if (typeof userData.phone === 'string' && userData.phone.trim()) {
          cleanPhone = userData.phone;
        }
        
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: cleanPhone, // ✅ Clean: "123-456, 789"
          address: userData.address || "",
          email: userData.email || "",
        });
        
        const restaurantData = res.data.data.restaurant;
        setRestaurant({
          restaurantName: restaurantData.restaurantName || "",
          restaurantType: restaurantData.restaurantType || "",
          openingTime: restaurantData.openingTime?.slice(0, 5) || "09:00",
          closingTime: restaurantData.closingTime?.slice(0, 5) || "22:00",
          restaurantImage: restaurantData.restaurantImage || null,
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUserChange = (e, key) => {
    setUser({ ...user, [key]: e.target.value });
  };

  const handleRestaurantChange = (e, key) => {
    setRestaurant({ ...restaurant, [key]: e.target.value });
  };

  const handleImageChange = (e) => {
    setRestaurant({ ...restaurant, restaurantImage: e.target.files[0] });
  };

  // 🔥 PERFECT Save - Sends clean data to backend
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      const formData = new FormData();

      // Send ALL fields (backend ignores empty)
      if (user.firstName.trim()) formData.append("firstName", user.firstName.trim());
      if (user.lastName.trim()) formData.append("lastName", user.lastName.trim());
      
      // 🆕 PHONE: Input → Clean array → JSON
      if (user.phone.trim()) {
        const phoneArray = user.phone
          .split(",")
          .map(p => p.trim())
          .filter(p => p);
        formData.append("phone", JSON.stringify(phoneArray));
      }
      
      if (user.address.trim()) formData.append("address", user.address.trim());
      if (user.email.trim()) formData.append("email", user.email.trim());

      if (restaurant.restaurantName.trim()) formData.append("restaurantName", restaurant.restaurantName.trim());
      if (restaurant.restaurantType.trim()) formData.append("restaurantType", restaurant.restaurantType.trim());
      formData.append("openingTime", restaurant.openingTime);
      formData.append("closingTime", restaurant.closingTime);

      if (restaurant.restaurantImage instanceof File) {
        formData.append("restaurantImage", restaurant.restaurantImage);
      }

      console.log("📤 Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const res = await axios.put("http://localhost:3000/api/restaurant/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Saved:", res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      
      // 🆕 Refetch to show updated data
      fetchProfile();
      
    } catch (error) {
      console.error("❌ Save error:", error.response?.data || error.message);
      alert("Save failed: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ PERMANENTLY delete account & restaurant?")) return;
    
    setDeleting(true);
    try {
      await axios.delete("http://localhost:3000/api/restaurant/delete", {
        withCredentials: true,
      });
      alert("✅ Deleted! Redirecting...");
      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed: " + error.response?.data?.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-12">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Update your personal details and restaurant information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-100 rounded-2xl shadow-lg">
                <Store className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Personal Info</h2>
                <p className="text-gray-600">Your account details</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "First Name", key: "firstName", required: true },
                { label: "Last Name", key: "lastName", required: true },
                { 
                  label: "Phone Numbers", 
                  key: "phone", 
                  type: "tel",
                  placeholder: "123-456-7890",
                  className: "md:col-span-2",
                  helper: "Separate multiple numbers with commas (,)"
                },
                { label: "Email", key: "email", type: "email", required: true },
                { 
                  label: "Address", 
                  key: "address", 
                  className: "md:col-span-2"
                },
              ].map((field) => (
                <div key={field.key} className={field.className || ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={user[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) => handleUserChange(e, field.key)}
                    disabled={saving || deleting}
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-300 text-lg placeholder-gray-400"
                  />
                  {field.helper && (
                    <p className="text-xs text-gray-500 mt-2 pl-1">{field.helper}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 rounded-2xl shadow-lg">
                <Store className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Restaurant Info</h2>
                <p className="text-gray-600">Business details</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 font-medium">
                Restaurant Logo
              </label>
              <div className="flex items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 group">
                {restaurant.restaurantImage && !(restaurant.restaurantImage instanceof File) ? (
                  <img
                    src={restaurant.restaurantImage}
                    alt="Restaurant logo"
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-200 shadow-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-indigo-300">
                    <Store className="w-12 h-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    id="restaurantImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={saving || deleting}
                    className="hidden"
                  />
                  <label 
                    htmlFor="restaurantImage"
                    className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-block disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {restaurant.restaurantImage instanceof File ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Restaurant Name", key: "restaurantName", required: true },
                { label: "Restaurant Type", key: "restaurantType" },
                { label: "Opening Time", key: "openingTime", type: "time" },
                { label: "Closing Time", key: "closingTime", type: "time" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={restaurant[field.key]}
                    onChange={(e) => handleRestaurantChange(e, field.key)}
                    disabled={saving || deleting}
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all duration-300 text-lg placeholder-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleSave}
              disabled={saving || deleting}
              className={`group relative flex items-center gap-3 px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 transform ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-500/50"
                  : saving
                  ? "bg-gray-400 text-white cursor-not-allowed shadow-lg"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-indigo-500/50 hover:shadow-indigo-500/75 hover:-translate-y-2 active:scale-[0.98]"
              } disabled:opacity-75`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saved ? (
                <>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Save className="w-4 h-4" />
                  </div>
                  <span>Saved! ✅</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || saving}
              className="group flex items-center gap-3 px-12 py-5 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-red-500/50 hover:shadow-red-500/75 hover:-translate-y-2 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
          
          {saved && (
            <div className="mt-8 p-8 bg-emerald-50 border-2 border-emerald-200 rounded-3xl text-center shadow-lg">
              <Save className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">Saved Successfully!</h3>
              <p className="text-emerald-700">Your settings have been updated 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}