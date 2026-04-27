
import { useState, useEffect } from "react";
import {
  Search, ShieldOff, ShieldCheck, MapPin, Phone, Store,
  AlertTriangle, ChevronDown, Loader2, CheckCircle, XCircle, Clock
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // "block" | "approve" | "reject"
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/restaurants",
        { withCredentials: true }
      );
      setVendors(data.restaurants || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (restaurantId) => {
    setActionLoading(restaurantId);
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/restaurants/${restaurantId}/toggle-block`,
        {},
        { withCredentials: true }
      );
      const vendor = vendors.find((v) => v._id === restaurantId);
      toast.success(
        vendor?.isBlocked
          ? `${vendor.restaurantName} has been unblocked`
          : `${vendor.restaurantName} has been blocked`
      );
      await fetchVendors();
      setConfirmId(null);
      setConfirmAction(null);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const approveRestaurant = async (restaurantId) => {
    setActionLoading(restaurantId);
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/restaurant/approve/${restaurantId}`,
        {},
        { withCredentials: true }
      );
      const vendor = vendors.find((v) => v._id === restaurantId);
      toast.success(`${vendor?.restaurantName} has been approved! 🎉`);
      await fetchVendors();
      setConfirmId(null);
      setConfirmAction(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve restaurant");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectRestaurant = async (restaurantId) => {
    setActionLoading(restaurantId);
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/restaurant/reject/${restaurantId}`,
        { withCredentials: true }
      );
      const vendor = vendors.find((v) => v._id === restaurantId);
      toast.success(`${vendor?.restaurantName} has been rejected and removed`);
      await fetchVendors();
      setConfirmId(null);
      setConfirmAction(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject restaurant");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = () => {
    if (confirmAction === "block") toggleBlock(confirmId);
    else if (confirmAction === "approve") approveRestaurant(confirmId);
    else if (confirmAction === "reject") rejectRestaurant(confirmId);
  };

  const openConfirm = (id, action) => {
    setConfirmId(id);
    setConfirmAction(action);
  };

  const filtered = vendors.filter((vendor) => {
    const q = search.toLowerCase();
    const matchSearch =
      vendor.restaurantName?.toLowerCase().includes(q) ||
      vendor.ownerName?.toLowerCase().includes(q) ||
      vendor.address?.toLowerCase().includes(q) ||
      vendor.phone?.includes(q);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && !vendor.isBlocked && vendor.isApproved) ||
      (statusFilter === "Blocked" && vendor.isBlocked) ||
      (statusFilter === "Pending" && !vendor.isApproved);
    return matchSearch && matchStatus;
  });

  const totalActive = vendors.filter((v) => !v.isBlocked && v.isApproved).length;
  const totalBlocked = vendors.filter((v) => v.isBlocked).length;
  const totalPending = vendors.filter((v) => !v.isApproved).length;

  const confirmingVendor = vendors.find((v) => v._id === confirmId);

  // Modal config per action
  const modalConfig = {
    block: {
      icon: <AlertTriangle size={24} className={confirmingVendor?.isBlocked ? "text-emerald-500" : "text-red-500"} />,
      iconBg: confirmingVendor?.isBlocked ? "bg-emerald-50" : "bg-red-50",
      title: confirmingVendor?.isBlocked ? "Unblock Restaurant?" : "Block Restaurant?",
      message: confirmingVendor?.isBlocked
        ? <>This will restore access for <strong>{confirmingVendor?.restaurantName}</strong>.</>
        : <>This will suspend all orders for <strong>{confirmingVendor?.restaurantName}</strong>.</>,
      confirmText: confirmingVendor?.isBlocked ? "Yes, Unblock" : "Yes, Block",
      confirmClass: confirmingVendor?.isBlocked ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600",
    },
    approve: {
      icon: <CheckCircle size={24} className="text-emerald-500" />,
      iconBg: "bg-emerald-50",
      title: "Approve Restaurant?",
      message: <>Approving <strong>{confirmingVendor?.restaurantName}</strong> will allow them to log in and start receiving orders.</>,
      confirmText: "Yes, Approve",
      confirmClass: "bg-emerald-500 hover:bg-emerald-600",
    },
    reject: {
      icon: <XCircle size={24} className="text-red-500" />,
      iconBg: "bg-red-50",
      title: "Reject Restaurant?",
      message: <>This will permanently delete <strong>{confirmingVendor?.restaurantName}</strong> and their account. This cannot be undone.</>,
      confirmText: "Yes, Reject",
      confirmClass: "bg-red-500 hover:bg-red-600",
    },
  };

  const modal = confirmAction ? modalConfig[confirmAction] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-0 font-sans">
      {/* Top bar */}
      <div className="pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-500 mb-1">
              Admin Panel
            </p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Restaurant Management
            </h2>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mt-1">
            <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-lg font-bold text-emerald-700 leading-none">{totalActive}</p>
              <p className="text-[10px] font-medium text-emerald-500 mt-0.5 uppercase tracking-wider">Active</p>
            </div>
            <div className="text-center px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-lg font-bold text-amber-600 leading-none">{totalPending}</p>
              <p className="text-[10px] font-medium text-amber-500 mt-0.5 uppercase tracking-wider">Pending</p>
            </div>
            <div className="text-center px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-lg font-bold text-red-600 leading-none">{totalBlocked}</p>
              <p className="text-[10px] font-medium text-red-400 mt-0.5 uppercase tracking-wider">Blocked</p>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-lg font-bold text-gray-700 leading-none">{vendors.length}</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">Total</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurant, owner, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 cursor-pointer"
            >
              {["All", "Active", "Pending", "Blocked"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 px-4 py-2.5 mt-3 bg-gray-50 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Restaurant</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</p>
      </div>

      {/* Vendor rows */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <Store size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No restaurants match your filters</p>
          </div>
        )}

        {filtered.map((restaurant) => {
          const isPending = !restaurant.isApproved;
          const isBlocked = restaurant.isBlocked;
          const isActive = restaurant.isApproved && !restaurant.isBlocked;

          return (
            <div
              key={restaurant._id}
              className={`grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 items-center px-4 py-3.5 rounded-xl border transition-all ${
                isPending
                  ? "bg-amber-50/60 border-amber-100"
                  : isBlocked
                  ? "bg-red-50/60 border-red-100 opacity-75"
                  : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm"
              }`}
            >
              {/* Restaurant info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                  isBlocked
                    ? "from-red-100 to-red-200 grayscale opacity-50"
                    : isPending
                    ? "from-amber-100 to-yellow-100"
                    : "from-indigo-100 to-blue-100"
                }`}>
                  {restaurant.restaurantImage ? (
                    <img
                      src={restaurant.restaurantImage}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <Store className="text-indigo-600" size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isBlocked ? "text-gray-400 line-through" : "text-gray-800"
                  }`}>
                    {restaurant.restaurantName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 truncate">
                      👤 {restaurant.ownerName || "N/A"}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {restaurant.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                <span className="truncate">{restaurant.address || "N/A"}</span>
              </div>

              {/* Status badge */}
              <div>
                {isPending ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    <Clock size={10} /> Pending
                  </span>
                ) : isBlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200">
                    <ShieldOff size={10} /> Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ShieldCheck size={10} /> Active
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {isPending ? (
                  // Pending → show approve + reject
                  <>
                    <button
                      onClick={() => openConfirm(restaurant._id, "approve")}
                      disabled={actionLoading === restaurant._id}
                      title="Approve restaurant"
                      className="p-2 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === restaurant._id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <CheckCircle size={15} />
                      }
                    </button>
                    <button
                      onClick={() => openConfirm(restaurant._id, "reject")}
                      disabled={actionLoading === restaurant._id}
                      title="Reject restaurant"
                      className="p-2 rounded-lg border bg-red-50 border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={15} />
                    </button>
                  </>
                ) : (
                  // Approved → show block/unblock
                  <button
                    onClick={() => openConfirm(restaurant._id, "block")}
                    disabled={actionLoading === restaurant._id}
                    title={isBlocked ? "Unblock restaurant" : "Block restaurant"}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                      isBlocked
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                        : "bg-red-50 border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    {actionLoading === restaurant._id
                      ? <Loader2 size={15} className="animate-spin" />
                      : isBlocked
                      ? <ShieldCheck size={15} />
                      : <ShieldOff size={15} />
                    }
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {confirmId && confirmingVendor && modal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${modal.iconBg}`}>
              {modal.icon}
            </div>
            <h3 className="text-center font-bold text-gray-800 text-lg mb-2">
              {modal.title}
            </h3>
            <p className="text-center text-sm text-gray-500 leading-relaxed mb-6">
              {modal.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmId(null); setConfirmAction(null); }}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading === confirmId}
                className={`flex-1 text-white rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${modal.confirmClass}`}
              >
                {actionLoading === confirmId ? (
                  <><Loader2 size={15} className="animate-spin" /> Processing...</>
                ) : modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;