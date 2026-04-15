import { useState } from "react";
import { Search, ShieldOff, ShieldCheck, MapPin, Phone, Store, AlertTriangle, ChevronDown } from "lucide-react";

const initialVendors = [
  { id: 1, name: "Fresh Farms Co.", contactName: "Ram Shrestha", category: "Produce", phone: "+977-9801234567", address: "Kalimati, Kathmandu", blocked: false, logo: "🥦", supplyCount: 38, joinedDate: "Jan 12, 2024" },
  { id: 2, name: "Himalayan Dairy", contactName: "Sita Rai", category: "Dairy", phone: "+977-9812345678", address: "Lalitpur, Patan", blocked: false, logo: "🧈", supplyCount: 22, joinedDate: "Mar 3, 2024" },
  { id: 3, name: "Valley Meats", contactName: "Bikram Thapa", category: "Meat & Seafood", phone: "+977-9823456789", address: "Asan, Kathmandu", blocked: true, logo: "🥩", supplyCount: 15, joinedDate: "Feb 18, 2024" },
  { id: 4, name: "Peak Beverages", contactName: "Anita Gurung", category: "Beverages", phone: "+977-9834567890", address: "Thamel, Kathmandu", blocked: false, logo: "🧃", supplyCount: 47, joinedDate: "Apr 7, 2024" },
  { id: 5, name: "Bakery Supply Hub", contactName: "Deepak Karki", category: "Bakery", phone: "+977-9845678901", address: "Bhaktapur", blocked: false, logo: "🌾", supplyCount: 29, joinedDate: "Dec 20, 2023" },
  { id: 6, name: "Spice Route Traders", contactName: "Manisha Lama", category: "Spices & Condiments", phone: "+977-9856789012", address: "Indrachowk, Kathmandu", blocked: true, logo: "🌶️", supplyCount: 61, joinedDate: "Nov 5, 2023" },
  { id: 7, name: "Golden Grains", contactName: "Suresh Pandey", category: "Bakery", phone: "+977-9867890123", address: "Boudha, Kathmandu", blocked: false, logo: "🌽", supplyCount: 18, joinedDate: "May 1, 2024" },
  { id: 8, name: "Mountain Springs", contactName: "Rekha Tamang", category: "Beverages", phone: "+977-9878901234", address: "Lazimpat, Kathmandu", blocked: false, logo: "💧", supplyCount: 33, joinedDate: "Jun 14, 2024" },
];

const STATUS_OPTIONS = ["All", "Active", "Blocked"];

export default function VendorManagement() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);

  const toggleBlock = (id) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, blocked: !v.blocked } : v)));
    setConfirmId(null);
  };

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      v.name.toLowerCase().includes(q) ||
      v.contactName.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q) ||
      v.phone.includes(q);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && !v.blocked) ||
      (statusFilter === "Blocked" && v.blocked);
    return matchSearch && matchStatus;
  });

  const totalActive  = vendors.filter((v) => !v.blocked).length;
  const totalBlocked = vendors.filter((v) =>  v.blocked).length;

  const confirmingVendor = vendors.find((v) => v.id === confirmId);

  return (
    <div className="space-y-0 font-sans">
      {/* ── Top bar ── */}
      <div className="pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-500 mb-1">Admin Panel</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Registry</h2>
          </div>
          {/* Stat pills */}
          <div className="flex gap-2 mt-1">
            <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-lg font-bold text-emerald-700 leading-none">{totalActive}</p>
              <p className="text-[10px] font-medium text-emerald-500 mt-0.5 uppercase tracking-wider">Active</p>
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
              placeholder="Search name, contact, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 px-4 py-2.5 mt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Vendor</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Supplies</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
      </div>

      {/* ── Vendor rows ── */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <Store size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No vendors match your filters</p>
          </div>
        )}

        {filtered.map((vendor) => {
          return (
            <div
              key={vendor.id}
              className={`grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 items-center px-4 py-3.5 rounded-xl border transition-all
                ${vendor.blocked
                  ? "bg-red-50/60 border-red-100 opacity-75"
                  : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm"
                }`}
            >
              {/* Vendor info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${vendor.blocked ? "grayscale opacity-50" : ""}`}
                >
                  {vendor.logo}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${vendor.blocked ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {vendor.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                      <Store size={10} /> {vendor.contactName}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {vendor.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                <span className="truncate">{vendor.address}</span>
              </div>

              {/* Supply count */}
              <div>
                <span className="text-sm font-bold text-gray-700">{vendor.supplyCount}</span>
                <span className="text-xs text-gray-400 ml-1">orders</span>
              </div>

              {/* Block / Unblock button */}
              <div className="flex items-center gap-2">
                <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  vendor.blocked
                    ? "bg-red-50 text-red-500 border-red-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  {vendor.blocked ? "Blocked" : "Active"}
                </span>
                <button
                  onClick={() => setConfirmId(vendor.id)}
                  title={vendor.blocked ? "Unblock vendor" : "Block vendor"}
                  className={`p-2 rounded-lg border transition-colors ${
                    vendor.blocked
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                      : "bg-red-50 border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600"
                  }`}
                >
                  {vendor.blocked ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Confirm modal ── */}
      {confirmId && confirmingVendor && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              confirmingVendor.blocked ? "bg-emerald-50" : "bg-red-50"
            }`}>
              <AlertTriangle size={22} className={confirmingVendor.blocked ? "text-emerald-500" : "text-red-500"} />
            </div>
            <h3 className="text-center font-bold text-gray-800 text-lg">
              {confirmingVendor.blocked ? "Unblock Vendor?" : "Block Vendor?"}
            </h3>
            <p className="text-center text-sm text-gray-500 mt-2 leading-relaxed">
              {confirmingVendor.blocked
                ? <>This will restore access for <strong>{confirmingVendor.name}</strong>.</>
                : <>This will suspend all activity for <strong>{confirmingVendor.name}</strong>.</>
              }
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => toggleBlock(confirmId)}
                className={`flex-1 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  confirmingVendor.blocked
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmingVendor.blocked ? "Yes, Unblock" : "Yes, Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}