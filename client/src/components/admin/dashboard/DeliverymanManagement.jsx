import { useState, useEffect } from "react";
import {
  Search, ShieldOff, ShieldCheck, MapPin, Phone, Truck,
  AlertTriangle, ChevronDown, Loader2, CheckCircle, XCircle,
  Clock, User, Calendar, Package,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api";

const DeliverymanManagement = () => {
  const [deliverymen, setDeliverymen] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId]     = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // "block" | "approve" | "reject"
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDeliverymen();
  }, []);

  const fetchDeliverymen = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/admin/deliverymen`, {
        withCredentials: true,
      });
      setDeliverymen(data.deliverymen || []);
    } catch (error) {
      console.error("Failed to fetch deliverymen:", error);
      toast.error("Failed to load deliverymen");
    } finally {
      setLoading(false);
    }
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const toggleBlock = async (deliverymanId) => {
    setActionLoading(deliverymanId);
    try {
      await axios.patch(
        `${API}/admin/deliverymen/${deliverymanId}/toggle-block`,
        {},
        { withCredentials: true }
      );
      const dm = deliverymen.find((d) => d._id === deliverymanId);
      toast.success(
        dm?.isBlocked
          ? `${dm.name} has been unblocked`
          : `${dm.name} has been blocked`
      );
      await fetchDeliverymen();
      closeConfirm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const approveDeliveryman = async (deliverymanId) => {
    setActionLoading(deliverymanId);
    try {
      await axios.patch(
        `${API}/admin/deliverymen/${deliverymanId}/approve`,
        {},
        { withCredentials: true }
      );
      const dm = deliverymen.find((d) => d._id === deliverymanId);
      toast.success(`${dm?.name} has been approved! 🎉`);
      await fetchDeliverymen();
      closeConfirm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve deliveryman");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectDeliveryman = async (deliverymanId) => {
    setActionLoading(deliverymanId);
    try {
      await axios.delete(
        `${API}/admin/deliverymen/${deliverymanId}/reject`,
        { withCredentials: true }
      );
      const dm = deliverymen.find((d) => d._id === deliverymanId);
      toast.success(`${dm?.name} has been rejected and removed`);
      await fetchDeliverymen();
      closeConfirm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject deliveryman");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = () => {
    if (confirmAction === "block")   toggleBlock(confirmId);
    if (confirmAction === "approve") approveDeliveryman(confirmId);
    if (confirmAction === "reject")  rejectDeliveryman(confirmId);
  };

  const openConfirm  = (id, action) => { setConfirmId(id); setConfirmAction(action); };
  const closeConfirm = ()           => { setConfirmId(null); setConfirmAction(null); };

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filtered = deliverymen.filter((dm) => {
    const q = search.toLowerCase();
    const matchSearch =
      dm.name?.toLowerCase().includes(q)  ||
      dm.email?.toLowerCase().includes(q) ||
      dm.phone?.toString().includes(q)    ||
      dm.zone?.toLowerCase().includes(q)  ||
      dm.vehicle?.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active"     && dm.isApproved && !dm.isBlocked) ||
      (statusFilter === "Pending"    && !dm.isApproved) ||
      (statusFilter === "Blocked"    && dm.isBlocked) ||
      (statusFilter === "Available"  && dm.isApproved && dm.isAvailable && !dm.isBlocked) ||
      (statusFilter === "On Delivery"&& dm.isApproved && !dm.isAvailable && !dm.isBlocked);

    return matchSearch && matchStatus;
  });

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalActive     = deliverymen.filter((d) => d.isApproved && !d.isBlocked).length;
  const totalPending    = deliverymen.filter((d) => !d.isApproved).length;
  const totalBlocked    = deliverymen.filter((d) => d.isBlocked).length;
  const totalAvailable  = deliverymen.filter((d) => d.isApproved && d.isAvailable && !d.isBlocked).length;

  const confirmingDm = deliverymen.find((d) => d._id === confirmId);

  // ── Modal config ─────────────────────────────────────────────────────────────
  const modalConfig = {
    block: {
      icon:         <AlertTriangle size={24} className={confirmingDm?.isBlocked ? "text-emerald-500" : "text-red-500"} />,
      iconBg:       confirmingDm?.isBlocked ? "bg-emerald-50" : "bg-red-50",
      title:        confirmingDm?.isBlocked ? "Unblock Deliveryman?" : "Block Deliveryman?",
      message:      confirmingDm?.isBlocked
        ? <>This will restore access for <strong>{confirmingDm?.name}</strong>.</>
        : <>This will suspend <strong>{confirmingDm?.name}</strong> from receiving deliveries.</>,
      confirmText:  confirmingDm?.isBlocked ? "Yes, Unblock" : "Yes, Block",
      confirmClass: confirmingDm?.isBlocked ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600",
    },
    approve: {
      icon:         <CheckCircle size={24} className="text-emerald-500" />,
      iconBg:       "bg-emerald-50",
      title:        "Approve Deliveryman?",
      message:      <>Approving <strong>{confirmingDm?.name}</strong> will allow them to log in and receive delivery assignments.</>,
      confirmText:  "Yes, Approve",
      confirmClass: "bg-emerald-500 hover:bg-emerald-600",
    },
    reject: {
      icon:         <XCircle size={24} className="text-red-500" />,
      iconBg:       "bg-red-50",
      title:        "Reject Deliveryman?",
      message:      <>This will permanently delete <strong>{confirmingDm?.name}</strong> and their account. This cannot be undone.</>,
      confirmText:  "Yes, Reject",
      confirmClass: "bg-red-500 hover:bg-red-600",
    },
  };

  const modal = confirmAction ? modalConfig[confirmAction] : null;

  // ── Render ───────────────────────────────────────────────────────────────────
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
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-500 mb-1">
              Admin Panel
            </p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Deliveryman Management
            </h2>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mt-1 flex-wrap">
            <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-lg font-bold text-emerald-700 leading-none">{totalActive}</p>
              <p className="text-[10px] font-medium text-emerald-500 mt-0.5 uppercase tracking-wider">Active</p>
            </div>
            <div className="text-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-lg font-bold text-blue-600 leading-none">{totalAvailable}</p>
              <p className="text-[10px] font-medium text-blue-500 mt-0.5 uppercase tracking-wider">Available</p>
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
              <p className="text-lg font-bold text-gray-700 leading-none">{deliverymen.length}</p>
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
              placeholder="Search name, email, zone, vehicle..."
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
              {["All", "Active", "Available", "On Delivery", "Pending", "Blocked"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_auto] gap-4 px-4 py-2.5 mt-3 bg-gray-50 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Deliveryman</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zone / Vehicle</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Duty</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</p>
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <Truck size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No deliverymen match your filters</p>
          </div>
        )}

        {filtered.map((dm) => {
          const isPending    = !dm.isApproved;
          const isBlocked    = dm.isBlocked;
          const isOnDelivery = dm.isApproved && !dm.isAvailable && !dm.isBlocked;
          const isActive     = dm.isApproved && !dm.isBlocked;

          return (
            <div
              key={dm._id}
              className={`grid grid-cols-[2.5fr_1.5fr_1fr_1fr_auto] gap-4 items-center px-4 py-3.5 rounded-xl border transition-all ${
                isPending
                  ? "bg-amber-50/60 border-amber-100"
                  : isBlocked
                  ? "bg-red-50/60 border-red-100 opacity-75"
                  : isOnDelivery
                  ? "bg-blue-50/40 border-blue-100"
                  : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm"
              }`}
            >
              {/* Deliveryman info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                  isBlocked
                    ? "from-red-100 to-red-200 grayscale opacity-50"
                    : isPending
                    ? "from-amber-100 to-yellow-100"
                    : isOnDelivery
                    ? "from-blue-100 to-indigo-100"
                    : "from-indigo-100 to-blue-100"
                }`}>
                  {dm.deliverymanImage ? (
                    <img
                      src={dm.deliverymanImage}
                      alt={dm.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <User className="text-indigo-600" size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isBlocked ? "text-gray-400 line-through" : "text-gray-800"
                  }`}>
                    {dm.name || "N/A"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 truncate">
                      ✉️ {dm.email || "N/A"}
                    </span>
                    {dm.phone && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone size={10} /> {dm.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Zone / Vehicle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate font-medium">{dm.zone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Truck size={11} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate capitalize">{dm.vehicle || "N/A"}</span>
                </div>
              </div>

              {/* Duty time */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={11} className="text-gray-300 flex-shrink-0" />
                <span className="capitalize">{dm.dutyTime || "—"}</span>
              </div>

              {/* Status badge */}
              <div className="flex flex-col gap-1">
                {/* Approval status */}
                {isPending ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 w-fit">
                    <Clock size={9} /> Pending
                  </span>
                ) : isBlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-red-50 text-red-500 border border-red-200 w-fit">
                    <ShieldOff size={9} /> Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                    <ShieldCheck size={9} /> Active
                  </span>
                )}

                {/* Availability (only for approved) */}
                {isActive && (
                  isOnDelivery ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 w-fit">
                      <Package size={9} /> On Delivery
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </span>
                  )
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {isPending ? (
                  // Pending → approve + reject
                  <>
                    <button
                      onClick={() => openConfirm(dm._id, "approve")}
                      disabled={actionLoading === dm._id}
                      title="Approve"
                      className="p-2 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === dm._id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <CheckCircle size={15} />
                      }
                    </button>
                    <button
                      onClick={() => openConfirm(dm._id, "reject")}
                      disabled={actionLoading === dm._id}
                      title="Reject"
                      className="p-2 rounded-lg border bg-red-50 border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={15} />
                    </button>
                  </>
                ) : (
                  // Approved → block / unblock
                  <button
                    onClick={() => openConfirm(dm._id, "block")}
                    disabled={actionLoading === dm._id}
                    title={isBlocked ? "Unblock" : "Block"}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                      isBlocked
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                        : "bg-red-50 border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    {actionLoading === dm._id
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
      {confirmId && confirmingDm && modal && (
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
                onClick={closeConfirm}
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

export default DeliverymanManagement;
